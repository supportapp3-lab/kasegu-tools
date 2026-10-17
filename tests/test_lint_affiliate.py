"""Regression tests for affiliate-link lint rules."""
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "lint.py"
SPEC = importlib.util.spec_from_file_location("site_lint", SCRIPT)
site_lint = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(site_lint)


def document(content, disclosure=False):
    text = "Amazonのアソシエイトとして" if disclosure else ""
    return f"<html><body>{text}{content}</body></html>"


class AffiliateLintTests(unittest.TestCase):
    def test_amazon_link_requires_sponsored(self):
        errors = site_lint.affiliate_errors_from_html(
            document('<a href="https://amazon.co.jp/item">商品</a>', disclosure=True)
        )
        self.assertTrue(any("affiliate link needs rel=sponsored" in error for error in errors))

    def test_sponsored_amazon_link_is_allowed(self):
        errors = site_lint.affiliate_errors_from_html(
            document('<a href="https://www.amazon.co.jp/item" rel="ugc sponsored">商品</a>', disclosure=True)
        )
        self.assertEqual(errors, [])

    def test_amzn_short_link_requires_sponsored(self):
        errors = site_lint.affiliate_errors_from_html(
            document('<a href="https://amzn.to/short">商品</a>', disclosure=True)
        )
        self.assertTrue(any("affiliate link needs rel=sponsored" in error for error in errors))

    def test_affiliate_slot_requires_sponsored_for_other_hosts(self):
        html = document(
            '<div class="card affiliate" data-category="book">'
            '<a href="https://example.com/item">商品</a></div>'
        )
        errors = site_lint.affiliate_errors_from_html(html)
        self.assertTrue(any("affiliate link needs rel=sponsored" in error for error in errors))

    def test_affiliate_slot_allows_one_sponsored_external_link(self):
        html = document(
            '<div class="affiliate" data-category="book">'
            '<a href="https://example.com/item" rel="sponsored">商品</a></div>'
        )
        self.assertEqual(site_lint.affiliate_errors_from_html(html), [])

    def test_affiliate_slot_rejects_two_external_links(self):
        html = document(
            '<div class="affiliate" data-category="book">'
            '<a href="https://example.com/one" rel="sponsored">1</a>'
            '<a href="https://example.net/two" rel="sponsored">2</a></div>'
        )
        errors = site_lint.affiliate_errors_from_html(html)
        self.assertTrue(any("affiliate slot has more than one link" in error for error in errors))

    def test_amazon_link_requires_associates_disclosure(self):
        html = document('<a href="https://amazon.co.jp/item" rel="sponsored">商品</a>')
        errors = site_lint.affiliate_errors_from_html(html)
        self.assertTrue(any("amazon link needs associates disclosure" in error for error in errors))

    def test_associates_disclosure_allows_amazon_link(self):
        html = document(
            '<a href="https://amazon.co.jp/item" rel="sponsored">商品</a>',
            disclosure=True,
        )
        self.assertEqual(site_lint.affiliate_errors_from_html(html), [])

    def test_regular_external_link_outside_slot_needs_no_sponsored(self):
        html = document('<a href="https://example.com/">通常リンク</a>')
        self.assertEqual(site_lint.affiliate_errors_from_html(html), [])

    def test_relative_link_in_affiliate_slot_is_not_counted(self):
        html = document(
            '<div class="affiliate" data-category="book">'
            '<a href="/books/item">商品</a></div>'
        )
        self.assertEqual(site_lint.affiliate_errors_from_html(html), [])

    def test_affiliate_class_without_data_category_is_not_a_slot(self):
        html = document(
            '<div class="affiliate"><a href="https://example.com/">通常リンク</a></div>'
        )
        self.assertEqual(site_lint.affiliate_errors_from_html(html), [])


if __name__ == "__main__":
    unittest.main()
