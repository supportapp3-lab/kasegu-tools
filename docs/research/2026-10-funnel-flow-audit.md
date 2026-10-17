# 購入導線ガイド8本の節構成・パック数目安・affiliate枠位置の点検

確認日：2026-10-17（日本時間）  
確認対象：`main`（監査時点の commit `3fcd3c4a2e3e94a08d405a5a9a71bfa53230b850`）。HTML の節・リンク・FAQ と JSON-LD を読み取り専用で比較した。本文や広告枠は変更していない。

## 1. 8ガイドの比較

| ガイド | 手持ちを数える節 | 不足を確認する節 | パック数目安の節 | 購入前確認の節 | affiliate枠の位置（直前の節） | FAQ / JSON-LD | 対応ツールへのリンク |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [携帯トイレ](../../guides/keitai-toilet-bichiku/index.html) | `hand-stock` | `shortage-examples` | `shortage-examples`（不足例の表に内包） | `purchase-check` | `toilet` / `purchase-check` の後 | 9 / 9、一致 | あり：携帯トイレ計算、備蓄計算、期限管理 |
| [水](../../guides/mizu-kumioki-bichiku/index.html) | `hand-stock` | `shortage-bottles` | なし（2Lの個別ボトル本数への換算はあり） | `purchase-check` | `water` / `purchase-check` の後 | 9 / 9、一致 | あり：防災備蓄計算、期限管理 |
| [非常食](../../guides/hijoushoku-erabikata/index.html) | `stock-count` | `shortage-example` | `pack-example` | `purchase-check` | `long-life-food` / `purchase-check` の後 | 10 / 10、一致 | あり：防災備蓄計算、ローリングストック |
| [ペット](../../guides/pet-bousai-bichiku/index.html) | `stock` | `shortage` | `pack-example` | `purchase` | `pet-supply` / `purchase` の後 | 10 / 10、一致 | あり：ペット備蓄計算 |
| [赤ちゃん用品](../../guides/baby-bousai-bichiku/index.html) | `stock-count` | `shortage` | `pack-example` | `purchase-check` | `baby-supply` / `purchase-check` の後 | 10 / 10、一致 | あり：赤ちゃん用品計算、期限管理 |
| [カセットボンベ](../../guides/cassette-bombe-bichiku/index.html) | `stock-count` | `shortage` | `pack-example` | `buy-check` | `cassette-gas` / `buy-check` の後 | 9 / 9、一致 | あり：防災備蓄計算、期限管理 |
| [持ち出し袋](../../guides/mochidashi-bukuro/index.html) | `stock-count` | `gap-check`（品目・置き場所の不足と重複を照合。数式で総量を出す節はなし） | なし（品目ごとに単位が異なる） | `buy-check` | `go-bag` / `buy-check` の後 | 9 / 9、一致 | あり：防災備蓄計算、期限管理。袋専用の計算ツールはなし |
| [停電備え](../../guides/teiden-sonae/index.html) | `stock-count` | `match-check`（機器と電源の適合確認。共通の必要量計算はなし） | なし（電池の種類・機器表示の確認が先） | `buy-check` | `lighting-battery` / `buy-check` の後 | 8 / 8、一致 | あり：停電時の電力量整理、期限管理。電池本数の計算ツールはなし |

FAQ は FAQ 節の `<details>` 件数と、FAQPage の `mainEntity` 件数を数えた。件数は全ページで一致する。件数の一致は質問・回答の文面まで一致することを意味しない。パック数の節idは独立した節がある場合はそのid、携帯トイレのように不足例の表へ含まれる場合はその節idとした。

### 観察

- 8ページすべてに「手持ち」から「購入前確認」へ進む位置があり、affiliate枠はそれぞれの購入前確認節の直後に1つある。
- 4ページ（非常食、ペット、赤ちゃん用品、カセットボンベ）は不足例の後に独立したパック数節がある。
- 携帯トイレは Issue の前提と異なり、すでに `shortage-examples` の表で、架空の不足回数・包装の回数表示・切り上げたパック数まで計算している。例は「50÷25＝2パック」「40÷30を切り上げて2パック」。新しい例を重ねる必要はない。
- 水は不足量から2Lボトルの本数を切り上げているが、複数本を1パックとする架空の包装例はない。
- 持ち出し袋は品目と置き場所を分け、二重計上を避ける例がある。総量を一つの包装単位へ換算する構造ではない。
- 停電備えは、機器表示と互換性のある電池・ケーブルを確かめる構成。現在の例は機器の使用時間や家庭共通の必要本数を計算していない。

