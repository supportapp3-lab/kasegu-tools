# 技術SEO・重複・内部リンク監査

## 調査範囲と方法

ローカルの `main` のHTMLと `sitemap.xml`、`robots.txt` を静的に確認しました。公開候補はトップページ、6ツール、24記事、記事一覧、運営者情報・お問い合わせ・プライバシーの計35ページです。別にある `404.html` は公開ページ一覧と sitemap の対象から除外しました。Search Consoleの権限・実データはなく、表示回数、検索語、順位、実際のGoogle選択canonicalは未確認です。検索順位や流入への効果は断定していません。

## 1. インデックス前提

| 確認項目 | 結果 |
|---|---|
| ページ数 | HTML 36件（`404.html` を除く公開候補35件） |
| `<title>` | 35/35にあり。長さは12〜39文字。完全一致の重複なし |
| meta description | 35/35にあり。長さは52〜91文字 |
| canonical | 35/35で公開URLと一致 |
| sitemap | 35/35の公開候補を掲載。実ファイルのないURL、公開候補の漏れともに0件 |
| sitemap `<lastmod>` | 0/35。現状は未記載 |
| robots/noindex | `robots.txt` は全体を許可し、全HTMLに誤った `noindex` は見当たりません |
| 404 | `404.html` があり、sitemapには掲載していません |

