# 備蓄場所メモの次に強化する既存ページ候補

調査日: 2026-10-16

この調査は、Issue #95 の依頼に沿って、Issue #87 の上位三候補を実装した後の優先順位を見直すものです。目標は「検索から独自の役立つ内容へ進み、Amazon アソシエイト承認後には不足確認と一致する一般カテゴリを案内できる」流れです。Search Console と販売の実測値は手元にないため、検索量・順位・流入・収益は推定しません。購入効果はページ内の内容と既存の data-category の位置から行う定性的な評価で、効果の保証ではありません。

方針の参照: [2026-10-strategy.md](https://github.com/supportapp3-lab/kasegu-tools/blob/main/docs/research/2026-10-strategy.md)、[前回候補の調査（#87）](https://github.com/supportapp3-lab/kasegu-tools/blob/main/docs/research/2026-10-post-food-compare-candidates.md)、[技術SEO・重複・内部リンク監査（#54）](https://github.com/supportapp3-lab/kasegu-tools/blob/main/docs/research/2026-10-seo-audit.md)、[affiliate 枠設計](https://github.com/supportapp3-lab/kasegu-tools/blob/main/docs/research/2026-10-affiliate-slot-design.md)。#87 の上位案は実装済みであるため、それらを未着手として再提出しません。#54 が指摘する同一検索意図の重複を避け、現行の main にあるセクション・FAQ・data-category の位置を確認しました。

## 1. 前回調査以降の実装の棚卸し

前回の調査文書 #87 の第1章にある全候補を、main の HTML と該当 Issue / PR の状態で再確認しました。表中の位置関係は HTML の並び順です。

| #87 の候補 | 状況 | main の HTML で確認した内容と affiliate 枠の位置 |
|---|---|---|
| 携帯トイレの箱表示照合カード | 実装済み（Issue #79 / PR #80、マージ済み） | guides/keitai-toilet-bichiku の #box-memo に箱の表示を書き写す表があり、#faq に FAQ があります。#purchase-check の後に data-category="toilet" の枠があります。 |
| ペット同行避難の持ち出し・連絡カード | 実装済み（Issue #81 / PR #82、マージ済み） | guides/pet-bousai-bichiku の #pet-record に記録表があり、#faq に FAQ があります。記録・購入前確認の後に data-category="pet-supply" があります。 |
| 乳幼児用品のセット点検表 | 実装済み（Issue #83 / PR #84、マージ済み） | guides/baby-bousai-bichiku の #set-check にセット点検表があり、#faq に FAQ があります。点検表と購入前確認の後に data-category="baby-supply" があります。 |
| 備蓄品の置き場所・取り出し記録 | 実装済み（Issue #93 / PR #94、マージ済み） | guides/rolling-stock-hajimekata の既存 #places 内に引き継ぎ表があり、#faq に FAQ があります。ページ内に data-category はありません。表の前後に期限管理と量の確認に使う既存ツールへのリンクがあります。 |
| 明かり・予備電源の機器適合メモ | 中心機能は既存実装済み。追加案は見送り | guides/teiden-sonae に #match-check の照合表と #buy-check があり、その後に data-category="lighting-battery" があります。容量から使用日数や充電回数を推定しない注意があります。 |
| 持ち出し袋の中身と持てるかの確認カード | 実装済み（Issue #91 / PR #92、マージ済み） | guides/mochidashi-bukuro の #carry-check に運搬確認表があり、#faq に FAQ があります。#buy-check の後に data-category="go-bag" があり、その後に #place、#carry-check、#review が続きます。 |
| 住所別ハザード・避難先確認ログ | 未実装・保留 | guides/hazard-map-hinan に #portal、#places、#route、#family の説明がありますが、新しい記録表はありません。data-category はありません。既存の公式情報の案内と家庭別判断の境界を重ねない必要があります。 |
| 家族の災害時連絡・集合先カード | 未実装・保留 | guides/saigai-dengon-171 の #meeting が集合場所と連絡方法を扱い、#faq に提供条件の FAQ があります。data-category はありません。既存説明との重複と個人情報の扱いが課題です。 |
| 家庭の食べやすさ・調理条件の照合表 | 実装済み（Issue #85 / PR #86、マージ済み） | guides/hijoushoku-erabikata の #food-compare に購入候補の記入表があり、#faq に FAQ があります。#purchase-check の後に data-category="long-life-food" があります。 |
| カセットコンロとボンベの保管・説明書照合 | 新しい表は未実装。追加案は見送り | guides/cassette-bombe-bichiku に #stock-count、#buy-check、#dates、#safety があり、#buy-check の後に data-category="cassette-gas" があります。既存の説明書・表示・安全確認と重なる表は追加しません。 |

## 2. 既存ページ強化の候補

対象は公開済みの tools/ または guides/ の既存 URL のみです。検索語は検討用の「例」で、Search Console で確認した実検索語ではありません。数値の目安・期間・容量は新たに提案しません。公式出典欄の「数値出典なし」は、仕様に新しい数値を使わない意味です。

| 対象ページと読者の疑問 | 独自の価値 | 購入の流れへの効果 | 作業量 | 数値根拠となる公式出典 | 重複・食い合い（#54 の観点） | Amazon の一般カテゴリ | 安全・健康・方針 |
|---|---|---|---|---|---|---|---|
| [tools/bichiku](https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/)。「例：防災備蓄 計算結果 手持ち 比較 メモ」 | 計算結果と、現物を確認した手持ち・製品表示を同じ紙面で照合する空欄シート。ツールに保存機能を加えず、家族で確認した結果を残せる。 | 高。既存の「足りないものだけ補充」説明と water / toilet / food の枠が計算結果の後にある。不足が確認された場合だけ、該当カテゴリを見返せる。 | 小。HTML 1 ファイルに空欄表と FAQ。JS なし。 | 数値出典なし。入力結果と現物だけを記録し、標準量は追加しない。 | #54 は tools/bichiku を数量計算、関連記事を備蓄全般の説明とする役割分けを指摘。計算式・早見表・既存チェックリストを再掲せず、実物照合だけに限定する。 | water、toilet、food。既存枠の範囲内。 | 健康状態や必要量を判定しない。表示結果をそのまま購入数とせず、現物・製品表示を確認する既存方針を保つ。 |
| [tools/pet-bichiku](https://supportapp3-lab.github.io/kasegu-tools/tools/pet-bichiku/)。「例：ペット 備蓄計算 結果 手持ち フード 照合」 | ペットごとの結果を、普段使う製品・確認済みの手持ち・表示容量へ書き分ける。異なるフードを一括扱いしないための家庭内記録になる。 | 中。結果直後に pet-food / pet-water / pet-toilet / pet-carrier の枠がある。実際に不足したカテゴリだけ検討できるが、関連ガイドに在庫・記録の説明があるため追加価値は限定的。 | 小。HTML 1 ファイルに空欄表と FAQ。JS と保存機能は追加しない。 | 数値出典なし。入力者の普段の量・日数と製品表示だけを使い、獣医療上の量は扱わない。背景の公式案内は[環境省のペット災害対策](https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html)。 | tools/pet-bichiku は個別入力と計算、guides/pet-bousai-bichiku は備蓄・持ち出しの説明という役割を保つ。既存 #stock と #pet-record の内容を再掲しない。 | pet-food、pet-water、pet-toilet、pet-carrier。既存枠の範囲内。 | 健康・獣医療に関わる。療法食や飲水量を推奨・変更せず、普段の量と獣医師の指示を優先する。 |
| [tools/baby-bichiku](https://supportapp3-lab.github.io/kasegu-tools/tools/baby-bichiku/)。「例：赤ちゃん用品 備蓄計算 手持ち 製品表示 照合」 | 計算した結果、現物の在庫、製品表示を一緒に見直す記入欄。商品や授乳方法の適合を決めず、確認漏れを見つける。 | 中。結果の後に baby-milk / baby-diaper / baby-wipe / baby-food の枠がある。手持ちと不足を確認した後に該当カテゴリへ進めるが、guides/baby-bousai-bichiku の #set-check と重なる。 | 中。HTML 1 ファイルに表・FAQ・ナビ項目。JS は不要だが、既存セット点検との役割を明示する必要がある。 | 数値出典なし。新しい数量・日数・授乳量は扱わない。背景の家庭別確認先は[男女共同参画局の備蓄チェックシート](https://www.gender.go.jp/policy/saigai/shishin/pdf/shishin_bichiku_checksheet.pdf)。 | tools/baby-bichiku は入力した量と実在庫の確認、guides/baby-bousai-bichiku の #set-check は用品を使うための構成確認に限定する。 | baby-milk、baby-diaper、baby-wipe、baby-food。既存枠の範囲内。 | 乳幼児の栄養・健康に関わる。粉ミルクの調乳、授乳法、年齢別必要量を独自に案内せず、製品表示・専門家・公的案内を優先する。 |
| [tools/rolling-stock](https://supportapp3-lab.github.io/kasegu-tools/tools/rolling-stock/)。「例：期限管理 補充 在庫 確認」 | 現物を見て登録を更新し、補充する品目と理由を記録する補助欄。 | 低。期限・残量の確認後に長期保存食、水、携帯トイレの枠がすでに並び、「不足がなければ購入不要」と明記されている。新しい枠や記録は効果が薄い。 | 小。ただし既存の案内と重複するため、追加を推奨しない。 | 数値出典なし。製品表示の日付だけを扱う。食品表示は[消費者庁の期限表示資料](https://www.no-foodloss.caa.go.jp/digitalbook/2025/pageindices/index55.html)が既存ページに掲載されているが、新しい日数は使わない。 | #54 の役割分担どおり、tools/rolling-stock は登録・期限一覧、guides/rolling-stock-hajimekata は使う・買い足す手順。現状の購入前確認ですでに足りる。 | long-life-food、water、toilet。既存枠。 | 期限表示は食品の安全性を自動判定しない既存方針を維持する。 |
| [tools/toilet-bichiku](https://supportapp3-lab.github.io/kasegu-tools/tools/toilet-bichiku/)。「例：携帯トイレ 必要回数 手持ち 箱表示 比較」 | 製品の回分表示と手持ちを記録する余地はあるが、ツールが在庫・箱あたり回数・不足をすでに入力させ、表示する。 | 低。toilet / toilet-coagulant / toilet-bag の枠は必要回数と在庫結果の後にある。候補は現行の計算と購入前確認に重なる。 | 小。ただし追記を推奨しない。 | 数値出典なし。既存ツールの数値や公的目安を増やさない。 | guides/keitai-toilet-bichiku の #box-memo が箱表示を書き写すため、もう一つの照合表は食い合う。 | toilet、toilet-coagulant、toilet-bag。既存枠。 | 衛生・災害時の排水と廃棄に関わる。自治体・管理者・製品表示を優先し、使用可否を判定しない。 |
| [guides/cassette-bombe-bichiku](https://supportapp3-lab.github.io/kasegu-tools/guides/cassette-bombe-bichiku/)。「例：カセットコンロ ボンベ 適合 表示 確認」 | 型番・製品表示・説明書を見比べた結果を利用者が残す独自性はあるが、現行ページに同目的の確認がある。 | 低。cassette-gas 枠は購入前確認の後にあるが、独立表を追加する根拠が弱い。 | 小の表でも安全確認のレビューが必要。 | 数値出典なし。数値や寿命を追加しない。背景資料として[消費者庁の使用上の注意](https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_063)を確認する。 | #stock-count、#buy-check、#dates、#safety がすでに在庫・購入前・表示・安全を扱う。新表は重複が高い。 | cassette-gas。既存枠。 | 火気・一酸化炭素等の危険がある。適合や保管の独自判断をせず、取扱説明書・メーカー表示・消費者庁の注意を優先する。 |
| [guides/hazard-map-hinan](https://supportapp3-lab.github.io/kasegu-tools/guides/hazard-map-hinan/)。「例：ハザードマップ 確認日 避難先 家族」 | 参照した自治体地図の名称、確認日、家族で話した避難先を控える記録には価値がある。公式地図自体の解説を模倣しない。 | 低。関連する商品カテゴリは確認できず、購入の流れにはつながらない。 | 小。記録表・FAQを追加するなら HTML のみ。ただし安全境界のレビューが必要。 | 数値出典なし。特定住所の判断をせず、[国土地理院のハザードマップポータル](https://disaportal.gsi.go.jp/)と自治体の最新情報を参照する。 | 現行 #portal、#hazards、#places、#route、#family、#timing がすでに公式地図・避難先・経路を案内する。 | 自然なカテゴリなし。商品枠を新設しない。 | 生命安全に関わる。地図の色・住所・経路から安全を判定せず、自治体情報や災害時の指示を置き換えない。 |
| [guides/saigai-dengon-171](https://supportapp3-lab.github.io/kasegu-tools/guides/saigai-dengon-171/)。「例：災害 家族 集合場所 連絡先 メモ」 | 家庭内で集合場所・連絡方法・確認先を控える記録には独自性があるが、既存 #meeting が連絡と集合を説明している。 | 低。自然な一般商品カテゴリがなく、購入の流れへつなげる根拠はない。 | 小。ただし個人情報をサイトへ送らない条件が要る。 | 数値出典なし。提供条件は[NTT東日本の災害用伝言ダイヤル案内](https://www.ntt-east.co.jp/saigai/voice171/)など提供元の最新案内に従う。 | #meeting と既存 FAQ が主な情報を扱う。追加するなら家庭内で一致を確認するだけに限定する。 | 自然なカテゴリなし。商品枠を新設しない。 | 個人情報・安否に関わる。公開フォーム、送信、クラウド保存を追加しない。通信サービスの条件を独自に決めない。 |

## 3. 効果と作業量の比較

この順位は実測成果の予測ではありません。購入判断までの距離、独自の現物照合が残るか、data-category が文脈に合うか、既存ページとの差、変更の小ささで比較しています。

| 順位 | 候補 | 購入効果 | 作業量 | 比較結果 |
|---|---|---|---|---|
| 1 | tools/bichiku の計算結果・現物照合シート | 高 | 小 | 計算結果の直後に既存の water / toilet / food 枠があり、実際の手持ちと比べた後に不足分だけ検討できる。計算機能を重複させず、記録という独自価値が残る。 |
| 2 | tools/pet-bichiku のペット別照合シート | 中 | 小 | 結果のすぐ後にペット用品のカテゴリがある。個体ごとの記録が価値。ただし既存ガイドに在庫確認があるため、表を計算結果と製品表示の照合だけに絞る必要がある。 |
| 3 | tools/baby-bichiku の計算結果・製品表示の照合欄 | 中 | 中 | 結果後の用品カテゴリと近いが、既存のセット点検表に近い。セットの構成を繰り返さず、計算値・手持ち・製品表示の記録だけに限る場合に候補となる。 |
| 4 | tools/rolling-stock の補充記録 | 低 | 小 | 補充前の注意と三つの既存カテゴリがすでに隣接し、追加価値が薄い。変更しない判断が妥当。 |
| 5 | tools/toilet-bichiku の箱表示記録 | 低 | 小 | 手持ち・箱あたり回分・不足を計算し、関連ガイドにも箱表示表があるため重複する。 |
| 6 | guides/cassette-bombe-bichiku の適合記録 | 低 | 小 | 既存の購入前・表示・安全確認と重複し、危険のある用途の表現確認も要る。 |
| 7 | guides/hazard-map-hinan の家庭内確認記録 | 低 | 小 | 独自記録の余地はあるが、購入関連カテゴリがなく、安全判断を代替できない。 |
| 8 | guides/saigai-dengon-171 の連絡・集合確認欄 | 低 | 小 | 購入カテゴリとの接点がなく、現行 #meeting と重なる。 |

### 上位を選ぶ理由

- **tools/bichiku** は計算結果と実際の備蓄を照合する既存の説明・購入枠が揃っています。計算値の追加ではなく、確認した内容を家族内で残せる点に独自価値があります。不足が分からない段階で商品枠へ進ませない設計にできます。
- **tools/pet-bichiku** は個体ごとの入力と結果があるため、異なる製品・用途の在庫をまとめずに記録できます。一般向けカテゴリを結果と同じ画面で確認できます。ただし健康判断の用途に広げず、普段使う製品表示との照合に限定します。
- **tools/baby-bichiku** は計算結果と用品別のカテゴリがあります。既存ガイドのセット点検表を繰り返さず、計算結果と現物・製品表示を照合する記録だけに絞れる場合に限り候補です。医療・栄養判断を追加せず、小規模な表と FAQ で済みます。

## 4. 上位候補の実装仕様案

以下は個別の実装 Issue にできる仕様案で、この調査では実装しません。新しい数量・回数・日数・期限を表や例に入れません。記入欄は空欄とし、既存の affiliate 枠は追加・移動せず、見つかった不足に一致するカテゴリのみを任意で確認する流れにします。

### A. 防災備蓄ツールの計算結果と手持ちの照合

- **対象ファイル:** tools/bichiku/index.html のみ。
- **位置・見出し:** 新しい section id="stock-reconcile"、見出し「計算結果と手持ちの備えを照合する」。#checklist と #faq の間に挿入し、section-nav に「手持ちとの照合」リンクを追加する。
- **表:** 列名は「品目」「画面の計算結果」「家で確認した在庫」「製品表示・単位」「不足の確認」「確認メモ」。全欄を空欄とし、標準値や記入例の数量を入れない。表の前後に「現物と表示を確認し、不足がなければ購入しない」と説明する。
- **FAQ案:** Q「計算結果はそのまま購入する数量ですか？」 A「いいえ。計算結果は入力した人数と日数に基づく目安です。家にある使える在庫と製品表示を確かめ、不足がある場合に家庭の状況に合わせて検討してください。この記入欄は在庫や商品の適否を自動判定しません。」
- **内部リンク:** 既存の備蓄品の期限管理ツール、携帯トイレの箱表示ガイド、非常食の選び方ガイドへの既存リンクを確認する。新しい URL は作らない。
- **数値・公式出典:** 新しい数値を使わない。入力結果を転記する空欄のみ。数値出典なし。食品の背景案内は[農林水産省の食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)を参照先として使えるが、その数値を表へ転載しない。
- **既存カテゴリ:** data-category="water" / "toilet" / "food" の位置・属性は維持し、枠を増やさない。
- **変更しない範囲:** JS の計算式、入力・結果、保存機能、標準量、商品情報、価格、健康判断。
- **完了条件・テスト案:** 新規 HTML 節とナビ・FAQ 本文／JSON-LD が一致する。空欄表にサンプル数量がない。既存 data-category の数と位置、内部リンク、ID 重複、lint、全テストを確認する。

### B. ペット備蓄計算の個体別・現物照合

- **対象ファイル:** tools/pet-bichiku/index.html のみ。
- **位置・見出し:** 新しい section id="pet-stock-reconcile"、見出し「計算結果をペットごとの在庫と照合する」。#checklist の後、#evacuation の前に挿入し、section-nav にリンクを追加する。
- **表:** 列名は「家庭内で分かる呼び名」「用品の種類」「画面の計算結果」「現物の在庫」「製品表示で確認した容量・条件」「確認メモ」。名前や数量は記入例を入れず、共有前に個人情報を見直す注意を添える。
- **FAQ案:** Q「計算結果に合わせてフードや飲水量を変更しますか？」 A「いいえ。このツールは入力された普段の量を日数分に換算するもので、健康上の適切な量や製品の適合を判定しません。療法食、持病、食事や飲水への不安がある場合は、自己判断で変更せず獣医師へ相談してください。」
- **内部リンク:** 既存の guides/pet-bousai-bichiku/#stock と tools/rolling-stock/ を参照する。個体別の備蓄と期限管理の役割を分け、新しい URL は作らない。
- **数値・公式出典:** 新しい数値を使わない。普段の量・画面結果・手持ちを空欄で記録する。数値出典なし。公的な同行避難の案内は[環境省のペット災害対策](https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html)を確認先にする。
- **既存カテゴリ:** pet-food / pet-water / pet-toilet / pet-carrier を追加・移動しない。
- **変更しない範囲:** 計算 JS、保存・共有 URL、獣医療の助言、療法食の変更、品種や体重からの推奨、商品名・価格。
- **完了条件・テスト案:** 表は記録用であり、サイトへ入力送信・保存しないことを説明する。FAQ 本文と JSON-LD の一致、ナビ、カテゴリ位置、ID 重複、lint、全テストを確認する。

### C. 乳幼児備蓄計算の結果と表示照合

- **対象ファイル:** tools/baby-bichiku/index.html のみ。
- **位置・見出し:** 新しい section id="baby-stock-reconcile"、見出し「計算結果と手持ちの用品を照合する」。#checklist と #faq の間に挿入し、section-nav にリンクを追加する。
- **チェック欄:** 「用品の種類」「画面の計算結果」「家にある在庫」「製品表示で確認した内容」「確認が必要なこと」「見直しメモ」。空欄のみとする。既存の #set-check にあるセット構成項目を再掲しない。
- **FAQ案:** Q「画面に出た量は、授乳方法や必要量を決めるものですか？」 A「いいえ。入力値に基づく計算結果であり、授乳方法、栄養、年齢に応じた必要量や商品の適合を判断しません。製品表示と公的な案内を確認し、個別の健康・栄養の判断は専門家へ相談してください。」
- **内部リンク:** 既存 guides/baby-bousai-bichiku/#set-check と tools/rolling-stock/ を確認先として維持する。新しい URL は作らない。
- **数値・公式出典:** 新しい数量・日数・期間を使わない。数値出典なし。家庭ごとの備え項目は[男女共同参画局の備蓄チェックシート](https://www.gender.go.jp/policy/saigai/shishin/pdf/shishin_bichiku_checksheet.pdf)を参考にできるが、同シートの数量は転記しない。
- **既存カテゴリ:** baby-milk / baby-diaper / baby-wipe / baby-food の位置・属性を維持する。
- **変更しない範囲:** JS、計算式、授乳・健康助言、粉ミルクの調乳方法、商品名・価格・広告リンク。
- **完了条件・テスト案:** 既存ガイドとの役割分担、空欄表示、FAQ 本文／JSON-LD の一致、ナビ、カテゴリ位置、ID 重複、lint、全テストを確認する。

## 5. 見送る候補と理由

Search Console で表示回数や検索語が確認できるまで、新規 URL の案は出さず、公開済みのページだけを対象にします。新規ページは既存ページとの役割重複を判定できる検索データがなく、今作る優先性を裏付ける根拠がありません。

- guides/teiden-sonae は #match-check と #buy-check、lighting-battery 枠で中心課題を扱っているため、同じ照合表を増やしません。
- guides/mochidashi-bukuro、guides/mizu-kumioki-bichiku、guides/rolling-stock-hajimekata は #87 の上位案として実装済みです。現行の記入表の改善要望や実測データがない段階で、類似の表を追加しません。
- guides/keitai-toilet-bichiku、guides/pet-bousai-bichiku、guides/baby-bousai-bichiku、guides/hijoushoku-erabikata には、前回候補の箱表示・持ち出し・セット点検・比較の成果があります。計算機側に同じ表を複製しません。
- guides/cassette-bombe-bichiku は購入前確認と安全説明の重なりが大きく、火気に関する適合・保管を一般化するリスクがあります。
- guides/hazard-map-hinan と guides/saigai-dengon-171 は公共の安全・連絡情報を扱います。購入カテゴリとの関係が弱く、地域や提供条件の独自判定を避けるため、現時点では表を増やしません。
- tools/rolling-stock と tools/toilet-bichiku の既存出力・確認・カテゴリ配置は、補充判断の入口をすでに持ちます。重複するチェックリストを増やすより、現状を維持します。

新しい情報を公開する前に、実際の検索クエリとページの役割を照合します。候補に示したのは実装案であり、Search Console の結果や売上予測ではありません。

## 6. Search Console の実データが入ったら見直す点

- ページと実際の検索クエリを対応づけ、候補欄の「例」と実検索語を区別する。表示が少ないというだけで需要なしと断定しない。
- tools/bichiku、tools/pet-bichiku、tools/baby-bichiku のどのページが表示されたかを確認し、計算・現物照合・用品構成の役割が検索語と合うか調べる。
- #54 の候補群について、同一クエリに複数 URL が表示されているか確認する。重なりが見られた場合は、追加表ではなく title・導入・内部リンク・既存ページの役割を見直す。
- 既存ページを更新した場合は変更日と具体的な内容を記録し、後から同じ範囲の表示・クリック・訪問の変化を比較する。少ない観測や短い期間を成果の因果と断定しない。
- Search Console がまだ使えない場合は、候補を増やす作業を保留し、実測データがないことを維持する。

### 確認した公式資料

以下は内容を実際に開いて確認した公式資料です。出典のない目安・数値は候補仕様へ転載していません。

- [農林水産省：災害時に備えた食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)
- [消費者庁：携帯発電機・カセットこんろ・モバイルバッテリーの使用上の注意](https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_063)
- [男女共同参画局：備蓄チェックシート](https://www.gender.go.jp/policy/saigai/shishin/pdf/shishin_bichiku_checksheet.pdf)
- [環境省：ペットの災害対策](https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html)
- [国土地理院：ハザードマップポータルサイト](https://disaportal.gsi.go.jp/)
- [NTT東日本：災害用伝言ダイヤル](https://www.ntt-east.co.jp/saigai/voice171/)
- [農林水産省：備蓄食品の収納テクニック](https://www.maff.go.jp/j/zyukyu/foodstock/chapter09.html)

リポジトリ内の調査資料は GitHub の本文を読み、記載の公式 URL をたどって確認しています。公式資料は数値の転記先ではなく、内容や安全上の境界を確認する一次情報として使っています。