## 2. affiliate枠の設計メモとの照合

[2026-10 affiliate slot design](2026-10-affiliate-slot-design.md) のガイドページ別の位置指定には、携帯トイレ（`toilet`）・非常食（`long-life-food`）・停電備え（`lighting-battery`）がある。各枠はそれぞれ `purchase-check` または `buy-check` の後にあり、文書の位置指定と一致する。いずれも不足や購入前の確認を読んだ後で、商品候補の内容を照合する順序になっている。

水、ペット、赤ちゃん用品、カセットボンベ、持ち出し袋の5ガイドについては、この設計文書に個別のガイド位置指定がない。現状では各ページの購入前確認節の後に枠があり、確認を飛ばして枠へ進ませる位置ではない。明示された個別規則との不一致は見つからなかった。これら5枠の配置を設計文書へ追加するかは、承認後のリンク実装前に決めるとよい。

この比較は枠の位置だけを対象とする。リンク先、表示文、広告の適法性や承認状態は評価していない。

## 3. パック数例がない4ガイドの評価

Issue の候補に挙がった4ページを、現行 main の内容で再確認した。

| 対象 | 既存の数値・単位で例を作れるか | 追加価値と注意点 | 判断 |
| --- | --- | --- | --- |
| 携帯トイレ | すでに作成済み。手持ちを構成品がそろう回数で数え、不足回数を架空の包装表示で割り、端数を切り上げている。 | 同じ説明を足すと重複する。現行表は箱の「何回分」表示と組み合わせを照合し、購入後にそろった回数で在庫更新する点も説明している。 | 追加不要。Issue本文の「例がない」という前提を訂正する。 |
| 水 | 可能。既存の2人・3日例には必要18L、手持ち10.5L、不足7.5L、2Lボトル4本という架空の計算がある。 | 架空の外装表示を「2L×3本」とすれば、1パック6L、7.5÷6を切り上げて2パック、余り4.5Lまで示せる。必要量そのものを8Lに丸めない注意が既にあり、個別ボトル本数と包装パック数を区別する価値がある。 | 追加価値あり。既存値だけで説明でき、新しい公的数値は不要。 |
| 持ち出し袋 | 数量例はあるが、食品・水・電池・衛生用品など異なる単位が混在する。共通の「1パックあたり」に換算できない。 | 架空の包装数を一つの袋全体へ当てはめるのは誤解を招きやすい。一方、現在の `gap-check` は置き場所の重複を説明するが、移し替え前後の合計を数値で追う例はない。 | 包装数例は見送り。家庭が決めた品目別リストを使った在庫移動・重複計上の例なら有用。 |
| 停電備え | 条件付きで可能。現行の架空表に電池の種類Aが置き場所別にあり、機器表示との照合も説明している。 | 互換性を確認した機器だけに限れば、必要本数と適合する手持ちを引き算し、架空の包装本数で割る例を作れる。機器ラベルの架空条件と明記し、使用時間・持続日数・共通推奨数へ一般化しないことが必要。 | 条件付きで追加価値あり。正しい電池種類・本数を先に確認する例に限る。 |

