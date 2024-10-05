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

このチュートリアルでは、RESTful APIの基本的な概念から実装まで、段階的に学んでいきます。
これにより、Webアプリケーション開発に不可欠なAPIの作成スキルを習得することができます。

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

まず、`Article`構造体を定義しましょう。
Goの構造体（struct）は、このシナリオに最適です。
以下のように、タイトル、説明（desc）、内容（content）を持つ`Article`構造体を作成します：

```go
type Article struct {
    Title string `json:"Title"`
    Desc string `json:"desc"`
    Content string `json:"content"`
}

// let's declare a global Articles array
// that we can then populate in our main function
// to simulate a database
var Articles []Article
```

この構造体は、サイト上の記事を表現するために必要な3つのプロパティを含んでいます。
これを機能させるために、インポートリストに"`encoding/json`"パッケージを追加する必要があります。

`main`関数を更新して、`Articles`変数にダミーデータを追加しましょう。
これにより、後でデータの取得と変更ができるようになります：

```go
func main() {
	Articles = []Article{
		Article{Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		Article{Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}
	handleRequests()
}
```

これで準備が整いました。
次は、ここで定義したすべての記事を返す`/articles`エンドポイントを作成しましょう。

# 全記事の取得
このパートでは、HTTP GETリクエストを受け取ると、サイトの全記事を返す新しいRESTエンドポイントを作成します。

まず、`returnAllArticles`という新しい関数を作成します。
この関数は、先ほど作成した`Articles`変数をJSON形式でエンコードして返す単純なタスクを行います：

**main.go**
```go:main.go
func returnAllArticles(w http.ResponseWriter, r *http.Request){
    fmt.Println("Endpoint Hit: returnAllArticles")
    json.NewEncoder(w).Encode(Articles)
}
```

`json.NewEncoder(w).Encode(Articles)`の呼び出しにより、Articles配列がJSON文字列にエンコードされ、レスポンスの一部として書き込まれます。

この機能を動作させるには、`handleRequests`関数に新しいルートを追加する必要があります。
これにより、`http://localhost:10000/articles`へのアクセスが新しく定義した関数にマッピングされます：

```go
func handleRequests() {
    http.HandleFunc("/", homePage)
    // add our articles route and map it to our 
    // returnAllArticles function like so
    http.HandleFunc("/articles", returnAllArticles)
    log.Fatal(http.ListenAndServe(":10000", nil))
}
```

これで準備が整いました。
`go run main.go`でコードを実行し、ブラウザで`http://localhost:10000/articles`を開くと、記事リストのJSON表現が以下のように表示されるはずです：

**response**
```js
[
  {
    Title: "Hello",
    desc: "Article Description",
    content: "Article Content"
  },
  {
    Title: "Hello 2",
    desc: "Article Description",
    content: "Article Content"
  }
];
```

これで最初のAPIエンドポイントが正常に定義されました。

次のパートでは、従来の`net/http`ルーターの代わりに`gorilla/mux`ルーターを使用するようにREST APIを更新します。
ルーターを変更することで、後で必要になる着信HTTPリクエスト内のパスやクエリパラメータの解析などのタスクをより簡単に実行できるようになります。

# ルーターの導入
標準ライブラリは、シンプルなREST APIを立ち上げて実行するために必要なすべてを提供していますが、基本的な概念を理解したところで、サードパーティのルーターパッケージを導入する時期が来たと思います。

最も注目され、広く使用されているのは「gorilla/mux」ルーターです。

gorilla/muxの利点：
1. より柔軟なルーティング機能
2. パスやクエリパラメータの簡単な取得
3. HTTPメソッドに基づいたルーティング

このパッケージを導入することで、より高度で柔軟なAPIの開発が可能になります。
標準ライブラリから移行することで、以下のような利点があります：

1. コードの可読性の向上
2. より複雑なルーティングルールの実装が容易に
3. ミドルウェアの使用が簡単

