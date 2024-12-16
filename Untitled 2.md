# Bootstrap Integration

この記事では、プロジェクトに **Bootstrap** を組み込む方法を解説します。Bootstrapを利用することで、プロジェクトに美しいレスポンシブデザインを簡単に追加できます。

---

## Bootstrapとは？

**Bootstrap** は、レスポンシブなUIを構築するためのフロントエンドツールキットです。洗練されたCSSコンポーネントが多数用意されており、ユーザーインターフェースを効率的にデザインすることができます。

以下はBootstrap導入後のイメージ例です：

![[Pasted image 20241019115939.png]]

---

## Bootstrapの導入手順

### ### 1. Bootstrapのダウンロード

1. [Bootstrap公式サイト](https://getbootstrap.com/docs/5.3/getting-started/download/) にアクセスします。
2. ダウンロードページで、**コンパイル済みのCSSとJavaScriptファイル** を選択してダウンロードしてください。

   > **ポイント**: ソースファイルではなく、コンパイル済みファイルを選択することで、すぐに利用可能な状態でセットアップできます。

ダウンロードするファイルは以下のような構成になっています：

- **CSSファイル**: デザインやレイアウトに使用します。
- **JavaScriptファイル**: モーダルやナビゲーションなどの動的な要素をサポートします。

以下はダウンロードページのイメージです：

![[Pasted image 20241019120051.png]]

---

### ### 2. プロジェクトの設定

Bootstrapをプロジェクトで使用するために、以下の手順を実行してください：

1. **静的ファイル用のディレクトリ作成**
   - プロジェクトのルートディレクトリに `static` フォルダを作成します。
   - このフォルダは、CSS、JavaScript、画像などの静的リソースを管理するために使用します。

   ```bash
   mkdir static
   ```

2. **外部ライブラリ用のサブフォルダ作成**
   - `static` フォルダ内に `vendor` フォルダを作成し、外部ライブラリを管理します。

   ```bash
   mkdir static/vendor
   ```

3. **Bootstrapファイルの解凍と配置**
   - ダウンロードしたBootstrapのファイルを `static/vendor` フォルダに解凍します。
   - 解凍後、フォルダ名を `bootstrap` に変更してわかりやすくします。

   ```bash
   mv path_to_downloaded_files static/vendor/bootstrap
   ```

   > **補足**: BootstrapのCSSファイルは `static/vendor/bootstrap/css`、JavaScriptファイルは `static/vendor/bootstrap/js` 内に保存されます。

以下は、正しいディレクトリ構造の例です：

```
project/
├── static/
│   ├── vendor/
│       ├── bootstrap/
│           ├── css/
│           ├── js/
```

この構造により、静的リソースを簡単に管理・アクセスできるようになります。

![[Pasted image 20241019120158.png]]

---

### 3. コードの変更

#### 静的ファイルサーバーの設定

Ginフレームワークを使用して静的ファイルを提供するために、`main.go` の `main` 関数に以下のコードを追加します：

```go
r.Static("/static", "./static")
```

これにより、`/static` パスを介して静的ファイルを提供できるようになります。

#### main.goのサンプルコード

以下は変更後の `main.go` の例です：

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()

    // 静的ファイルの設定
    r.Static("/static", "./static")

    // テンプレートの設定
    r.LoadHTMLGlob("templates/views/*")

    // ルートの定義
    r.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{
            "title": "Bootstrap Integration",
        })
    })

    // サーバーの起動
    r.Run()
}
```

![[Pasted image 20241019120356.png]]

---

## ビューの作成

次に、ヘッダーやフッターのレイアウトをテンプレートとして定義します。

### 1. レイアウトディレクトリの作成

1. `templates/layout` ディレクトリを作成します。
2. この中に以下の2つのテンプレートファイルを作成します：
   - `header.html`
   - `footer.html`

### 2. header.htmlの内容

HTMLドキュメントの開始部分を記述します。ここでは、BootstrapのCSSやフォントの読み込み設定を行います。

```html
{{ define "layouts/header.html" }}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/static/vendor/bootstrap/css/bootstrap.min.css">
    <title>{{ .title }}</title>
</head>
<body>
    <div class="container">
{{ end }}
```

### 3. footer.htmlの内容

HTMLドキュメントの終了部分を記述します。

```html
{{ define "layouts/footer.html" }}
    </div>
</body>
</html>
{{ end }}
```

### 4. index.htmlの修正

メインテンプレートにヘッダーとフッターを組み込みます。

```html
{{ define "views/index.html" }}
    {{ template "layouts/header.html" . }}
    <h1 class="text-center mt-5">Welcome to Bootstrap Integration!</h1>
    {{ template "layouts/footer.html" . }}
{{ end }}
```

これにより、ヘッダーとフッターが他のテンプレートでも再利用可能になります。

![[Pasted image 20241019120459.png]]

---

## サーバーの再起動と動作確認

1. ターミナルで以下を実行し、サーバーを再起動します：

   ```bash
   go run main.go
   ```

2. ブラウザを開き、`http://localhost:8080` にアクセスします。
3. Bootstrapが適用されたスタイリッシュなページが表示されていることを確認してください。

![[Pasted image 20241019120525.png]]

---

## おわりに

これで、GinプロジェクトにBootstrapを組み込む手順が完了しました。Bootstrapを活用すれば、簡単に美しいレスポンシブデザインを実現できます。また、ヘッダーやフッターのテンプレート化により、効率的で再利用性の高い開発が可能になります。

次のステップでは、さらに高度なレイアウトやBootstrapコンポーネントを活用して、プロジェクトをより魅力的に仕上げてみましょう！

