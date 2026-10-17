"""Dependency-free structural HTML, metadata and local-link checks."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
AMAZON_HOSTS = {'amazon.co.jp', 'www.amazon.co.jp', 'amzn.to', 'amzn.asia'}
BLOCK = set('article aside div dl fieldset footer form h1 h2 h3 h4 header main nav ol p section table ul'.split())


class Lint(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.stack = []
        self.ids = set()
        self.links = []
        self.labels = set()
        self.inputs = []
        self.h1 = 0
        self.heading = 0
        self.lang = False
        self.title = False
        self.description = False
        self.canonical = False
        self.doctype = False
        self.json_data = None
        self.errors = []
        self.affiliate_errors = []
        self.affiliate_slots = []
        self.has_amazon_link = False
        self.body_text = []

    def fail(self, message):
        self.errors.append(f'{self.path.relative_to(ROOT)}:{self.getpos()[0]}: {message}')

    def fail_affiliate(self, message):
        error = f'{self.path.relative_to(ROOT)}:{self.getpos()[0]}: {message}'
        self.affiliate_errors.append(error)
        self.errors.append(error)

    def handle_decl(self, decl):
        if decl.lower() == 'doctype html':
            self.doctype = True

    def handle_starttag(self, tag, attrs):
        if len(attrs) != len(dict(attrs)):
            self.fail('duplicate attribute')
        attr = dict(attrs)
        if tag == 'a':
            href = attr.get('href', '')
            host = urlsplit(href).hostname
            rel_tokens = (attr.get('rel') or '').lower().split()
            is_amazon = host in AMAZON_HOSTS
            is_external = bool(re.match(r'^https?://', href, re.IGNORECASE))
            if is_amazon:
                self.has_amazon_link = True
            if (is_amazon or (is_external and self.affiliate_slots)) and 'sponsored' not in rel_tokens:
                self.fail_affiliate('affiliate link needs rel=sponsored')
            if is_external:
                for slot in self.affiliate_slots:
                    slot['links'] += 1
                    if slot['links'] > 1 and not slot['too_many_reported']:
                        self.fail_affiliate('affiliate slot has more than one link')
                        slot['too_many_reported'] = True
        if 'p' in self.stack and tag in BLOCK:
            self.fail('block element nested in p')
        if tag == 'a' and 'a' in self.stack:
            self.fail('nested anchor')
        if tag == 'form' and 'form' in self.stack:
            self.fail('nested form')
        if 'id' in attr:
            if attr['id'] in self.ids:
                self.fail(f'duplicate id: {attr["id"]}')
            self.ids.add(attr['id'])
        if tag == 'html':
            self.lang = attr.get('lang') == 'ja'
        if tag == 'title':
            self.title = True
        if tag == 'meta' and attr.get('name') == 'description':
            self.description = bool(attr.get('content'))
        if tag == 'link' and attr.get('rel') == 'canonical':
            self.canonical = (attr.get('href') or '').startswith('https://')
        if re.fullmatch(r'h[1-6]', tag):
            level = int(tag[1])
            if level > self.heading + 1:
                self.fail('heading level skipped')
            self.heading = level
            self.h1 += int(level == 1)
        if tag == 'label' and attr.get('for'):
            self.labels.add(attr['for'])
        if tag in ('input', 'textarea', 'select'):
            self.inputs.append(attr.get('id'))
        if tag == 'img' and 'alt' not in attr:
            self.fail('image needs alt')
        for key in ('href', 'src'):
            if key in attr:
                self.links.append(attr[key])
        if tag == 'a' and attr.get('target') == '_blank' and 'noopener' not in attr.get('rel', '').split():
            self.fail('external target needs noopener')
        if tag == 'script' and attr.get('type') == 'application/ld+json':
            self.json_data = ''
        is_affiliate_slot = (
            'affiliate' in (attr.get('class') or '').split()
            and 'data-category' in attr
        )
        if tag not in VOID:
            self.stack.append(tag)
            if is_affiliate_slot:
                self.affiliate_slots.append({
                    'depth': len(self.stack),
                    'links': 0,
                    'too_many_reported': False,
                })

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.fail(f'unmatched closing tag: {tag}')
            return
        self.stack.pop()
        if self.affiliate_slots and self.affiliate_slots[-1]['depth'] == len(self.stack) + 1:
            self.affiliate_slots.pop()
        if tag == 'script' and self.json_data is not None:
            try:
                json.loads(self.json_data)
            except ValueError:
                self.fail('invalid JSON-LD')
            self.json_data = None

    def handle_data(self, data):
        if self.json_data is not None:
            self.json_data += data
        elif 'body' in self.stack and 'script' not in self.stack and 'style' not in self.stack:
            self.body_text.append(data)

    def finish(self):
        if self.stack:
            self.fail(f'unclosed tags: {self.stack}')
        if not all((self.doctype, self.lang, self.title, self.description, self.canonical)):
            self.fail('missing doctype/lang/title/description/canonical')
        if self.h1 != 1:
            self.fail('exactly one h1 is required')
        if self.has_amazon_link and 'Amazonのアソシエイトとして' not in ''.join(self.body_text):
            self.fail_affiliate('amazon link needs associates disclosure')
        for control in self.inputs:
            if not control or control not in self.labels:
                self.fail(f'form control has no label: {control}')


def affiliate_errors_from_html(html):
    """Return affiliate-rule errors for one HTML document string."""
    parser = Lint(ROOT / '__affiliate_test__.html')
    parser.feed(html)
    parser.close()
    parser.finish()
    return parser.affiliate_errors


def main():
    pages = {}
    for path in sorted(ROOT.rglob('*.html')):
        if any(part.startswith('.') or part == 'output' for part in path.relative_to(ROOT).parts):
            continue
        parser = Lint(path)
        parser.feed(path.read_text(encoding='utf-8'))
        parser.close()
        parser.finish()
        pages[path.resolve()] = parser
    for path, parser in pages.items():
        for link in parser.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            local = unquote(url.path)
            if local.startswith('/kasegu-tools/'):
                target = ROOT / local.removeprefix('/kasegu-tools/')
            elif local.startswith('/'):
                target = ROOT / local.lstrip('/')
            else:
                target = path.parent / local if local else path
            target = target.resolve()
            if not target.is_relative_to(ROOT):
                parser.fail(f'link escapes site: {link}')
                continue
            if target.is_dir():
                target /= 'index.html'
            if not target.exists():
                parser.fail(f'broken local link: {link}')
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                parser.fail(f'unknown anchor: {link}')
    try:
        ElementTree.parse(ROOT / 'sitemap.xml')
    except ElementTree.ParseError as error:
        print(f'invalid sitemap: {error}', file=sys.stderr)
        return 1
    errors = [error for parser in pages.values() for error in parser.errors]
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'HTML lint OK: {len(pages)} pages; structure, metadata, labels, JSON-LD, links and anchors')
    return 0


if __name__ == '__main__':
    sys.exit(main())
