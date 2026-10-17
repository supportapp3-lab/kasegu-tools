"""Checks the fictional pack-count example in the emergency-food guide."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "hijoushoku-erabikata" / "index.html"
QUESTION = "不足食数からパック数はどう出しますか？"
ANSWER = "不足があるときだけ、不足食数を包装に書かれた1パックあたりの食数（同じ単位）で割り、端数を切り上げた数が算術上の目安です。不足がなければ0です。これは購入数量の確定ではなく、単位が違う表示を合算しません。画面で繰り返す場合は防災備蓄ツールの食品別目標在庫差分を使えます。"


class HijoushokuPackExampleTests(unittest.TestCase):
    def setUp(self):
        self.html = GUIDE.read_text(encoding="utf-8")

    def test_pack_example_has_requested_calculation_and_tool_link(self):
        section = re.search(
            r'<section\b(?=[^>]*\bid="pack-example")[^>]*>(.*?)</section>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(section, "pack-example section must exist")
        content = section.group(1)
        self.assertIn("10 ÷ 3", content)
        self.assertIn("4パック", content)
        self.assertIn("架空", content)
        self.assertIn(
            '<a href="../../tools/bichiku/index.html#custom-food-stock">',
            content,
        )
        self.assertIn(
            '<a href="#pack-example">パック数の目安</a>',
            self.html,
        )

    def test_faq_body_and_json_ld_have_the_same_answer(self):
        details = re.search(
            rf"<details>\s*<summary>{re.escape(QUESTION)}</summary>\s*"
            rf"<p>(.*?)</p>\s*</details>",
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(details, "FAQ question must exist in the page body")
        self.assertEqual(details.group(1), ANSWER)

        script = re.search(
            r'<script type="application/ld\+json">(.*?)</script>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(script, "FAQPage JSON-LD must exist")
        structured_data = json.loads(script.group(1))
        faq = next(
            item for item in structured_data["@graph"]
            if item.get("@type") == "FAQPage"
        )
        question = next(
            item for item in faq["mainEntity"]
            if item.get("name") == QUESTION
        )
        self.assertEqual(question["acceptedAnswer"]["text"], ANSWER)


if __name__ == "__main__":
    unittest.main()
