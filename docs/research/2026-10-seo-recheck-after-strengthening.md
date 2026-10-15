# 強化後の既存ページ SEO 再監査

調査日：2026-10-16（JST）
対象：supportapp3-lab/kasegu-tools の main。公開URLの現況をリポジトリ上のHTML・sitemap.xml・robots.txtとGit履歴で照合した。検索ボリュームや検索パフォーマンスは推定していない。Google Search Consoleの権限がないため、実際の表示回数・検索語・順位・Googleが選択したcanonical・インデックス状態は未確認である。方針は docs/research/2026-10-seo-audit.md と docs/research/2026-10-strategy.md に従い、新URLや記事を増やさず、実際の備え方と購入前確認の分かりやすさを優先する。

## 1. #56 監査の指摘の追跡

#56 の6章にある8候補を、現在の main と後続Issue/PRで確認した。Search Console上の状態だけはリポジトリから確認できない。

| #56 優先 | 判定 | 現在の根拠 |
|---:|---|---|
| 1 Search Console | 未対応（外部確認待ち） | URL-prefix property、サイトマップ送信、Page indexing、URL Inspection、Performanceの実データはこのリポジトリにない。Search Consoleで所有権確認と実データ確認が必要。 |
| 2 備蓄「何日分」記事・案内・計算ツールの役割 | 対応済み（Issue #65 / PR #66） | 記事は公的な日数目安・水の用途・在庫の考え方、案内はツールの選び分け、計算ページは人数・日数からの数量計算と役割が分かれた。title、description、H1、導入・リンク文を確認。 |
| 3 携帯トイレ記事と計算ツール | 対応済み（Issue #45 / PR #46、Issue #103 / PR #104） | ガイドは備蓄回数・箱表示・構成品・購入前確認を説明。ツールは必要回数・在庫との差を計算し、買う前の確認項目をガイドへ案内する。両PRはmainに取り込み済み。 |
| 4 ローリングストック記事と期限管理ツール | 対応済み（Issue #63 / PR #64、Issue #73 / PR #74） | 記事は使う・補充する運用手順、ツールは期限一覧・絞り込み・データの控えを担当する。相互リンクの文言も用途を示す。 |
| 5 WebApplicationの無料価格 | 対応済み（Issue #67 / PR #68） | 6ツールのWebApplicationに、実際の無料提供と合うoffers.price 0がある。実在しない評価・レビューは追加されていない。 |
| 6 sitemap lastmod | 対応済み（Issue #71 / PR #72） | scripts/build_sitemap.py が各HTMLの最新Gitコミット時刻を取得し、デプロイ用sitemapにlastmodを生成する。mainのソースsitemap.xmlは生成前の入力なのでlastmodを持たない。 |
| 7 robots・canonical・sitemapの整合 | 静的確認では対応不要 | robots.txtは全体を許可しsitemapを指す。35公開ページすべてにcanonicalがあり、sitemapのURLと対応する。Googleが実際に選択したcanonicalやクロール結果はSearch Console未確認のため保留。 |
| 8 孤立ページと内部リンク文 | 孤立ページなし、現状の維持で対応不要 | 35ページ内の通常リンクをたどると、トップ・記事一覧・6ツールから24記事に到達できる。公開候補に内部リンク着信0のページはない。リンク文は「考え方を読む」「必要数を計算する」など次の行動を示す。 |

## 2. 強化後ページのメタ情報

#84 の取り込み後の基準コミット c3b685b611c79d644063844d670caba7c5914580 から現在のmainまで、Gitの差分で8ページを特定した。タイトル・descriptionの文字数はHTMLの文字列を数えた実測値で、Google表示幅や順位の予測ではない。OG titleはtitleと、OG descriptionはmeta descriptionと一致する。Twitter title/descriptionもそれぞれ同じ内容で、8ページすべてで統一されている。

