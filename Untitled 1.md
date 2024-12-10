以下のように修正しました。内容を整理しつつ、読みやすい日本語で表現しています。

  

**第三章 Ginを使ってみよう**

  

この章では、Go言語のウェブフレームワーク **Gin Gonic** を使ったアプリケーション開発の第一歩を踏み出します。

まずはお馴染みの「Hello World」プログラムを作成し、その後、HTMLレンダリングやBootstrapの統合まで進めていきます。

  

**Hello Gin**

  

「Hello World」プログラムを作成する手順は以下の通りです。新しいプロジェクトをセットアップして、Ginの基本を学んでいきましょう。

  

**プロジェクトのセットアップ**

  

1. **ターミナルを開く**

「GO_PATH/source」ディレクトリに移動します。これはすべてのプロジェクトを保存するディレクトリです。

2. **プロジェクトフォルダの作成**

新しいフォルダを作成し、名前を「hello_gin」とします。

3. **フォルダへの移動**

作成したフォルダに移動します。

4. **Goモジュールの初期化**

以下のコマンドを実行して新しいモジュールを初期化します：

  

go mod init hello_gin

  

  

5. **モジュールファイルの確認**

go.mod ファイルを確認し、新しいモジュール「hello_gin」とGoのバージョンが記載されていることを確認します。

6. **VS Codeでプロジェクトを開く**

フォルダをVS Codeで開きます。

7. **main.goの作成**

プロジェクト内に main.go ファイルを作成します。

  

**Ginのインストール**

  

Ginパッケージをプロジェクトに追加するには、以下の手順を実行します：

1. **VS Codeのターミナルを開く**

2. 以下のコマンドを実行してGinをインストールします：

  

go get github.com/gin-gonic/gin

  

  

  

これで、プロジェクトにGinがインストールされました。

  

**最初のルートとHTMLレンダリング**

  

次に、Ginを使った最初のコードを書いていきます。

  

**main.goにコードを記述**

  

1. **パッケージ名**を main とします。

2. **Ginルーターの作成**

gin.Default() を呼び出して、デフォルトのミドルウェア付きルーターを作成します。

  

以下はコードの例です：

  

package main

  

import (

"net/http"

  

"github.com/gin-gonic/gin"

)

  

func main() {

r := gin.Default()

  

_// HTMLテンプレートをロード_

r.LoadHTMLGlob("templates/views/*")

  

_// ルート定義_

r.GET("/", func(c *gin.Context) {

c.HTML(http.StatusOK, "index.html", gin.H{

"title": "hello_gin",

})

})

  

_// サーバーを起動_

r.Run() _// デフォルトポートは8080_

}

  

**HTMLテンプレートの準備**

  

1. **ディレクトリの作成**

プロジェクト内に templates/views フォルダを作成します。

2. **index.htmlの作成**

以下の内容で index.html ファイルを作成します：

  

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

  

3. **プログラムの実行**

ターミナルで以下のコマンドを実行します：

  

go run main.go

  

ブラウザで http://localhost:8080 にアクセスすると、「hello_gin」と表示されるはずです。

  

**Bootstrapの統合**

  

次に、プロジェクトに **Bootstrap** を追加してUIを改善します。

  

**Bootstrapの導入手順**

  

1. **Bootstrapのダウンロード**

[Bootstrap公式サイト](https://getbootstrap.com/docs/5.3/getting-started/download/) から、コンパイル済みのCSSとJavaScriptファイルをダウンロードします。

2. **静的ファイルの配置**

• プロジェクト内に static/vendor フォルダを作成します。

• ダウンロードしたBootstrapファイルを static/vendor/bootstrap に配置します。

3. **静的ファイルサーバーの設定**

main.go の main 関数に以下を追加します：

  

r.Static("/static", "./static")

  

  

4. **テンプレートの修正**

index.html の <head> にBootstrapのCSSを追加します：

  

<link rel="stylesheet" href="/static/vendor/bootstrap/css/bootstrap.min.css">

  

**ビューの改善**

  

1. **レイアウトの分割**

• templates/layout フォルダを作成し、header.html と footer.html を作成します。

• header.html にはHTMLドキュメントの開始部分を記述します。

• footer.html にはHTMLドキュメントの終了部分を記述します。

2. **index.htmlの更新**

ヘッダーとフッターを組み込むようテンプレートを修正します：

  

{{ template "layout/header.html" . }}

<h1>{{ .title }}</h1>

{{ template "layout/footer.html" . }}

  

**実行して確認**

  

コードを保存し、再度 go run main.go を実行します。ブラウザでページを更新すると、Bootstrapが適用され、美しいデザインになっていることを確認できます。

  

以上で、Ginを使った基本的なウェブアプリケーション開発が完了です。この章では、Hello Worldから始めて、HTMLレンダリングやBootstrap統合までを学びました。次の章では、さらに高度な機能を追加していきます！