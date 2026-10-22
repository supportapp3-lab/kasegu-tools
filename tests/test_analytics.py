"""Validate public GA4 tags and disclosures using only the standard library."""
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://supportapp3-lab.github.io/kasegu-tools/'
MEASUREMENT_ID = 'G-5V4X0DLVWC'
GA4_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID
CONFIG = re.compile(r"gtag\(\s*['\"]config['\"]\s*,\s*['\"]G-5V4X0DLVWC['\"]\s*\)")
IDENTIFIER = re.compile(r'\b(?:GTM-[A-Z0-9]+|UA-\d+-\d+|G-[A-Z0-9]+)\b')
EXPECTED_INLINE = """window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-5V4X0DLVWC');"""


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_head = False
        self.scripts = []
        self.current_script = None
        self.head_tags = []
        self.iframes = []
        self.links = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head':
            self.in_head = True
        if self.in_head:
            self.head_tags.append((tag, attrs))
        if tag == 'script':
            self.current_script = {'attrs': attrs, 'head': self.in_head, 'text': ''}
            self.scripts.append(self.current_script)
        if tag == 'iframe':
            self.iframes.append(attrs)
        if tag == 'a':
            self.links.append(attrs.get('href', ''))

    def handle_endtag(self, tag):
        if tag == 'head':
            self.in_head = False
        if tag == 'script':
            self.current_script = None

    def handle_data(self, data):
        if self.current_script is not None:
            self.current_script['text'] += data
        else:
            self.text.append(data)


def public_pages():
    pages = {ROOT / name for name in ('index.html', '404.html', 'about/index.html',
                                     'privacy/index.html', 'contact/index.html')}
    for node in ElementTree.parse(ROOT / 'sitemap.xml').findall('.//{*}loc'):
        if not node.text.startswith(BASE):
            raise ValueError('Unexpected sitemap origin: ' + node.text)
        relative = node.text.removeprefix(BASE)
        path = ROOT / relative
        pages.add(path if path.suffix == '.html' else path / 'index.html')
    # Also cover public HTML added before its sitemap entry exists.
    for folder in ('tools', 'guides', 'about', 'privacy', 'contact'):
        pages.update((ROOT / folder).rglob('*.html'))
    return sorted(pages)


def parse(path):
    html = path.read_text(encoding='utf-8')
    page = Page()
    page.feed(html)
    return html, page


class AnalyticsTests(unittest.TestCase):
    def test_every_public_page_has_one_complete_tag_in_consistent_head_position(self):
        pages = public_pages()
        self.assertGreaterEqual(len(pages), 41)
        for path in pages:
            with self.subTest(page=path.relative_to(ROOT)):
                html, page = parse(path)
                loaders = [s for s in page.scripts if s['attrs'].get('src') == GA4_SRC]
                self.assertEqual(len(loaders), 1)
                self.assertTrue(loaders[0]['head'])
                self.assertIn('async', loaders[0]['attrs'])
                initializers = [s for s in page.scripts if CONFIG.search(s['text'])]
                self.assertEqual(len(initializers), 1)
                self.assertTrue(initializers[0]['head'])
                normalized = '\n'.join(line.strip() for line in initializers[0]['text'].strip().splitlines())
                self.assertEqual(normalized, EXPECTED_INLINE)
                self.assertEqual(len(CONFIG.findall(html)), 1)
                index = next(i for i, (tag, attrs) in enumerate(page.head_tags)
                             if tag == 'script' and attrs.get('src') == GA4_SRC)
                self.assertTrue(any(tag == 'meta' and 'charset' in attrs
                                    for tag, attrs in page.head_tags[:index]))
                self.assertEqual(page.head_tags[index - 1][0], 'meta')
                self.assertEqual(page.head_tags[index - 1][1].get('name'), 'viewport')
                self.assertEqual(page.head_tags[index + 1], ('script', {}))
                self.assertEqual(page.head_tags[index + 2][0], 'title')

    def test_only_exact_ga4_external_script_and_no_other_measurement_ids(self):
        for path in public_pages():
            with self.subTest(page=path.relative_to(ROOT)):
                html, page = parse(path)
                for script in page.scripts:
                    src = script['attrs'].get('src', '')
                    url = urlsplit(src)
                    if url.scheme or url.netloc:
                        self.assertEqual(src, GA4_SRC)
                self.assertEqual(page.iframes, [])
                self.assertEqual(set(IDENTIFIER.findall(html)), {MEASUREMENT_ID})

    def test_privacy_explains_google_cookie_processing_and_opt_out(self):
        _, page = parse(ROOT / 'privacy/index.html')
        text = ''.join(page.text)
        for term in ('Google アナリティクス', 'GA4', 'Cookie', '閲覧ページ', '参照元',
                     'おおよその地域', '端末・ブラウザ', 'Googleが収集・処理',
                     '個人を直接特定する情報は収集対象に含めません', 'ブラウザの設定でCookieを無効'):
            self.assertIn(term, text)
        self.assertIn('https://policies.google.com/technologies/partner-sites', page.links)
        self.assertIn('https://tools.google.com/dlpage/gaoptout', page.links)

    def test_policy_and_about_do_not_claim_analytics_is_uninstalled(self):
        for name in ('privacy/index.html', 'about/index.html'):
            with self.subTest(page=name):
                _, page = parse(ROOT / name)
                for sentence in re.split(r'[。！？\n]', ''.join(page.text)):
                    if 'アクセス解析' in sentence:
                        self.assertNotRegex(sentence, r'未導入|未設置')
                self.assertIn('Google アナリティクス', ''.join(page.text))
        _, about = parse(ROOT / 'about/index.html')
        self.assertIn('../privacy/index.html', about.links)


if __name__ == '__main__':
    unittest.main()
