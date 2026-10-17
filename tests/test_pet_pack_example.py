import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "pet-bousai-bichiku" / "index.html"
QUESTION = "フードの不足量から、何袋分を検討すればよいですか？"
ANSWER = "不足があるときだけ、同じ製品の不足量を包装に書かれた1袋あたりの内容量（同じ単位）で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。開封後に残る量を保存条件と期限の範囲で使い切れるかも製品表示で確認し、療法食などは獣医師の指示を優先してください。"


class PetPackExampleTest(unittest.TestCase):
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
        for text in ("250 ÷ 1,000", "1袋", "1,000－250＝750g", "架空"):
            self.assertIn(text, section)
        self.assertIn('href="../../tools/pet-bichiku/index.html"', section)

    def test_section_follows_shortage_and_precedes_pet_record(self):
        shortage = self.html.index('id="shortage"')
        pack = self.html.index('id="pack-example"')
        pet_record = self.html.index('id="pet-record"')
        self.assertLess(shortage, pack)
        self.assertLess(pack, pet_record)

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
