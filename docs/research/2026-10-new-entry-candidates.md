# 新しい検索入口になる計算ツール候補

調査日: 2026-10-16（日本時間）

## 結論と調査の範囲

次の検証対象は **A: 停電時に使う機器の電力量を利用者の実機表示から整理するツール** と **B: 家庭が自分で決めた特別な食品の目標在庫と現物との差を確認する既存ツール機能** の二つです。Aは購入意図との近さがある一方、同種計算機が検索結果に複数あり、容量・使用時間の結果が実際の使える時間や安全を保証しないため、競争と安全の確認を前提とします。Bは需要の根拠を数量予測ではなく公的ガイドの対象者別ニーズと既存計算機能との隙間に置きます。Bではサイトが食事量や医学的な目標を決めず、本人が決めた在庫目標との差だけを表示します。

これは検索結果の質的確認と現在のサイト棚卸しに基づく編集判断です。Search Consoleの流入・クリック、売上、転換率の実測はありません。検索結果はこの調査の実施環境で、検索結果ページや検索結果に現れたサイトの内容を確認しただけです。一般的な検索結果や需要を示すものではありません。有料SEOツールは使っていません。アソシエイトは未承認で、商品名、価格、レビュー、商品リンクは扱いません。実装前の提案であり、この文書以外の変更は含めません。

## 現行ページの棚卸し

以下は2026-10-16にmainのHTMLを見て、各ページが現在答える中心的な問いを一行にまとめたものです。ここにない機能や実測成果があるとは扱いません。

### 6つの計算ツール

