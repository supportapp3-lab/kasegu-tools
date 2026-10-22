# 暮らしの計算室 / 防災備蓄 計算

Issue #1の範囲で実装した、依存・ビルド不要の静的HTML/CSS/JavaScriptサイトです。

## ローカル確認

```sh
python -m http.server 8000
```

`http://localhost:8000/`からツールと各案内ページへ移動できます。
GitHub Pages用404ページの絶対パスは `/kasegu-tools/` を前提にします。
404を含む本番相当の確認では、親フォルダを配信し `http://localhost:8000/kasegu-tools/` を開いてください。

## 機能と計算

- 大人・子ども・乳幼児の合計人数×日数から、水3L/日、トイレ5回/日、主食3食/日を計算。
- 水の2Lボトル換算は切り上げ。人数各0〜999、任意日数1〜365。
- 年齢別に係数は変えない簡易目安。生活用水・おかず・乳幼児の個別用品は別途。
- ペット有りは補足の表示だけで、人用の必要量には加算しません。
- 入力変更で再計算。URLに人数・日数・ペットの有無を保持し共有できます。
- コピーを拒否される場合は手動コピー欄を表示。計算用のスクリプトには入力の送信・追跡・外部ライブラリはありません。アクセス解析にはGoogle アナリティクス 4を利用します（[プライバシーポリシー](privacy/index.html)）。
- 静的な使い方・計算式・7日分早見表・7問のFAQ、計算根拠リンクと免責文を掲載。
- モバイル、ライト/ダーク、ラベル、キーボード操作、ライブ結果表示に対応。

## テスト・lint（依存の追加不要）

```sh
node tests/bichiku.test.js
node --check assets/js/bichiku.js
python scripts/lint.py
git diff --check
```

HTML lintはPython標準ライブラリで、タグの対応、重複ID/属性、見出し階層、フォームラベル、JSON-LD、内部リンクとアンカー、基本メタデータを検査します。ブラウザ表示やLighthouseの代替ではありません。

## GitHub Pagesの有効化（管理者が実施）

1. PRをレビューしてから管理者がmainへマージしてください。この実装はmainへ直接pushしません。
2. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
3. mainへのpush、またはmainを選んだワークフローの手動実行で、検証済みの静的ファイルが公開されます。
4. PRでは検証だけを実行し、Pagesへデプロイしません。
5. 公開URLは `https://supportapp3-lab.github.io/kasegu-tools/` を想定しています。別URLへ移す場合はcanonical、OGP、JSON-LD、sitemap、robots、404内のパスを更新してください。

Pagesの設定やブランチ保護、Secretsなどは変更していません。公開は未実施です。

sitemap の `lastmod` は公開時に git 履歴から自動生成されます。`sitemap.xml` には URL だけを書き、新しいページを追加するときは従来どおり `<loc>` を追加してください。

## 広告・商品・問い合わせの枠

広告は `data-slot="top|middle|bottom"`、商品枠は `data-category="water|toilet|food"` にあります。
配信スクリプト・商品リンク・問い合わせURL・投げ銭URLは未設置です。アフィリエイトリンクを後で追加する場合は `rel="sponsored noopener"` を使い、広告表記とプライバシーポリシーを見直してください。未設定URLへクリックさせるダミーリンクは設置していません。

## 確認の範囲

Lighthouseは90以上を目標とした軽量な構成です。スコアを保証するものではありません。
計算は目安であり自治体の指示と各家庭の事情を優先してください。AdSenseの審査通過や収益を保証しません。

## OGP画像のローカル再生成

`assets/og/`の13枚のPNGは生成済みファイルをコミットします。CIとデプロイは画像生成を行いません。
再生成時だけPillowが使えるPythonと日本語フォントを用意し、次を実行します。フォントファイルや追加パッケージはリポジトリに同梱しません。

```sh
python scripts/build_og_images.py --font /path/to/NotoSansJP.ttf
```

トップは`home.png`、ツールは各ディレクトリ名のPNG、その他のsitemapページは`default.png`を参照します。文字はサイト名と短い見出しで、画像は1200×630です。フォントは使用元のライセンスに従ってください。