| ページ | 追加・強化内容 | title（文字数） | description（文字数） | 評価・文案 |
|---|---|---:|---:|---|
| guides/hijoushoku-erabikata/index.html | food-compare：非常食と日常食品の照合 | 非常食の選び方｜日常食品との分け方と備蓄のバランス｜暮らしの計算室（33） | 非常食と日常食品を使う目的で分け、準備条件・家族の食事・容量・保管を見比べる解説。公的な日数の背景と量・期限管理への導線も案内します。（67） | 照合表の比較観点と、公的目安・次のツールへの導線を説明しており内容を反映。現状維持。検索語例（量は未確認）：非常食 選び方、日常食品 備蓄。 |
| guides/mizu-kumioki-bichiku/index.html | container-record：容器・日付・入れ替え記録 | 水道水のくみ置き備蓄｜保存期間の目安と容器・生活用水の備え｜暮らしの計算室（37） | 東京都水道局のくみ置き方法と条件付きの保存日数を確認。容器、日付、飲料用と生活用水、分散保管と入れ替えの記録を説明します。（61） | 記録欄と本文の中心内容がtitle・descriptionにある。現状維持。検索語例：水道水 くみ置き、備蓄容器 記録。 |
| guides/mochidashi-bukuro/index.html | carry-check：持ち出し品の確認 | 非常用持ち出し袋の準備｜自宅の備蓄との違いと見直し方｜暮らしの計算室（34） | 官邸のチェックリストを入口に、持ち出す物と自宅備蓄の違いを確認。家族の個別用品、置き場所、期限と避難場所・安否確認の共有を説明します。（67） | 持ち出しと自宅備蓄の区別、チェック項目を反映。現状維持。検索語例：非常用持ち出し袋 準備、自宅備蓄 違い。 |
| guides/rolling-stock-hajimekata/index.html | #85以降の変更あり、新しいsection idはなし | ローリングストックの始め方｜使う・買い足す手順を解説｜暮らしの計算室（34） | 普段使う食品や用品を買い置きし、使った分を補充する手順を解説。品目の選び方、保管場所、期限を確認して続ける方法を整理し、期限を一覧管理するツールも案内します。（79） | 記事の運用手順と一覧ツールを区別できる。現状維持。 |
| tools/baby-bichiku/index.html | baby-stock-reconcile：用品別の照合表 | 赤ちゃん 防災 必要量 計算｜ミルク・おむつ・おしりふきの備蓄目安（33） | お子さんごとの普段の1日量から、ミルク・調乳用水・おむつ・おしりふき・離乳食の備蓄量を無料計算。最大10人、3日・7日・任意日数、共有URLとチェックリスト付き。（81） | 数量計算と共有機能は説明するが、新しい在庫照合表は明示しない。候補文案：「普段の使用量と日数から赤ちゃん用品の備蓄量を計算。ミルク・水・おむつなどを在庫照合表で整理し、買い足し前の確認に使えます。」 |
| tools/bichiku/index.html | stock-reconcile：手元の在庫と必要量の照合 | 防災備蓄 計算｜家族の水・食料・携帯トイレ必要量を自動計算（29） | 家族の人数と日数から、飲料・調理用水、2Lボトル本数、携帯トイレ、主食の必要量の目安を無料計算。計算根拠・早見表・FAQと共有機能付き。（68） | 数量計算の説明は明確だが、追加された在庫照合はdescriptionに出ていない。候補文案：「家族の人数と日数から水・食料・携帯トイレの目安を計算。手元の備蓄を照合表で確認し、品目ごとの不足と見直し箇所を整理できます。」 |
| tools/pet-bichiku/index.html | pet-stock-reconcile：犬猫用品の照合表 | ペット 防災備蓄 計算｜犬・猫のフード・水・トイレ用品の必要量を自動計算（36） | 犬・猫など最大10頭の普段のフード量・飲水量から、5日・7日・任意日数の備蓄量を無料計算。袋数・2Lボトル本数・シーツ・猫砂、共有URLとチェックリスト付き。（79） | 品目別計算は説明するが、追加された照合表は明示しない。候補文案：「犬猫の普段のフード・飲水量から日数分を計算。フード・水・トイレ用品を在庫照合表で整理し、買い足し前の確認に使えます。」 |
| tools/toilet-bichiku/index.html | pre-buy-check：不足回数を買う前に確認 | 携帯トイレ 必要数 計算｜家族の人数・日数から何回分・何個必要か（32） | 人数・日数・1日の回数から、携帯トイレの必要回数を無料計算。在庫を差し引いた不足回数と、製品の容量を入力した場合のパック数も確認。早見表・共有URL・マンションでの注意付き。（87） | 在庫差とパック数は反映済み。購入前の箱表示・構成品の確認はdescriptionにない。候補文案：「人数・日数・回数から携帯トイレの必要回数と不足を計算。購入前に箱の回数表示と構成品を確認する項目も掲載しています。」 |

