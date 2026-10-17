"""Regression tests for the generated sitemap."""
import importlib.util
import subprocess
import tempfile
import unittest
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from unittest.mock import patch
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "build_sitemap.py"
SPEC = importlib.util.spec_from_file_location("build_sitemap", SCRIPT)
build_sitemap_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(build_sitemap_module)

NS = {"s": build_sitemap_module.SITEMAP_NAMESPACE}
BASE = build_sitemap_module.SITE_BASE


def write_sitemap(path, urls):
    root = ElementTree.Element(f"{{{build_sitemap_module.SITEMAP_NAMESPACE}}}urlset")
    for url, lastmod in urls:
        entry = ElementTree.SubElement(root, f"{{{build_sitemap_module.SITEMAP_NAMESPACE}}}url")
        ElementTree.SubElement(entry, f"{{{build_sitemap_module.SITEMAP_NAMESPACE}}}loc").text = url
        if lastmod:
            ElementTree.SubElement(entry, f"{{{build_sitemap_module.SITEMAP_NAMESPACE}}}lastmod").text = lastmod
    ElementTree.ElementTree(root).write(path, encoding="utf-8", xml_declaration=True)


class AnchorParser(HTMLParser):
    """Collect crawlable anchor hrefs from one local HTML page."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "a":
            href = dict(attrs).get("href")
            if href:
                self.hrefs.append(href)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def normalize_internal_url(href, source_url, base_url=BASE):
    """Resolve an anchor and keep only canonical URLs under this GitHub Pages project."""
    base = urlsplit(base_url)
    target = urlsplit(urljoin(source_url, href))
    if target.scheme not in ("http", "https") or target.hostname != base.hostname:
        return None
    if not target.path.startswith(base.path):
        return None

    path = target.path
    if path.endswith("/index.html"):
        path = path[:-len("index.html")]
    elif not Path(path).suffix and not path.endswith("/"):
        path += "/"
    return f"{base.scheme}://{base.netloc}{path}"


def local_html_for_url(url, root, base_url=BASE):
    """Map a project URL to an existing local HTML file without leaving root."""
    base_path = urlsplit(base_url).path
    parsed = urlsplit(url)
    if parsed.hostname != urlsplit(base_url).hostname or not parsed.path.startswith(base_path):
        return None

    relative = unquote(parsed.path[len(base_path):])
    page = Path(root) / relative
    if not relative or parsed.path.endswith("/") or not page.suffix:
        page = page / "index.html"

    root = Path(root).resolve()
    page = page.resolve()
    if not page.is_relative_to(root) or not page.is_file():
        return None
    return page


def unreachable_sitemap_urls(root, sitemap_urls, base_url=BASE):
    """Return sitemap URLs not reachable through local same-project anchor links."""
    start_url = normalize_internal_url(base_url, base_url, base_url)
    visited = {start_url}
    queue = deque([start_url])

    while queue:
        source_url = queue.popleft()
        page = local_html_for_url(source_url, root, base_url)
        if page is None:
            continue

        parser = AnchorParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for href in parser.hrefs:
            target_url = normalize_internal_url(href, source_url, base_url)
            if target_url and target_url not in visited:
                target_page = local_html_for_url(target_url, root, base_url)
                if target_page is not None:
                    visited.add(target_url)
                    queue.append(target_url)

    return [
        url for url in sitemap_urls
        if normalize_internal_url(url, base_url, base_url) not in visited
    ]


class BuildSitemapTests(unittest.TestCase):
    def test_generated_urls_map_to_existing_pages_and_lastmod_matches_git(self):
        source = ROOT / "sitemap.xml"
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / "generated.xml"
            build_sitemap_module.build_sitemap(source, output)

            source_entries = ElementTree.parse(source).findall("s:url", NS)
            generated_entries = ElementTree.parse(output).findall("s:url", NS)
            self.assertEqual(len(generated_entries), len(source_entries))

            pages_with_history = 0
            for source_entry, generated_entry in zip(source_entries, generated_entries):
                url = source_entry.findtext("s:loc", namespaces=NS)
                self.assertEqual(generated_entry.findtext("s:loc", namespaces=NS), url)
                self.assertTrue(url.startswith(BASE))
                self.assertNotIn("/404.html", url)

                page = build_sitemap_module.file_for_url(url)
                self.assertTrue(page.is_file(), f"{url} must map to an existing public page")
                self.assertNotEqual(page, ROOT / "404.html")

                relative = page.relative_to(ROOT).as_posix()
                result = subprocess.run(
                    ["git", "log", "-1", "--format=%cI", "--", relative],
                    cwd=ROOT,
                    check=False,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                )
                expected = result.stdout.strip() if result.returncode == 0 else ""
                actual = generated_entry.findtext("s:lastmod", namespaces=NS)
                if expected:
                    pages_with_history += 1
                    self.assertEqual(actual, expected, relative)
                else:
                    self.assertIsNone(actual, relative)

            self.assertGreater(pages_with_history, 0, "tracked public pages should have Git history")

    def test_all_sitemap_urls_reachable_from_top(self):
        sitemap_root = ElementTree.parse(ROOT / "sitemap.xml").getroot()
        sitemap_urls = [
            loc.text.strip()
            for loc in sitemap_root.findall("s:url/s:loc", NS)
            if loc.text and loc.text.strip()
        ]
        unreachable = unreachable_sitemap_urls(ROOT, sitemap_urls)
        self.assertEqual(
            unreachable,
            [],
            "sitemap URLs not reachable from the top page: " + ", ".join(unreachable),
        )

    def test_unreachable_sitemap_page_is_detected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "index.html").write_text(
                '<a href="/kasegu-tools/a/">A</a>', encoding="utf-8"
            )
            (root / "a").mkdir()
            (root / "a" / "index.html").write_text(
                '<a href="/kasegu-tools/b/?source=a#details">B</a>', encoding="utf-8"
            )
            (root / "b").mkdir()
            (root / "b" / "index.html").write_text("B page", encoding="utf-8")
            (root / "c").mkdir()
            (root / "c" / "index.html").write_text("Orphan page", encoding="utf-8")
            sitemap_urls = [
                BASE,
                BASE + "a/",
                BASE + "b/",
                BASE + "c/",
            ]

            self.assertEqual(
                unreachable_sitemap_urls(root, sitemap_urls),
                [BASE + "c/"],
            )

    def test_page_without_git_history_has_no_lastmod(self):
        page_url = BASE + "tools/bichiku/"
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "source.xml"
            output = Path(temporary) / "generated.xml"
            write_sitemap(source, [(page_url, "2000-01-01T00:00:00+00:00")])
            no_history = subprocess.CompletedProcess(
                args=["git", "log"], returncode=128, stdout="", stderr="no history"
            )
            with patch.object(build_sitemap_module.subprocess, "run", return_value=no_history):
                build_sitemap_module.build_sitemap(source, output)

            entry = ElementTree.parse(output).find("s:url", NS)
            self.assertIsNone(entry.find("s:lastmod", NS))

    def test_missing_page_fails(self):
        missing_url = BASE + "guides/__missing_sitemap_test_page__/"
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "source.xml"
            output = Path(temporary) / "generated.xml"
            write_sitemap(source, [(missing_url, None)])
            with self.assertRaises(FileNotFoundError):
                build_sitemap_module.build_sitemap(source, output)

    def test_source_and_output_must_differ(self):
        source = ROOT / "sitemap.xml"
        with self.assertRaises(ValueError):
            build_sitemap_module.build_sitemap(source, source)


if __name__ == "__main__":
    unittest.main()
