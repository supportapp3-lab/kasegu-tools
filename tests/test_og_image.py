"""Check all sitemap pages and committed PNGs without image dependencies."""
import struct
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://supportapp3-lab.github.io/kasegu-tools/'


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.canonical = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta':
            key = attrs.get('property') or attrs.get('name')
            self.meta.setdefault(key, []).append(attrs.get('content', ''))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs.get('href'))


class OgImageTests(unittest.TestCase):
    def test_all_sitemap_pages_have_one_local_large_image(self):
        sitemap = ElementTree.parse(ROOT / 'sitemap.xml')
        urls = [node.text for node in sitemap.findall('.//{*}loc')]
        self.assertEqual(len(urls), 40)
        dedicated = {}
        for url in urls:
            with self.subTest(url=url):
                self.assertTrue(url.startswith(BASE))
                relative = url.removeprefix(BASE)
                page = ROOT / relative / 'index.html'
                head = Head()
                head.feed(page.read_text(encoding='utf-8'))
                self.assertEqual(head.canonical, [url])
                for key, value in [('og:image:width', '1200'), ('og:image:height', '630'),
                                   ('twitter:card', 'summary_large_image')]:
                    self.assertEqual(head.meta.get(key), [value])
                image_urls = head.meta.get('og:image', [])
                self.assertEqual(len(image_urls), 1)
                image_url = image_urls[0]
                self.assertTrue(image_url.startswith(BASE + 'assets/og/'))
                self.assertFalse(urlsplit(image_url).query)
                self.assertFalse(urlsplit(image_url).fragment)
                image = ROOT / image_url.removeprefix(BASE)
                self.assertTrue(image.is_relative_to(ROOT / 'assets/og'))
                self.assertEqual(image.suffix, '.png')
                data = image.read_bytes()
                self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
                self.assertEqual(data[12:16], b'IHDR')
                self.assertEqual(struct.unpack('>II', data[16:24]), (1200, 630))
                self.assertLessEqual(len(data), 300 * 1024)
                self.assertEqual(len(head.meta.get('og:image:alt', [])), 1)
                self.assertTrue(head.meta['og:image:alt'][0].strip())
                if not relative or relative.startswith('tools/'):
                    self.assertNotEqual(image.name, 'default.png')
                    dedicated[url] = image.name
                else:
                    self.assertEqual(image.name, 'default.png')
        self.assertEqual(len(dedicated), 12)
        self.assertEqual(len(set(dedicated.values())), 12)


if __name__ == '__main__':
    unittest.main()