# ルーターの構築
既存の`main.go`ファイルを更新し、標準ライブラリのHTTPルーターを`gorilla/mux`ベースのルーターに置き換えます。
`handleRequests`関数を以下のように修正して、新しいルーターを作成します：

**main.go**
```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    "github.com/gorilla/mux"
)

… // Existing code from above
func handleRequests() {
    // creates a new instance of a mux router
    myRouter := mux.NewRouter().StrictSlash(true)
    // replace http.HandleFunc with myRouter.HandleFunc
    myRouter.HandleFunc("/", homePage)
    myRouter.HandleFunc("/all", returnAllArticles)
    // finally, instead of passing in nil, we want
    // to pass in our newly created router as the second
    // argument
    log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
    fmt.Println("Rest API v2.0 - Mux Routers")
    Articles = []Article{
        Article{Title: "Hello", Desc: "Article Description", Content: "Article Content"},
        Article{Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
    }
    handleRequests()
}
```

このコードを実行すると、システムの動作に大きな変化はありません。
同じポートで起動し、アクセスするエンドポイントに応じて同じ結果を返します。

主な違いは、gorilla/muxルーターを使用することで、このチュートリアルの後半でパスやクエリパラメータを簡単に取得できるようになることです。

**$ go run main.go**を実行すると、以下のように表示されます：

```
REST API v2.0 - Mux Routers
```

# パス変数の使用
ここまでで、ホームページと全記事を返す簡単なREST APIを作成しました。
では、1つの記事だけを表示したい場合はどうすればよいでしょうか？

`gorilla/mux`ルーターのおかげで、パスに変数を追加し、その変数に基づいて返す記事を選択できます。
`handleRequests()`関数内の`/articles`ルートの下に新しいルートを追加しましょう：

```go
myRouter.HandleFunc("/article/{id}", returnSingleArticle)
```

パスに`{id}`を追加しました。
これは、特定の記事を返すときに使用するID変数を表します。

まず、`Article`構造体にIdプロパティを追加します：

```go
type Article struct {
	Id      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}
```

次に、`main`関数を更新して`Articles`配列のId値を設定します：

```go
func main() {
	Articles = []Article{
		Article{Id: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		Article{Id: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}
	handleRequests()
}
```

`returnSingleArticle`関数でURLから`{id}`値を取得し、その条件に一致する記事を返すことができるようになりました。
データをどこにも保存していないため、まずはブラウザに渡されたIDを返すだけにしましょう。

```go
func returnSingleArticle(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    key := vars["id"]

    fmt.Fprintf(w, "キー: " + key)
}
```

このコードを実行し、`http://localhost:1000/article/1`にアクセスすると、ブラウザに`キー: 1`と表示されるはずです。

次に、この`key`値を使用して、そのキーに一致する特定の記事を返すようにしましょう。

```go
func returnSingleArticle(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    key := vars["id"]

    // すべての記事をループで回す
    // article.Idが渡されたキーと一致する場合
    // その記事をJSONでエンコードして返す
    for _, article := range Articles {
        if article.Id == key {
            json.NewEncoder(w).Encode(article)
        }
    }
}
```

`go run main.go`でこのコードを実行し、ブラウザで`http://localhost:10000/article/1`を開きます：

**`http://localhost:10000/article/1`のレスポンス**
```js
{
"Id": "1",
"Title": "こんにちは",
"desc": "記事の説明",
"content": "記事の内容"
}
```

これで、キー`1`に一致する記事がJSON形式で返されるのが確認できます。

# 記事の作成と更新
このチュートリアルのパートでは、CRUD REST APIの「Create（作成）」、「Update（更新）」、「Delete（削除）」の部分を構築します。
すでに「Read（読み取り）」については、単一の記事と全記事の両方を読み取る機能を実装しました。

## 新しい記事
新しい記事を作成する機能を実装するため、`main.go`ファイルに`createNewArticle()`関数を追加します。

```go
func createNewArticle(w http.ResponseWriter, r *http.Request) {
	// POSTリクエストのボディを取得
	// リクエストボディを含む文字列レスポンスを返す
	reqBody, _ := ioutil.ReadAll(r.Body)
	fmt.Fprintf(w, "%+v", string(reqBody))
}
```

