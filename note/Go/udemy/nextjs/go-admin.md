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

# Docker
これで最初のシンプルなアプリを正常に実行できたので、このプロジェクトをDockerで構成していきましょう。`docker.com/products/docker-desktop`にアクセスして、自分のマシンに適したインストーラーをダウンロードしてください。

私はMacを使用していますが、Windows版やLinux版もダウンロードできます。
インストールが完了すると、Macを使用している場合は、画面上部にアイコンが表示されます。
Dockerをインストールしたら、このプログラムを実行するために2つのファイルを作成する必要があります。
1つは`docker-compose.yml`ファイルで、もう1つは`Dockerfile`です。

これらの違いは何かというと、`Dockerfile`はこのアプリを構成するためのもので、環境をそのファイル内に記述します。
一方、`docker-compose.yml`ファイルは、このプロジェクトと使用するデータベース（ここではMySQL）を接続するためのものです。

まずは`Dockerfile`から始めましょう。

`Dockerfile`内には、Goの開発環境を指定し、使用するGoのバージョンも明記する必要があります。
私は現時点での最新バージョンを使用します。これがGoのプロジェクトであることをDockerに伝えます。

次に、作業ディレクトリを指定します。`/app`と呼びますが、名前は特に重要ではありません。
次に、`go.mod`ファイルをコピーします。

```Dockerfile
COPY go.mod .
```

これは、このプロジェクトの`go.mod`ファイルを作業ディレクトリにコピーすることを意味します。
`go.sum`ファイルも同じようにコピーします。

```Dockerfile
COPY go.sum .
```

これらのファイルをプロジェクトに追加しましたので、次にパッケージを一括で取得する必要があります。
コマンドを実行してパッケージをダウンロードします。

```Dockerfile
RUN go mod download
```

これにより、パッケージを1つずつ追加する必要はありません。
`go.mod`に記載されたパッケージがDockerコンテナ内にダウンロードされます。

最後に、すべてのファイルをコピーします。

```Dockerfile
COPY . .
```

これでプロジェクト内のすべてのファイルをDockerコンテナ内にコピーします。

最後にコマンドを実行します。

```Dockerfile
CMD ["go", "run", "main.go"]
```

これで`Dockerfile`は完了です。
このファイルでは、環境を設定し、パッケージをダウンロードし、`main.go`を実行するようにしています。
非常にシンプルです。

次に、`docker-compose.yml`ファイルに移りましょう。

ここではバージョンを指定する必要があります。
最新のバージョンは`3.9`です。

```yaml
version: '3.9'
```

次に、サービスを指定します。
この講義ではバックエンドサービスのみ追加します。

```yaml
services:
	backend:
		build: .
```

`build: .`は、この`Dockerfile`を使用してバックエンドをビルドすることを意味します。
何も指定しなくても`Dockerfile`が使用されますが、もし`Dockerfile`の名前を変更した場合は、ここで指定する必要があります。

次にポートを設定します。

```yaml
`ports:
	- "8000:3000"`
```

この設定で、ポート3000を8000で使用するように変更します。

ここで直接ポートを変更します。

```yaml
ports:
	- "8000:3000"
```

この設定は、コンテナ内のポート3000を、ローカルマシンのポート8000にマッピングすることを意味します。
つまり、プロジェクトがポート3000で実行されると、そのコンテナ内でこのポートが使用され、ローカルマシン側ではポート8000としてアクセスされます。

これがどのように機能するかは、プロジェクトを実行する際に確認できます。

次に、ボリュームについてです。

```yaml
volumes:
	- .:/app
```

この設定は、現在のディレクトリ（`.`）をコンテナ内の`/app`ディレクトリにマッピングします。
つまり、作業ディレクトリです。

これにより、ファイルに変更を加えた場合、その変更がコンテナ内にも反映されます。
また、コンテナ内でファイルが変更されれば、ローカルにも反映されます。
これにより、変更が双方向にマッピングされます。

ここまでで設定は完了です。
このプロジェクトを実行するには、以下のコマンドを入力します。

```bash
docker compose up
```