新しく強化されたガイド3ページとローリングストック記事は、meta情報が固有の内容を十分に説明している。4ツールは機能量・入力範囲をよく説明する一方、追加した照合表・購入前確認の特徴がdescriptionに現れないため、7章の候補にする。タイトルを無理に長くしたり、検索語を羅列したりする根拠はない。Googleはtitle linkやsnippetを書き換える場合があり、固定の推奨文字数はない。検索語例は内容を説明するための例で、検索量・需要を示さない。

## 3. 追加セクションへの内部リンク

比較範囲は前章と同じGit差分。35公開ページのローカルa href 891件を解決し、対象ファイルとidを照合した。外部URLの応答可否はこの検査に含めない。

| ページ・追加id | section-nav | 関連ツール↔ガイド | トップ・記事一覧から対象idへ | サイト内のfragment着信 |
|---|---|---|---|---:|
| guides/hijoushoku-erabikata/index.html#food-compare | なし | 記事ページへの導線はあるが、このidへのリンクはなし | なし | 0 |
| guides/mizu-kumioki-bichiku/index.html#container-record | なし | 記事ページへの導線はあるが、このidへのリンクはなし | なし | 0 |
| guides/mochidashi-bukuro/index.html#carry-check | なし | 記事ページへの導線はあるが、このidへのリンクはなし | なし | 0 |
| tools/bichiku/index.html#stock-reconcile | あり | 関連ガイドへの導線あり。該当idへの直接リンクはなし | なし | section-navのみ |
| tools/pet-bichiku/index.html#pet-stock-reconcile | あり | 関連ガイドへの導線あり。該当idへの直接リンクはなし | なし | section-navのみ |
| tools/baby-bichiku/index.html#baby-stock-reconcile | あり | 関連ガイドへの導線あり。該当idへの直接リンクはなし | なし | section-navのみ |
| tools/toilet-bichiku/index.html#pre-buy-check | あり | 携帯トイレガイドへの導線あり。該当idへの直接リンクはなし | なし | section-navのみ |

35ページの全891内部リンクは、ローカルのファイルとfragment先がすべて存在し、リンク切れは0件だった。トップや記事一覧、関連ページからページ自体へ行けても、指定した新しいsection idへのリンクがあることとは区別した。新規セクションの本文は存在し、ツール4件はsection-navから到達できる。ガイド3件は同ページ目次がなく、外から直接開けるfragmentもない。

## 4. 構造化データの整合

既存の監査対象35ページをHTMLとして読み、application/ld+jsonの各script本文をJSONパーサーへ渡した。FAQPageではmainEntityのQuestion.nameを抽出し、FAQのdetails/summaryと数・順序・文言を比較した。BreadcrumbListではitemListElementの最後のitem URLとcanonicalを比較した。HTML entityをデコードし、空白を正規化して比較した。生成スクリプトはこの調査のための一時手順で、リポジトリには追加していない。

| 検査 | 結果 |
|---|---|
| JSON-LD | JSON-LDを含む31ページの全scriptが有効なJSON。解析エラー0。ほか4ページはJSON-LDなし。 |
| FAQPage | 30ページ。Question数と本文details数は30/30で一致。Question名は29/30で本文と順序・文言が一致。 |
| FAQの差 | guides/cassette-bombe-bichiku/index.html は8問ずつあるが、JSON-LDの「古いボンベの処分方法はどこで確認しますか？」が6番目、本文では8番目。 |
| FAQ answerの追加確認 | guides/bichiku-nannichibun/index.html はQuestion 6件が一致。1つのJSON-LD acceptedAnswerに本文の末尾の出典注記（農林水産省「家庭での備蓄」）が含まれず、回答本文と完全一致しない。 |
| BreadcrumbList | 31ページすべてで、末尾itemのURLとページのcanonicalが一致。 |

FAQPageのリッチリザルトは、このサイトで表示される前提にしない。GoogleはFAQ表示の対象を政府・医療系などのよく知られた権威サイトに制限している。本文との一致を保つ目的で、質問順と回答文の小さなずれは修正候補にする。

## 5. ツールとガイドの食い合い

ここでの評価はページ上のtitle・H1・導入・本文から見た意図の近さであり、実際の検索語が競合しているという結論ではない。Search Consoleのクエリ別表示がないため、検索カニバリゼーションは未確認。

