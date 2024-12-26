この章では、Go言語の人気ウェブフレームワーク Gin を使って、簡単なウェブアプリを作成します。
画面に「Hello, Gin!」と表示するシンプルなアプリを作成しながら、プロジェクトのセットアップ、HTMLテンプレートの利用、Bootstrapを使ったデザイン改善までを学びましょう。

---
# Ginのセットアップをしよう
まずは、Ginを使った基本的な動作を確認するための準備を進めます。
## ステップ1:新しいプロジェクトフォルダを作る
Goのプロジェクトを1つのフォルダで管理します。以下の手順で新しいフォルダを作成し、その中で作業を進めましょう。

ターミナル（またはコマンドプロンプト）を開きます。
以下のコマンドを実行して、 `hello_gin` という名前のフォルダを作成し、そのフォルダに移動します。

```bash
mkdir ~/hello_gin
cd ~/hello_gin
```

このフォルダが今回のプロジェクトの作業場所になります。

## ステップ2:Goモジュールを初期化する
Goでは、プロジェクトを「モジュール」という単位で管理します。以下のコマンドを実行してモジュールを初期化しましょう。

```bash
go mod init hello_gin
```

実行すると、`go.mod` というファイルと`go.sum`というファイルが生成されます。このファイルには、プロジェクトの名前や依存関係が記録されます。

## ステップ3:プロジェクトをエディタで開く
プロジェクトを管理しやすくするため、Visual Studio Code（VS Code）などのエディタでフォルダを開きます。

```bash
code .
```

## ステップ4:Ginをインストールする
Ginフレームワークを使用するには、プロジェクトにライブラリを追加します。以下のコマンドを実行してください。

```bash
go get github.com/gin-gonic/gin
```

これで、Ginのインストールが完了しました。 `go.mod` ファイルを確認すると、Ginが依存ライブラリとして記載されているのがわかります。

# Ginを使ったアプリの作成
次に、実際に「Hello Gin!」とブラウザに表示させてみましょう。
## ステップ5:main.goを作成する
プロジェクトフォルダ内に `main.go` という名前のファイルを作成します。このファイルがアプリケーションのエントリーポイント（最初に実行されるファイル）です。

## ステップ6:コードを書く
では実際に main.go を書いていきましょう。ウェブサーバーを立ち上げ、画面に「Hello, Gin!」を表示します。
以下の手順に沿ってコードを段階的に記述します。

### パッケージと基本構造を記述
パッケージ名を`main`とし、コードの一番上に`package main`と記述します。
main 関数を追加して基本構造を作ります。必要なパッケージのインポートは自動で補完される場合があります。

パッケージ名はmainとします。コードの一番上に`package main`と書きます。
importパッケージについてはGoの拡張機能が自動的に行います。場所だけ用意しましょう。

```go:main.go
package main

import ()

func main() {
}
```

### Ginルーターの作成
`gin.Default()` を使用して新しいGinルーターを作成します。このルーターはデフォルトのミドルウェアが組み込まれています。さらに、gin.Logger() を使用してログ出力を有効にします。

```go:main.go
package main

import ()

func main() {
    // Ginのルーターを作成
    r := gin.Default()
    r.Use(gin.Logger())
}
```

### GETリクエストのルートを定義
`r.GET()` を使用してルートを定義します。リクエストを受け取るたびに実行されるハンドラ関数を追加します。

```go:main.go
func main() {
    r := gin.Default()
    r.Use(gin.Logger())

	// ルートハンドラを定義
	r.GET("/", func(c *gin.Context) {
	})
}
```

### HTMLテンプレートのロード
`r.LoadHTMLGlob()` を使用してテンプレートを読み込みます。テンプレートはプロジェクト内の `templates/views` フォルダに保存します。このフォルダは後ほど作成します。

```go:main.go
func main() {
    r := gin.Default()
    r.Use(gin.Logger())

	// HTMLテンプレートをロード
	r.LoadHTMLGlob("templates/views/*")

	r.GET("/", func(c *gin.Context) {
	})
}
```

### HTMLのレンダリングを追加
`c.HTML()` を使用してHTTPステータスコードとテンプレートを指定し、レンダリングします。
テンプレートに渡すデータは `gin.H` を使用して定義します。

ステータスコードには、 `http.StatusOK`（成功を意味する200）を指定します。
テンプレート名はロードしたテンプレートファイルのパス（例: `index.html`）です。そして、テンプレートに渡すデータは `gin.H` を用いてキーと値のペアで記述します。

```go:main.go
func main() {
    r := gin.Default()
    r.Use(gin.Logger())

    r.LoadHTMLGlob("templates/views/*")

    // ルートハンドラを定義
    r.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{
            "title": "Hello, Gin!",
        })
    })
}
```

"index.html" は、r.LoadHTMLGlob でロードしたテンプレート内のファイルと一致する必要があります。
`gin.H`はGoのmapを簡潔に記述するためのヘルパーです。この場合、テンプレートで `{{ .title }}` と記述することで、"Hello, Gin!" が表示されます。

ファイルを保存すると、必要なパッケージが自動的にインポートされます。
ログを追加するには、log.Println()関数を使用します。
サーバーを起動するには、r.Run()を呼び出します。デフォルトのポートは8080です。

```go:main.go
    // サーバーを起動
    log.Println("Server Started!")
    r.Run()
```

最終的な`main.go`はこちらです。

```go:main.go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(gin.Logger())

	r.LoadHTMLGlob("templates/views/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Hello, Gin!",
		})
	})

	log.Println("Server Started!")
	r.Run()
}
```

### HTMLテンプレートの作成：
HTMLファイルを用意して、画面に表示する内容を定義します。Ginでは、HTMLテンプレートを利用して動的に内容を変更できます。

以下の手順でテンプレートを作成しましょう。

プロジェクト内に templates/views フォルダを作成します。このフォルダはHTMLテンプレートを保存する場所です。
その中に index.html を作成します。このファイルがウェブページの見た目を定義します。
以下の内容を index.html に記述してください。

```html:templates/views/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ .title }}</title>
</head>
<body>
    <h1>{{ .title }}</h1>
</body>
</html>
```

`<title>{{ .title }}</title>` と `<h1>{{ .title }}</h1>` は、Goのテンプレート構文を使用しています。
`{{ .title }}` の部分に、Goコードから渡される値が埋め込まれます。

`{{ .title }}` はGinの `gin.H` で渡すキーに対応しています。
例えば、`gin.H{"title": "Hello, Gin!"}` と渡すと、このテンプレートで「Hello, Gin!」が表示されます。
これにより、動的に内容を変更可能なウェブページが完成します。

### アプリの実行
プロジェクトのルートディレクトリにいることを確認して、以下のコマンドを実行します。

```bash
go run main.go
```

このコマンドにより、main.go ファイルがコンパイルされ、サーバーが起動します。
ウェブブラウザを開き、以下のURLにアクセスします。

```
http://localhost:8080
```

## おわりに

この章では、Ginを使った基本的なウェブアプリケーションを作成しました。
