import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "baby-bousai-bichiku" / "index.html"
QUESTION = "おむつの不足枚数から、何パック分を検討すればよいですか？"
ANSWER = "不足があるときだけ、同じサイズの不足枚数を包装に書かれた1パックあたりの枚数で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。開封後に残る枚数をサイズが合わなくなる前に使い切れるかも、製品表示と家庭の状況で確認してください。"


class BabyPackExampleTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = GUIDE.read_text(encoding="utf-8")

    def test_fictional_pack_example_and_tool_link(self):
        match = re.search(
            r'<section\b(?=[^>]*\bid="pack-example")[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        section = match.group(1)
        for text in ("8 ÷ 20", "1パック", "20－8＝12枚", "架空"):
            self.assertIn(text, section)
        self.assertIn('href="../../tools/baby-bichiku/index.html"', section)

    def test_section_follows_shortage_and_precedes_set_check(self):
        shortage = self.html.index('id="shortage"')
        pack = self.html.index('id="pack-example"')
        set_check = self.html.index('id="set-check"')
        self.assertLess(shortage, pack)
        self.assertLess(pack, set_check)

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
