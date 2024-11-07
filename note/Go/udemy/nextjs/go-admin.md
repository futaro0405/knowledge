# setup
では、まずプロジェクトを作成しましょう。`Go`をインストール済みであることを確認してください。インストールはとても簡単です。

`golang.org`にアクセスし、`Go`をダウンロードして、自分のマシンに合ったバージョンを選んでください。

ダウンロード後、`Express`に触発されたフレームワークである`Fiber`フレームワークを使用します。

https://docs.gofiber.io/#hello-world
このコードをコピーして、`GoLand`というIDEを開きます。
まず、`go mod init ambassador`というコマンドでプロジェクトを初期化し、このプロジェクトを`ambassador`と呼びます。
これにより、まだ何も記述されていない`go.mod`ファイルが作成されます。

次に、ここで`go`ファイルを作成し、先ほどコピーしたコードを貼り付けます。

```go
package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")
}
```

このパッケージがない場合は、以下のように追加してください。

```bash
go mod tidy
```

ライブラリをダウンロード・インストールして、`go.mod`も更新されます。
ここで`go run main.go`を実行すると、プロジェクトがポート3000で動作し、「Hello World」と表示されます。
