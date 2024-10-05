Webアプリケーションを開発する場合、アプリケーションの動的な部分にデータを表示したり、データベース内の情報を更新・削除したりするために、1つ以上のREST APIとやり取りすることがほとんどです。

このチュートリアルでは、`GET`、`POST`、`DELETE`、`PUT`エンドポイントを備えた本格的なREST APIを構築します。
これにより、完全なCRUD操作を行うことができるようになります。

このチュートリアルでは基本的な概念に焦点を当てるため、扱う記事の保存にバックエンドのデータベース技術は使用しません。
しかし、将来的にデータベースとの連携が必要になった場合に備えて、簡単に更新できるような方法でREST APIを設計します。

この記事で使用する完全なソースコードは、以下のリンクで入手できます
[TutorialEdge/create-rest-api-in-go-tutorial](https://github.com/TutorialEdge/create-rest-api-in-go-tutorial)

# 前提条件

- 開発マシンにGo バージョン1.11以上がインストールされていること

# 目標
このチュートリアルを終えると、以下のことができるようになります：

1. Goを使用して独自のRESTful APIを作成する方法を理解する
2. プロジェクト内にREST APIのエンドポイントを作成し、POST、GET、PUT、DELETEのHTTPリクエストを処理できるようにする

このチュートリアルでは、RESTful APIの基本的な概念から実装まで、段階的に学んでいきます。これにより、Webアプリケーション開発に不可欠なAPIの作成スキルを習得することができます。

# RESTアーキテクチャ

RESTは現在、Webサイトから企業向けアプリケーションまで、あらゆる場所で使用されています。
RESTfulアーキテクチャスタイルは、ソフトウェアコンポーネント間の通信を実現する強力な方法です。
REST APIを構築することで、以下のメリットがあります：

1. 消費者（クライアント）と生産者（サーバー）を容易に分離できる
2. 通常、設計上ステートレス（状態を持たない）である

REST APIの基本概念についてさらに学びたい場合は、「[RESTful APIとは何か？](https://tutorialedge.net/software-eng/what-is-a-rest-api/)」という記事をご覧ください。

このアーキテクチャの特徴により、RESTは柔軟で拡張性の高いシステムを構築する際に非常に有用です。
このチュートリアルでは、このような強力なRESTful APIをGoを使って実際に構築していく方法を学んでいきます。

# JSONについて
このチュートリアルでは、すべての情報の送受信にJavaScript Object Notation（JSON）を使用します。
幸いなことに、Goには標準ライブラリパッケージ「`encoding/json`」があり、JSONフォーマットのエンコードとデコードを簡単に行うことができます。

注意：
「`encoding/json`」パッケージについてさらに詳しく知りたい場合は、[公式ドキュメント（encoding/json）](https://pkg.go.dev/encoding/json)をご覧ください。

# マーシャリングについて
Goのデータ構造をJSONに簡単に変換するために、「マーシャリング」という技術を使用します。
マーシャリングは以下の特徴を持つバイトスライスを生成します：

1. 非常に長い文字列を含む
2. 余分な空白を含まない

マーシャリングの利点：

1. Goの複雑なデータ構造を、JSONという標準的なフォーマットに変換できる
2. APIを通じてデータを送信する際に効率的

このプロセスにより、Goプログラム内のデータ構造を簡単にJSON形式に変換し、APIを通じて送信することができます。
逆に、受信したJSONデータをGoのデータ構造に変換することも可能です（これを __アンマーシャリング__ と呼びます）。

# 基本的なAPIの作成
まずは、HTTPリクエストを処理できる簡単なサーバーを作成します。
`main.go`という新しいファイルを作成し、その中に3つの重要な関数を定義します。

1. `homePage`関数：ルートURLへのリクエストを処理します。
2. `handleRequests`関数：アクセスされたURLパスと定義された関数をマッチングさせます。
3. `main`関数：APIを起動します。

以下が`main.go`の内容です。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Welcome to the HomePage!")
    fmt.Println("Endpoint Hit: homePage")
}

func handleRequests() {
    http.HandleFunc("/", homePage)
    log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
    handleRequests()
}
```

このコードを実行すると、ポート10000で簡単なAPIが起動します（他のプロセスがこのポートを使用していない場合）。
ブラウザで`http://localhost:10000/`にアクセスすると、「Welcome to the HomePage!」と表示されるはずです。
これで、REST APIを構築するための基礎ができました。

注意：Goを使用したWebサーバーの作成についてより詳しく知りたい場合は、「[Go(Lang)を使用した簡単なWebサーバーの作成](https://tutorialedge.net/golang/creating-simple-web-server-with-golang/)」というチュートリアルをチェックしてください。

# 記事（Article）の構造体を定義する

これから作成するREST APIは、Webサイト上の記事の作成（CREATE）、読み取り（READ）、更新（UPDATE）、削除（DELETE）を可能にします。これらの操作をまとめて「CRUD」と呼びます。

まず、`Article`構造体を定義しましょう。Goの構造体（struct）は、このシナリオに最適です。以下のように、タイトル、説明（desc）、内容（content）を持つ`Article`構造体を作成します：

go

Copy

``type Article struct {     Title string `json:"Title"`    Desc string `json:"desc"`    Content string `json:"content"` } // グローバルなArticles配列を宣言します // これをmain関数内で初期化し、データベースを模倣します var Articles []Article``

この構造体は、サイト上の記事を表現するために必要な3つのプロパティを含んでいます。これを機能させるために、インポートリストに`"encoding/json"`パッケージを追加する必要があります。

次に、`main`関数を更新して、`Articles`変数にダミーデータを追加しましょう。これにより、後でデータの取得と変更ができるようになります：

go

Copy

`func main() {     Articles = []Article{        Article{Title: "こんにちは", Desc: "記事の説明", Content: "記事の内容"},        Article{Title: "こんにちは 2", Desc: "記事の説明", Content: "記事の内容"},    }    handleRequests() }`

これで準備が整いました。次は、ここで定義したすべての記事を返す`/articles`エンドポイントを作成しましょう。

このステップにより、APIが扱うデータの基本構造が定義され、初期データが設定されました。次は、これらのデータをAPIを通じて操作する方法を実装していきます。