| テーマ | ガイドとツールの現状 | 評価・役割をさらに伝える案 |
|---|---|---|
| 備蓄全体 | guides/bichiku-nannichibun は「何日分」「公的目安・水の用途・在庫の考え方」。tools/bichiku は水・食料・携帯トイレの必要量計算と在庫照合。guides/bousai-bichiku はツールの選び分け。 | 現状は「考え方」「どの道具を使うか」「数を計算する」で区別できる。相互リンク文にもその役割を維持する。 |
| 携帯トイレ | guides/keitai-toilet-bichiku は備蓄回数、箱表示、構成品、購入判断。tools/toilet-bichiku は人数・回数・日数から必要量と不足を計算。 | 記事は判断・表示の読み方、ツールは数量計算という現在の分担を維持する。購入前の箱表示確認はガイドへ送る。 |
| ペット | guides/pet-bousai-bichiku は公的な備蓄日数、用品の優先順位、同行避難。tools/pet-bichiku は普段の量から必要量を計算し在庫を照合。 | 記事は何をどう備えるか、ツールは家庭の普段の使用量を用品別に数える役割を明示する。 |
| 乳幼児 | guides/baby-bousai-bichiku は用品を一式で備える理由、公的資料、授乳への配慮。tools/baby-bichiku は子どもごとの普段の使用量と日数から数量を計算。 | 記事は選択・授乳支援の注意、ツールは家庭ごとの数量整理を担当する。 |
| 期限管理 | guides/rolling-stock-hajimekata は使う・補充する運用手順。tools/rolling-stock は期限一覧、期限順の絞り込み、JSON控え。 | title・H1・導入で「続け方」と「記録・一覧」の違いが見える。現状維持。 |

title/H1の完全一致は確認されていない。現状のガイドとツールは検索目的が隣接しても、読む・選ぶ・計算するという流れで補完できる。実際の流入を根拠にcanonical変更やページ統合を行うのは、Search Consoleで同じ検索語に複数URLが繰り返し出ているかを見てからにする。

## 6. sitemap.xml と robots.txt

| 確認項目 | 結果 |
|---|---|
| 公開ページ数 | sitemapの35 URLと、404.htmlを除く35公開HTMLが一致。 |
| sitemapとcanonical | 35/35でURLが一致。存在しないページURL、掲載漏れともに0。 |
| sourceのlastmod | リポジトリのsitemap.xmlには0/35件。これはデプロイ時に生成する設計。 |
| デプロイ時のlastmod | .github/workflows/pages.yml はfetch-depth: 0で全履歴を取得し、_site/sitemap.xmlを生成。scripts/build_sitemap.py は各ページの最新コミット日時（Gitの% cI）をW3C形式で付ける。履歴がない時は付けず、実ファイルがないURLは失敗する。 |
| lastmodの実変更との一致 | 実際の各HTMLの最新Git変更を元に生成するため、固定の推測日付ではない。source sitemapと公開生成物を混同しない。 |
| robots.txt | User-agent * をAllow: /とし、https://supportapp3-lab.github.io/kasegu-tools/sitemap.xml を指す。不要なブロックは見つからない。 |

lastmodはHTMLファイルの最終コミット日時を表し、各本文が検索上重要な更新を受けたかを人手で判定した日時とは限らない。生成時刻とGit履歴の差は測定していない。Googleはlastmodを信頼できる時に使うとしているため、軽微な空白変更も日時を進めるGit履歴の性質を踏まえ、内容重要度の厳密な代理指標とは表現しない。

## 7. 次の実装Issue候補

検索表示・購入率の実測値がないため、影響は定性的な優先度である。検索語の例はページ内容から考えたもので、ボリュームを示さない。すべて既存URL内の修正案で、新しいURLは作らない。