Googleは sitemap のURLをクロール・インデックスの保証とは扱わず、`lastmod` は継続して正確に検証できる値の場合に使います。現在のように未記載でも sitemap の基本構成に問題はありません。更新日時を足す場合は、本文・構造化データ・リンクなどの重要な変更時刻を正確に反映できる仕組みを用意してください。canonicalはGoogleへの希望のシグナルであり、Google側が別URLを選ぶ可能性もあります。title と description にGoogle所定の固定文字数はなく、検索語や表示幅に応じてタイトルやスニペットが書き換え・省略されることがあります。[sitemapの仕様](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [canonicalの指定](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) · [title link](https://developers.google.com/search/docs/appearance/title-link) · [スニペットとmeta description](https://developers.google.com/search/docs/appearance/snippet) · [robots.txtの用途](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

## 2. ページ一覧

title・description の文字数はHTML上の文字列を数えたものです。canonical欄の「一致」は、GitHub Pages の公開URLとHTML内のcanonicalを照合した結果です。内部リンク着信数はローカルHTMLからの相対リンク数で、外部リンクは含みません。

| ファイル | `<title>`（長さ） | description 長さ | canonical | sitemap | 内部リンク着信数 | JSON-LD の主な型 |
|---|---|---:|---|---|---:|---|
| `about/index.html` | 運営者情報｜暮らしの計算室（13） | 63 | 一致 | 掲載 | 73 | — |
| `contact/index.html` | お問い合わせ｜暮らしの計算室（14） | 63 | 一致 | 掲載 | 72 | — |
| `guides/baby-bousai-bichiku/index.html` | 赤ちゃんの防災備蓄｜ミルク・おむつは何を何日分？｜暮らしの計算室（32） | 66 | 一致 | 掲載 | 3 | Article, BreadcrumbList, FAQPage |
| `guides/bichiku-nannichibun/index.html` | 防災備蓄は何日分？水と食料の量を家族の人数から考える｜暮らしの計算室（34） | 62 | 一致 | 掲載 | 12 | Article, BreadcrumbList, FAQPage |
| `guides/bousai-bichiku/index.html` | 防災備蓄の考え方｜家族・トイレ・ペット・期限管理のツール案内（30） | 84 | 一致 | 掲載 | 30 | Article, BreadcrumbList, FAQPage |
| `guides/cassette-bombe-bichiku/index.html` | カセットボンベは何本備える？防災の熱源とカセットコンロの備え｜暮らしの計算室（38） | 64 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/ensei-hi/index.html` | 推し活・ライブ遠征費の考え方｜予算と内訳の整理ガイド（26） | 90 | 一致 | 掲載 | 2 | Article, BreadcrumbList, FAQPage |
| `guides/hazard-map-hinan/index.html` | ハザードマップの見方と避難場所・避難経路の決め方｜暮らしの計算室（32） | 67 | 一致 | 掲載 | 6 | Article, BreadcrumbList, FAQPage |
| `guides/hijoushoku-erabikata/index.html` | 非常食の選び方｜日常食品との分け方と備蓄のバランス｜暮らしの計算室（33） | 67 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/index.html` | 解説記事｜暮らしの計算室（12） | 67 | 一致 | 掲載 | 45 | CollectionPage, BreadcrumbList |
| `guides/jishin-sokugo-kodo/index.html` | 地震が起きたら｜揺れの直後に身を守る行動と注意点｜暮らしの計算室（32） | 65 | 一致 | 掲載 | 3 | Article, BreadcrumbList, FAQPage |
| `guides/kagu-tentou-boushi/index.html` | 家具の転倒防止対策｜地震に備える配置と固定の基本｜暮らしの計算室（32） | 69 | 一致 | 掲載 | 6 | Article, BreadcrumbList, FAQPage |
| `guides/kanshin-breaker/index.html` | 感震ブレーカーとは｜種類と設置の考え方｜暮らしの計算室（27） | 69 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/keikai-level/index.html` | 警戒レベルとは｜避難指示・高齢者等避難の意味と取るべき行動｜暮らしの計算室（37） | 72 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/keitai-toilet-bichiku/index.html` | 携帯トイレの備蓄は何回分？家族人数から必要数を考える｜暮らしの計算室（34） | 63 | 一致 | 掲載 | 5 | Article, BreadcrumbList, FAQPage |
| `guides/mizu-kumioki-bichiku/index.html` | 水道水のくみ置き備蓄｜保存期間の目安と容器・生活用水の備え｜暮らしの計算室（37） | 61 | 一致 | 掲載 | 5 | Article, BreadcrumbList, FAQPage |
| `guides/mochidashi-bukuro/index.html` | 非常用持ち出し袋の準備｜自宅の備蓄との違いと見直し方｜暮らしの計算室（34） | 67 | 一致 | 掲載 | 9 | Article, BreadcrumbList, FAQPage |
| `guides/pet-bousai-bichiku/index.html` | ペットの防災備蓄｜フード・水は何日分？犬猫の備え方｜暮らしの計算室（33） | 65 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/rolling-stock-hajimekata/index.html` | ローリングストックの始め方｜期限切れを防ぐ備蓄の回し方｜暮らしの計算室（35） | 65 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/saigai-dengon-171/index.html` | 災害用伝言ダイヤル171の使い方｜家族の安否確認を決めておく｜暮らしの計算室（38） | 69 | 一致 | 掲載 | 7 | Article, BreadcrumbList, FAQPage |
| `guides/shachuhaku-hinan/index.html` | 車中泊避難の注意点｜エコノミークラス症候群と季節の危険｜暮らしの計算室（35） | 63 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/teiden-sonae/index.html` | 停電への備え｜夜間の明かり・スマホ電源・家で過ごす工夫｜暮らしの計算室（35） | 66 | 一致 | 掲載 | 8 | Article, BreadcrumbList, FAQPage |
| `guides/tsunami-hinan/index.html` | 津波から逃げる｜警報・注意報と高い場所への避難｜暮らしの計算室（31） | 68 | 一致 | 掲載 | 3 | Article, BreadcrumbList, FAQPage |
| `guides/tsuuden-kasai/index.html` | 通電火災とは｜地震後の電気とブレーカーの落とし方｜暮らしの計算室（32） | 68 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `guides/yukimichi-tachioujou/index.html` | 雪道の立ち往生に備える｜車に積むものと閉じ込められたときの注意｜暮らしの計算室（39） | 66 | 一致 | 掲載 | 3 | Article, BreadcrumbList, FAQPage |
| `guides/yukioroshi-jiko-boushi/index.html` | 雪下ろし・雪かきの事故を防ぐ｜除雪中の事故防止10箇条と注意点｜暮らしの計算室（39） | 66 | 一致 | 掲載 | 3 | Article, BreadcrumbList, FAQPage |
| `guides/zaitaku-hinan/index.html` | 在宅避難とは｜自宅で過ごすための条件と備え｜暮らしの計算室（29） | 68 | 一致 | 掲載 | 4 | Article, BreadcrumbList, FAQPage |
| `index.html` | 暮らしの計算室｜暮らしの備えを、分かりやすく（22） | 52 | 一致 | 掲載 | 67 | — |
| `privacy/index.html` | プライバシーポリシー｜暮らしの計算室（18） | 63 | 一致 | 掲載 | 41 | — |
| `tools/baby-bichiku/index.html` | 赤ちゃん 防災 必要量 計算｜ミルク・おむつ・おしりふきの備蓄目安（33） | 81 | 一致 | 掲載 | 11 | WebApplication, FAQPage, BreadcrumbList |
| `tools/bichiku/index.html` | 防災備蓄 計算｜家族の水・食料・携帯トイレ必要量を自動計算（29） | 68 | 一致 | 掲載 | 93 | WebApplication, FAQPage, BreadcrumbList |
| `tools/ensei-hi/index.html` | 遠征費 計算｜推し活・ライブ遠征の交通費・宿泊費をまとめてシミュレーション（37） | 91 | 一致 | 掲載 | 6 | WebApplication, FAQPage, BreadcrumbList |
| `tools/pet-bichiku/index.html` | ペット 防災備蓄 計算｜犬・猫のフード・水・トイレ用品の必要量を自動計算（36） | 79 | 一致 | 掲載 | 11 | WebApplication, FAQPage, BreadcrumbList |
| `tools/rolling-stock/index.html` | ローリングストック 賞味期限管理｜備蓄の期限をブラウザで一覧（30） | 89 | 一致 | 掲載 | 19 | WebApplication, FAQPage, BreadcrumbList |
| `tools/toilet-bichiku/index.html` | 携帯トイレ 必要数 計算｜家族の人数・日数から何回分・何個必要か（32） | 87 | 一致 | 掲載 | 13 | WebApplication, FAQPage, BreadcrumbList |

## 3. 重複・検索意図の近さ

完全一致するtitleまたはH1はありません。以下は重複の確定ではなく、同じ課題語を扱うページ群について役割が伝わるかを確認する候補です。Search Consoleの検索語・表示データがないため、実際の検索食い合いは未確認です。

| ページ群 | 現在の役割と見える近さ | 役割の分け方案 |
|---|---|---|
| `guides/bichiku-nannichibun/index.html`、`guides/bousai-bichiku/index.html`、`tools/bichiku/index.html` | 「防災備蓄」「何日分」「家族の量」が共通。前者は人数・日数と用途別の説明、次はツール案内、最後は計算ツール | 「日数・量の考え方」「ツールの選び方」「入力して計算」を各title/H1・導入文・内部リンクで明示する。説明ページから計算ツール、ツールから計算範囲を説明する記事へ、用途が分かるリンク文でつなぐ |
| `guides/keitai-toilet-bichiku/index.html` と `tools/toilet-bichiku/index.html` | 携帯トイレの備蓄数・必要数が共通。記事は備蓄の考え方、ツールは人数・日数・在庫から計算 | 記事は選び方・使う状況・在庫確認に寄せ、ツールは計算入力と結果に寄せる。相互リンクの文言も役割を示す |
| `guides/rolling-stock-hajimekata/index.html` と `tools/rolling-stock/index.html` | ローリングストックと期限管理が共通。記事は始め方と運用、ツールは期限・在庫の登録と一覧 | 記事は「使う→補充→期限確認」の運用手順、ツールは記録・検索・データ控えに役割を限定して案内する |

Googleは簡潔で説明的なtitleを推奨し、ページ間の重複URLではcanonical等を手掛かりに代表URLを選びます。この監査対象のページではcanonicalの不一致もtitle/H1の完全重複も見つかっていないため、現時点ではページ削除やcanonical変更より、意図の違いを明示する内部リンク・見出しの確認が適切です。[title linkの推奨](https://developers.google.com/search/docs/appearance/title-link) · [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

## 4. 内部リンク

ローカルHTML内の相対 `<a href>` をたどるリンクグラフでは、トップページ、`guides/index.html`、6つすべてのツールを起点に24記事すべてへ到達できました。内部リンク着信が0の公開候補もありません。これはリポジトリ内リンクの到達性を示すだけで、公開後のHTTP応答やGooglebotのクロール実績は示しません。

購入導線として指定された4記事への経路は次のとおりです。

| テーマ | トップからのリンク経路 |
|---|---|
| 携帯トイレ | トップ → `guides/bousai-bichiku/index.html` → `guides/keitai-toilet-bichiku/index.html` |
| 水 | トップ → `tools/bichiku/index.html` → `guides/mizu-kumioki-bichiku/index.html` |
| 非常食 | トップ → `tools/bichiku/index.html` → `guides/hijoushoku-erabikata/index.html` |
| ペット | トップ → `guides/bousai-bichiku/index.html` → `guides/pet-bousai-bichiku/index.html` |

Googleは通常の `<a href>` をクロール可能なリンクとして扱い、説明的で簡潔なアンカーテキストと、重要ページへのサイト内リンクを勧めています。現状は孤立ページがないため、追加リンクは到達性の不足を埋めるより、読者が次に何をできるかを明確にする用途で検討できます。[Google向けリンクのベストプラクティス](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

## 5. 構造化データ

| 主な型 | 件数 | 現在Google検索で期待できる表示 |
|---|---:|---|
| `Article` | 24記事 | GoogleはArticle系マークアップを記事内容の理解やタイトル・画像・日付情報の改善に利用し得ます。表示は保証されません |
| `BreadcrumbList` | 31ページ | Google検索のパンくず機能が対応する型です。表示は保証されません |
| `FAQPage` | 30ページ（24記事＋6ツール） | FAQリッチリザルトは、現在、よく知られた権威ある政府・医療系サイトでのみ表示されます。このサイトは該当すると確認できないため、表示を前提にしないでください |
| `WebApplication` | 6ツール | GoogleのSoftware AppリッチリザルトはWebApplication型にも対応します。ただし全6ツールに必須の `offers.price` がなく、さらに実在する評価またはレビューもありません。したがって現状のマークアップは要件を満たしません。無料であることを示す `price: 0` は指定できますが、実在しない評価・レビューを作ってはいけません |
| `CollectionPage` | 1ページ（記事一覧） | Googleのリッチリザルト一覧に専用表示型として掲載されていません |

JSON-LDは30ページで本文のFAQを記述しています。Googleは構造化データの正しい記述だけでリッチリザルト表示を保証しないとしています。FAQPageの表示制限とSoftwareApplicationの要件を踏まえ、リッチリザルトのためにFAQや評価を増やすことは優先しないのが妥当です。現在のArticle/Breadcrumb markupはサイトの説明補助として扱い、実際の表示はSearch ConsoleやRich Results Testで確認します。[FAQ表示変更](https://developers.google.com/search/blog/2023/08/howto-faq-changes) · [Googleが対応する構造化データ](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) · [Article](https://developers.google.com/search/docs/appearance/structured-data/article) · [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) · [SoftwareApplication / WebApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) · [構造化データの一般ガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

## 6. 優先修正・確認候補

順位はリポジトリ内の確認結果とGoogle公式資料に基づく作業優先度で、検索順位や表示回数の予測ではありません。最大10件のうち、上位の確認から進めてください。

| 優先 | 対象ファイル／場所 | 候補 | 根拠 |
|---:|---|---|---|
| 1 | Search Console（リポジトリ外。ファイル変更なし） | サイトをURL-prefix propertyで確認し、sitemap提出状態、Page indexing、URL Inspection、Performanceの表示・検索語を確認する。Search Console実データは今回未確認 | クロールや検索パフォーマンスをローカルHTMLだけで判定できず、Google公式もURL Inspection・Performance reportで確認する案内 |
| 2 | `guides/bichiku-nannichibun/index.html`、`guides/bousai-bichiku/index.html`、`tools/bichiku/index.html` | 「日数の説明」「備蓄ツールの選び方」「数量計算」の違いをtitle/H1/導入と相互リンク文で明確にする。Search Consoleで同じ検索語に複数URLが表示されているか確認してから文言を変える | 簡潔でページ内容に合うtitle、リンク先が分かるアンカーを推奨 |
| 3 | `guides/keitai-toilet-bichiku/index.html`、`tools/toilet-bichiku/index.html` | 記事は備蓄判断・用途、ツールは必要数と在庫差の計算と役割を分ける。関連リンクの文言で「考え方」と「計算」を区別 | title linksと内部リンクのガイド |
| 4 | `guides/rolling-stock-hajimekata/index.html`、`tools/rolling-stock/index.html` | 記事の運用説明とツールの期限登録・一覧機能をtitle/H1・説明文・相互リンクで分ける | title linksと内部リンクのガイド |
| 5 | `tools/bichiku/index.html`、`tools/baby-bichiku/index.html`、`tools/ensei-hi/index.html`、`tools/pet-bichiku/index.html`、`tools/rolling-stock/index.html`、`tools/toilet-bichiku/index.html` | SoftwareApplicationリッチリザルトを狙うなら、まず実際の提供内容を確認した上で無料価格 `offers.price: 0` を記述し、評価／レビューは本物のデータが存在する場合だけ追加する。偽の評価は追加しない。条件を満たさない間はリッチリザルトを見込まない | Google公式のSoftwareApplication必須項目 |
| 6 | `sitemap.xml` と、sitemapを更新する既存の生成・公開手順 | 現在lastmodは0件。信頼できる重要更新日時を生成できる場合のみlastmodを追加し、できない場合は未記載を維持する | Googleはlastmodが一貫し検証可能に正確な場合に利用すると説明 |
| 7 | `robots.txt`、`sitemap.xml`、Search Console | 今回はrobots、canonical、sitemapの静的整合性に欠落なし。公開後にGoogle選択canonical、クロール・インデックスを確認し、異常があったURLだけを対象に修正する | 静的ファイルだけではGoogle側の取得・選択状態を観測できない |
| 8 | `guides/index.html` と24記事の関連記事リンク | 既に孤立ページはない。今後の更新では、リンク数を増やすだけでなく、読者の次の行動が分かるリンク文（例：考え方を読む／必要数を計算する）を維持する | Googleはcrawlableな`<a href>`と説明的なアンカーテキストを推奨 |

## 参照した公式資料

- [Google Search Central: sitemapの作成とlastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central: title link](https://developers.google.com/search/docs/appearance/title-link)
- [Google Search Central: meta descriptionとsnippet](https://developers.google.com/search/docs/appearance/snippet)
- [Google Search Central: canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google Search Central: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central: crawlable linksと内部リンク](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google Search Central Blog: FAQ/How-to rich resultsの変更](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Google Search Central: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google Search Central: Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google Search Central: SoftwareApplication / WebApplication structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google Search Central: structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [Google Search Central: structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

監査日: 2026-10-15（Asia/Tokyo）

