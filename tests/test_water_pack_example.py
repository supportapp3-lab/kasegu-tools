import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "mizu-kumioki-bichiku" / "index.html"
QUESTION = "水の不足量から、外装パックをいくつ検討すればよいですか？"
ANSWER = "不足があるときだけ、不足リットル数を外装に書かれた1パックあたりの容量（1本の容量×本数）で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。目安より多く残る量は手持ちとして記録し、必要量そのものは変えずに、賞味期限表示と保存条件を確認してください。"


class WaterPackExampleTest(unittest.TestCase):
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
            "7.5L",
            "2L×3本",
            "7.5 ÷ 6",
            "2パック",
            "6×2－7.5＝4.5L",
            "架空",
        ):
            self.assertIn(text, section)
        self.assertIn('href="../../tools/rolling-stock/index.html"', section)

    def test_section_and_affiliate_frame_positions(self):
        shortage = self.html.index('id="shortage-bottles"')
        pack = self.html.index('id="pack-example"')
        purchase_check = self.html.index('id="purchase-check"')
        affiliate = re.search(
            r'<section\b(?=[^>]*\bdata-category="water")[^>]*>',
            self.html,
        )
        self.assertIsNotNone(affiliate)
        self.assertEqual(self.html.count('data-category="water"'), 1)
        self.assertLess(shortage, pack)
        self.assertLess(pack, purchase_check)
        self.assertGreater(affiliate.start(), purchase_check)

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
        self.assertEqual(details_count, 10)
        self.assertEqual(len(faq_page["mainEntity"]), 10)
        self.assertEqual(details_count, len(faq_page["mainEntity"]))


if __name__ == "__main__":
    unittest.main()