この関数を定義したら、`handleRequests`関数内のルートリストに新しいルートを追加できます。
今回は、`.Methods("POST")`をルートの末尾に追加して、このルートがHTTP POSTリクエストのみに応答するように指定します：

```go
func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/articles", returnAllArticles)
	// 注意：ここでの順序が重要です！他の `/article` エンドポイントより
	// 先にこれを定義する必要があります。
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	myRouter.HandleFunc("/article/{id}", returnSingleArticle)
	log.Fatal(http.ListenAndServe(":10000", myRouter))
}
```

このコードを実行し、以下のような内容のPOSTリクエストを送信してみてください：

```js
{
    "Id": "3", 
    "Title": "Newly Created Post", 
    "desc": "The description for my new post", 
    "content": "my articles content" 
}
```

このエンドポイントが呼び出され、リクエストボディの内容がそのままエコーバックされるはずです。

新しいエンドポイントが正しく動作することを確認したら、`createNewArticle`関数を更新して、リクエストボディのJSONを新しい`Article`構造体にアンマーシャルし、それを`Articles`配列に追加するようにしましょう：

```go
func createNewArticle(w http.ResponseWriter, r *http.Request) {
    // POSTリクエストのボディを取得
    // これを新しいArticle構造体にアンマーシャル
    // その後、Articles配列に追加
    reqBody, _ := ioutil.ReadAll(r.Body)
    var article Article 
    json.Unmarshal(reqBody, &article)
    // グローバルなArticles配列を更新して
    // 新しいArticleを含める
    Articles = append(Articles, article)

    json.NewEncoder(w).Encode(article)
}
```

このコードを実行し、同じPOSTリクエストをアプリケーションに送信すると、以前と同じJSON形式でレスポンスが返されますが、新しい記事が`Articles`配列に追加されていることも確認できます。

これを`http://localhost:10000/articles`にアクセスして確認してください：

**`http://localhost:10000/articles`のレスポンス**

```js
[
	{
		"Id": "1",
		"Title": "こんにちは",
		"desc": "記事の説明",
		"content": "記事の内容"
	},
	{
		"Id": "2",
		"Title": "こんにちは 2",
		"desc": "記事の説明",
		"content": "記事の内容"
	},
	{
		"Id": "3",
		"Title": "新しく作成された投稿",
		"desc": "新しい投稿の説明",
		"content": "記事の内容"
	}
]
```

これで、REST APIに「Create（作成）」機能を追加することに成功しました！

次のセクションでは、記事を削除できる新しいAPIエンドポイントの追加方法を学びます。

# 記事の削除
REST APIでデータを削除するには、識別子を受け取り、それに関連するものを削除する`DELETE`エンドポイントを公開する必要があります。

`main.go`ファイルに`deleteArticle`関数を追加します：

```go
func deleteArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	for index, article := range Articles {
		if article.Id == id {
			Articles = append(Articles[:index], Articles[index+1:]...)
		}
	}
}
```

`handleRequests`関数にこの新しい`deleteArticle`関数へのルートを追加します：

```go
func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/articles", returnAllArticles)
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	// 新しいDELETEエンドポイントを追加
	myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
	myRouter.HandleFunc("/article/{id}", returnSingleArticle)
	log.Fatal(http.ListenAndServe(":10000", myRouter))
}
```

`http://localhost:10000/article/2`にHTTP DELETEリクエストを送信して試してみてください。

注意：この実装は単純化のためグローバル変数を更新しています。スレッドセーフにするには、Mutexの使用を検討してください。

# 記事の更新
最後に実装するのは更新エンドポイントです。
このエンドポイントはHTTP PUTメソッドを使用し、DELETE エンドポイントと同様に `Id` パスパラメータを取ります。
また、JSONリクエストボディも必要です。

この PUT リクエストのボディにあるJSONには、更新したい記事の新しいバージョンが含まれます。

