"""Regression tests for the generated sitemap."""
import importlib.util
import subprocess
import tempfile
import unittest
from pathlib import Path
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
