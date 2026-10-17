# 購入導線の次候補とアソシエイト申請前のサイト確認

確認対象: main `f8a0149225da43be52f774fa2faabb5814c09fe9`（2026-10-17）。本文はリポジトリ内のHTML、テスト、調査文書を確認した結果です。Search Console の実測値は取得していません。申請・外部登録・送信、HTML変更は行っていません。

## 1. #171 の候補1〜4の完了確認

| #171候補 | 対応 | mainで確認した内容 | 節・FAQの確認 |
|---|---|---|---|
| 1. 水ガイドの包装パック数例 | 実装済み: [Issue #173](https://github.com/supportapp3-lab/kasegu-tools/issues/173) / [PR #174](https://github.com/supportapp3-lab/kasegu-tools/pull/174)（マージ済み） | `guides/mizu-kumioki-bichiku/index.html` に架空の包装表示を使った計算例とFAQがある。既存の個別ボトル数と包装パック数を区別している。 | `hand-stock < shortage-bottles < pack-example < purchase-check`。FAQ本文10件、FAQPageの`mainEntity`10件。 |
| 2. 停電ガイドの適合電池パック数例 | 実装済み: [Issue #175](https://github.com/supportapp3-lab/kasegu-tools/issues/175) / [PR #176](https://github.com/supportapp3-lab/kasegu-tools/pull/176)（マージ済み） | `guides/teiden-sonae/index.html` に機器表示に適合する電池だけを数える架空例がある。使用時間や家庭共通の必要数を推定しない。 | `stock-count < match-check < pack-example < buy-check < local-info`。FAQ本文9件、FAQPage9件。`lighting-battery`枠は`buy-check`の後。 |
| 3. 持ち出し袋の移し替え・重複計上例 | 実装済み: [Issue #177](https://github.com/supportapp3-lab/kasegu-tools/issues/177) / [PR #178](https://github.com/supportapp3-lab/kasegu-tools/pull/178)（マージ済み） | `guides/mochidashi-bukuro/index.html` の`#gap-check`に、袋と家の在庫を分ける表、および家庭が決めた架空リストで移動前後の合計を保つ例がある。 | `stock-count < gap-check < buy-check < family`。FAQ本文9件、FAQPage9件。 `go-bag`枠は`buy-check`の後。 |
| 4. 8ガイド構造回帰テスト | 実装済み: [Issue #179](https://github.com/supportapp3-lab/kasegu-tools/issues/179) / [PR #180](https://github.com/supportapp3-lab/kasegu-tools/pull/180)（マージ済み） | `tests/test_funnel_guides_structure.py` が8ガイドの節順、affiliate枠、FAQ本文・FAQPage件数、JSON-LDを検査する。 | PR #180の[validate CI](https://github.com/supportapp3-lab/kasegu-tools/actions/runs/39023746837)はsuccess。FAQ件数の基準は8ガイドすべて現行HTMLと一致。 |

FAQ件数は現行mainのHTMLを読み、FAQ節の`<details>`数とJSON-LD内のFAQPageの`mainEntity`数を照合しました。#171監査の以前の表には、#174と#176より前のFAQ件数が残っています。この表では現行mainの数を使っています。

## 2. 申請前後のサイト側チェック

| 項目 | mainで確認した現状 | 区分 |
|---|---|---|
| サイトの運営・公開状態 | 運営者情報、問い合わせ、プライバシーポリシーの各ページがある。申請に使うURLがログインなしで表示できるか、申請者の情報と一致するかは申請者側で最終確認する。 | 未（ユーザー作業） |
| 独自コンテンツ数 | `guides/index.html`に記事リンクが24件ある。Amazonの申請審査ヘルプは、各申請サイトに公開されたオリジナル投稿が少なくとも10件必要と案内している。24件の一覧数は下回っていないが、一覧にあることだけで各ページが独自・十分な内容と判定されるわけではない。各URLの公開・内容を申請者が確認する。 | 済（一覧件数）／未（個別の公開・内容確認） |
| 申請と本人情報 | Amazonアソシエイトは未申請・未承認。申請操作と登録情報の入力はしていない。 | 未（ユーザー作業） |
| 現行の広告・アフィリエイト表示 | トップ、運営者情報、プライバシーポリシーは、未申請・未承認、商品リンクや追跡タグ未設置である現状を説明している。現時点で稼働中の広告を示す表示はない。 | 済 |
| 空の紹介枠 | 28カテゴリ枠（14ファイル）に、暮らし計算5ページの`potting-soil`、`paint`、`wallpaper`、`aquarium`、`portable-power`を加えると、33個のカテゴリ枠が19ファイルにある。これとは別に、遠征費ツールにカテゴリのない汎用枠が1個ある。合計34枠。いずれも現在は紹介用リンクなし。 | 済（枠の棚卸し） |
| 商品リンク・計測タグ | 現在のHTMLでは枠内の商品リンクは見つからず、トップとプライバシーポリシーも商品リンク・広告タグ・追跡スクリプト未設置と記載している。PR承認後の更新時には再確認する。 | 済（現状）／承認後に再確認 |
| プライバシーポリシー | `privacy/index.html`はlocalStorageの備蓄リストと現状の広告・Cookie等を説明し、将来導入時に更新すると明記している。実際にリンクや計測を導入するなら公開前に内容を合わせる。 | 済（現状）／承認後に更新 |
| Amazon所定の開示文 | 承認後にサイトへ掲載する文言は「Amazonのアソシエイトとして、暮らしの計算室は適格販売により収入を得ています。」。現在は未申請のため、稼働中の開示としては表示していない。 | 承認後に実装 |
| リンクの追加 | 現在の枠は空のまま。承認後、登録媒体・Amazonが発行したリンク・表示要件を確認したうえで、枠と説明が一致するものだけを追加する。 | 承認後に実装 |

### カテゴリ枠一覧

カテゴリ枠は33件、異なるカテゴリは27種です。重複数は`toilet`が4、`water`が3、`long-life-food`が2、残り24種が各1です。別に、カテゴリ未設定の汎用枠が1件あります。

`aquarium`, `baby-diaper`, `baby-food`, `baby-milk`, `baby-supply`, `baby-wipe`, `cassette-gas`, `food`, `go-bag`, `goods`, `hotel`, `lighting-battery`, `long-life-food`, `paint`, `pet-carrier`, `pet-food`, `pet-supply`, `pet-toilet`, `pet-water`, `portable-power`, `potting-soil`, `toilet`, `toilet-bag`, `toilet-coagulant`, `travel`, `wallpaper`, `water`

既存の[枠設計書](2026-10-affiliate-slot-design.md)は、暮らし計算5ページの追加前に集計した28カテゴリ枠です。今後棚卸しを更新するときは、この5カテゴリを加えた現状値を使います。カテゴリのない汎用枠は、案内する内容が決まるまで空のままにします。

### コンテンツ数と公式案内

Amazonの[申請審査ヘルプ](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)は、提出された各サイトが公開状態であり、各サイトに少なくとも10件のオリジナル投稿があることを案内しています。同ページはサインアップから180日以内に3件以上の適格販売が発生した後に審査すると説明していますが、件数は承認や報酬を保証しません。[審査を断るサイト例](https://affiliate.amazon.co.jp/help/node/topic/GRBF7RY23VJNPV84)には、未完成・作成直後、記事や投稿が極めて少ない、更新が長く止まっている、転載や広告中心で独自性がないケースが挙げられています（公式ページ確認: 2026-10-17）。

現在のガイド一覧は24URLです。審査に出す前に、対象URLが誰でも読めること、ページごとに独自の説明・計算・記入例などがあること、転載や広告だけのページでないことを申請者が確認してください。件数だけで審査結果は予測できません。

## 3. 計算ツール5ページとガイドの購入前照合

ここでいう4つの暮らし計算ツールはプランター用土、塗料、壁紙、水槽です。停電時の電力量ツールも合わせ、入力と結果・購入前確認・affiliate枠の位置をmain HTMLから確認しました。

| ページ | 計算例・入力/結果 | 手持ち・表示との購入前確認 | affiliate枠の位置 | 薄い点 |
|---|---|---|---|---|
| `tools/planter-soil` | 容器寸法または表示容量と、袋の表示容量を入力し、必要容量・最小袋数を計算。静的な計算例はない。 | `#pre-buy-check`は容器容量と袋表示、手持ちで足りるかを確認する。手持ち袋数と不足の記録欄はない。 | `potting-soil`は`#pre-buy-check`の後。 | 結果の袋数を、実際に使える在庫と照合して記録する例がない。用土の適合・栽培条件は判定しない。 |
| `tools/paint-quantity` | 面積、塗り回数、製品表示の1缶当たり面積を入力し、最小缶数を計算。静的な計算例はない。 | `#pre-buy-check`は測定、塗り回数、ラベル、下地・安全条件、手持ちで足りるかを確認する。 | `paint`は`#pre-buy-check`の後。 | 計算例と、使える手持ち缶数との差を一緒に確認する記録がない。表示面積は保証値ではないという既存注意を保つ必要がある。 |
| `tools/wallpaper-quantity` | 壁寸法、有効幅、柄リピート、切りしろ、任意のロール長を入力し、必要長さ・切り出し数を計算。静的な計算例はない。 | `#pre-buy-check`は開口部、端部、切りしろ、柄合わせ、施工条件、手持ちが足りるかを確認する。 | `wallpaper`は`#pre-buy-check`の後。 | 手持ちの残ロールが同じ柄・色番・有効幅か記録する欄がない。施工可否は判定しない。 |
| `tools/aquarium-volume` | 内寸、水面までの高さ、底砂厚、袋表示容量を入力し、理論水量・底砂袋数を計算。静的な計算例はない。 | `#pre-buy-check`は実際の水面、機材等による差、手持ち底砂、耐荷重を確認する。 | `aquarium`は`#pre-buy-check`の後。 | 理論値と実際の水位から見積もる量を記録する欄がない。ただし飼育数・生体の適合は範囲外。 |
| `tools/portable-power` | 機器ごとのW、使用時間、日数を入力し、理想上のWhを合計。静的な計算例はない。 | `#pre-buy-check`と`#safety`に、結果は電源の容量・稼働時間でないこと、定格出力・瞬間出力・端子・説明書を確認することがある。 | `portable-power`は安全・購入前確認の後。 | 機器と実際に使える電源の適合は停電ガイドの`#match-check`にもある。別の互換判定・必要容量を加えると重複や安全上の誤解になる。 |

5ページとも計算式と結果は独自の実用機能で、購入前チェックとカテゴリ枠も既にある一方、静的な入力例はありません。差が最も残るのは、計算結果を実物の手持ちと製品表示に照合する具体例・記録です。ポータブル電源は電力量の理想合計を実機の容量・稼働時間に読み替えない注意があるため、追加計算は候補にしません。

### ガイド側で重複する案は見送る

- 水、停電、持ち出し袋は#171の候補が#174、#176、#178で実装済み。計算例を再追加しない。
- 携帯トイレは`#box-memo`と購入前確認、ペットは`#pet-record`、赤ちゃん用品は`#set-check`、非常食は`#food-compare`がある。ツール側へ同じ表を複製しない。
- カセットボンベは`#stock-count`、`#pack-example`、`#buy-check`、`#dates`、`#safety`で数量・表示・安全を確認する。新たな互換表や一律の使用量計算は追加しない。
- 8ガイドの節、FAQ、カテゴリ枠の保全は#180のテストが担う。ページ本文や枠を変える候補にはしない。

## 4. 次の改善候補

優先順位は、購入判断に近い位置、表示値と手持ちの照合ができるか、現行内容との重複、安全面、作業量で定性的に決めました。Search Consoleの表示回数・クエリ・クリック等を見ていないため、検索流入や売上の増加は予測しません。

| 順位 | 対象ファイル | 変更案 | 効果の種類 | 作業量 | Search Console |
|---|---|---|---|---|---|
| 1 | `tools/paint-quantity/index.html`と既存の塗料テスト | 架空の計算例に、同じ製品表示に合う手持ち缶数を重ね、追加購入が必要か本人が照合する例を示す。 | 購入文脈 | 小 | 説明の明確化は今できる。検索語に合わせた見出し調整は10/20以降の実測待ち。 |
| 2 | `tools/planter-soil/index.html`と既存の用土テスト | 容器容量・袋表示・使える手持ち袋数を架空値で並べ、最小袋数と手持ちを区別する例を追加する。用土の適合や作物への推奨はしない。 | 購入文脈 | 小 | 計算と在庫照合の説明は今できる。流入優先度は10/20以降の実測待ち。 |
| 3 | `tools/wallpaper-quantity/index.html`と既存の壁紙テスト | 残ロールを同じ柄・色番・有効幅・リピートで照合する空欄メモを追加し、必要長さだけで購入を決めない手順を示す。 | 購入文脈 | 中 | 現物照合は今でも役立つ。実際の検索クエリに沿う表現は10/20以降に判断。 |
| 4 | `tools/aquarium-volume/index.html`と既存の水槽テスト | 理論水量と利用者が確認した水面・機材条件を分けて記録する短い空欄欄を追加する。生体数・飼育可否や製品適合は判断しない。 | 購入文脈 | 中 | 現状の安全注意で足りる可能性もあるため、優先決定は10/20以降の検索・利用意図を確認してから。 |
| 見送り | `tools/portable-power/index.html`、`guides/teiden-sonae/index.html` | 新たな互換性・必要容量計算は作らない。`#match-check`と購入前チェックがあり、追加の判定は重複・安全リスクがある。 | — | — | 必要性が実測で見えた場合も、メーカー仕様を超える計算を提案しない。 |

### 上位3件の実装Issueにできる仕様案

#### 1. 塗料: 架空の入力と手持ち缶の照合

- 対象: `tools/paint-quantity/index.html`。結果と式の説明の後、`#pre-buy-check`の前に`#stock-example`を追加する。
- 表示例: 「架空の入力例」と明記し、面積12㎡、2回塗り、架空ラベルの塗り面積6㎡/回/缶なら、計算上は4缶。未開封で条件が合う手持ちが2缶なら差は2缶。これは購入指示・製品性能の保証ではない。実際の製品表示、下地、施工条件を優先し、手持ちで足りれば購入不要とする。
- テストで確認する文字列: `id="stock-example"`、`架空の入力例`、`12㎡`、`6㎡/回/缶`、`4缶`、`手持ち2缶`、`差は2缶`。節順と`data-category="paint"`が購入前確認の後に残ることも検査する。
- 計算式: 面積×塗り回数÷表示面積を切り上げる。実際の製品には当てはめず、架空の説明値だけに使う。

#### 2. プランター用土: 容器・袋表示・手持ちの照合

- 対象: `tools/planter-soil/index.html`。結果の後、`#pre-buy-check`の前に`#stock-example`を追加する。
- 表示例: 「架空の入力例」と明記し、容器の表示30L、袋の表示12Lなら計算上の最小袋数は3袋。使える手持ちが1袋なら不足目安は2袋。ただし土の種類、排水層、容器や作物への適合はこの例で判断しない。手持ちで必要量を満たせば購入不要。
- テストで確認する文字列: `id="stock-example"`、`架空の入力例`、`容器の表示30L`、`袋の表示12L`、`最小3袋`、`手持ち1袋`、`不足目安2袋`。節順と`data-category="potting-soil"`が購入前確認の後に残ることも検査する。
- `30L`と`12L`は例示用の架空値であり、実在商品・推奨容量・公的基準ではない。

#### 3. 壁紙: 残ロールの一致確認メモ

- 対象: `tools/wallpaper-quantity/index.html`。計算結果と`#pre-buy-check`の間に`#stock-check`を追加する。
- 空欄のみの確認欄に「柄・色番」「有効幅」「柄リピート」「残り長さ」「破れ・汚れ」「必要長さ」を別々に記入する。サンプルの柄番、寸法、長さ、商品名は入れない。数値の組み合わせから貼れるかを自動判定せず、開口部・端部・施工余裕は販売店または施工業者へ確認する。条件の一致が確かでない場合は在庫として差し引かない。
- テストで確認する文字列: `id="stock-check"`、`柄・色番`、`有効幅`、`柄リピート`、`残り長さ`、`必要長さ`、`施工条件は販売店・施工業者へ確認`。節順と`data-category="wallpaper"`が購入前確認の後に残ることも検査する。

## 5. Search Console の実データを待つか

Search Console の実測値はこの調査では未確認です。#171の4候補は既存ページの理解を助ける小規模な変更として完了し、構造テストもmainにあります。上記の記入例や空欄確認欄は、流入効果を主張せず利用者が計算結果と実物を照合できる仕様として検討できます。ただし、新しい見出し、候補の順位、作業着手順を「検索需要が高い」と説明してはいけません。

2026-10-20以降にデータが見られる場合は、ページ別の表示回数、クエリ、クリック、掲載順位と同一意図の複数URLを確認し、表現や優先順位を見直します。短期間の変化を追加作業の因果や売上の証明にせず、実測前に広い防災記事や新規URLを増やしません。データが得られない場合は「未確認」と記録します。IndexNow、Bing、Search Consoleなど外部サービスへの登録・送信・操作はこの候補に含めません。

## 付録: mainの確認手順

基準コミットは`f8a0149225da43be52f774fa2faabb5814c09fe9`。#171候補の状態と節は、次のファイルを直接照合できます。

- `guides/mizu-kumioki-bichiku/index.html`、`tests/test_water_pack_example.py`
- `guides/teiden-sonae/index.html`、`tests/test_teiden_pack_example.py`
- `guides/mochidashi-bukuro/index.html`、`tests/test_mochidashi_transfer_example.py`
- 8ページのFAQ・JSON-LD・affiliate位置: `tests/test_funnel_guides_structure.py`
- 枠数とカテゴリの従来集計: `docs/research/2026-10-affiliate-slot-design.md`に、4つの生活計算ツールと`portable-power`の5枠を加える
- 5つの生活計算ツールの入力、計算、購入前確認、カテゴリ: 各`tools/<slug>/index.html`。対象は`planter-soil`、`paint-quantity`、`wallpaper-quantity`、`aquarium-volume`、`portable-power`
- disclosure / privacy: `index.html`、`about/index.html`、`privacy/index.html`
- 記事件数: `guides/index.html`のガイド記事リンクを数える（ナビゲーション・トップ・他の共通リンクを除外）

検査コマンドはmainのworkflowと同じ標準ライブラリのテストです。

```bash
python3 -m unittest discover -s tests -p 'test_water_pack_example.py' -v
python3 -m unittest discover -s tests -p 'test_teiden_pack_example.py' -v
python3 -m unittest discover -s tests -p 'test_mochidashi_transfer_example.py' -v
python3 -m unittest discover -s tests -p 'test_funnel_guides_structure.py' -v
python3 -m unittest discover -s tests -p 'test_lint_affiliate.py' -v
python3 -m unittest discover -s tests -p 'test_build_sitemap.py' -v
python3 scripts/lint.py
```

枠の集計では、`class="affiliate"`と`data-category`を持つ要素を数え、`tools/ensei-hi/index.html`のカテゴリなし親枠を別に1件数えます。商品リンクの確認では、紹介枠内に`<a href>`がなく、placeholderだけであることを見ます。テスト実行を伴うこの棚卸しは本PRのCIで確認します。