これにより、デフォルトのネットワークが作成され、ネットワークを指定していなくても問題ありません。
そして、Goとその他のパッケージがダウンロードされます。
モジュールがダウンロードされているのが確認できます。

ご覧のとおり、FiberアプリがDockerコンテナ内でポート3000で実行されているのが確認できます。
しかし、ローカルホストでポート3000にアクセスしても何も表示されません。
なぜでしょうか？

それは、ポートを8000にマッピングしたからです。
ポート8000にアクセスすると、「Hello World」が表示されます。
ポート3000はコンテナ内のものなので、ローカルホストでアクセスするためにはポート8000を使う必要があります。

ここでポートを8000に統一して、Dockerコンテナを再起動する必要があります。
混乱を避けるために、コンテナ内とローカルホストの両方でポート8000を使用するようにします。

これでDockerとの接続は成功しました。
次のチュートリアルでは、データベースの追加を行います。

# Database
次に、データベースに接続し、`Gorm`パッケージを使用して接続します。

まず、`gorm.io`にアクセスして`Gorm`をインストールします。
このコマンドをコピーして新しいタブで実行し、`Gorm`をインストールしました。

SQLiteは使用せず、MySQLを使用します。これに対応するドライバーも追加しました。

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

MySQLがマシンにインストールされていなくても問題ありません。
なぜなら、Dockerコンテナ内にMySQLを追加するからです。
Dockerの利点は、マシンに何かをインストールしていなくても、Docker内でセットアップが完結することです。

データベースは`alcohol_db`という名前で、MySQLのイメージを追加します。

```yaml
mysql:
	image:
		mysql:5.7.22
		container_name: mysql_container
environment:
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: alcohol_db
ports:
- "3306:3306"
restart: always
```

このようにしてMySQLのバージョン`5.7.22`を使用します。
`restart: always`オプションを追加することで、MySQLが停止しても自動的に再起動されます。

次のステップでは、この設定でMySQLを実行し、Gormを使ってGoのアプリケーションから接続できるようにします。

これがMySQL用の全ての認証情報とデータベース設定です。
データベースを「ambassador」と呼びます。
これが作成するデータベースです。
`MYSQL_USER`は`root`、`MYSQL_PASSWORD`も`root`に設定し、`MYSQL_ROOT_PASSWORD`も`root`とします。

これらは必要な値です。お好みに応じて、ここに任意の値を設定することができます。

これで、ベースとなる設定と、データベースにログインするためのユーザーを作成しました。

次に、**ボリューム**が必要です。

```yaml
volumes:
	- ./db_data:/var/lib/mysql
```

これは非常に重要です。
`db_data`というフォルダを作成し、MySQLデータベースの内容をそこにマッピングします。
コンテナを起動すると、この`db_data`フォルダ内にMySQLのデータファイルが生成されることが確認できます。

**なぜボリュームが必要なのか**というと、これがないとMySQLのデータが永続化されず、コンテナを停止・再起動した際にデータが失われてしまいます。

最後に、オプションとして次の行を追加します。
これは、マシンにMySQLがすでにインストールされている場合にポートの競合を避けるためです。

```yaml
ports:
	- "3306:3306"
```

これにより、Docker内のMySQLがローカルの3306ポートにマッピングされます。
他にMySQLがローカルで稼働している場合は、この設定でポート競合を避けることができます。

したがって、コンテナ内のMySQLのポートは`3306`ですが、ローカルマシンでは`33306`にマッピングします。
これは、すでにローカルにMySQLがインストールされているため、ポートの競合を避けるためです。

```yaml
ports:
	- "33306:3306"
```

ローカルにMySQLがインストールされていない場合は、通常の`3306:3306`で問題ありません。

ここまででMySQLの設定が完了しました。次に、`depends_on`を追加します。

```yaml
depends_on:
	- mysql
```

**`depends_on`** とは、バックエンドコンテナがデータベースに依存していることを示します。
これにより、まずデータベースコンテナが起動し、その後にバックエンドコンテナが起動します。
順序が逆だと、データベースに接続できずにエラーが発生する可能性があります。

次に、プログラム内にデータベース接続を追加する必要があります。
以下のように、接続用の変数を作成します。