| 候補 | 対象・そのまま使える変更案 | 変更しない範囲・完了条件 | 作業量 | 検索流入 / 購入の流れ |
|---|---|---|---|---|
| 1. 新しいガイド節へ直接移動 | guides/hijoushoku-erabikata/index.html のsection-navへ「照合表」→#food-compare、guides/mizu-kumioki-bichiku/index.html へ「容器・日付・入れ替え記録」→#container-record、guides/mochidashi-bukuro/index.html へ「持ち出し品の確認」→#carry-checkを追加。 | 本文やURLは変更しない。各リンクのidが存在し、全ページのローカルリンク・fragment lintが成功する。 | 小 | 検索：低（検索順位への直接効果は予測できない）／購入の流れ：中（必要な比較・購入前確認へ読者が移動しやすい）。 |
| 2. FAQPageを本文に合わせる | guides/cassette-bombe-bichiku/index.html のJSON-LD Question順を本文の8問と同じ順にする。guides/bichiku-nannichibun/index.html はJSON-LD回答の末尾の出典注記を本文に合わせるか、両方から同じ形で除く。 | FAQ表示自体を狙う変更にはしない。本文とJSON-LDの件数・順序・質問・回答が一致し、全JSON-LDがparseできる。表示FAQ本文は削らない。 | 小 | 検索：低（FAQ表示はサイト種別上期待しない）／購入の流れ：低（信頼できる解説の維持）。 |
| 3. 追加した照合・購入前確認をdescriptionに反映 | tools/bichiku/index.html：「家族の人数と日数から水・食料・携帯トイレの目安を計算。手元の備蓄を照合表で確認し、品目ごとの不足と見直し箇所を整理できます。」tools/baby-bichiku/index.html：「普段の使用量と日数から赤ちゃん用品の備蓄量を計算。ミルク・水・おむつなどを在庫照合表で整理し、買い足し前の確認に使えます。」tools/pet-bichiku/index.html：「犬猫の普段のフード・飲水量から日数分を計算。フード・水・トイレ用品を在庫照合表で整理し、買い足し前の確認に使えます。」tools/toilet-bichiku/index.html：「人数・日数・回数から携帯トイレの必要回数と不足を計算。購入前に箱の回数表示と構成品を確認する項目も掲載しています。」 | 現行機能で確認できる事実だけを記載。title・canonical・本文・計算ロジックは変更しない。meta、OG、Twitter、Article/WebApplication JSON-LDのdescription整合を確認する。 | 小 | 検索：低（検索語例「備蓄 在庫 照合」は例であり量不明）／購入の流れ：中（不足の確認と購入前に見る内容が検索結果の説明にも現れる）。 |
| 4. sitemap生成の回帰テスト | tests/test_build_sitemap.py を追加し、標準ライブラリのunittestで一時出力へsitemapを生成。URL数・ページ対応・lastmodが各HTMLの最新Git履歴由来であること、履歴なし・不在ページの扱いを検証する。 | scripts/build_sitemap.py、デプロイ結果、公開ページURLは変更しない。テストがローカルで走り、Pages validateで実行される。 | 中 | 検索：低（既に正しいsitemapを維持する回帰防止）／購入の流れ：低（直接の導線変更ではない）。 |

## 調査の再現手順

1. GitHubのmainからsitemap.xmlが列挙する公開パスと、404.htmlを除くHTMLページを読み、35ページを対象にした。
2. #84後の基準コミット c3b685b611c79d644063844d670caba7c5914580 とmainのGit差分・履歴で変更ページと新しいidを列挙した。
3. 各HTMLのtitle、meta description、og:title、og:description、twitter:title、twitter:descriptionを読み、文字列の長さを数えた。Google検索結果画面での実表示は測っていない。
4. 一時的なHTML検査処理で全a hrefを取得し、相対パス・fragmentを現在のページURLに対して解決する。対象HTMLのファイル存在とid一覧を照合する。
5. application/ld+json scriptごとにJSONパースし、FAQPageのQuestion.nameを本文FAQのsummaryと順番・件数で比較する。BreadcrumbListの最後のitem URLをcanonicalと照合する。
6. sitemapのloc集合を35公開canonical URL集合と比較する。robots.txtのAllowとSitemap行を読む。Pages workflowと既存sitemap生成スクリプトを確認し、ソースとデプロイ用出力の違いを判定する。
7. 検索意図の実績は主張せず、title・H1・meta・導入文の内容を並べて説明上の役割を確認する。

## 確認した公式資料

- [Google Search Central: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) — sitemapはクロール・インデックス保証ではなく、lastmodは正確に検証できる場合に利用する。
- [Google Search Central: How to specify a canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — canonicalは代表URLを示すシグナルで、サイトマップもcanonical判断のシグナルの一つ。
- [Google Search Central: Control your title links](https://developers.google.com/search/docs/appearance/title-link) — 検索結果タイトルはページ内容等から自動生成・変更され得る。
- [Google Search Central: Control your snippets](https://developers.google.com/search/docs/appearance/snippet) — meta descriptionが使われることはあるが、スニペットは検索内容に応じて生成される。
- [Google Search Central: Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) — robots.txtはクロール制御で、canonicalを指定する手段ではない。
- [Google Search Central: Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) — クロール可能なリンクにはa hrefを使い、リンク先の説明になる文言を推奨。
- [Google Search Central: FAQ structured data changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — FAQ表示の対象制限。
- [Google Search Central: Search gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) — 構造化データ機能と対象型の一覧。
