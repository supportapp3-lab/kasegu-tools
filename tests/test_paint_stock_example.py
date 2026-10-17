import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "tools" / "paint-quantity" / "index.html"


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


class PaintStockExampleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = HTML_PATH.read_text(encoding="utf-8")

    def test_stock_example_has_safe_fictional_comparison(self):
        section = re.search(
            r'<section\b[^>]*\bid="stock-example"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(section)
        for phrase in (
            "架空の手持ち例",
            "最小3缶",
            "手持ちが1缶",
            "3－1＝2缶",
            "3缶以上",
            "追加購入は不要",
            "開封済み",
        ):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, section.group(1))

    def test_section_and_affiliate_order_and_navigation(self):
        positions = [
            self.html.index('id="limits"'),
            self.html.index('id="stock-example"'),
            self.html.index('id="pre-buy-check"'),
            self.html.index('data-category="paint"'),
            self.html.index('id="sources"'),
        ]
        self.assertEqual(positions, sorted(positions))
        self.assertIn('<a href="#stock-example">手持ちとの照合</a>', self.html)
        self.assertEqual(self.html.count('data-category="paint"'), 1)

    def test_existing_formula_and_six_faqs_remain(self):
        formula = re.search(
            r'<section\b[^>]*\bid="formula"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(formula)
        for phrase in ("18㎡", "36 ÷ 15", "3缶"):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, formula.group(1))

        faq = re.search(
            r'<section\b[^>]*\bid="faq"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(faq)
        details_count = len(re.findall(r"<details\b", faq.group(1)))
        self.assertEqual(details_count, 6)

        scripts = re.findall(
            r'<script\b[^>]*\btype="application/ld\+json"[^>]*>(.*?)</script>',
            self.html,
            re.DOTALL,
        )
        faq_pages = []
        for script in scripts:
            faq_pages.extend(find_faq_pages(json.loads(script)))
        self.assertEqual(len(faq_pages), 1)
        self.assertEqual(len(faq_pages[0].get("mainEntity", [])), 6)


if __name__ == "__main__":
    unittest.main()
