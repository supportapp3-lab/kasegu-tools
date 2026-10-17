import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "teiden-sonae" / "index.html"
QUESTION = "電池の不足本数から、包装をいくつ検討すればよいですか？"
ANSWER = "機器本体の表示と種類が合い、使いかけでない電池だけを手持ちとして数えます。不足があるときだけ、不足本数を包装に書かれた1パックあたりの本数で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。使用時間や何日分かは計算しないため、機器の表示と取扱説明書を確認してください。"


class TeidenPackExampleTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = GUIDE.read_text(encoding="utf-8")

    def test_fictional_pack_example_and_expiry_link(self):
        match = re.search(
            r'<section\b(?=[^>]*\bid="pack-example")[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        section = match.group(1)
        for text in (
            "架空の機器ラベル",
            "種類Aを2本",
            "2×2＝4本",
            "不足は2本",
            "2 ÷ 2 ＝1",
            "1パック",
        ):
            self.assertIn(text, section)
        self.assertIn('href="../../tools/rolling-stock/index.html"', section)

    def test_section_and_affiliate_frame_positions(self):
        match_check = self.html.index('id="match-check"')
        pack = self.html.index('id="pack-example"')
        buy_check = self.html.index('id="buy-check"')
        affiliate = re.search(
            r'<section\b(?=[^>]*\bdata-category="lighting-battery")[^>]*>',
            self.html,
        )
        self.assertIsNotNone(affiliate)
        self.assertEqual(self.html.count('data-category="lighting-battery"'), 1)
        self.assertLess(match_check, pack)
        self.assertLess(pack, buy_check)
        self.assertGreater(affiliate.start(), buy_check)

    def test_faq_matches_question_and_answer(self):
        faq = re.search(
            r"<details><summary>" + re.escape(QUESTION) +
            r"</summary><p>(.*?)</p></details>",
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(faq)
        self.assertEqual(faq.group(1), ANSWER)

    def test_faq_page_json_ld_matches_question_and_answer(self):
        match = re.search(
            r'<script type="application/ld\+json">(.*?)</script>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        data = json.loads(match.group(1))
        faq_page = next(
            item for item in data["@graph"] if item.get("@type") == "FAQPage"
        )
        question = next(
            item for item in faq_page["mainEntity"] if item["name"] == QUESTION
        )
        self.assertEqual(question["acceptedAnswer"]["text"], ANSWER)

    def test_faq_body_and_json_ld_counts_match(self):
        faq_start = self.html.index('id="faq"')
        faq_end = self.html.index("</section>", faq_start)
        details_count = self.html[faq_start:faq_end].count("<details>")
        match = re.search(
            r'<script type="application/ld\+json">(.*?)</script>',
            self.html,
            re.DOTALL,
        )
        data = json.loads(match.group(1))
        faq_page = next(
            item for item in data["@graph"] if item.get("@type") == "FAQPage"
        )
        self.assertEqual(details_count, 9)
        self.assertEqual(len(faq_page["mainEntity"]), 9)
        self.assertEqual(details_count, len(faq_page["mainEntity"]))


if __name__ == "__main__":
    unittest.main()
