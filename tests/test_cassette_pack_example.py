import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "cassette-bombe-bichiku" / "index.html"
QUESTION = "ボンベの不足本数から、何パック分を検討すればよいですか？"
ANSWER = "不足があるときだけ、不足本数を使用するコンロに適合するボンベの包装に書かれた1パックあたりの本数で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。目安より多く残る本数は手持ちとして記録し、製造年月・期限表示とメーカー案内を確認してください。"


class CassettePackExampleTest(unittest.TestCase):
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
        for text in ("4 ÷ 3", "2パック", "3×2－4＝2本", "架空"):
            self.assertIn(text, section)
        self.assertIn('href="../../tools/rolling-stock/index.html"', section)

    def test_section_and_affiliate_frame_positions(self):
        shortage = self.html.index('id="shortage"')
        pack = self.html.index('id="pack-example"')
        buy_check = self.html.index('id="buy-check"')
        affiliate = re.search(
            r'<section\b(?=[^>]*\bdata-category="cassette-gas")[^>]*>',
            self.html,
        )
        self.assertIsNotNone(affiliate)
        self.assertEqual(self.html.count('data-category="cassette-gas"'), 1)
        self.assertLess(shortage, pack)
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


if __name__ == "__main__":
    unittest.main()
