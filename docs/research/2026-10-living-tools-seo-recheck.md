# 暮らし計算4ツール 技術SEO再監査

確認日: 2026-10-17  
基準: GitHub の `main` 上の HTML、sitemap、robots.txt。Search Console の実測値は未確認で、表示回数やクリック数は記載しない。

## 1. 前提と公開履歴

| ツール | canonical URL | main に追加されたPRのマージコミット日時（JST） |
|---|---|---|
| プランター用土量 | https://supportapp3-lab.github.io/kasegu-tools/tools/planter-soil/ | 2026-10-16 16:48 JST ([commit](https://github.com/supportapp3-lab/kasegu-tools/commit/cb7fe06ccee19c55c2c20d68a8c1d58252c0b615)) |
| 塗料必要量 | https://supportapp3-lab.github.io/kasegu-tools/tools/paint-quantity/ | 2026-10-16 17:20 JST ([commit](https://github.com/supportapp3-lab/kasegu-tools/commit/88851292b0b74f29fb6a04e95553c4755d9c41db)) |
| 壁紙必要量 | https://supportapp3-lab.github.io/kasegu-tools/tools/wallpaper-quantity/ | 2026-10-16 17:48 JST ([commit](https://github.com/supportapp3-lab/kasegu-tools/commit/6a32ffe1e344cc59935b17198d82aa11dc411f7f)) |
| 水槽水量・底砂量 | https://supportapp3-lab.github.io/kasegu-tools/tools/aquarium-volume/ | 2026-10-16 18:53 JST ([commit](https://github.com/supportapp3-lab/kasegu-tools/commit/d1131e7596d1a8c4827d99b5ee3fe45beb82ffcb)) |

この日時は各ツールを追加したコミットの日時であり、公開ホスティングの反映時刻そのものではない。4 URL はいずれも `sitemap.xml` に掲載されている。

## 2. メタ情報の照合

文字数は HTML から抽出した文字列の JavaScript `length`。canonical は各ページの URL と一致する。

| ページ | title | meta description | canonical | og:title | og:description | twitter:title / twitter:description | H1 |
|---|---|---|---|---|---|---|---|
| planter-soil | プランター用土量 計算｜容器の寸法から必要Lと袋数を整理 (28) | 容器の内側の寸法または表示容量と、用土の袋容量から幾何上の容量と最小袋数を整理します。作物や用土の適性は判定しません。 (59) | website | プランター用土量 計算｜必要Lと袋数を整理 (21) | 容器の寸法または表示容量と、用土の袋容量から幾何上の容量と最小袋数を整理します。 (40) | プランター用土量 計算｜必要Lと袋数を整理 / 容器の寸法または表示容量と、用土の袋容量から幾何上の容量と最小袋数を整理します。 | プランターの用土量を容量と袋数で整理 (18) |
| paint-quantity | 塗料 必要量 計算｜面積と塗り回数から必要缶数を整理 (26) | 塗る面積・塗り回数・製品表示の1缶当たりの塗り面積から、必要な塗り面積と最小缶数を整理します。塗料の適合や施工条件は判定しません。 (65) | website | 塗料 必要量 計算｜必要缶数を整理 (17) | 塗る面積・塗り回数・製品表示の1缶当たりの塗り面積から、必要な塗り面積と最小缶数を整理します。 (47) | 塗料 必要量 計算｜必要缶数を整理 / 塗る面積・塗り回数・製品表示の1缶当たりの塗り面積から、必要な塗り面積と最小缶数を整理します。 | 塗料の必要缶数を面積と回数から計算 (17) |
| wallpaper-quantity | 壁紙 必要量 計算｜壁の幅・高さと柄リピートから切り出し枚数を整理 (33) | 壁1面の幅・高さ、壁紙の有効幅、柄リピートから、理論上の切り出し枚数と必要な長さを整理します。施工方法や購入量は判定しません。 (63) | website | 壁紙 必要量 計算｜切り出し枚数と必要な長さ (22) | 壁1面の幅・高さ、壁紙の有効幅、柄リピートから理論値を整理します。 (33) | 壁紙 必要量 計算｜切り出し枚数と必要な長さ / 壁1面の幅・高さ、壁紙の有効幅、柄リピートから理論値を整理します。 | 壁紙の切り出し枚数と必要な長さを計算 (18) |
| aquarium-volume | 水槽 水量・底砂量 計算｜内寸から理論Lを整理 (23) | 水槽の内側の幅・奥行・水面までの高さから理論上の水容量を計算。底砂の厚みと袋容量を入力すると理論容量と最小袋数を整理します。 (62) | website | 水槽 水量・底砂量 計算｜内寸から理論Lを整理 (23) | 水槽の内寸と指定した底砂の厚みから、理論上の容量を整理します。 (31) | 水槽 水量・底砂量 計算｜内寸から理論Lを整理 / 水槽の内寸と指定した底砂の厚みから、理論上の容量を整理します。 | 水槽の水量と底砂量を理論上の容量で整理 (19) |

