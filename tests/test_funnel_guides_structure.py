import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDES = (
    ("keitai-toilet-bichiku", ("hand-stock", "shortage-examples", "purchase-check"), "calculator", "toilet", 9),
    ("mizu-kumioki-bichiku", ("hand-stock", "shortage-bottles", "pack-example", "purchase-check"), "storage", "water", 10),
    ("hijoushoku-erabikata", ("stock-count", "shortage-example", "pack-example", "purchase-check"), "disclaimer", "long-life-food", 10),
    ("pet-bousai-bichiku", ("stock", "shortage", "pack-example", "purchase"), "priority", "pet-supply", 10),
    ("baby-bousai-bichiku", ("stock-count", "shortage", "pack-example", "purchase-check"), "family", "baby-supply", 10),
    ("cassette-bombe-bichiku", ("stock-count", "shortage", "pack-example", "buy-check"), "dates", "cassette-gas", 9),
    ("mochidashi-bukuro", ("stock-count", "gap-check", "buy-check"), "family", "go-bag", 9),
    ("teiden-sonae", ("stock-count", "match-check", "pack-example", "buy-check"), "local-info", "lighting-battery", 9),
)


def find_faq_pages(value):
    if isinstance(value, list):
        pages = []
        for item in value:
            pages.extend(find_faq_pages(item))
        return pages
    if not isinstance(value, dict):
        return []
    pages = [value] if value.get("@type") == "FAQPage" else []
    if "@graph" in value:
        pages.extend(find_faq_pages(value["@graph"]))
    return pages


class FunnelGuidesStructureTest(unittest.TestCase):
    def assert_guide_structure(self, html, guide):
        name, section_ids, next_section_id, category, expected_faq_count = guide

        positions = []
        for section_id in section_ids:
            section_opening = re.compile(
                r'<section\b[^>]*\bid="' + re.escape(section_id) + r'"[^>]*>'
            )
            matches = list(section_opening.finditer(html))
            self.assertEqual(len(matches), 1, f"{name}: section {section_id!r} must occur once")
            positions.append(matches[0].start())
        self.assertEqual(positions, sorted(positions), f"{name}: section order changed")

        next_section = re.search(
            r'<section\b[^>]*\bid="' + re.escape(next_section_id) + r'"[^>]*>',
            html,
        )
        self.assertIsNotNone(next_section, f"{name}: next section {next_section_id!r} is missing")

        affiliate_sections = list(
            re.finditer(r'<section\b[^>]*\bdata-category="([^"]+)"[^>]*>', html)
        )
        self.assertEqual(len(affiliate_sections), 1, f"{name}: expected one affiliate slot")
        affiliate = affiliate_sections[0]
        self.assertEqual(affiliate.group(1), category, f"{name}: affiliate category changed")
        self.assertGreater(affiliate.start(), positions[-1], f"{name}: affiliate precedes purchase check")
        self.assertLess(affiliate.start(), next_section.start(), f"{name}: affiliate follows the next section")

        faq_section = re.search(
            r'<section\b[^>]*\bid="faq"[^>]*>(.*?)</section>',
            html,
            re.DOTALL,
        )
        self.assertIsNotNone(faq_section, f"{name}: FAQ section is missing")
        details_count = len(re.findall(r"<details\b", faq_section.group(1)))
        self.assertEqual(details_count, expected_faq_count, f"{name}: FAQ details count changed")

        scripts = re.findall(
            r'<script\b[^>]*\btype="application/ld\+json"[^>]*>(.*?)</script>',
            html,
            re.DOTALL,
        )
        self.assertTrue(scripts, f"{name}: JSON-LD script is missing")
        faq_pages = []
        for index, script in enumerate(scripts):
            with self.subTest(guide=name, json_ld_script=index):
                faq_pages.extend(find_faq_pages(json.loads(script)))
        self.assertEqual(len(faq_pages), 1, f"{name}: expected one FAQPage")
        json_faq_count = len(faq_pages[0].get("mainEntity", []))
        self.assertEqual(json_faq_count, expected_faq_count, f"{name}: FAQPage count changed")
        self.assertEqual(details_count, json_faq_count, f"{name}: FAQ counts differ")

    def test_all_funnel_guides_keep_structure(self):
        for guide in GUIDES:
            name = guide[0]
            path = ROOT / "guides" / name / "index.html"
            with self.subTest(guide=name):
                self.assert_guide_structure(path.read_text(encoding="utf-8"), guide)

    def test_detects_removed_faq_detail_without_changing_a_page(self):
        guide = GUIDES[0]
        path = ROOT / "guides" / guide[0] / "index.html"
        html = path.read_text(encoding="utf-8")
        faq_section = re.search(
            r'(<section\b[^>]*\bid="faq"[^>]*>)(.*?)(</section>)',
            html,
            re.DOTALL,
        )
        self.assertIsNotNone(faq_section)
        changed_faq, replacements = re.subn(
            r"<details\b.*?</details>",
            "",
            faq_section.group(2),
            count=1,
            flags=re.DOTALL,
        )
        self.assertEqual(replacements, 1)
        mutated_html = (
            html[:faq_section.start(2)]
            + changed_faq
            + html[faq_section.end(2):]
        )
        with self.assertRaises(AssertionError):
            self.assert_guide_structure(mutated_html, guide)


if __name__ == "__main__":
    unittest.main()
