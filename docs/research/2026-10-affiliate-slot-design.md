# アソシエイト承認後に埋める affiliate 枠の設計

確認日: 2026-10-15。規約・規制はこの日に各公式ページで確認しました。公開直前にも最新版を再確認してください。この文書は設計案であり、法務判断や審査通過の保証ではありません。

## 1. 枠の棚卸し

tools/ と guides/ の HTML を確認しました。data-category 属性の一致は **28件**で、下表の合計と一致します。対象ファイルは **14ファイル**です。

| data-category | ファイル | 枠の位置・直前に読者が見た内容 |
| --- | --- | --- |
| baby-milk | tools/baby-bichiku/index.html | 「2 備蓄の目安」の計算後。普段の授乳用品と日数を確認し、授乳量を判定しない旨を読んだ直後。 |
| baby-diaper | tools/baby-bichiku/index.html | 同じ計算セクション。使い慣れたサイズと手持ちの残量を照合した直後。 |
| baby-wipe | tools/baby-bichiku/index.html | 同じ計算セクション。パックの枚数と保管方法を確認した直後。 |
| baby-food | tools/baby-bichiku/index.html | 同じ計算セクション。離乳食の内容とアレルギー表示を確認した直後。 |
| water | tools/bichiku/index.html | 「備えるものを整理する」の導入直後、計算入力前。在庫を確認し不足を整理する案内。 |
| toilet | tools/bichiku/index.html | 同じ導入枠。家族全体の備蓄を整理する案内で、計算結果はまだない。 |
| food | tools/bichiku/index.html | 同じ導入枠。家族全体の備蓄を整理する案内で、計算結果はまだない。 |
| hotel | tools/ensei-hi/index.html | 「予約や購入を確認するときに」。比較先の紹介枠だが、商品・予約リンクは未設定と明記。 |
| travel | tools/ensei-hi/index.html | 同じ比較セクション。日程・経路・往復料金を確認する文脈。 |
| goods | tools/ensei-hi/index.html | 同じ比較セクション。旅行用品・装備を確認する文脈。 |
| pet-food | tools/pet-bichiku/index.html | 「2 必要な備蓄量」の計算後。普段の量と日数、手持ちの製品・容量・期限を照合した直後。 |
| pet-water | tools/pet-bichiku/index.html | 同じ計算セクション。飲水用の容器・持ち出し方法・食器を確認した直後。 |
| pet-toilet | tools/pet-bichiku/index.html | 同じ計算セクション。トイレ用品と処理方法を確認した直後。 |
| pet-carrier | tools/pet-bichiku/index.html | 同じ計算セクション。シーツ・キャリー・処理用袋を確認した直後。 |
| long-life-food | tools/rolling-stock/index.html | JSONで控える・移す説明の後。期限・在庫の計算結果直後ではなく、購入意図とのつながりは弱い。 |
| water | tools/rolling-stock/index.html | 同じ JSON 説明の後。容器・期限・保管方法を確認する案内。 |
| toilet | tools/rolling-stock/index.html | 同じ JSON 説明の後。トイレ用品・期限・保管方法を確認する案内。 |
| toilet | tools/toilet-bichiku/index.html | 「2 必要な回数と不足分」の計算後。手持ちの箱・袋に何回分あるか確認した直後。 |
| toilet-coagulant | tools/toilet-bichiku/index.html | 同じ計算セクション。製品の使用回数と使い方を照合した直後。 |
| toilet-bag | tools/toilet-bichiku/index.html | 同じ計算セクション。処理袋との組み合わせ・保管期限を確認した直後。 |
| baby-supply | guides/baby-bousai-bichiku/index.html | 「購入・補充の前に確認すること」の後。不足がない場合は買い足し不要、健康判断は専門家を優先と説明。 |
| cassette-gas | guides/cassette-bombe-bichiku/index.html | 購入・補充前の不足確認と使用量・期限の注意の後。 |
| long-life-food | guides/hijoushoku-erabikata/index.html | 「購入・補充の前に確認すること」の後。手持ち・期限・家族が食べられるかを見直した直後。 |
| toilet | guides/keitai-toilet-bichiku/index.html | 箱の表示、処分方法、自治体差を確認する購入前チェックの後。 |
| water | guides/mizu-kumioki-bichiku/index.html | 「購入・補充前に確認すること」の後。必要量を満たせば買い足し不要、期限・保存条件を確認する文脈。 |
| go-bag | guides/mochidashi-bukuro/index.html | 「購入・補充の前に確認すること」の後。家族が実際に持てるか・取り出せるかを確かめる案内。 |
| pet-supply | guides/pet-bousai-bichiku/index.html | 購入・補充前の不足確認の後。種類・サイズを変える判断では獣医師を優先する文脈。 |
| lighting-battery | guides/teiden-sonae/index.html | 購入・補充の前に確認することの後。照明・ラジオ・予備電池の公式案内を確認した直後。 |

