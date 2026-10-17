import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "tools" / "wallpaper-quantity" / "index.html"


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


class WallpaperStockCheckTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = HTML_PATH.read_text(encoding="utf-8")

    def test_stock_check_has_blank_memo_and_safe_guidance(self):
        section = re.search(
            r'<section\b[^>]*\bid="stock-check"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(section)
        body = section.group(1)
        for phrase in (
            "柄・色番",
            "有効幅",
            "柄リピート",
            "残り長さ",
            "破れ・汚れ",
            "必要長さ",
            "差し引かない",
            "自動判定しない",
            "施工条件は販売店・施工業者へ確認",
        ):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, body)
        self.assertNotIn("<input", body.lower())
        self.assertNotIn("<script", body.lower())
        self.assertNotIn("<a ", body.lower())

        memo = re.search(r'<ul\b[^>]*\bclass="stock-memo"[^>]*>(.*?)</ul>', body, re.DOTALL)
        self.assertIsNotNone(memo)
        self.assertEqual(len(re.findall(r"<li\b", memo.group(1))), 6)

    def test_section_order_affiliate_and_navigation(self):
        positions = [
            self.html.index('id="limits"'),
            self.html.index('id="stock-check"'),
            self.html.index('id="pre-buy-check"'),
            self.html.index('data-category="wallpaper"'),
            self.html.index('id="faq"'),
            self.html.index('id="sources"'),
        ]
        self.assertEqual(positions, sorted(positions))
        self.assertIn('<a href="#stock-check">残ロールの確認</a>', self.html)
        self.assertEqual(self.html.count('data-category="wallpaper"'), 1)

    def test_existing_formula_and_seven_faqs_remain(self):
        formula = re.search(
            r'<section\b[^>]*\bid="formula"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(formula)
        for phrase in ("4枚", "240cm", "9.6m"):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, formula.group(1))

        faq = re.search(
            r'<section\b[^>]*\bid="faq"[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(faq)
        details_count = len(re.findall(r"<details\b", faq.group(1)))
        self.assertEqual(details_count, 7)

        scripts = re.findall(
            r'<script\b[^>]*\btype="application/ld\+json"[^>]*>(.*?)</script>',
            self.html,
            re.DOTALL,
        )
        faq_pages = []
        for script in scripts:
            faq_pages.extend(find_faq_pages(json.loads(script)))
        self.assertEqual(len(faq_pages), 1)
        self.assertEqual(len(faq_pages[0].get("mainEntity", [])), 7)


if __name__ == "__main__":
    unittest.main()