水の既存目安は本文が参照する農林水産省の「大事な水、どうやって備えますか？」（[一次情報](https://www.maff.go.jp/j/zyukyu/foodstock/imadoki/imadoki02_10.html)）に基づく。携帯トイレの回数例は本文掲載の内閣府「トイレ備蓄忘れていませんか？」（[一次情報](https://www.bousai.go.jp/kohou/kouhoubousai/r06/111/news_08.html)）を参照する。ここで扱うパック表示・在庫値は架空の説明値で、新たな公的数値や製品情報ではない。

## 4. 改善候補と優先順位

候補は4件。Search Console の検索語・表示回数・クリック数・掲載順位を取得していないため、検索流入や購入率の増加は予測しない。

| 順位 | 対象・変更 | 期待効果 | 作業量 | Search Console 判断 |
| --- | --- | --- | --- | --- |
| 1 | 水ガイドに架空の外装パック換算を追加 | 購入文脈：不足リットル、個別ボトル本数、外装パック数の違いを順に確認できる | 小 | 実際の検索語を待たずに可。流入効果の評価は10/20以降のデータで行う |
| 2 | 停電備えに、互換性を確認した電池だけの不足・包装換算例を追加 | 購入文脈：本体表示に合う電池の種類・本数を購入前に照合できる | 中 | 安全な説明範囲は現在の本文から決められるため可。需要評価は10/20以降 |
| 3 | 持ち出し袋に、家と袋の移し替え前後を示す品目別在庫例を追加 | 購入文脈：購入前に自宅在庫を袋の中身と重複計上しない | 小 | 内容の誤解を防ぐ改善なので可。検索語に合わせた表現の調整は10/20以降 |
| 4 | 8ガイドのFAQ件数・節順・affiliate位置を確認する回帰テストを追加 | 承認後のリンク準備：ガイドの編集後も購入確認を通る導線と構造化データの件数を保つ | 中 | 技術的な一貫性のテストなので可。検索データは不要 |

### 上位候補の実装仕様案

1. **水：包装パック数の例**
   - 対象：`guides/mizu-kumioki-bichiku/index.html`。独立した `#pack-example` を `#shortage-bottles` の後、`#purchase-check` の前へ置く。
   - 架空値・式：既存の2人・3日例（不足7.5L）を再利用。包装に「2L×3本」とある架空候補を置く。1パック=6L、7.5÷6=1.25を切り上げて2パック、補充後に不足分を差し引くと4.5L相当が目安より多く残る。8Lへ必要量を丸めない。
   - 表示上の条件：架空表示であること、商品名や推奨ではないこと、用途・容器表示・保存条件を確認し実際に購入した量で在庫を更新することを併記する。
   - テストで確認する文字列：`id="pack-example"`、`7.5L`、`2L×3本`、`2パック`、`4.5L`。節順 `shortage-bottles < pack-example < purchase-check` も確認する。

2. **停電備え：適合電池の包装数例**
   - 対象：`guides/teiden-sonae/index.html`。独立した `#pack-example` を `#match-check` の後、`#buy-check` の前へ置く。
   - 架空値・式：架空の機器ラベルに「種類Aを2本」とあり、同じラベルの機器を2台使う家庭例なら必要4本。適合を確認できた手持ちが2本の場合、不足は2本。架空包装表示が「種類A 2本入り」なら2÷2=1パック。種類が違う電池や使いかけを足さない。
   - 表示上の条件：機器ラベルと包装表示は架空と明記。使用時間・持続日数・家庭共通の必要量を推定しない。ケーブルや電池の互換性は実機の表示・説明書を優先する。
   - テストで確認する文字列：`id="pack-example"`、`架空の機器ラベル`、`種類Aを2本`、`不足は2本`、`1パック`。節順 `match-check < pack-example < buy-check` と、`data-category="lighting-battery"` の枠が `buy-check` の後に残ることを確認する。

3. **持ち出し袋：移し替え時の品目別在庫例**
   - 対象：`guides/mochidashi-bukuro/index.html`。`#gap-check` 内の現在の確認表の後、`#buy-check` の前に、家と袋の個数を別にする架空例を一つ追加する。独立したパック数の節は作らない。
   - 架空値・式：家庭が自分で決めた持ち出しリストの例として「袋用の水3本、袋内2本、家の棚に4本」を示す。袋用不足は3−2=1本。家から1本を袋へ移した場合は袋3本・家3本で、合計7本のまま。購入前に家の本数を袋の本数へ重複加算しない。3本は一般の推奨量ではない。
   - 表示上の条件：必要個数は家族が定めた例と明記し、すべての家庭の必須品目・量や重量基準とはしない。
   - テストで確認する文字列：`家庭が決めた架空のリスト`、`袋用の不足は1本`、`袋へ移した後`、`家3本`。節順 `gap-check < buy-check` と、`data-category="go-bag"` の枠が `buy-check` の後に残ることも確認する。

候補4のテストでは、各ページの上表の節順、FAQ件数と FAQPage 件数、affiliate枠が購入確認節より後にあることを検査する。ページ本文やリンクを変更せず、HTMLParser と json など Python 標準ライブラリで検査できる。

## 5. Search Console の実データを待つか

Search Console の実データは、この監査では未確認。2026-10-20以降に表示回数・クリック数・検索語・掲載順位を確認できるまでは、候補の検索順位効果を判断しない。水・停電・持ち出し袋の上位3候補は、現在のページに既にある在庫例・確認手順の理解を助ける内容で、検索語の傾向が分からなくても実装できる。候補4の回帰テストも構造の保全なのでデータ待ちは不要。携帯トイレには同じパック数例が既にあるため、重複実装しない。

10/20以降のデータは候補の表題・検索意図の見直しに使い、短期間の順位変動だけで追加の広告枠や商品リンクを増やさない。外部サービスへの登録・送信、IndexNow、Bing、Search Console の操作はこの調査にも候補にも含めない。

## 付録：節・affiliate枠・FAQ件数の取得コード

以下はリポジトリのルートで実行する Python 3 標準ライブラリのみの確認例。対象ページの相対パスを配列へ並べ、節id、節見出し、data-category 枠の直前の節、FAQ の details 数、FAQPage の mainEntity 数、ツールリンクを表示する。比較表の id と件数を再取得できる。スロットの直前節は、`data-category` を持つ section 自身を除いた直前の id 付き section とする。

```python
from html.parser import HTMLParser
from pathlib import Path
import json

PAGES = {
    "toilet": "guides/keitai-toilet-bichiku/index.html",
    "water": "guides/mizu-kumioki-bichiku/index.html",
    "food": "guides/hijoushoku-erabikata/index.html",
    "pet": "guides/pet-bousai-bichiku/index.html",
    "baby": "guides/baby-bousai-bichiku/index.html",
    "cassette": "guides/cassette-bombe-bichiku/index.html",
    "go-bag": "guides/mochidashi-bukuro/index.html",
    "blackout": "guides/teiden-sonae/index.html",
}

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = []
        self.slots = []
        self.tool_links = []
        self.faq_details = 0
        self.section_stack = []
        self.h2 = False
        self.h2_parts = []
        self.script = False
        self.script_parts = []
        self.faq_json_count = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section":
            section_id = attrs.get("id")
            category = attrs.get("data-category")
            if category:
                previous = next(
                    (item["id"] for item in reversed(self.sections) if item["id"]),
                    None,
                )
                self.slots.append((category, previous))
            item = {"id": section_id, "heading": ""}
            self.sections.append(item)
            self.section_stack.append(item)
        elif tag == "h2":
            self.h2 = True
            self.h2_parts = []
        elif tag == "details" and any(s["id"] == "faq" for s in self.section_stack):
            self.faq_details += 1
        elif tag == "a":
            href = attrs.get("href", "")
            if "tools/" in href:
                self.tool_links.append(href)
        elif tag == "script" and attrs.get("type") == "application/ld+json":
            self.script = True
            self.script_parts = []

    def handle_endtag(self, tag):
        if tag == "h2":
            if self.section_stack:
                self.section_stack[-1]["heading"] = "".join(self.h2_parts).strip()
            self.h2 = False
        elif tag == "script" and self.script:
            try:
                data = json.loads("".join(self.script_parts))
                faq = next(
                    item for item in data.get("@graph", [])
                    if item.get("@type") == "FAQPage"
                )
                self.faq_json_count = len(faq.get("mainEntity", []))
            except (ValueError, StopIteration, TypeError):
                pass
            self.script = False
        elif tag == "section" and self.section_stack:
            self.section_stack.pop()

    def handle_data(self, data):
        if self.h2:
            self.h2_parts.append(data)
        if self.script:
            self.script_parts.append(data)

for name, relative_path in PAGES.items():
    parser = AuditParser()
    parser.feed(Path(relative_path).read_text(encoding="utf-8"))
    faq_ids = [
        (item["id"], item["heading"])
        for item in parser.sections if item["id"]
    ]
    print(json.dumps({
        "page": name,
        "sections": faq_ids,
        "affiliate_after": parser.slots,
        "faq_details": parser.faq_details,
        "faq_json_ld": parser.faq_json_count,
        "tool_links": sorted(set(parser.tool_links)),
    }, ensure_ascii=False))
```

比較表で「不足節」とした `gap-check` と `match-check` は、それぞれ品目・置き場所の照合と機器・電源の適合確認を示す。計算式を持つ不足数量の節とは区別した。コードは節構造を取得するためのもので、改善候補の架空値を自動生成するものではない。
