# 検索エンジンに見つけてもらう経路の点検

確認日: 2026-10-17（JST）  
対象: `main` の `6688c8af4687e00b80297bd932da31b7f9fe57d0`  
公開URL: [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/)

## 1. 前提と実測

main の `sitemap.xml` にある `<loc>` は **40 件**です。サイトマップは [https://supportapp3-lab.github.io/kasegu-tools/sitemap.xml](https://supportapp3-lab.github.io/kasegu-tools/sitemap.xml) です。依頼者の記録では、Search Console の所有権確認・サイトマップ送信・URL検査からの登録リクエストは 2026-10-14 に実施済みで、表示回数とインデックス数は 2026-10-20 に確認予定です。この文書では Search Console の実測値を確認できていないため、数値を補いません。

## 2. GitHub Pages のサブパスと robots.txt / sitemap

このリポジトリは共有ホスト `supportapp3-lab.github.io` の `/kasegu-tools/` 配下に公開されています。Google の説明では、robots.txt はサイトのトップレベルに置き、その規則は配置先のホスト・プロトコル・ポートに適用されます（[robots.txt の仕様](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)）。そのため、このリポジトリの [robots.txt](https://supportapp3-lab.github.io/kasegu-tools/robots.txt) はプロジェクトのサブパスにはありますが、Google がホストのルートで確認する [https://supportapp3-lab.github.io/robots.txt](https://supportapp3-lab.github.io/robots.txt) をこのリポジトリから作成・制御することはできません。現在のファイルは `Allow: /` とサブパスのサイトマップURLを記載しています。サイトマップ自体は独立して公開され、依頼者の記録では Search Console から送信済みです。

Google はサイトマップをサイト内の任意の場所に置ける一方、Search Console に送信しない場合は親ディレクトリの子孫にだけ影響すると説明しています（[サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)）。このサイトマップ内のURLはすべて `/kasegu-tools/` 配下です。既に Search Console に送信済みという前提なら、ホストルートにある別サイトマップをこのリポジトリで用意する対応は不要です。

| このリポジトリでできること | ホスト側の権限が必要なこと |
| --- | --- |
| サブパス内の `robots.txt` とサイトマップを維持し、Search Console に正しいサイトマップを送信する | `https://supportapp3-lab.github.io/robots.txt` のようなホストルートのファイルを設置・変更する |

**現状の判断:** リポジトリ内の `robots.txt` はサブパスで提供されるファイルです。Search Console に送信済みのサイトマップは別の発見経路として利用できます。main の現状からは、ホストルートの設定変更が必要だとは判断しません。

## 3. sitemap のURLとトップからのクリック深さ

main のHTMLで `<a href="…">` をたどり、同一プロジェクト内のHTMLページについて幅優先探索しました。深さはトップを0クリックとします。「最初にリンクしているページ」は、探索で最短経路上に最初に見つかった直前ページです。起点のトップには親ページがありません。

| sitemap URL | 最短クリック数 | 最初にリンクしているページ |
| --- | ---: | --- |
| [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) | 0 | トップ（起点） |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/about/](https://supportapp3-lab.github.io/kasegu-tools/about/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/privacy/](https://supportapp3-lab.github.io/kasegu-tools/privacy/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/contact/](https://supportapp3-lab.github.io/kasegu-tools/contact/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/pet-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/pet-bichiku/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/baby-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/baby-bichiku/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/toilet-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/toilet-bichiku/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/rolling-stock/](https://supportapp3-lab.github.io/kasegu-tools/tools/rolling-stock/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/portable-power/](https://supportapp3-lab.github.io/kasegu-tools/tools/portable-power/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/ensei-hi/](https://supportapp3-lab.github.io/kasegu-tools/tools/ensei-hi/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/ensei-hi/](https://supportapp3-lab.github.io/kasegu-tools/guides/ensei-hi/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/](https://supportapp3-lab.github.io/kasegu-tools/guides/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/bichiku-nannichibun/](https://supportapp3-lab.github.io/kasegu-tools/guides/bichiku-nannichibun/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/rolling-stock-hajimekata/](https://supportapp3-lab.github.io/kasegu-tools/guides/rolling-stock-hajimekata/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/keitai-toilet-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/keitai-toilet-bichiku/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/pet-bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/pet-bousai-bichiku/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/baby-bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/baby-bousai-bichiku/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/hijoushoku-erabikata/](https://supportapp3-lab.github.io/kasegu-tools/guides/hijoushoku-erabikata/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/mizu-kumioki-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/mizu-kumioki-bichiku/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/](https://supportapp3-lab.github.io/kasegu-tools/tools/bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/cassette-bombe-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/cassette-bombe-bichiku/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/mochidashi-bukuro/](https://supportapp3-lab.github.io/kasegu-tools/guides/mochidashi-bukuro/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/saigai-dengon-171/](https://supportapp3-lab.github.io/kasegu-tools/guides/saigai-dengon-171/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/kagu-tentou-boushi/](https://supportapp3-lab.github.io/kasegu-tools/guides/kagu-tentou-boushi/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/teiden-sonae/](https://supportapp3-lab.github.io/kasegu-tools/guides/teiden-sonae/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/hazard-map-hinan/](https://supportapp3-lab.github.io/kasegu-tools/guides/hazard-map-hinan/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/keikai-level/](https://supportapp3-lab.github.io/kasegu-tools/guides/keikai-level/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/tsuuden-kasai/](https://supportapp3-lab.github.io/kasegu-tools/guides/tsuuden-kasai/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/kanshin-breaker/](https://supportapp3-lab.github.io/kasegu-tools/guides/kanshin-breaker/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/zaitaku-hinan/](https://supportapp3-lab.github.io/kasegu-tools/guides/zaitaku-hinan/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/shachuhaku-hinan/](https://supportapp3-lab.github.io/kasegu-tools/guides/shachuhaku-hinan/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/yukioroshi-jiko-boushi/](https://supportapp3-lab.github.io/kasegu-tools/guides/yukioroshi-jiko-boushi/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/yukimichi-tachioujou/](https://supportapp3-lab.github.io/kasegu-tools/guides/yukimichi-tachioujou/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/jishin-sokugo-kodo/](https://supportapp3-lab.github.io/kasegu-tools/guides/jishin-sokugo-kodo/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/guides/tsunami-hinan/](https://supportapp3-lab.github.io/kasegu-tools/guides/tsunami-hinan/) | 2 | [https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/](https://supportapp3-lab.github.io/kasegu-tools/guides/bousai-bichiku/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/planter-soil/](https://supportapp3-lab.github.io/kasegu-tools/tools/planter-soil/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/paint-quantity/](https://supportapp3-lab.github.io/kasegu-tools/tools/paint-quantity/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/wallpaper-quantity/](https://supportapp3-lab.github.io/kasegu-tools/tools/wallpaper-quantity/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |
| [https://supportapp3-lab.github.io/kasegu-tools/tools/aquarium-volume/](https://supportapp3-lab.github.io/kasegu-tools/tools/aquarium-volume/) | 1 | [https://supportapp3-lab.github.io/kasegu-tools/](https://supportapp3-lab.github.io/kasegu-tools/) |

**結果:** sitemap の 40 URLはすべてトップから到達可能で、最長は2クリックです。sitemap内で到達できないURLは0件、到達したHTMLページのうちsitemapにないURLも0件でした。計算を再現するスクリプトは次節に記載します。

## 4. Google がページを見つけ、クロール・登録する流れ

Google はクロール可能なリンクをたどってURLを見つけ、サイトマップもURL発見の手掛かりとして使います。リンクは通常、`href` を持つHTMLの `<a>` 要素にします（[クロール可能なリンクのベストプラクティス](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)）。Google 検索の工程はURLの発見、クロール、インデックス登録、検索結果への表示に分かれ、各工程は保証されません（[Google 検索の仕組み](https://developers.google.com/search/docs/fundamentals/how-search-works)）。

Search Console のURL検査から登録をリクエストできますが、これはクロールや検索結果への掲載を保証しません。再クロールの依頼にはプロパティへの適切な権限が必要で、リクエスト枠にも制限があります。同じURLを繰り返し送っても処理は速くなりません（[Google に再クロールを依頼する](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)）。依頼者が10月14日に送信済みのため、予定どおり10月20日に Search Console の実測を見て、未登録URLがあれば理由を確認するのが次の判断点です。

## 5. Google以外: IndexNow と Bing Webmaster Tools

### IndexNow

IndexNow の仕様は、ホストの所有確認として公開キーファイルを求めています。ルート配置が推奨ですが、同一ホスト上のサブディレクトリ配置も許され、その場合は通知に `keyLocation` を指定します。仕様の例では、`/catalog/` 内のキーは `/catalog/` で始まるURLに使え、別ディレクトリのURLには使えません（[公式仕様](https://www.indexnow.org/documentation)）。したがって、プロジェクト内に公開キーを置き `keyLocation=https://supportapp3-lab.github.io/kasegu-tools/<key>.txt` とする形は、仕様にあるサブディレクトリ規則上は `/kasegu-tools/` 配下だけを対象にできます。これは仕様からの適用判断であり、このサイトでの送信・検証は行っていません。

IndexNow のプロトコルでは、アカウント登録手順ではなくキーファイルによるホスト確認とHTTP通知を定めています。公式FAQの案内する送信先は Bing、Naver、Seznam.cz、Yandex、Yep と共通エンドポイントなどです。送信を受け取った検索エンジンは参加エンジン間でURLを共有します（[FAQ](https://www.indexnow.org/faq)、[参加検索エンジン](https://www.indexnow.org/searchengines)、[参加エンジン一覧データ](https://www.indexnow.org/searchengines.json)）。受信はクロールや登録の保証ではありません。GitHub Pagesでキーを公開できることだけでは、実際の受け付け結果までは確認できないため、導入と通知自動化はユーザー判断の後に別作業とします。今回の依頼範囲ではキーの追加も外部送信もしていません。

### Bing Webmaster Tools

Bing Webmaster Tools はアカウントを作成してサイトを追加し、サイト全体または適切なパスについて所有権を証明する必要があります。Search Console からインポートする方法では、Googleアカウント情報へのアクセス許可を求め、正常にインポートされたサイトは自動確認されます。手動追加ではXML認証ファイル、HTMLメタタグ、DNSレコードなどの確認方法があります（[サイトの追加と所有権確認](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)）。この作業にはユーザーのアカウントと選択が必要なので、こちらでは登録・連携しません。閲覧した公式ヘルプは料金を明記していないため、費用は断定しません。

## 6. 採らない施策

検索順位を操作する目的の相互リンク・リンク購入、価値の乏しい自動生成ページ、無関係な掲示板やQ&Aへの宣伝リンク投稿は提案しません。Google は、検索順位を操作するリンクや検索向けだけで利用者価値の乏しい大量生成コンテンツをスパムポリシーで扱っています（[Google ウェブ検索のスパムに関するポリシー](https://developers.google.com/search/docs/essentials/spam-policies)）。Bingもウェブマスター向けガイドラインを公開しています（[Bing Webmaster ガイドライン](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)）。

## 7. 次の実装候補とユーザー判断

| 対象ファイル・変更案 | 変更しない範囲・完了条件 | 作業量 | アカウント・費用 | 検索流入への効果 |
| --- | --- | --- | --- | --- |
| `tests/test_build_sitemap.py` と既存CI: sitemapのURLがローカルHTMLに対応し、各ページがトップからリンクで到達できることを検査する | 公開HTML・サイトマップ生成仕様は変えない。新しいページを追加した際に孤立ページや存在しないURLをCIで検出する | 小 | 不要 | 低。現在は全件到達済みで、将来のリンク切れを予防する品質確認 |
| 将来の独立Issue: IndexNow用のキーと公開後通知を追加する | 実装前にキーの置き場所とGitHub Pages上での受理確認を決める。受理・送信結果を記録し、公開URLだけを通知する | 中 | アカウント登録手順は仕様に記載なし。ホスト確認用キーが必要。費用は公式資料で確認できず | 低。対応エンジンに変更URLを通知する仕組みだが、登録・順位は保証されない |
| ユーザー作業: Bing Webmaster ToolsにプロジェクトURLを追加し、所有権確認後にサイトマップを確認する | ユーザーがアカウント作成またはSearch Console連携を選ぶ。リポジトリ変更なし | 小（ユーザー作業） | アカウントと所有権確認が必要。閲覧したヘルプに費用記載なし | 低。Bingで発見状況を確認する経路が増えるが、掲載は保証されない |

### ユーザーに確認すること

- Bing Webmaster Tools のアカウント作成、または Search Console との連携を希望するか。
- IndexNow の公開キーと公開後通知を別Issueで実装するか。実装する場合は、公開URLをIndexNow参加エンジンへ送信することを了承するか。
- 2026-10-20以降、Search Consoleで表示回数・インデックス状況・未登録URLの理由を確認し、その結果を次の判断に使う。

## 8. 再現手順と公式資料

### mainの対象を確認する

```sh
git rev-parse main
grep -c '<loc>' sitemap.xml
```

この調査時点のmainは `6688c8af4687e00b80297bd932da31b7f9fe57d0`、`<loc>` は 40 件でした。

### クリック深さ表を再生成する

リポジトリのルートで Python 3 を実行します。外部パッケージやHTTPアクセスは使わず、チェックアウト済みHTMLと `sitemap.xml` を読みます。幅優先探索なので最初に記録された経路が最短です。

```python
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

BASE = "https://supportapp3-lab.github.io/kasegu-tools/"
HOST = "supportapp3-lab.github.io"
PREFIX = "/kasegu-tools/"

class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hrefs = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "a":
            href = dict(attrs).get("href")
            if href:
                self.hrefs.append(href)

def normalize(raw, source):
    u = urlsplit(urljoin(source, raw))
    if u.scheme not in ("http", "https") or u.netloc != HOST:
        return None
    path = u.path
    if not path.startswith(PREFIX):
        return None
    if path.endswith("/index.html"):
        path = path[:-len("index.html")]
    elif not Path(path).suffix and not path.endswith("/"):
        path += "/"
    return f"https://{HOST}{path}"

def local_html(url):
    path = unquote(urlsplit(url).path)
    rel = path[len(PREFIX):]
    candidate = Path(rel) if rel else Path("index.html")
    if rel and (candidate.is_dir() or urlsplit(url).path.endswith("/")):
        candidate = candidate / "index.html"
    return candidate if candidate.is_file() else None

import xml.etree.ElementTree as ET
root = ET.parse("sitemap.xml").getroot()
sitemap = [el.text for el in root.iter() if el.tag.endswith("loc") and el.text]
seen = {BASE: (0, None)}
queue = deque([BASE])
reachable_html = set()

while queue:
    page = queue.popleft()
    depth = seen[page][0]
    file = local_html(page)
    if not file:
        continue
    reachable_html.add(page)
    parser = Links()
    parser.feed(file.read_text(encoding="utf-8"))
    for href in parser.hrefs:
        target = normalize(href, page)
        if target and target not in seen and local_html(target):
            seen[target] = (depth + 1, page)
            queue.append(target)

print("| URL | 最短クリック数 | 最初にリンクしているページ |")
print("| --- | ---: | --- |")
for url in sitemap:
    depth, parent = seen.get(url, ("到達不可", None))
    first = f"[{parent}]({parent})" if parent else ("トップ（起点）" if depth == 0 else "—")
    print(f"| [{url}]({url}) | {depth} | {first} |")
print("sitemap内で未到達:", [u for u in sitemap if u not in seen])
print("到達したHTMLのうちsitemap外:", sorted(reachable_html - set(sitemap)))
```

### 公式資料（すべて2026-10-17に確認）

- Google, [robots.txt の仕様](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- Google, [サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Google, [クロール可能なリンクのベストプラクティス](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- Google, [Google 検索の仕組み](https://developers.google.com/search/docs/fundamentals/how-search-works)
- Google, [Google に再クロールを依頼する](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- Google, [Google ウェブ検索のスパムに関するポリシー](https://developers.google.com/search/docs/essentials/spam-policies)
- Bing, [サイトの追加と所有権確認](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- Bing, [Webmaster ガイドライン](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- IndexNow, [プロトコル仕様](https://www.indexnow.org/documentation)
- IndexNow, [FAQ](https://www.indexnow.org/faq)
- IndexNow, [参加検索エンジン](https://www.indexnow.org/searchengines)
- IndexNow, [参加エンジン一覧データ](https://www.indexnow.org/searchengines.json)