### 観察
- 4ページとも title、meta description、canonical、OG、Twitter、H1 が設定されている。title と H1 は同じ意味を指すが全文一致ではない。
- OG と Twitter の title/description は各ページ内で一致する。一方で、OG description と meta description は4ページとも別の文面で、WebApplication description も meta description と同一ではない。
- title の長さは23〜33文字、meta description は59〜65文字。Google は表示幅に応じてタイトルやスニペットを自動調整し、meta description を常に表示するわけではない。長さだけを理由に修正する必要はない（公式資料: [title links](https://developers.google.com/search/docs/appearance/title-link)、[snippets](https://developers.google.com/search/docs/appearance/snippet)）。

## 3. 入口と内部リンク

| 入口 | 用土 | 塗料 | 壁紙 | 水槽 |
|---|---|---|---|---|
| トップ `index.html` | 「用土量を整理する」 | 「塗料の缶数を整理する」 | 「壁紙の必要量を整理する」 | 「水槽の容量を整理する」 |
| `about/index.html` | 「プランター用土量 計算」 | 「塗料 必要缶数 計算」 | 「壁紙 必要量 計算」 | 「水槽 水量・底砂量 計算」 |
| `guides/index.html` | リンクなし | リンクなし | リンクなし | リンクなし |
| 各計算ページ | 他3ツールすべてへの相互リンクあり | 他3ツールすべてへの相互リンクあり | 他3ツールすべてへの相互リンクあり | 他3ツールすべてへの相互リンクあり |

トップと運営者情報から各ツールへ直接移動でき、各ツール間も相互リンクされている。解説記事一覧から4ツールへの直接リンクはないが、同一覧は現状、防災・備蓄と遠征費の記事を案内するページであり、対象ツール向けの解説は掲載していない。

## 4. 構造化データ

| ページ | WebApplication name / description | H1 | BreadcrumbList 2段目 name | breadcrumb item | FAQPage |
|---|---|---|---|---|---|
| planter-soil | プランター用土量 計算 / 容器の寸法または表示容量と、用土の袋容量から容量と最小袋数を整理します。 | プランターの用土量を容量と袋数で整理 | プランター用土量 計算 | canonical不一致 | FAQ 6/6、順序・文言は一致 |
| paint-quantity | 塗料 必要量 計算 / 塗る面積・塗り回数・製品表示の塗り面積から必要缶数を整理します。 | 塗料の必要缶数を面積と回数から計算 | 塗料 必要量 計算 | canonical不一致 | FAQ 6/6、順序・文言は一致 |
| wallpaper-quantity | 壁紙 必要量 計算 / 壁1面の幅・高さと製品表示の有効幅・柄リピートから、理論上の切り出し枚数と長さを整理します。 | 壁紙の切り出し枚数と必要な長さを計算 | 壁紙 必要量 計算 | canonical不一致 | FAQ 7/7、順序・文言は一致 |
| aquarium-volume | 水槽 水量・底砂量 計算 / 水槽の内寸と指定した底砂の厚みから、理論上の容量を整理します。 | 水槽の水量と底砂量を理論上の容量で整理 | 水槽 水量・底砂量 計算 | canonical不一致 | FAQ 6/6、順序・文言は一致 |

4ページすべてで JSON-LD を parse できる。FAQPage は画面上の FAQ と質問・回答の件数、順序、文言が一致する（planter 6、paint 6、wallpaper 7、aquarium 6）。BreadcrumbList の2段目 URL は canonical と一致する一方、その name は H1 と一致せず、全ページで短い WebApplication name と同じラベルを使っている。section-nav のリンク先 ID は4ページすべてで存在する（planter 5、paint 5、wallpaper 5、aquarium 5）。

Google の公式資料は、構造化データが有効でも表示機能を保証しないこと、実際のページ内容を正確に表す必要があることを説明している。一般的な検査には [Rich Results Test と Schema Markup Validator](https://developers.google.com/search/docs/appearance/structured-data) を案内している。本監査では JSON の構文と画面上の FAQ との一致を確認したが、外部検査ツールによるリッチリザルト適格性は確認していない。

## 5. ページ同士の検索意図

4ツールの目的はそれぞれ、容器の容量と用土袋数、塗装面積と缶数、壁紙の切り出し枚数と長さ、水槽の理論水量と底砂量で区別されている。語例としては「プランター 用土量 計算」「塗料 必要缶数 計算」「壁紙 必要量 計算」「水槽 水量 計算」が考えられるが、需要量や順位は測定していない。4ページ間に同じ計算を扱う重複ページは見当たらない。防災・遠征費の既存ガイドとも本文の目的は異なる。

## 6. sitemap.xml と robots.txt

- `sitemap.xml` は全40 URLを含み、対象4 canonical URLも含む。全エントリに `lastmod` はない。
- `robots.txt` は `User-agent: *` と `Allow: /` を指定し、同サイトの `sitemap.xml` を案内している。対象4 URLを拒否する規則はない。
- sitemap は発見を助けるが、クロールやインデックスを保証しない。lastmod は実際の更新日を正確に管理できる場合に限り追加する（[Google sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ja)）。
- robots.txt はクロールの制御であり、検索結果からの除外を保証する手段ではない（[Google robots.txt guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro)）。

## 7. 次の実装候補

| 対象ファイル | 変更案 | 変更しない範囲・完了条件 | 作業量 | 検索流入／購入の流れへの効果 |
|---|---|---|---|---|
| 4ツールの `index.html` | WebApplication description と BreadcrumbList の name を、meta description・H1・本文に合わせて整理し、同じ主題と計算範囲を示す。 | 計算ロジック、URL、表示本文、FAQ、sitemap は変更しない。JSON-LD を parse でき、description が対象ページの範囲と一致し、breadcrumb item が canonical のままであること。 | 小 | 低〜中。ページ内容を複数の記述で一貫して伝えやすくする。順位や掲載内容の変化は保証しない。 |
| `sitemap.xml` と更新手順 | 将来のページ更新で正確な最終更新日を追跡できる運用が整った場合に、対象 URL の `lastmod` を追加する。 | 実際に更新していないページの日時は追加しない。全 `lastmod` が該当ページの実更新日と一致すること。 | 小〜中 | 低。更新情報をクローラへ渡せるが、クロール時期や掲載は保証しない。 |

Search Console の確認後、表示回数・クリックと対象ページを照合して優先順位を見直す。それまでは、計測していない効果を断定しない。

## 8. 再現手順と公式資料

### リポジトリの確認
- 対象 HTML: `tools/{planter-soil,paint-quantity,wallpaper-quantity,aquarium-volume}/index.html`
- 入口: `index.html`, `about/index.html`, `guides/index.html`
- crawl: `sitemap.xml`, `robots.txt`
- git 履歴: `git log --follow --format="%cs %s" -- <対象ページ>`。各ツールの最初の追加コミットを GitHub 上で確認した。
- HTML 内の `<title>`、`meta`、canonical、H1、JSON-LD を抽出し、FAQ は `<details><summary>` と FAQPage の配列を順番に比較した。JSON-LD のパースは標準 JSON parser で行う。
- section-nav の `href="#id"` ごとに同じ HTML 内の `id` を照合した。内部リンクはトップ、運営者情報、ガイド一覧、各対象ツールページの href とアンカーテキストを照合した。
- 外部資料は以下の公式ページを HTTP 取得して確認した。確認日: 2026-10-17。

### 公式資料
- Google Search Central, [title links](https://developers.google.com/search/docs/appearance/title-link)
- Google Search Central, [snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- Google Search Central, [structured data testing](https://developers.google.com/search/docs/appearance/structured-data)
- Google Search Central, [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ja)
- Google Search Central, [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
