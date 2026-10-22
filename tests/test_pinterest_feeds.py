"""Check the committed Pinterest feeds and the offline generator contract."""
import importlib.util
import json
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
from collections import Counter
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://supportapp3-lab.github.io/kasegu-tools/'
IMAGE_BASE = BASE + 'assets/pinterest/'
MEDIA = '{http://search.yahoo.com/mrss/}content'
COUNTS = {'bousai': 2, 'diy': 2, 'garden': 1}
SCRIPT = ROOT / 'scripts/build_pinterest_feeds.py'
SPEC = importlib.util.spec_from_file_location('build_pinterest_feeds', SCRIPT)
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


def snapshot(root):
    return {p.relative_to(root): (p.read_bytes(), p.stat().st_mtime_ns)
            for p in root.rglob('*') if p.is_file()}


def copy_fixture(root):
    (root / 'data').mkdir()
    (root / 'scripts').mkdir()
    shutil.copy2(ROOT / 'data/pinterest_pins.json', root / 'data/pinterest_pins.json')
    shutil.copy2(SCRIPT, root / 'scripts/build_pinterest_feeds.py')
    shutil.copytree(ROOT / 'assets/pinterest', root / 'assets/pinterest')


def check_cli(root):
    return subprocess.run([sys.executable, '-B', str(root / 'scripts/build_pinterest_feeds.py'), '--check'],
                          cwd=root, capture_output=True, text=True, encoding='utf-8')


class PinterestFeedTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pins = json.loads((ROOT / 'data/pinterest_pins.json').read_text(encoding='utf-8'))

    def test_rss_channels_and_all_five_items_match_source_exactly(self):
        self.assertEqual(len(self.pins), 5)
        source = {pin['id']: pin for pin in self.pins}
        self.assertEqual(len(source), len(self.pins))
        found = []
        for board, count in COUNTS.items():
            with self.subTest(board=board):
                path = ROOT / 'assets/pinterest' / (board + '.xml')
                self.assertTrue(path.read_bytes().startswith(b'<?xml'))
                self.assertIn('encoding=\'utf-8\'', path.read_text(encoding='utf-8').splitlines()[0])
                self.assertEqual(dict(namespace for _, namespace in ET.iterparse(path, events=['start-ns']))['media'],
                                 'http://search.yahoo.com/mrss/')
                rss = ET.parse(path).getroot()
                self.assertEqual(rss.tag, 'rss')
                self.assertEqual(rss.attrib, {'version': '2.0'})
                self.assertEqual(len(rss.findall('channel')), 1)
                channel = rss.find('channel')
                expected = [pin for pin in self.pins if pin['board'] == board]
                self.assertEqual(channel.findtext('title'), '暮らしの計算室｜' + expected[0]['board_name'])
                self.assertEqual(channel.findtext('link'), BASE)
                self.assertTrue(channel.findtext('description').strip())
                self.assertEqual(channel.findtext('language'), 'ja')
                items = channel.findall('item')
                self.assertEqual(len(items), count)
                dates = []
                for item in items:
                    guid = item.find('guid')
                    self.assertEqual(guid.attrib, {'isPermaLink': 'false'})
                    pin = source[guid.text]
                    self.assertEqual(pin['board'], board)
                    found.append(guid.text)
                    for field in ('title', 'description', 'link', 'pubDate'):
                        self.assertEqual(len(item.findall(field)), 1)
                        self.assertEqual(item.findtext(field), pin[field])
                    self.assertEqual(len(item.findall('guid')), 1)
                    date = parsedate_to_datetime(item.findtext('pubDate'))
                    self.assertIsNotNone(date.tzinfo)
                    dates.append(date)
                self.assertEqual(dates, sorted(dates))
        self.assertEqual(Counter(found), Counter({pin['id']: 1 for pin in self.pins}))

    def test_item_limits_sitemap_links_and_actual_png_enclosures(self):
        sitemap_urls = {node.text for node in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')}
        for board in COUNTS:
            for item in ET.parse(ROOT / 'assets/pinterest' / (board + '.xml')).findall('channel/item'):
                with self.subTest(guid=item.findtext('guid')):
                    self.assertLessEqual(len(item.findtext('title')), 100)
                    self.assertLessEqual(len(item.findtext('description')), 500)
                    self.assertLessEqual(item.findtext('description').count('#'), 3)
                    link = item.findtext('link')
                    self.assertIn(link, sitemap_urls)
                    self.assertFalse(urlsplit(link).query)
                    self.assertFalse(urlsplit(link).fragment)
                    self.assertEqual(len(item.findall('enclosure')), 1)
                    self.assertEqual(len(item.findall(MEDIA)), 1)
                    enclosure, media = item.find('enclosure'), item.find(MEDIA)
                    pin = next(pin for pin in self.pins if pin['id'] == item.findtext('guid'))
                    for image in (enclosure, media):
                        url = image.get('url')
                        self.assertEqual(url, pin['image'])
                        self.assertTrue(url.startswith(IMAGE_BASE))
                        self.assertFalse(urlsplit(url).query)
                        self.assertFalse(urlsplit(url).fragment)
                    path = (ROOT / pin['image'].removeprefix(BASE)).resolve()
                    self.assertTrue(path.is_relative_to((ROOT / 'assets/pinterest').resolve()))
                    data = path.read_bytes()
                    self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
                    self.assertEqual(data[12:16], b'IHDR')
                    self.assertEqual(struct.unpack('>II', data[16:24]), (1000, 1500))
                    self.assertEqual(enclosure.attrib, {'url': pin['image'], 'type': 'image/png',
                                                     'length': str(len(data))})
                    self.assertEqual(media.attrib, {'url': pin['image'], 'medium': 'image',
                                                   'type': 'image/png', 'width': '1000', 'height': '1500'})

    def test_check_succeeds_without_touching_committed_files(self):
        before = snapshot(ROOT / 'assets/pinterest')
        result = check_cli(ROOT)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(snapshot(ROOT / 'assets/pinterest'), before)

    def test_check_returns_one_for_stale_or_missing_files_without_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            copy_fixture(root)
            stale = root / 'assets/pinterest/bousai.xml'
            stale.write_bytes(stale.read_bytes() + b' ')
            before = snapshot(root)
            result = check_cli(root)
            self.assertEqual(result.returncode, 1)
            self.assertIn('bousai.xml', result.stderr)
            self.assertEqual(snapshot(root), before)
            (root / 'assets/pinterest/garden.xml').unlink()
            before = snapshot(root)
            result = check_cli(root)
            self.assertEqual(result.returncode, 1)
            self.assertIn('garden.xml', result.stderr)
            self.assertEqual(snapshot(root), before)

    def test_check_accepts_windows_checkout_line_endings_without_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            copy_fixture(root)
            for board in COUNTS:
                path = root / 'assets/pinterest' / (board + '.xml')
                path.write_bytes(path.read_text(encoding='utf-8').replace('\n', '\r\n').encode('utf-8'))
            before = snapshot(root)
            result = check_cli(root)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertEqual(snapshot(root), before)

    def test_generation_sorts_dates_and_escapes_plain_text_deterministically(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            copy_fixture(root)
            pins = [dict(pin) for pin in reversed(self.pins)]
            source = root / 'data/pinterest_pins.json'
            source.write_text(json.dumps(pins, ensure_ascii=False), encoding='utf-8')
            for path, data in builder.build_feeds(root).items():
                self.assertEqual(data.decode('utf-8'), (ROOT / path).read_text(encoding='utf-8'))
            pins[0]['title'] = 'A & B < C'
            pins[0]['description'] = 'Plain <b>text</b> & "quotes"'
            source.write_text(json.dumps(pins, ensure_ascii=False), encoding='utf-8')
            first = builder.build_feeds(root)
            self.assertEqual(first, builder.build_feeds(root))
            item = ET.fromstring(first[Path('assets/pinterest/garden.xml')]).find('channel/item')
            self.assertEqual(item.findtext('title'), pins[0]['title'])
            self.assertEqual(item.findtext('description'), pins[0]['description'])
            self.assertEqual(list(item.find('description')), [])
            self.assertIn(b'&lt;b&gt;text&lt;/b&gt; &amp;', first[Path('assets/pinterest/garden.xml')])


if __name__ == '__main__':
    unittest.main()