```go
package main

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

func main() {
    dsn := "root:root@tcp(mysql:3306)/ambassador?charset=utf8mb4&parseTime=True&loc=Local"
    database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database!")
    }

    // その他のコードはここに追加
}
```

`gorm.io/driver/mysql`と`gorm.io/gorm`パッケージをインポートするのを忘れないでください。
これで、プログラムからデータベースに接続できるようになります。

ここでMySQLを使用してデータベース接続を設定します。接続文字列を使い、第二パラメータとして`Gorm`の設定を渡しますが、今回は何も追加しません。

```go
dsn := "root:root@tcp(mysql:3306)/ambassador?charset=utf8mb4&parseTime=True&loc=Local"
database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
if err != nil {
    panic("Failed to connect to database!")
}
```

この部分がデータベースへの接続になります。

**接続のポイント**:

- 先に作成した認証情報を使用します。ユーザーは`root`、パスワードも`root`です。
- `mysql:3306`の部分はDockerコンテナ内でのサービス名とポート番号です。Dockerコンテナ内で実行されるため、サービス名（`mysql`）とポート（`3306`）を使用します。

もしコンテナ外から接続する場合は、通常の`localhost`を使用しますが、Dockerコンテナ内から接続する場合はサービス名を使います。

接続文字列のフォーマットは次のとおりです：

```sql
ユーザー名:パスワード@tcp(サービス名:ポート)/データベース名?charset=utf8mb4&parseTime=True&loc=Local
```

したがって、今回の接続設定は以下のようになります：

```go
dsn := "root:root@tcp(mysql:3306)/ambassador?charset=utf8mb4&parseTime=True&loc=Local"
```

これにより、`ambassador`というデータベースに接続します。

`root:root`が認証情報です。接続先データベースは`ambassador`です。

**ポイント**: Dockerコンテナ内での接続には、コンテナ内のサービス名とポート番号を指定する必要があります。接続が確立できない場合はパニックが発生し、「データベースに接続できませんでした」というエラーが表示されます。

**手順**:

1. コンテナを停止し、再度実行します。今回、データベースコンテナも構築されるため、2つのコンテナが稼働することになります。
2. 最初の実行で問題が発生した場合、データベースが再起動されていることが原因の可能性があります。再度実行して確認します。
3. `db_data`フォルダを確認すると、多くのファイルが生成されているのがわかります。これはMySQLがデータをそこに保存するためです。このフォルダを削除しないようにしてください。

**確認**: もし接続設定を`localhost`や`127.0.0.1`に変更すると、接続エラーが発生する可能性があります。

```bash
connection refused
```

**正しい接続方法**: Dockerコンテナ内では、サービス名（この場合は`mysql`）を使用します。Dockerはサービス名を使用して接続がデータベースに対するものであると認識します。

これで、データベース接続が正常に機能していることを確認できます。
# Migrations
データベースへの接続が成功したので、次はそのデータベースにテーブルを追加できるか確認してみましょう。

まず、データベースコンテナに接続します。ここではMySQLを使用します。`GoLand`を使用していない場合は、`MySQL Workbench`などを使用すると良いでしょう。

`GoLand`には右側にデータベース接続用のタブがあり、30日間の無料トライアルを利用することもできます。`GoLand`は有料ソフトウェアですが、便利です。

**接続設定**:

- ポートは`33066`
- ユーザーは`root`
- パスワードは`root`
- データベース名は`ambassador`

この設定で接続を試み、成功しました。データベースが空でテーブルがないことを確認できます。

**テーブルを追加する準備**: 新しいディレクトリを作成して、テーブルを管理します。

1. プロジェクト内にsrcディレクトリを作成します。
2. その中に`database`というフォルダを作成します。
3. その中に`db.go`という名前のGoファイルを作成します。

```bash
mkdir -p models/database
touch models/database/db.go
```

この`migrate.go`ファイルを使って、データベースにテーブルを追加するコードを書いていきます。

これでパッケージが整いましたので、データベースとの接続を行う関数を作成します。

1. **接続関数の作成**: `connect`関数を作成し、接続部分を移動します。