| ページ | 現在答えている問い |
|---|---|
| [tools/bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/bichiku/index.html) | 家族の人数と日数から飲料・調理用水、携帯トイレ、主食の目安を計算し、手持ちと照合する。 |
| [tools/pet-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/pet-bichiku/index.html) | ペットの普段の量、頭数、日数からフード・水・トイレ用品を計算する。 |
| [tools/baby-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/baby-bichiku/index.html) | 乳幼児の普段の使用量、人数、日数からミルク・おむつ等を計算する。 |
| [tools/toilet-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/toilet-bichiku/index.html) | 人数と日数、手持ちの回分、箱あたり回分から携帯トイレの不足と箱数を計算する。 |
| [tools/rolling-stock](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/rolling-stock/index.html) | 備蓄品の期限・残量一覧を管理し、一覧を保存・復元する。 |
| [tools/ensei-hi](https://github.com/supportapp3-lab/kasegu-tools/blob/main/tools/ensei-hi/index.html) | 入力した交通・宿泊・参加・自由費目の金額から遠征費の合計と予算との差を計算する。 |

### 24のガイド

| ページ | 現在答えている問い |
|---|---|
| [guides/baby-bousai-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/baby-bousai-bichiku/index.html) | 乳幼児の備え、授乳・用品の確認、セット点検をどう行うか。 |
| [guides/bichiku-nannichibun](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/bichiku-nannichibun/index.html) | 家庭の備蓄日数と水・食料等の量をどう考えるか。 |
| [guides/bousai-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/bousai-bichiku/index.html) | 家庭の条件に沿って防災用品の準備をどう始めるか。 |
| [guides/cassette-bombe-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/cassette-bombe-bichiku/index.html) | カセットコンロ・ボンベの在庫、表示、保管、安全をどう確認するか。 |
| [guides/ensei-hi](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/ensei-hi/index.html) | 遠征にかかる費用をどう整理するか。 |
| [guides/hazard-map-hinan](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/hazard-map-hinan/index.html) | 公式ハザード情報、避難場所、経路をどう調べるか。 |
| [guides/hijoushoku-erabikata](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/hijoushoku-erabikata/index.html) | 家族が食べられる非常食と調理条件をどう比較するか。 |
| [guides/jishin-sokugo-kodo](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/jishin-sokugo-kodo/index.html) | 地震直後に身を守り、状況を見て行動する手順は何か。 |
| [guides/kagu-tentou-boushi](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/kagu-tentou-boushi/index.html) | 家具の転倒や落下による危険をどう減らすか。 |
| [guides/kanshin-breaker](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/kanshin-breaker/index.html) | 感震ブレーカーの種類と住まいに合う確認事項は何か。 |
| [guides/keikai-level](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/keikai-level/index.html) | 警戒レベルや気象情報をどう読み、公式避難情報を確認するか。 |
| [guides/keitai-toilet-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/keitai-toilet-bichiku/index.html) | 携帯トイレを備え、箱の回分表示や使用後の扱いをどう確認するか。 |
| [guides/mizu-kumioki-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/mizu-kumioki-bichiku/index.html) | 水のくみ置き・保管・用途をどう確認するか。 |
| [guides/mochidashi-bukuro](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/mochidashi-bukuro/index.html) | 持ち出し袋の中身、在庫、置き場所、実際に運べるかをどう見直すか。 |
| [guides/pet-bousai-bichiku](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/pet-bousai-bichiku/index.html) | ペットとの同行避難、備蓄、連絡・持ち出し記録をどう準備するか。 |
| [guides/rolling-stock-hajimekata](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/rolling-stock-hajimekata/index.html) | ローリングストックを日常の購入・消費・補充にどう組み込むか。 |
| [guides/saigai-dengon-171](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/saigai-dengon-171/index.html) | 災害用伝言ダイヤルの公式手順と家族の集合・連絡方法をどう確認するか。 |
| [guides/shachuhaku-hinan](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/shachuhaku-hinan/index.html) | 車中泊避難の健康・寒さ・換気などの危険をどう避けるか。 |
| [guides/teiden-sonae](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/teiden-sonae/index.html) | 停電の備え、機器・端子・表示の照合、購入前の安全確認をどうするか。 |
| [guides/tsunami-hinan](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/tsunami-hinan/index.html) | 津波警報時に公式情報に従って避難するにはどうするか。 |
| [guides/tsuuden-kasai](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/tsuuden-kasai/index.html) | 停電後の通電火災を避けるため何を確認するか。 |
| [guides/yukimichi-tachioujou](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/yukimichi-tachioujou/index.html) | 大雪で道路に滞留したときの安全・連絡・物資をどう考えるか。 |
| [guides/yukioroshi-jiko-boushi](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/yukioroshi-jiko-boushi/index.html) | 屋根の雪下ろしに伴う事故をどう防ぐか。 |
| [guides/zaitaku-hinan](https://github.com/supportapp3-lab/kasegu-tools/blob/main/guides/zaitaku-hinan/index.html) | 在宅避難できる条件を公式情報と照らし、家庭の物資をどう備えるか。 |

## 候補の比較

見込みは検索流入の実測値ではなく、公式機関が対象の備えを扱っているか、季節・目的の明確さ、既存ページとの近さ、調査時に確認した検索結果の競争を合わせた編集上の仮説です。「高」は需要量ではなく、公式・季節・既存意図によるテーマの関連性が相対的に強いという意味です。検索結果に専門サイトやツールがあった場合も、競合不在を主張しません。

| 候補と答える問い | 重複・食い合い | 購入検討につながる一般カテゴリ案 | 計算に使える一次資料・数値の扱い | 安全・誤用リスクと必要な注意 | 作業量 | 検索流入見込みの根拠 |
|---|---|---|---|---|---|---|
| A. 停電時に使いたい機器の電力量を整理すると、入力した使い方は何Whになるか | guides/teiden-sonae の #match-check と #buy-check は既に機器の表示・端子・購入前確認を扱うが、日々の負荷を合算する計算機能は未確認。ページ群で停電の基礎説明が重なるため、機器名・実機のW表示を使う表計算に限定する。検索結果では複数の容量計算ツールが見つかり競争は強い。 | 新しい `portable-power`（既存 data-category にないため追加承認が必要）。停電対策用品やポータブル電源。ただし既存ガイドの `lighting-battery` 枠を流用しない。 | Goal Zero の[メーカー説明](https://help.goalzero.com/hc/en-us/articles/38587553528987-How-long-will-the-Yeti-run-my-device)は、機器の電力と蓄電池のWhで稼働時間が変わることを説明。式のW×時間は入力時間に基づく理想的負荷の合算で、実際の使用時間や必要な製品容量はメーカー実測・変換損失・条件が異なる。安全上の根拠は[NITEの停電時の電源・通電火災注意](https://www.nite.go.jp/jiko/chuikanki/press/2024fy/prs240827.html)。 | 過大な期待・誤った機器選択・火災・感電。結果を必要購入容量や稼働時間と呼ばない。実機銘板・説明書、定格出力、瞬間出力、端子、メーカー注意を別々に確認し、医療機器や生命維持装置の判断、発電機の使用場所判断をしない。 | 中〜大 | **中**。経産省・NITEが停電時の電源安全を案内し、検索結果にも複数の容量計算ツールがあり意図の存在は見える。一方で類似ツールが既にあり、流入獲得を予測できない。 |
| B. 家庭が自分で決めた特別な食品の備えについて、目標在庫と現在庫との差はいくつか | tools/bichiku は家族人数から水・トイレ・主食を算出し手持ち照合もある。guides/hijoushoku-erabikata は非常食候補比較表がある。Bは食品を任意入力し個別目標と現物の差を扱う場合にだけ異なる。現状の計算式を複製しない。 | 既存の `food`（主食・保存食）枠。新カテゴリなし。 | 農林水産省の[要配慮者向け食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)は乳幼児、高齢者、慢性疾患、食物アレルギー等の条件別に備えと注意を扱う。個別の目標量はサイトが引用・推定せず、本人が選んだ製品・目標・現在庫だけを使うため、計算に外部の摂取基準は入れない。 | アレルギー・栄養・慢性疾患、誤食。健康状態・アレルゲン・氏名を記録・送信しない。目標値や代替食品を勧めない。表示、専門家、公的資料を優先し、目標数量の設定は本人・家族の判断に任せる。 | 中 | **中〜高**。農林水産省が特別な配慮を要する家庭向け資料を公開している。一般備蓄計算・非常食比較との関連語は既存サイトにあるが、専用検索需要の量は不明。 |
| C. カセットボンベの使用計画に対し、手持ちと製品表示からどれだけ差があるか | guides/cassette-bombe-bichiku の #stock-count、#buy-check、#dates、#safety が在庫・製品表示・保管・安全を既に扱う。tools/bichiku も熱源や調理水を含む一般備蓄の入口。新計算は重複が大きい。 | 既存 `cassette-gas`。 | 農林水産省の[食品ストックガイド（熱源）](https://www.maff.go.jp/j/zyukyu/foodstock/chapter07.html)は備蓄本数の目安とその前提を明記する。メーカーの使用条件は製品固有であり、一般的な燃焼時間や一律換算には使わない。 | 火気・一酸化炭素・爆発。気温・鍋・火力・使用時間差を隠す一律計算は危険。メーカーの器具・ボンベ適合、換気、使用・保管・期限の注意を優先し、製品表示を超える結論を出さない。 | 大 | **中**。公的な備えの案内と季節・調理意図の接点がある。今回の検索では独立した計算サイトより公的な量の案内が見つかったが、これは検索量の証拠ではない。 |
| D. 冬季停電用の防寒用品について、自分の世帯で確認する項目・必要数は何か | guides/teiden-sonae、guides/shachuhaku-hinan と雪害ガイドに寒さの説明がある。新しい数値チェックリストは地域差を無視しやすく、内容が既存記事に分散している。 | 既存 data-category なし。寝具・防寒用品は自然な売場カテゴリだが、枠を新設する根拠は弱い。 | [農林水産省食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)は家庭備蓄の包括的な入口だが、防寒用品の統一数量を支える資料ではない。引用可能な全国共通数値を見つけていない。 | 低体温症、火気、換気、暖房器具の誤使用。家族構成・住居・地域差が大きいため標準個数や必要量を提示しない。選択は自治体や製品説明を優先。 | 中 | **中**。冬季・寒冷地の季節性と停電意図がある。地域別の自治体チェックリストが検索結果にあり競争・地域差も大きい。 |
| E. 収納棚の実測寸法と品物の外寸を入力し、保管に使う空間の概算を比べる | guides/rolling-stock-hajimekata の #places と tools/rolling-stock が場所・在庫を扱い、guides/bichiku-nannichibun が備蓄量を扱う。寸法から容量を出すなら既存機能と違うが、立体の詰め方を計算しない限り精度は限られる。 | 新しい `storage-container` 案。収納用品。現行枠との適合は不明で、枠を増やさないのが初期方針。 | [農林水産省食品ストックガイド（収納）](https://www.maff.go.jp/j/zyukyu/foodstock/chapter09.html)は見える化・分散収納と重い品の扱いを説明。利用者が測る縦×横×高さの体積は幾何の基本式であり、収納可能性や耐荷重を公的資料の数値から判定しない。 | 家具転倒・通路ふさぎ・重い物の落下・床や棚の荷重。空間体積の結果を収納可能判定に使わず、実際の形、出し入れ、重量、転倒防止を別途確認。 | 中 | **中**。農林水産省が収納・分散配置を扱い、検索結果には分散収納記事や記入式チェック表がある。容量の計算意図は推論で、実測需要は不明。 |
| F. 現在使う食品・製品・備えの条件ごとに、本人が選んだ保有目標を記録する | tools/bichiku の #stock-reconcile、tools/rolling-stock の期限管理、guides/hijoushoku-erabikata の比較表が近い。現行機能との重複が高く、目標設定の理由が曖昧なら別の入力欄は増やさない。 | 既存 `food`、`water`、`toilet` 等。新しいカテゴリは不要。 | [農林水産省食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)。既存の各ツールの入力・計算根拠を重ねず、自由入力分には公式基準を持ち込まない。 | 目標設定をサイトが標準化すると健康・家庭条件の判断を誤る。本人入力と在庫差だけに限定。 | 小〜中 | **低〜中**。既存ツールを使う検索意図に隣接する一方、新しい入口より既存の照合・期限管理と重なり、検索流入増加の根拠が弱い。 |
| G. サイズ違いの乳幼児用品を現在庫・家族が定めた備え目標で整理する | tools/baby-bichiku と guides/baby-bousai-bichiku の #set-check が同じ用品を扱う。対象を「サイズ別の在庫差」に限れば新機能の余地はあるが、発育や使用時期の予測は既存機能にない。 | 既存 `baby-supply`。 | 農林水産省の[要配慮者向け食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)は乳幼児向け備えを扱う。ただしおむつサイズの将来需要や個人別使用量の新たな数値は根拠なし。 | 発育・授乳・食事の個人差。将来サイズ、年齢別必要数、医学的助言を表示しない。現在の製品表示と家族の実使用量だけを本人が入力する。 | 中 | **中**。乳幼児の備えは公式ガイドにあるが、既存の専用計算機能と競合する。専用機能に新たな流入があるとの実測はない。 |
| H. ペットごとの製品在庫と家庭が決めた目標との差を表示する | tools/pet-bichiku と guides/pet-bousai-bichiku がペット別量・持ち出し・在庫を扱う。品目の在庫照合のほかに新規計算を足すと重複が大きい。 | 既存 `pet-food`、`pet-water`、`pet-toilet` 等。 | [環境省のペット災害対策](https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html)は飼い主の備えと自治体避難所ルールの確認を案内する。個体の食餌や飲水量をサイト側で一般化する数値は使わない。 | 動物の健康、療法食、水分、避難施設の受入れ。獣医療や避難可否を判定せず、普段の量・かかりつけ獣医師・自治体情報を優先。 | 小〜中 | **中**。環境省がペット備えを案内し、検索結果にペットの防災計算ツールが複数ある。ただし既存の自サイト計算との食い合いが強く、追加価値は限られる。 |

## 検索結果に現れた競合・公式案内の例

下表の外部ページは、記載した検索テーマの調査時に見つかった例です。企業・独立サイトを含む競合例は比較対象としてのみ示し、内容の正しさ、掲載順、需要量、ユーザー数を評価する根拠にはしていません。公式機関の資料は数値根拠として使う場合に限り前節の根拠欄に置き、民間サイトの数字や方式は計算式へ持ち込みません。

| 候補 | 検索結果で確認したページの型 | この確認から言える範囲 |
|---|---|---|
| A. 電力量整理 | [DIY数量計算のポータブル電源容量計算](https://www.diy-keisan.jp/electrical/portable-power-capacity-calculator/)、[Gadget Labの容量計算](https://gadget-lab.jp/power-station-calculator/)、[もしもの防災の容量計算](https://moshimono-bousai.com/portable-power-capacity-calculator/) | このテーマに計算ツール形式の検索結果が複数現れる。競争があるため単純に同じ機能を追加するだけでは差別化しにくい。これらの式・係数を本候補に引用しない。 |
| B. 特別な食品在庫 | [農林水産省の要配慮者向け食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html) | 公的な資料が乳幼児・高齢者・慢性疾患・アレルギー等の備えを扱う。検索結果だけでは、利用者自身が決めた目標在庫を差分計算する機能の検索需要は分からない。 |
| C. カセットボンベ | [農林水産省の熱源・備蓄案内](https://www.maff.go.jp/j/zyukyu/foodstock/chapter07.html)、[福島県の災害時の給食施設向け資料](https://www.pref.fukushima.lg.jp/uploaded/attachment/730007.pdf) | 公式の備蓄目安や施設条件を含む試算資料が見つかる。家庭向けに条件を単純化した独自計算が必要とは言えず、製品別条件を外した数字は使わない。 |
| D. 冬の防寒 | [札幌市北区の備蓄品チェックリスト](https://www.city.sapporo.jp/somu/koho-shi/202012/documents/202012kitaall21.pdf)、[斜里町の暴風雪対策資料](https://www.town.shari.hokkaido.jp/material/files/group/1/bouhuusetutaisaku.pdf) | 地域の気候を前提とする公式チェック例がある。全国共通の品目数・基準に広げない。 |
| E. 収納寸法 | [図解手帖の分散収納ガイド](https://zukai-techo.hibibako.com/guide/bichiku-storage-map/)、[そなえぐらしの収納チェックリスト](https://sonaegurashi.com/bosai-goods-storage/) | 置き場所・分散収納を扱う記事や記入式の表がある。体積計算だけで使いやすさや耐荷重を判断できない。 |
| F. 汎用備蓄量 | [JP Toolsの防災備蓄計算](https://jptools.jp/disaster-stockpile)、[はそこんの備蓄計算](https://hasokon.com/tools/bosai-bichiku-keisan/) | 家族人数や日数から複数カテゴリを計算する競合例がある。現行 `tools/bichiku` と同じ一般計算を重ねない。 |
| G. 乳幼児用品 | [農林水産省の食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html) | 公的な乳幼児向け備え案内がある。実際のサイズ別消費・発育に基づく数量を本資料からは算定できない。 |
| H. ペット在庫 | [計算ツールズのペット備蓄量計算](https://ta5k.com/tools/daily/pet-bichiku)、[サクポチのペット備蓄量計算](https://sakupochi.com/pet-senior-tools/pet-disaster-stockpile) | ペットの条件を入力する計算ツールが検索結果に複数現れる。既存 `tools/pet-bichiku` との食い合いを考慮し、新機能の独自価値を確認する。 |

## 推奨仕様案

### A. 停電時の機器別電力量を足し合わせる

- **対象:** 新規URL `tools/portable-power/`。作成は別の実装Issueで承認後に行う。この調査では公開ページ、ファイル、data-categoryを変更しない。
- **答える問い:** 「家で使いたい機器を製品表示から入力すると、選んだ使用時間に対する理想上の電力量合計は何Whか」。必要な電源製品や実際の稼働時間を診断するものではない。
- **入力:** 機器名（任意のテキスト）、機器表示の消費電力W、予定使用時間（時間/日）、日数。利用者が銘板・説明書で確認した値を入力する。機器行は追加・削除可能。推奨機器や初期値の家電リストは置かない。
- **計算:** 各行の理想エネルギー = 入力W × 使用時間/日 × 日数。合計 = 各行の和。これはWと時間の積による負荷の整理だけで、変換効率、温度、機器サイクル、劣化、使用可能容量、起動電力を推定しない。小数時間と空欄、0、負数、桁上限を明示して検証する。
- **出力:** 各機器の入力値・行ごとのWh、理想負荷合計Wh、計算条件、強い注意書き。Whの数字を製品容量の推奨値や稼働時間に言い換えない。
- **根拠:** [Goal Zeroの公式サポート](https://help.goalzero.com/hc/en-us/articles/38587553528987-How-long-will-the-Yeti-run-my-device)は機器の電力と電源容量が使用時間に関係し、実際は条件で変わることを説明する。[NITEの注意資料](https://www.nite.go.jp/jiko/chuikanki/press/2024fy/prs240827.html)を安全案内にリンクする。式は個々の数値基準ではなくW×hのWと時間の積。
- **注意書き:** 実際の電気使用量と稼働時間は製品・条件で異なる。定格出力、瞬間出力、出力波形、端子、充電方法、環境条件、メーカー説明書を製品ごとに確認。医療機器・生命維持装置を含む利用可否は扱わない。燃料式発電機の室内・車内等での使用方法を説明しない。公式安全情報と取扱説明書を優先する。
- **内部リンク:** [停電への備え](https://supportapp3-lab.github.io/kasegu-tools/guides/teiden-sonae/) の #match-check と #buy-check、[通電火災](https://supportapp3-lab.github.io/kasegu-tools/guides/tsuuden-kasai/)。新ツールから購入前安全確認へ戻れる位置に置く。
- **affiliate枠:** `data-category="portable-power"` を結果と注意の後に、リンク・画像・価格のない空枠として提案する。新カテゴリの採用・配置はアソシエイト承認状況と運営方針を別途確認してから決める。現行の `lighting-battery` を流用しない。
- **テスト観点:** 一行のW×時間×日数、複数行の合算、小数時間、行追加削除、空の行、0、負数、無効文字、上限値、結果の桁 overflow、入力順を変えた同じ合計、Whであることを確認。入力値をURL・サーバーへ送らない。レイアウトで安全注意がスマホでも結果より先に隠れないこと。

### B. 個別に選んだ食品在庫目標との差分

- **対象:** 既存 `tools/bichiku/index.html#custom-food-stock` の拡張案。新規URLは増やさない。
- **答える問い:** 「家族が指定した食品ごとの目標在庫と、いま使える在庫の差はいくつか」。食品の選択や健康状態に合わせた基準をサイトが判定しない。
- **入力:** 品目名（食品の商品分類やアレルゲン情報を固定リスト化しない）、利用者が自分で決めた目標数量、現在使える在庫、本人が選んだ記録用の尺度（例: パック・食分・個）。対象行を追加・削除できる。
- **計算:** 不足 = max(目標数量 − 現在庫, 0)。目標と在庫は同じ尺度で入力する。異なる尺度の自動変換、摂取量・栄養素・アレルゲン・人数・日数からの自動目標は実装しない。
- **出力:** 品目ごとの目標・現在庫・差分。「不足なし」「不足あり」を表示。目標が未入力、尺度が不一致、負数、無効値なら結果を無効にする。入力した品目や目標を保存・送信しない。
- **根拠:** [農林水産省の食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)は乳幼児、高齢者、慢性疾患、食物アレルギー等の家庭向けに備えと食事の注意を扱う。この根拠は個々の家庭の食事量・商品適性・必要な数量を決める式ではないため、計算へ基準値を入れない。
- **注意書き:** 食品表示、アレルギー対応、医療・栄養に関する判断を代替しない。公的ガイド、医師・管理栄養士等の専門家、製品表示を優先。公開端末・共有URLに個人の病歴や食物アレルギー情報を書かない。
- **内部リンク:** [非常食の選び方](https://supportapp3-lab.github.io/kasegu-tools/guides/hijoushoku-erabikata/) の #food-compare と #purchase-check、現在の備蓄ツールの #stock-reconcile。既存の目安計算・在庫照合を再掲しない。
- **affiliate枠:** 既存 `food` カテゴリのみを、結果・注意書きの後の任意確認枠として維持。リンク・画像・価格は追加しない。不足がなければ買い足し不要と明記。
- **テスト観点:** 目標が在庫より大きい、同じ、少ない場合、異なる尺度を選んだ場合、同名行、空品目、空目標、0在庫、負数、上限値、行追加・削除、URLに機微な入力が混ざらないこと、既存の水・トイレ・主食の計算と照合機能を壊さないことを確認。

## 見送る候補

- **カセットボンベの本数計算:** 公的な食品ストック案内に本数の目安はありますが、既存の専用ガイドが保管・安全・在庫をすでに説明しています。メーカーの使用条件や調理内容を一つの式へ一般化すると、気温・鍋・火力の差を覆い隠します。数値計算の独立した入口を増やすより、製品表示・公式案内へ誘導するのが妥当です。
- **冬季停電の防寒用品数:** 寒冷地、住居、要配慮者、熱源によって内容が異なり、一律の必要数を公的資料で裏付けられません。季節記事を追加しても、既存の停電・雪害ページとの重複と更新負担が大きい。
- **棚の収納量・立体詰め計算:** 体積だけを計算しても形状、棚の耐荷重、転倒、通路を判断できません。収納用品の買い物を促すだけでは、既存の収納ガイドとの差別化が弱い。
- **汎用備蓄・ペット・乳幼児計算の拡張:** 現在のツールがすでに数量計算し、ペット・乳幼児には個別ツールもあります。新機能に固有の検索意図をSearch Consoleで確認するまでは既存説明の重複を避けます。
- **家庭用薬や医療機器の必要量計算:** 薬の用量、持病、電源の継続時間や避難判断に関わり、サイトの一般式が安全な案内になりません。公式・医療専門家・製品提供元へ案内するに留めます。

## Search Console実測が届いた後に見直すこと

- A・Bに対応する実際の検索クエリがあるか。一般的な停電・備蓄語に混ざるのか、固有の目的語・検索表現があるのか。
- 既存ツールとガイドの表示回数、クリック、CTRの期間比較。季節性、ページ公開・改稿日、サイト全体の変更を記録し、短期間の差を因果関係と断定しない。
- 同じクエリで複数の自サイトURLが表示されるか。見つかった場合は新しいページの追加ではなく、canonical・タイトル・内部リンク・役割の分担を先に検討する。
- 新候補を公開しても、既存ページから対象ページへ利用者が進むか、計算完了や関連リンクの操作があるか。分析を使う場合はプライバシー説明と計測設定を確認し、個人の入力値は収集しない。
- 月ごとの検索結果変化、公式情報の更新、仕様変更、問い合わせやユーザーフィードバック。SEO指標と実用性の両方を確認し、商品リンク導入の成否と混同しない。
- Search Consoleが未連携・データ不足なら数値を補完せず、候補の優先判断を保留する。アソシエイト承認前に商品リンクや購入依頼を行わない。

## 確認した公式資料

各URLは2026-10-16にブラウザで開き、内容を照合しました。検索結果だけで存在を確認したURLや、取得時にエラーとなったページは根拠一覧に入れていません。

| 発行元 | 資料と今回確認した範囲 |
|---|---|
| Goal Zero（メーカー） | [How long will the Yeti run my device?](https://help.goalzero.com/hc/en-us/articles/38587553528987-How-long-will-the-Yeti-run-my-device)：容量・機器負荷と稼働時間の関係を確認。特定製品の例を一般的な効率係数として流用しない。 |
| NITE（製品評価技術基盤機構） | [災害時にも活躍する携帯発電機やポータブル電源の事故と停電復旧後の通電火災に注意！](https://www.nite.go.jp/jiko/chuikanki/press/2024fy/prs240827.html)：停電時の電源使用と事故・安全注意。 |
| 農林水産省 | [災害時に備えた食品ストックガイド](https://www.maff.go.jp/j/zyukyu/foodstock/guidebook.html)：家庭備蓄、および乳幼児・高齢者・慢性疾患・食物アレルギーがある人の注意資料。 |
| 農林水産省 | [食品ストックガイド（7）熱源を確保しよう](https://www.maff.go.jp/j/zyukyu/foodstock/chapter07.html)：カセットボンベの公的な目安と、その適用条件を確認。 |
| 農林水産省 | [食品ストックガイド（9）備蓄食品の収納テクニック](https://www.maff.go.jp/j/zyukyu/foodstock/chapter09.html)：食品の見える化、分散収納、重い物の配置に関する記述。 |
| 環境省 | [ペットの災害対策](https://www.env.go.jp/nature/dobutsu/aigo/1_law/disaster.html)：避難所の自治体ルール、ペットの備えと同行避難の確認。 |

## 調査上の限界

競合例は次節に調査時の検索結果で見つかったページとして記録しました。運営者や公開状態、内容は変わることがあり、個別ページの確認は検索結果上の掲載順位・集客数・運営者属性を証明しません。例は需要規模を表すものではありません。上の仕様は安全面と既存ページとの差を検討するためのたたき台で、実装前に対象利用者・Search Console・サイトのaffiliate方針を再確認してください。
