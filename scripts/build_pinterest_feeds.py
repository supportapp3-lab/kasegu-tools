"""Generate committed Pinterest RSS 2.0 feeds from pinterest_pins.json."""
import argparse
import json
import struct
import sys
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE_BASE = 'https://supportapp3-lab.github.io/kasegu-tools/'
IMAGE_BASE = SITE_BASE + 'assets/pinterest/'
MEDIA_NAMESPACE = 'http://search.yahoo.com/mrss/'
BOARDS = ('bousai', 'diy', 'garden')


def publication_date(pin):
    date = parsedate_to_datetime(pin['pubDate'])
    if date.tzinfo is None:
        raise ValueError('pubDate must include a timezone: ' + pin['id'])
    return date


def image_size(root, url):
    parsed = urlsplit(url)
    if not url.startswith(IMAGE_BASE) or parsed.query or parsed.fragment:
        raise ValueError('Unsupported Pinterest image URL: ' + url)
    directory = (root / 'assets/pinterest').resolve()
    path = (directory / unquote(url.removeprefix(IMAGE_BASE))).resolve()
    if not path.is_relative_to(directory):
        raise ValueError('Image path escapes assets/pinterest: ' + url)
    with path.open('rb') as image:
        header = image.read(24)
    if (header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR'
            or len(header) != 24 or struct.unpack('>II', header[16:24]) != (1000, 1500)):
        raise ValueError('Expected a 1000x1500 PNG: ' + url)
    return path.stat().st_size


def build_feeds(root):
    pins = json.loads((root / 'data/pinterest_pins.json').read_text(encoding='utf-8'))
    grouped = {board: [] for board in BOARDS}
    seen = set()
    for pin in pins:
        if pin['board'] not in grouped:
            raise ValueError('Unknown board: ' + pin['board'])
        if pin['id'] in seen:
            raise ValueError('Duplicate pin id: ' + pin['id'])
        seen.add(pin['id'])
        grouped[pin['board']].append(pin)

    ET.register_namespace('media', MEDIA_NAMESPACE)
    feeds = {}
    for board, entries in grouped.items():
        if not entries or len({pin['board_name'] for pin in entries}) != 1:
            raise ValueError('Expected one board_name and at least one pin for ' + board)
        board_name = entries[0]['board_name']
        rss = ET.Element('rss', {'version': '2.0'})
        channel = ET.SubElement(rss, 'channel')
        ET.SubElement(channel, 'title').text = '暮らしの計算室｜' + board_name
        ET.SubElement(channel, 'link').text = SITE_BASE
        ET.SubElement(channel, 'description').text = '暮らしの計算室の「' + board_name + '」のピンを紹介します。'
        ET.SubElement(channel, 'language').text = 'ja'
        for pin in sorted(entries, key=lambda pin: (publication_date(pin), pin['id'])):
            item = ET.SubElement(channel, 'item')
            for name in ('title', 'description', 'link'):
                ET.SubElement(item, name).text = pin[name]
            ET.SubElement(item, 'guid', {'isPermaLink': 'false'}).text = pin['id']
            ET.SubElement(item, 'pubDate').text = pin['pubDate']
            ET.SubElement(item, 'enclosure', {
                'url': pin['image'], 'type': 'image/png',
                'length': str(image_size(root, pin['image'])),
            })
            ET.SubElement(item, '{' + MEDIA_NAMESPACE + '}content', {
                'url': pin['image'], 'medium': 'image', 'type': 'image/png',
                'width': '1000', 'height': '1500',
            })
        ET.indent(rss, space='  ')
        feeds[Path('assets/pinterest') / (board + '.xml')] = (
            ET.tostring(rss, encoding='utf-8', xml_declaration=True) + b'\n')
    return feeds


def update_feeds(root, check=False):
    # Build all feeds before writing, so invalid source data cannot partially update them.
    feeds = build_feeds(root)
    different = []
    for relative, data in feeds.items():
        path = root / relative
        # Git may check text files out with CRLF on Windows; compare XML text,
        # while always generating the same UTF-8/LF bytes.
        if not path.is_file() or path.read_text(encoding='utf-8') != data.decode('utf-8'):
            different.append(relative.as_posix())
        if not check:
            path.write_bytes(data)
    return different


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='check committed feeds without writing')
    args = parser.parse_args(argv)
    try:
        different = update_feeds(ROOT, check=args.check)
    except (OSError, ValueError, KeyError, TypeError) as error:
        print('Pinterest feeds: ' + str(error), file=sys.stderr)
        return 1
    if args.check and different:
        print('Outdated or missing Pinterest feeds: ' + ', '.join(different), file=sys.stderr)
        return 1
    print('Pinterest feeds: ' + ('up to date' if args.check else 'generated 3 feeds'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