内訳は toilet 4、water 3、long-life-food 2、その他19カテゴリが各1件です。tools/ensei-hi/index.html には data-category のない汎用 section.affiliate がもう1件あります。カテゴリ照合28件には含めず、カテゴリが決まるまで広告を入れません。section.affiliate 要素自体は合計29件です。

## 2. Amazon アソシエイトの公式ルール

### リンク形式と開始時期

- 公式ヘルプにはテキストリンク、商品リンク、バナーリンクが記載され、アソシエイト・ツールバーやセントラルのリンク作成ツールを使う手順もあります。初回は価格や画像を自動表示しないテキストリンクを推奨します。SiteStripe という画面名称の現在の日本語表示は確認できず、未確認です。出典: [リンクタイプの説明](https://affiliate.amazon.co.jp/help/node/topic/G7N4YLMP8XV5WX2Q)、[リンク作成方法](https://affiliate.amazon.co.jp/help/node/topic/G8H6ZT34PMFJQ4E5)（2026-10-15確認）。
- 特別リンクは申請後にサイトへ表示でき、割り当てられたアソシエイトIDを含め、Amazon が指定する形式で紹介元を追跡できる必要があります。リンクへのブックマークを促さず、リンク先と説明を一致させます。申請前には設置せず、申請後に生成したリンクだけを使います。出典: [アソシエイト・プログラム・ポリシー「リンク」](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。
- Amazon は参照元を合理的に特定できなくするリンクの隠蔽・偽装・不明瞭化（リダイレクトを含む）を禁じています。短縮URL一般を一律禁止する条項は確認できなかったため未確認とし、短縮・独自転送を使わず、公式ツールのリンクを直接置く案です。出典: [同ポリシー「Promotional Limitations」](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。

### 価格・在庫・レビュー

- 価格・在庫をページ側で独自に書き写して表示せず、初期実装では表示しません。Amazon提供リンク内の情報、または Creators API / PA API で取得しライセンス条件を満たす情報だけが例外です。価格比較形式にも別条件があります。出典: [アソシエイト・プログラム・ポリシー「Prices and availability」](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。
- Data Feeds、Creators API / PA API、または1時間より低い頻度で更新する価格・在庫表示には、日時と所定の価格・在庫免責文などの条件があります。取得・更新・表示仕様を個別に確認できていないため、APIを使う商品カードはこの Issue の実装候補から外します。出典: [同ポリシーの表示要件](https://affiliate.amazon.co.jp/help/operating/policies/)、[PA APIライセンス](https://affiliate.amazon.co.jp/help/operating/paapilicenseagreement)（2026-10-15確認）。
- Amazonのレビューや星評価は Creators API / PA API から適正に取得し、要件に従う場合以外は表示できません。口コミの転載、星の独自表示、スクレイピングはしません。出典: [アソシエイト・プログラム・ポリシー](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。

### 商品画像

初回実装では商品画像を扱わず、テキストリンクにします。画像や商品データの利用権は、Creators API / PA API / Data Feeds のライセンスと仕様に従う必要があります。画像コンテンツにはキャッシュ制限があるため、Amazonページのスクリーンショットや保存画像の再アップロードは避けます。出典: [IPライセンスおよび利用要件](https://affiliate.amazon.co.jp/help/operating/paapilicenseagreement)、[画像に関する公式ヘルプ](https://affiliate.amazon.co.jp/help/node/topic/GKT6X2R3NGW5V23K)（2026-10-15確認）。

### 表示文と禁止事項

- 運営規約の表示文は **「Amazonのアソシエイトとして、[サイト名]は適格販売により収入を得ています。」** です。規約はサイト上で目立つように明示するよう求めています。[サイト名]は運営者表記に置き換えます。出典: [アソシエイト・プログラム運営規約 第5条](https://affiliate.amazon.co.jp/help/operating/agreement/)（2026-10-15確認）。
- 自分または他人のための自己購入、友人・親族・従業員などへ購入を依頼・促すことは禁止です。出典: [アソシエイト・プログラム・ポリシー「Promotional Limitations」](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。
- 印刷物、電子書籍、郵送物、口頭勧誘などオフラインで特別リンクを配る販促は不可です。メール・SMS・ソーシャルメディアのダイレクトメッセージには、受信者が希望して登録した場合など条件付き例外があります。「メールは一律禁止」とはせず、本設計ではウェブページ内のリンクだけを対象にします。出典: [同ポリシー「Promotional Limitations」](https://affiliate.amazon.co.jp/help/operating/policies/)（2026-10-15確認）。
- リンク先の商品と異なる説明、誤解を招く価格・割引、Amazonとの提携関係を誇張する表現をしません。出典: [同ポリシー「General Requirements Applicable to All Special Links」](https://affiliate.amazon.co.jp/help/operating/policies/)、[運営規約 第5条](https://affiliate.amazon.co.jp/help/operating/agreement/)（2026-10-15確認）。

### 申請・承認

- Amazon は申請後180日以内に3件の適格販売がない場合、申請を取り下げることがあり、3件発生後に申請を評価すると案内しています。審査通過の保証ではありません。出典: [審査プロセスのヘルプ](https://affiliate.amazon.co.jp/help/node/topic/G7MJTPEP9NC3YKMG)（2026-10-15確認）。
- 申請サイトは公開され、独自コンテンツを含む必要があります。第三者素材を使う場合、独自の解説・分析・改変が必要です。審査ヘルプには各サイトに少なくとも10件の投稿が必要との案内もあります。サイトごとの適用判断は未確認です。出典: [参加要件](https://affiliate.amazon.co.jp/help/operating/policies/)、[審査プロセス・審査対象サイト例](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)（2026-10-15確認）。

## 3. 消費者庁のステルスマーケティング規制

消費者庁のQ&Aは、サイト冒頭に広告利用を書くだけで常に十分とはせず、表示全体や文字の大きさ・色などから広告であると明瞭かを判断すると説明しています。広告でないと誤認される内容は、その近くでも関係性を明示する必要があります。本サイトでは規約所定のAmazon表示を共通の見やすい位置に置き、各 affiliate 枠の近くにも「広告」「アフィリエイト広告を含みます」等を読みやすく表示する案です。これは設計案で、個別の適法性を保証するものではありません。出典: [消費者庁「ステルスマーケティングに関するQ&A」Q13](https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing)（2026-10-15確認）。

## 4. Google Search Central のリンク属性

広告・有料掲載リンクは rel="sponsored" を指定します。nofollow も許容されますが、Google は sponsored を推奨しています。Amazonリンクの a 要素に rel="sponsored" を含めます。新しいタブで開く場合は既存の安全設定も保ちます。出典: [Google Search Central「Qualify your outbound links to Google」](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)（2026-10-15確認）。

## 5. data-category ごとの枠設計

以下は特定商品を推奨せず、一般カテゴリだけを扱う案です。導線文は計算・記事内容とつなぎ、不足数を特定商品の購入指示にしません。上限は各枠あたりです。hotel / travel の宿泊・交通予約は Amazon 商品リンクとの対応を確認できず、決定されるまで0件とします。

| data-category | 紹介する一般カテゴリ | 導線文言例 | 上限 |
| --- | --- | --- | ---: |
| baby-milk | 普段使う授乳用品と衛生用品 | 普段の授乳方法に合う用品の表示を確認 | 1 |
| baby-diaper | 使い慣れたサイズの紙おむつ | 不足分を確認したら、今使うサイズと枚数を照合 | 1 |
| baby-wipe | おしりふき | 普段使う枚数と1パックの枚数を比べる | 1 |
| baby-food | 普段食べている離乳食・ベビーフード | 普段の内容とアレルギー表示を確認 | 1 |
| water（防災備蓄計算） | 飲料・調理用の保存水 | 不足がある場合は容量と保管条件を確認 | 1 |
| toilet（防災備蓄計算） | 携帯トイレ | 必要回数と手持ちの回分を照合 | 1 |
| food | 主食・非常食 | 家族が食べ慣れた主食の内容を確認 | 1 |
| hotel | 宿泊予約は Amazon 商品リンクとの適合を確認できず | 設計保留。別の予約サービスを含めるか運営者が決める | 0 |
| travel | 交通予約は Amazon 商品リンクとの適合を確認できず | 設計保留。別の予約サービスを含めるか運営者が決める | 0 |
| goods | 旅行・防災時に使う一般的な携行用品 | 使う場面と手持ち品を確認してから選ぶ | 1 |
| pet-food | 普段食べているペットフード | 普段の種類・容量と手持ちを照合 | 1 |
| pet-water | ペット用の飲水容器・給水用品 | 使い慣れた容器と持ち出し方法を確認 | 1 |
| pet-toilet | 種類に合うシーツ・猫砂・処理用品 | 普段のトイレ用品と処理方法を確認 | 1 |
| pet-carrier | キャリー・移動用具 | 動物が使えるサイズと移動方法を確認 | 1 |
| long-life-food（ローリングストック） | 普段食べる保存食 | 期限を確認し、食べ慣れたものから補充 | 1 |
| water（ローリングストック） | 保存水 | 登録した期限と容器の表示を照合 | 1 |
| toilet（ローリングストック） | 携帯トイレ用品 | 登録品の残量・期限を確認 | 1 |
| toilet（携帯トイレ計算） | 携帯トイレ一式 | 必要回数と手持ちの回分を確認 | 1 |
| toilet-coagulant | 携帯トイレ用凝固剤 | 袋との対応と使用回数を確認 | 1 |
| toilet-bag | 携帯トイレ用処理袋・消臭袋 | 凝固剤との組み合わせと保管期限を確認 | 1 |
| baby-supply | 普段使う赤ちゃん用品 | 不足がある用品だけ、家庭の使い方に合う表示を確認 | 1 |
| cassette-gas | カセットボンベ | 器具との適合・保管条件・期限を確認 | 1 |
| long-life-food（食品選びガイド） | 食べ慣れた保存食 | 手持ちと期限を確認して必要分だけ検討 | 1 |
| toilet（携帯トイレガイド） | 携帯トイレ一式 | 回数表示と処理方法を確認 | 1 |
| water（水ガイド） | 保存水・用途に合う水容器 | 手持ちの量と保存条件を確認 | 1 |
| go-bag | 家族が持ち運べる袋・整理用品 | 実際に持てる重さと取り出しやすさを確認 | 1 |
| pet-supply | ペットの普段の用品 | 種類・サイズを変えず、獣医師の指示も確認 | 1 |
| lighting-battery | 照明・予備電池・携帯電源 | 機器に合う電池・端子・保管条件を確認 | 1 |

tools/rolling-stock/index.html の3枠は現状、JSON の保存・移行説明の後で、期限や残量を確認する箇所から離れています。場所を動かす変更はこの Issue の範囲外です。購入文脈の隣へ移す別 Issue ができるまでは、そこへリンクを実装しない案です。tools/ensei-hi/index.html の汎用枠にもカテゴリや根拠がないため保留します。

## 6. 最初に埋める優先順位

Search Console の実データは未確認です。検索流入や売上は予測しません。計算結果に具体的な不足が出て、対応カテゴリが一致する枠を優先します。

1. tools/toilet-bichiku/index.html の toilet — 必要回数・不足数の計算直後で、商品表示の「何回分」と入力値を照合しやすい。
2. 同ファイルの toilet-coagulant — 凝固剤の使用回数を確認する流れに続き、袋との組み合わせ条件も説明済み。
3. 同ファイルの toilet-bag — 処理袋の組み合わせ・保管期限を見直す箇所に続く。
4. tools/baby-bichiku/index.html の baby-diaper — 普段のサイズ・使用量・手持ちの不足を分けて確認できる。授乳方法や健康判断へ誘導しない。
5. tools/pet-bichiku/index.html の pet-food — 普段の使用量と指定日数から出た値を製品容量・期限と比べられる。療法食などの変更は勧めない。

不足がゼロなら買い足しを促しません。上限は各枠1リンクで、比較表・ランキング・価格表示を設けません。

## 7. 承認後の実装チェックリスト案

- [ ] 申請・承認状態と対象サイトを確認し、各リンクを Amazon の公式リンク作成手段で取得する。アソシエイトIDを複数ページへ手入力せず、1箇所の設定値から出力する。
- [ ] Amazon の所定表示をサイト共通の見やすい場所と affiliate 枠の近くに置き、消費者庁 Q&A の観点でサイズ・色・読みやすさを確認する。
- [ ] プライバシーポリシーへ第三者広告・リンク・Cookieその他の利用実態を記載する。計測・Cookie構成を確認してから文言を決める。
- [ ] アフィリエイトリンクに rel="sponsored" があること、割り当てられたIDを含む公式リンクであること、リンク先と案内文が一致することを lint またはレビューで確認する。
- [ ] 初回実装では価格・在庫・レビュー・星評価・商品画像を独自に表示しない。将来 API を使う場合は利用資格、表示条件、更新頻度、日時、免責、画像保存制限を現行ライセンスで再確認する。
- [ ] 自己購入・知人への購入依頼、参照元を隠す転送、期限切れセール表示、根拠のない売れ筋・効果の断定がないことを確認する。
- [ ] 各枠の件数が上限内であり、hotel / travel / 汎用枠へ未決定の広告が出ないことを確認する。

## 8. ユーザー側でしか決められない事項

- 申請時期は「検索流入が出始めてから」と決定済みです。実際の Search Console 値を見て申請日を決めます。
- Amazon 表示文の [サイト名] に入れる運営者名・サイト名表記。
- hotel と travel の予約枠を Amazon 以外の提携プログラムで埋めるか、広告なしにするか。
- 優先5枠の後に残りの枠も埋めるか。tools/rolling-stock の3枠と汎用枠を移動・分類する場合は別の変更範囲として決めます。
- 各枠1リンクの上限案を採用するか。承認後の初回実装ではこの案を既定とします。
