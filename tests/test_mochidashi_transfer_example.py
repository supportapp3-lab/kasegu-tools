import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "mochidashi-bukuro" / "index.html"
EXAMPLE = '<p class="example"><strong>移し替えの計算例（家庭が決めた架空のリストです）</strong><br>家庭が決めた架空のリストで、袋用の水を3本としている例です。上の記入例のとおり袋内に2本、家の棚に4本あるとき、3－2で袋用の不足は1本です。家の棚から1本を袋へ移した後は袋3本・家3本で、合計は2＋4＝6本のまま増えません。購入を考える前に、家の4本を袋の本数へ足して足りていると数えたり、移した1本を家にも残っているように数えたりしないでください。3本は一般的な推奨量ではなく、品目や量は家族の事情と自治体の案内に合わせて決めます。</p>'


class MochidashiTransferExampleTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = GUIDE.read_text(encoding="utf-8")

    def test_example_matches_exact_text_and_position(self):
        self.assertEqual(self.html.count(EXAMPLE), 1)
        gap_start = self.html.index('id="gap-check"')
        gap_end = self.html.index("</section>", gap_start)
        section = self.html[gap_start:gap_end]
        example_start = section.index(EXAMPLE)
        table_end = section.index("</tbody></table></div>")
        shortage_start = section.index("不足の判断は、品目名だけで決めず")
        self.assertGreater(example_start, table_end)
        self.assertLess(example_start, shortage_start)
        for text in (
            "家庭が決めた架空のリスト",
            "袋用の不足は1本",
            "袋へ移した後",
            "家3本",
            "2＋4＝6本",
        ):
            self.assertIn(text, EXAMPLE)

    def test_gap_and_affiliate_positions(self):
        gap = self.html.index('id="gap-check"')
        buy_check = self.html.index('id="buy-check"')
        affiliate = re.search(
            r'<section\b(?=[^>]*\bdata-category="go-bag")[^>]*>',
            self.html,
        )
        self.assertIsNotNone(affiliate)
        self.assertEqual(self.html.count('data-category="go-bag"'), 1)
        self.assertLess(gap, buy_check)
        self.assertGreater(affiliate.start(), buy_check)

    def test_faq_counts_remain_nine_and_match_json_ld(self):
        faq_start = self.html.index('id="faq"')
        faq_end = self.html.index("</section>", faq_start)
        details_count = self.html[faq_start:faq_end].count("<details>")
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
        self.assertEqual(details_count, 9)
        self.assertEqual(len(faq_page["mainEntity"]), 9)
        self.assertEqual(details_count, len(faq_page["mainEntity"]))


if __name__ == "__main__":
    unittest.main()
