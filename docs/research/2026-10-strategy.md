# 暮らしの計算室：最初の適格販売に向けた調査

調査日：2026-10-14（日本時間）。Issue #40。成果物はこの文書のみ。

## 1. 結論と調査の限界

優先案は「携帯トイレの不足回数を確認 → 箱の回数表示を読む → 必要な分だけ購入を検討」と「水の不足量・置き場所を確認」の導線を整えること。これは検索結果と既存ページの機能からの**推論**であり、売上実績による判断ではない。広い防災用語の解説を増やすだけでは、公的情報との差が小さい。

本サイトの現状はAmazonアソシエイト未申請・未承認、商品リンク未設置。申請後180日以内に3件の適格販売が生じると審査対象になるという公式案内があるが、3件で承認や支払いが確定するわけではない。[審査と休止](https://affiliate.amazon.co.jp/help/node/topic/G7MJTPEP9NC3YKMG)、[申請審査](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)。本人・友人・家族への購入依頼で条件を満たす案は採用しない。[自己購入の説明](https://affiliate.amazon.co.jp/help/node/topic/GPSPSUGXUX7V87QZ)、[参加要件](https://affiliate.amazon.co.jp/help/operating/policies)。申請・リンク導入・実際の投稿はこの調査では行っていない。

### 方法

- 最新main `d17fcbf9fcb65e776c9e6ec988b124c11924f0bf` のHTMLタイトル、内容・計算機能を参照し、20記事と6ツールを対象にした。タイトル等から推定した検索意図を下表の「検索語」とした。Search Consoleで実際に流入する検索語は未確認。
- 下表の検索語をWeb検索し、返された結果のサイト・見出し・説明を比較した。日本のGoogleの順位を固定条件で測定した調査ではない。表中のURLは**検索結果に現れた競合例**であり、「1位」「上位占有率」や順位の強さを確認したとは扱わない。
- 公的機関と企業公式は運営者名・ドメインを根拠に分類。「独立サイト」は小規模・専門サイトの形を指す。個人運営か法人運営か未確認のものを個人と断定しない。大手メディアと企業の販促ページも区別する。
- 「勝ち目あり」は、独自の計算・記入例・実測があれば試す余地があるという編集判断。「薄い」は、広い検索語で同種の要約を追加する優先度が低いという判断。順位・需要の保証ではない。
- 検索ボリューム、被リンク、ドメイン評価、CTR、CVR、売上、閲覧数、登録状況・インデックス状況は**未確認**。推測の数値は置かない。競合の記事の安全・健康助言を本サイトの根拠として転載しない。
- 並行提出した雪害2記事はPR #41。文書提出前に所有者がmainへ取り込んだ（提出基準 `a319c18d84ac9d6198bafce8a2fcc1b75ddddfe9`）。依頼時点の20記事を今回の分析対象とし、追加2記事の実績は別途確認する。

## 2. 既存20記事の競合と狙い

表の検索語は調査に使用した語。URLを開いて最新本文・運営属性を再確認してから施策を実行する。

| 記事（`guides/`以下） | 検索語 | 結果に現れた競合・傾向 | 勝ち目と差別化案（推論） |
|---|---|---|---|
| bousai-bichiku | 防災備蓄 ガイド | 公的：[東京備蓄ナビ](https://www.bichiku.metro.tokyo.lg.jp/)。専門団体：[コメリ災害対策センター](https://www.komeri-npo.org/howto/bitiku.html)。既にリストと家庭別案内がある | **薄い**。総論の再説明より、各ツールの使い分け・不足の確認順序に集中 |
| bichiku-nannichibun | 防災 備蓄 何日分 | 公的：[政府広報](https://www.gov-online.go.jp/vertical/online/video-289.html)、[京都市](https://www.bousai.city.kyoto.lg.jp/0000000185.html)。日数の公式説明と競合 | **薄い**。家庭ごとの計算結果を使った段階的な準備例なら試せる |
| rolling-stock-hajimekata | ローリングストック 始め方 | 公的：[農水省](https://www.maff.go.jp/j/zyukyu/foodstock/chapter02.html)。独立：[ソナエカゾエ](https://sonaekazoe.com/articles/rolling-stock)。公的と実用解説が混在 | **あり・条件付き**。続かなかった理由、期限ラベルと補充日の具体例を自作 |
| keitai-toilet-bichiku | 携帯トイレ 備蓄 何回分 | 公的：[川崎市](https://www.city.kawasaki.jp/800/page/0000122885.html)、[千葉市](https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/saigai-toilet-taisaku.html)。企業：[Panasonic](https://panasonic.jp/life/safety/130025.html)。人数表まで充実 | **あり・条件付き**。持っている回数と不足回数、箱の回数表示を結び付ける |
| pet-bousai-bichiku | ペット 防災 備蓄 | 公的：[神戸市](https://www.city.kobe.lg.jp/a84140/kenko/health/hygiene/animal/bousai.html)。専門団体：[ペット防災ネットワーク](https://petbousai.jp/guide/pet-bousai-checklist)。公的・専門情報がある | **あり・条件付き**。犬猫ごとの普段の消費量と手持ち在庫の記録例。体重だけで給与量を決めない |
| baby-bousai-bichiku | 赤ちゃん 防災 備蓄 | 大手小売：[アカチャンホンポ](https://shop.akachan.jp/shop/r/rbousai/)。メーカー：[明治](https://www.meiji.co.jp/baby/milk-stock/necessary/list.html)。独立：[防災くらしガイド](https://bousaikun.ashigaru.jp/guide/baby-disaster-stockpile.html) | **あり・条件付き**。兄弟のサイズ違い・普段使う枚数の記入例。授乳の医学的助言は追加しない |
| hijoushoku-erabikata | 非常食 選び方 | メーカー：[亀田製菓](https://www.kameda-netshop.jp/pages/bousai)。大手系メディア：[macaroni](https://macaro-ni.jp/32034)。独立：[図解手帖](https://zukai-techo.hibibako.com/guide/emergency-food/) | **あり・条件付き**。実際に試食した条件・調理不要か・家族の好みの記録。未試食のランキングは作らない |
| mizu-kumioki-bichiku | 水 汲み置き 備蓄 | 公的：[千葉県水道](https://www.pref.chiba.lg.jp/suidou/souki/oshirase/kumioki.html)、[農水省](https://www.maff.go.jp/j/zyukyu/foodstock/imadoki/imadoki02_10.html)。保存条件の原典が強い | **薄い**。保存期間の要約で競わず、容器の本数・保管場所の記録へ |
| cassette-bombe-bichiku | カセットボンベ 備蓄 本数 | 公的：[農水省](https://www.maff.go.jp/j/zyukyu/foodstock/chapter07.html)。メーカー：[岩谷産業](https://www.iwatani.co.jp/jpn/consumer/products/cg/useful/stockpile/)。独立：[本数・保管の解説サイト](https://lifexrees.com/disaster-prevention/cassette-gas-stockpile-calculation/) | **薄い**。メーカーの条件付き実験と異なる条件の数値を一律換算しない。保管・点検の案内に寄せる |
| mochidashi-bukuro | 非常持ち出し袋 中身 | 大手企業メディア：[中部電力カテエネ](https://katene.chuden.jp/clubkatene/p/entertainment/disaster-prevention-column/08.html)。独立：[もしもの防災](https://moshimono-bousai.com/emergency-go-bag-checklist/) | **あり・条件付き**。自宅備蓄との重複を除く記入式チェック、持てるかを本人が確認 |
| saigai-dengon-171 | 災害用伝言ダイヤル 171 使い方 | サービス提供者：[NTT東日本](https://www.ntt-east.co.jp/release/detail/20170825_01_02.html)、[NTT西日本](https://www.ntt-west.co.jp/dengon/way/rec.html)。公的：[警視庁](https://www.keishicho.metro.tokyo.lg.jp/kurashi/saigai/jishin/message_service.html) | **薄い**。公式操作案内が直接回答。家族で決める連絡カードの補助に使う |
| kagu-tentou-boushi | 家具 転倒防止 | 公的：[東京消防庁](https://www.tfd.metro.tokyo.lg.jp/learning/elib/kagutenhandbook.html)、[東京くらしWEB](https://www.shouhiseikatu.metro.tokyo.lg.jp/anzen/kigaikiken/2026/fixfurniture.html)。器具の条件まで説明 | **薄い**。部屋の配置チェックには余地。賃貸の条件や器具適合を省いて万能商品を薦めない |
| teiden-sonae | 停電 備え | 公的：[君津市](https://www.city.kimitsu.lg.jp/soshiki/6/1130.html)。大手事業者：[東京電力PG](https://pgservice1.tepco.co.jp/2024/05/27/power-outage-measures/) | **あり・条件付き**。手持ちライトの電池・スマホのケーブルの現物確認を記録 |
| hazard-map-hinan | ハザードマップ 避難 判断 | 公的：[蓮田市](https://www.city.hasuda.saitama.jp/kiki/hinankoudou-flow.html)、[久留米市](https://www.city.kurume.fukuoka.jp/1050kurashi/2040bousaianzen/3003shiru/2023-0908-1305-86.html)。地域の原典が直接回答 | **薄い**。全国共通の避難判断を独自に出さず、自治体へたどり着く手順の補助 |
| keikai-level | 警戒レベル 違い | 公的：[官邸](https://www.kantei.go.jp/jp/headline/bousai/keihou.html)、[気象庁](https://www.jma.go.jp/jma/kishou/know/bosai/alertlevel.html)。制度情報は原典優位 | **薄い**。最新制度の維持を優先し、商品購入導線の入口にはしない |
| tsuuden-kasai | 通電火災 対策 | 公的：[さいたま市](https://www.city.saitama.lg.jp/001/011/014/004/001/p067049.html)、[国民生活センター](https://www.kokusen.go.jp/mimamori/mj_mailmag/mj-shinsen518.html) | **薄い**。事故時の安全情報は公式を優先。広告で注意を妨げない |
| kanshin-breaker | 感震ブレーカー 選び方 | 公的：[内閣府](https://www.bousai.go.jp/jishin/kanshin_breaker.html)。商品比較メディア：[マイベスト](https://my-best.com/617)。独立：[わが家の備蓄](https://wagayanobitikuhin.com/guide/earthquake-breaker-guide) | **薄い**。工事・適合の確認が必要。最初の販売件数のために手軽さだけを強調しない |
| zaitaku-hinan | 在宅避難 備え | 公的：[東京都](https://www.koho.metro.tokyo.lg.jp/2026/09/01-2.html)、[千葉市](https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/zaitakuhinan.html)、[港区](https://www.city.minato.tokyo.jp/chiikibousai/29manshonhandbook.html) | **薄い**。安全な在宅の判断は公的情報。生活用品の不足チェックへの案内役 |
| shachuhaku-hinan | 車中泊 避難 エコノミークラス | 公的：[茨城県](https://www.pref.ibaraki.jp/bousaikiki/bousaikiki/bousai/shachuuhaku.html)、[大阪市](https://www.city.osaka.lg.jp/kikikanrishitsu/page/0000672884.html)。企業：[トヨタ](https://www.toyota.co.jp/jpn/sustainability/social_contribution/tdrs/emergency/) | **薄い**。健康・季節の危険が中心。販売目的で車中泊を勧めない |
| ensei-hi | 遠征費 節約 | 大手旅行事業者：[JR東日本びゅうトラベル](https://www.jre-travel.com/article/00375/)。独立：[遠征へ行こう](https://ensei-go.com/cut-travel-costs/)。個人投稿例：[note](https://note.com/glad_cosmos7122/n/nde1b32fd9f3a) | **あり・条件付き**。予算内訳を自分の実費で比較する機能を入口に。旅行の予約売上とは別 |

## 3. 既存6ツール

| ツール（`tools/`以下） | 検索語 | 競合例・属性 | 判定・補足 |
|---|---|---|---|
| bichiku | 防災 備蓄 計算 家族 人数 | 公的：[東京備蓄ナビ](https://www.bichiku.metro.tokyo.lg.jp/)。独立：[JP Tools](https://jptools.jp/disaster-stockpile) | **あり・条件付き**。計算自体は既存。根拠・丸め・含まない用途を明確にし、家族に共有できる使い勝手を見せる |
| pet-bichiku | ペット 防災 備蓄 計算 | 専門ツールサイト：[計算ツールズ](https://ta5k.com/tools/daily/pet-bichiku)（個人/法人未確認） | **あり・条件付き**。普段のフード量と製品表示を使う既存方式の違いを説明。需要量は未確認 |
| baby-bichiku | 赤ちゃん 防災 おむつ ミルク 計算 | 専門ツール：[計算ツールズ](https://ta5k.com/tools/daily/baby-bichiku)。独立：[そなえヨミ](https://sonae-yomi.jp/guide/baby) | **あり・条件付き**。一人ずつの普段量を使うことが差別化候補。医学的な標準量の自動決定へ拡張しない |
| toilet-bichiku | 携帯トイレ 必要数 計算 | 専門情報：[漫画で読む携帯・簡易トイレの使い方](https://toilet-bosai.com/keitai/explanation/sonaeru/)。公的表：[川崎市](https://www.city.kawasaki.jp/800/page/0000122885.html) | **あり・条件付き、購入導線の第一候補**。計算後に手持ちの回数表示を確認する手順を示す |
| rolling-stock | ローリングストック 計算 | 専門ツール：[計算ツールズ](https://ta5k.com/tools/daily/rolling-stock-cycle)。公的概念説明：[農水省](https://www.maff.go.jp/j/zyukyu/foodstock/chapter02.html) | **あり・条件付き**。日常消費と期限を使った実際の管理例。補充通知や在庫読取機能があると誤認させない |
| ensei-hi | 遠征費 計算 | 専門ツール：[計算ツールズ](https://ta5k.com/tools/fun/concert-cost)、[ToolkitsLab](https://toolkitslab.com/tools/oshi-travel-cost-calculator)。独立：[遠征費計算](https://ensei.kkpwebninja.com/) | **あり・条件付き**。自分の入力価格で予算を比べる。自動料金取得・ホテル最安比較があるとは説明しない |

検索結果には独立サイト・計算サイトも現れたため「個人は一切勝てない」とする根拠はない。ただし個々の運営形態、Google実順位、ユーザー数は未確認。人命・健康に関わる部分では根拠の正確さが必要。[Googleの有用なコンテンツ案内](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)は、独自の分析・経験と信頼できる情報を重視している。出典を並べただけで独自性を満たしたとは判断しない。

## 4. 未着手の検索意図：12候補

専用記事がないテーマを抽出した。既存記事の一般説明と重なる場合は新規URLを増やさず、その記事の独自の記録例として追加する。下記の検索語でも検索結果を確認した。競合が少ない、検索量がある、上位になるという断定はしない。

| 候補検索語 | 個人でも作れる価値と競合例 | 判断・重複を避ける方法 |
|---|---|---|
| 携帯トイレ 50回 100回 家族 不足 | 製品の箱数を選ぶ前の不足回数・切り上げ例。[防災くらしガイド](https://bousaikun.ashigaru.jp/goods/toilet-hygiene.html)に商品比較あり | 優先。既存必要数記事へ箱数・手持ちの記入例を加える候補。実在製品の内容物は確認が必要 |
| 備蓄 水 2L 500ml 収納 本数 | 容量の異なるボトルの置き場所・持ち運びを現物で記録。[そなえカルテ](https://www.sonae-carte.jp/posts/water-bottle-size)に比較あり | 優先。必要量だけでなく自宅の棚の実測が独自部分。飲料用と生活用を分ける |
| 備蓄 置き場所 1K 分散 | 実際の間取りに置いた写真と寸法、避難の動線。[農水省](https://www.maff.go.jp/j/zyukyu/foodstock/jirei_point.html)、[分散収納例](https://zukai-techo.hibibako.com/guide/bichiku-storage-map/) | 試す余地。間取り条件を明示、全国共通の安全配置と断定しない |
| ローリングストック 賞味期限 ラベル 手書き | 自作ラベルと運用後の記録。[無印良品](https://www.muji.com/jp/ja/store/articles/staff-blog/itsumomoshimo/1693887)に備蓄提案あり | 試す余地。既存の始め方・計算から独立したテンプレートの検索意図 |
| ペット 防災 フード 小分け ラベル | 未開封・開封後を区別した情報カード。メーカー表示を記録。[ペットパラダイス](https://www.rakuten.co.jp/pet-para/contents/bousai/) | 条件付き。小分けで保存期間が延びるとは書かない。既存の量計算と目的が異なる |
| 赤ちゃん 防災 おむつ サイズアウト 在庫 | 兄弟・サイズ別の在庫棚卸し表。[ベビーザらス](https://www.babiesrus.co.jp/ja-jp/promotions/disaster-prevention/)に用品案内 | 条件付き。成長時期は予測せず、普段のサイズと手持ちを本人が記入 |
| 防災 ライト 電池 サイズ 管理 | 手持ちライトの型番・電池種類・必要本数・点検日を記録。[Panasonic](https://panasonic.jp/flashlight/select.html)に選び方案内 | 試す余地。停電総論と分ける。機器の寿命や連続使用時間を推測しない |
| 防災 モバイルバッテリー ケーブル 確認 | 端子の組み合わせと実際の充電確認の記録。[消費者庁](https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_063)に事故注意 | 条件付き。容量だけで充電回数を断言しない。安全な現物確認の記録に限定 |
| 携帯トイレ ごみ 自治体 調べ方 | 自治体ページへの探し方と地域別の確認欄。[千葉市](https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/saigai-toilet-taisaku.html)に処分方法 | 条件付き。既存備蓄量と別の使用後の検索意図。全国一律の分別を作らない |
| 防災 眼鏡 予備 ケース | 現在の眼鏡・予備・ケースの持ち出しカード。[メガネ関連団体](https://www.megane10-01.com/disaster-preparation) | 試す余地。度数・医療判断をせず持ち出し準備だけを扱う |
| 非常食 温め不要 試食 記録 | 実際の試食条件、開封のしやすさ、家族の好みを記録。[家電 Watch](https://kaden.watch.impress.co.jp/docs/topic/topic/1669550.html)に実食記事あり | 条件付き。大手にも実食がある。自分の利用条件が違うときのみ新規に価値が出る |
| 遠征 持ち物 モバイルバッテリー 雨 | 実際の荷物と会場ルールを確認した一覧。[おしたび](https://oshitabi.net/guides/ensei-packing-list) | 条件付き。費用計算とは別の準備意図。会場・日程を限定し安全注意を確認 |

これらの候補にも既存競合がある。勝ち目の根拠は「作れる独自の資料」であり、競合不在ではない。新規コンテンツを選ぶ前に、対象読者に記入例が役立つか、検索で同じ様式が既に満たされていないかを確認する。

## 5. 自然な商品導線と購入意図の優先順位

購入意図の順序は読者が解決しようとする課題からの推論。単価・紹介料・売れやすさは未調査。特定ASIN・価格・レビュー評価は未確認で、推奨商品名は決めていない。

| 順序 | ページ | 自然な置き場所・カテゴリ | 選ぶ前に伝える内容 |
|---|---|---|---|
| 1 | 携帯トイレ記事・toilet-bichiku | 必要回数と手持ちを比べた後。携帯トイレ、便袋、凝固剤、保管袋 | 「回分」と袋・凝固剤の内訳、保存条件、便器との適合、使用後の地域ルール。不足がなければ購入不要 |
| 2 | 水の記事・bichiku | 必要L数と保管場所を確認した後。飲料水、保存水、給水用容器 | 長期保存水だけに偏らず普段使う水との違い。容量・重量・容器の用途・メーカー表示を確認 |
| 3 | 非常食・ローリングストック記事/ツール | 家族が食べられる物を選ぶ節。調理不要食品、レトルト、缶詰 | アレルゲン・開封・調理条件・期限と好み。未試食を試食済みとして紹介しない |
| 4 | ペット記事・pet-bichiku | 普段のフード量と用品リストの後。いつものフード、トイレ用品、キャリー | 種類とサイズ・普段の使用量。療法食を独自に代替しない。商品表示・獣医師の指示を優先 |
| 5 | 赤ちゃん記事・baby-bichiku | サイズ・普段量を記入した後。おむつ、おしりふき、普段使う授乳用品 | 成長に伴う入替え。ミルク変更・調乳法を販売目的で勧めない |
| 6 | 停電への備え | 手持ち機器の確認後。LEDライト、適合する電池、モバイルバッテリー | 型番・端子・表示・安全注意。ポータブル電源は機器ごとの適合確認が必要で初手にはしない |
| 7 | 持ち出し袋、家具、ボンベ、感震ブレーカー | 条件を確認する節。袋・固定用品・適合する燃焼器具・ブレーカー | 一律のセット推奨を避け、使える条件と相談先を示す。工事・適合の確認を省かない |
| 8 | 遠征記事/ツール | 持ち物への補足。雨具、荷物用小物、充電関連 | 現在は費用整理が主目的。Amazon物販と交通・宿泊の予約は別。文脈外の商品枠を増やさない |

171、警戒レベル、ハザードマップ、通電火災、車中泊避難は情報確認が主目的で、最初の販売導線の入口としての優先度は低い。在宅避難記事は生活用品の確認への案内に使えるが、安全条件の説明より先に商品を見せない。

導線の設計案：記事の根拠・使い方 → 計算/記入 → 手持ち確認 → 不足と条件の確認 → 任意の購入検討。後日リンクを入れる場合には、広告表記とAmazon所定の識別、参加登録した媒体・リンク形式、価格等の扱いを公式規約で再確認する。売上のための虚偽レビュー、特別リンクのクリックへの報酬、知人への購入依頼は採らない。[運営規約](https://affiliate.amazon.co.jp/help/operating/agreement)、[ポリシー](https://affiliate.amazon.co.jp/help/operating/policies)。

## 6. 検索以外の流入

| 経路 | 向き不向き（推論） | 実施するなら | 確認した原典・限界 |
|---|---|---|---|
| X | 計算の使い方を短く見せる、遠征の予算整理には向く。新規アカウントから確実に売れる根拠はない | 家族条件の例や独自のチェック図と記事への任意リンク。投稿ごとに内容を変える。関連のない返信・DM・大量同文投稿はしない | [X Authenticity](https://help.x.com/en/rules-and-policies/authenticity)は大量・重複・無関係の投稿やリンクのみの反復等を禁じる。所有アカウント・フォロワー・実績未確認 |
| Pinterest | 収納配置、チェック表、期限ラベルなど保存する図に向く。急ぎの制度告知には不向き | 自作の図を実際の説明ページへつなぐ。ピンの情報だけでも役立つ内容にする。直接Amazonリンクより自サイトの解説への導線を先に検討 | [商用・アフィリエイト指針](https://policy.pinterest.com/en/commercial-and-branded-content-guidelines)は独自性・透明性・適度な利用等を求める。Pinterestが許してもAmazonの条件が別途適用される。日本語圏の到達数未確認 |
| Yahoo!知恵袋等Q&A | 困りごとの調査には向く。商品販売目的の送客には不向き | 公開された疑問を匿名の検索意図として参考にする。広告・自作自演質問・リンク誘導を目的に投稿しない | [知恵袋の利用ルール](https://chiebukuro.yahoo.co.jp/topic/guide/rule/index.html)に商業・広告目的の利用禁止がある。他Q&Aの規約は未確認なので同一ルールと決め付けない |
| 既存のコミュニティ | 投稿ルールと参加者の要望が一致するときのみ、役立つ図・計算の紹介に余地 | 管理者のルールに従い、求められた場面で提供する。大量投稿・無断DM・販売件数を満たすための購入依頼はしない | 所有媒体、投稿権限、許可、到達数は未確認。実際の投稿は別途利用者の判断が必要 |

Amazonアソシエイトとインフルエンサーの申請条件を混同しない。利用媒体の登録と各媒体の規約を申請時に再確認する。[Amazon申請審査のSNS欄](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)。有料広告によるAmazon送客には適格販売の制限があるため、この2週間案には広告出稿を含めない。[2026年4月20日改定案内](https://affiliate.amazon.co.jp/help/operating/compare)。

## 7. 次の2週間：優先タスク5つ

期間案：2026-10-15〜10-28。実際の申請・サイト変更・SNS投稿は、この調査PRの作業範囲に含めない。期限までの3件達成は約束しない。

| 優先 | 期間 | タスク・成果物 | 次へ進む判断材料 |
|---|---|---|---|
| 1 | 10/15〜16 | 利用者が公開状態、申請先媒体、現在のアクセス確認手段を確認し、申請するか判断。未申請表記と実際の状態が一致することを確認 | 申請日・審査状態、商品リンクを使える状態、対象媒体が確認できる。3件が審査条件であって承認保証ではないことを共有 |
| 2 | 10/16〜19 | 携帯トイレの記事/計算から購入検討までの具体例を用意。実在する箱の回数・内訳・保存表示を原典で確認した比較メモを作る | 不足回数を読者自身が理解でき、既存品で足りる場合も示す。リンク導入時は登録・表記・規約を再確認 |
| 3 | 10/19〜21 | 水の容器容量・置き場所、期限ラベルのいずれかを、現物写真・寸法・記入済み例で説明する | 上の候補12件から独自の体験を提供できるものを選ぶ。実測していない内容は実測扱いにしない |
| 4 | 10/21〜24 | 利用者の運営媒体で、計算例と自作図を使う少数のX投稿/Pinterestピン案を作り、媒体ルールに沿って公開するか判断 | 投稿先URLと条件を記録。反応を見ずに同文・類似図を大量増産しない。Q&Aで販売目的の送客をしない |
| 5 | 10/25〜28 | 実際の検索表示・流入、商品リンクの利用状況、Amazonが報告する適格販売を確認し、携帯トイレ/水の導線を一つずつ見直す | Search Console等が利用可能なら表示された検索語を記録。Amazon側の実績は利用者が確認。データがない欄は未確認のままにし、足りない売上を知人購入で埋めない |

申請・公開の準備が確認できなければタスク1を継続する。閲覧されていなければ入口・発見経路を、閲覧されても利用されなければ記入例・不足確認を見直す。クリックがあっても適格販売がない場合は、価格・条件・適合・読者の目的を再確認する。少数の結果から因果関係や市場需要を断定しない。

## 8. 参照と更新

参照URLは各表・段落に直接列挙した。検索調査語は表の検索語列と候補12件の列が記録。特定日時の検索結果例であり、順位は再現しない可能性がある。競合例の情報は競合傾向の判断用で、製品・安全・健康の推奨根拠としての検証を済ませたものではない。

今後取得する実データ：公開URLの到達とインデックス、検索語別の表示/訪問、ツール利用の状況、申請日と媒体、商品表示の確認日、Amazonの適格販売報告。現時点ではすべて未確認。広告や測定手段を実装する際は現在の追跡なしの説明との整合も別Issueで扱う。