```go
package database

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
    dsn := "root:root@tcp(mysql:3306)/ambassador?charset=utf8mb4&parseTime=True&loc=Local"
    database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database!")
    }
    DB = database
}
```

2. **`main.go`で接続関数を使用**: `main.go`で`database.Connect()`を呼び出します。

```go
package main

import (
    "your_project/models/database"
)

func main() {
    database.Connect()
    // 他のコードはここに追加
}
```

**インポートの忘れ**: `main.go`内で`database`をインポートしてください。

3. **モデルの作成**: `models`ディレクトリを作成し、その中に`user.go`ファイルを作成します。

```go
package models

type User struct {
    ID        uint   `gorm:"primaryKey"`
    FirstName string `gorm:"size:255"`
    LastName  string `gorm:"size:255"`
    Email     string `gorm:"unique;size:255"`
    Password  string `gorm:"size:255"`
    IsAmbassador bool `gorm:"default:false"`
}
```

この構造体は`User`テーブルのカラムを表しており、`ID`はプライマリキー、`FirstName`や`LastName`は文字列型です。また、`IsAmbassador`は`bool`型で、この値によってユーザーが管理者かアンバサダーかを区別します。

この後、`migrate.go`でこの構造体を使ってテーブルを自動生成するコードを記述します。

まず、ユーザーテーブルをデータベースに作成するために、データベース接続で自動マイグレーションを行う関数を追加します。

1. **`AutoMigrate`関数の作成**: `database`パッケージ内に`AutoMigrate`関数を作成し、`Gorm`を使ってテーブルを生成します。

```go
package database

import (
    "gorm.io/gorm"
    "your_project/models"
)

func AutoMigrate() {
    if err := DB.AutoMigrate(&models.User{}); err != nil {
        panic("Failed to migrate database!")
    }
}
```

2. **`main.go`で`AutoMigrate`関数を使用**: `main.go`内でこの関数を呼び出し、テーブルを作成します。

```go
package main

import (
    "your_project/models/database"
)

func main() {
    database.Connect()
    database.AutoMigrate()
    // その他のコードを追加
}
```

3. **データベースを確認**: `docker-compose up --build`コマンドでDockerコンテナを再起動し、設定を反映させます。データベース内にテーブルが作成されるはずです。

**確認手順**:

- データベースツールまたは`GoLand`を使用してデータベースに接続し、`user`テーブルが作成されているか確認します。
- テーブルには`ID`, `FirstName`, `LastName`, `Email`, `Password`, `IsAmbassador`のカラムが含まれ、`IsAmbassador`は`tinyint`として設定されています。

**補足**: `AutoMigrate`関数は、構造体を元にデータベース内に対応するテーブルを作成し、設定も自動で行います。次のチュートリアルでは、ファイルの変更時に自動的に反映されるように設定する方法を紹介します。

# Live Reloading
この問題に対処するために、Go用のライブリローダーである`air`パッケージをインストールして、自動的にコード変更を反映できるようにします。

1. **`air`パッケージのインストール**: Dockerコンテナ内で`air`を使用するために、`Dockerfile`に以下のコマンドを追加します。

```Dockerfile
RUN curl -fLo /usr/local/bin/air https://raw.githubusercontent.com/cosmtrek/air/master/bin/linux/air && \
    chmod +x /usr/local/bin/air
```

2. **`main.go`の実行**: これにより、コンテナ内で`air`コマンドが使用できるようになります。`Dockerfile`内で`go run main.go`を削除し、代わりに`air`コマンドを使用してアプリケーションを実行します。

```Dockerfile
CMD ["air"]
```

3. **Dockerコンテナの再ビルドと実行**: `docker-compose up --build`コマンドを使用して、コンテナを再ビルド・再起動します。これにより、`air`パッケージがインストールされ、コードの変更が検知されると、自動的にアプリケーションが再実行されます。

**確認**:

- コンテナが再起動し、`air`が正しく動作しているか確認します。正常に動作していれば、コードを変更するたびにコンテナ内でアプリケーションが再実行されます。
- `air`は、コード変更時にリアルタイムで再ビルドと再実行を行うため、手動でコンテナを再起動する必要がなくなります。

これで、コードの変更が即座に反映されるようになり、開発効率が向上します。

