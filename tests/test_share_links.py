"""Check static sharing blocks and destination URLs using only the stdlib."""
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
GA4_SRC = 'https://www.googletagmanager.com/gtag/js?id=G-5V4X0DLVWC'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.title = ''
        self.in_title = False
        self.blocks = []
        self.current = None
        self.links = []
        self.external = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        if tag == 'section' and 'page-share' in attrs.get('class', '').split():
            self.current = {'links': [], 'buttons': [], 'fallback': ''}
            self.blocks.append(self.current)
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
            if self.current is not None:
                self.current['links'].append(attrs)
        if tag == 'button' and self.current is not None:
            self.current['buttons'].append(attrs)
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
            if urlsplit(attrs['src']).netloc and attrs['src'] != GA4_SRC:
                self.external.append(attrs['src'])
        if tag == 'iframe':
            self.external.append('iframe')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'section':
            self.current = None

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.current is not None:
            self.current['fallback'] += data


def parse(path):
    parser = Page()
    parser.feed(path.read_text(encoding='utf-8'))
    return parser


class ShareLinkTests(unittest.TestCase):
    def test_every_tool_and_guide_has_one_complete_static_block(self):
        tools = sorted((ROOT / 'tools').glob('*/index.html'))
        guides = sorted((ROOT / 'guides').glob('*/index.html'))
        self.assertEqual(len(tools), 11)
        self.assertEqual(len(guides), 24)
        for page in tools + guides:
            with self.subTest(page=page.relative_to(ROOT)):
                parsed = parse(page)
                self.assertEqual(len(parsed.canonical), 1)
                canonical = parsed.canonical[0]
                self.assertEqual(len(parsed.blocks), 1)
                block = parsed.blocks[0]
                links = block['links']
                self.assertEqual(len(links), 3)
                by_host = {urlsplit(link['href']).hostname: link for link in links}
                self.assertEqual(set(by_host), {'social-plugins.line.me', 'b.hatena.ne.jp', 'x.com'})
                for link in links:
                    self.assertEqual(link.get('target'), '_blank')
                    self.assertEqual(set(link.get('rel', '').split()), {'noopener', 'noreferrer'})
                    query = parse_qs(urlsplit(link['href']).query)
                    self.assertFalse(any(key.lower().startswith('utm_') for key in query))
                for host in ['social-plugins.line.me', 'x.com']:
                    self.assertEqual(parse_qs(urlsplit(by_host[host]['href']).query)['url'], [canonical])
                line = urlsplit(by_host['social-plugins.line.me']['href'])
                self.assertEqual(line.path, '/lineit/share')
                self.assertEqual(set(parse_qs(line.query)), {'url'})
                x = urlsplit(by_host['x.com']['href'])
                self.assertEqual(x.path, '/intent/post')
                self.assertEqual(parse_qs(x.query)['text'], [parsed.title])
                self.assertEqual(set(parse_qs(x.query)), {'url', 'text'})
                hatena = urlsplit(by_host['b.hatena.ne.jp']['href'])
                self.assertEqual(unquote(hatena.path), '/entry/s/' + canonical.removeprefix('https://'))
                self.assertFalse(hatena.query)
                self.assertEqual(len(block['buttons']), 1)
                self.assertEqual(block['buttons'][0].get('type'), 'button')
                self.assertIn('data-share-copy', block['buttons'][0])
                self.assertEqual(block['buttons'][0].get('data-share-url'), canonical)
                self.assertIn(canonical, block['fallback'])
                self.assertEqual(parsed.scripts.count('../../assets/js/share.js'), 1)
                html = page.read_text(encoding='utf-8')
                self.assertLess(html.index('class="page-share"'), html.index('</main>'))

    def test_no_external_scripts_except_exact_ga4_or_iframes_on_target_pages(self):
        for page in list((ROOT / 'tools').glob('*/index.html')) + list((ROOT / 'guides').glob('*/index.html')):
            with self.subTest(page=page.relative_to(ROOT)):
                self.assertEqual(parse(page).external, [])

    def test_excluded_pages_have_no_sharing_block_or_script(self):
        for name in ['index.html', 'about/index.html', 'privacy/index.html',
                     'contact/index.html', '404.html', 'guides/index.html']:
            with self.subTest(page=name):
                parsed = parse(ROOT / name)
                self.assertEqual(parsed.blocks, [])
                self.assertFalse(any(script.endswith('/share.js') for script in parsed.scripts))


if __name__ == '__main__':
    unittest.main()
