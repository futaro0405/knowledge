# Golang MySQLチュートリアル
Golangの学習を進めると、データベースとの連携は避けられません。  
このチュートリアルでは、GoでMySQLデータベースに接続し、基本的なSQL文を実行する方法を紹介します。  

MySQLは現在、開発者が利用できる最も有名で広く使用されているデータベース技術の1つです。  
巨大なコミュニティがあります。  
Wordpressのメインデータベース技術として、ウェブの半分を支えている可能性があります。  
ローカルでMySQLインスタンスを簡単に起動でき、優れたアプリケーションの構築に適しています。  

注意：技術選択は人気だけで決めるべきではありません。CockroachDBやNoSQLデータベースなどの代替案を検討する必要がある場合もあります。

MySQLドライバーとして https://github.com/go-sql-driver/mysql を使用します。  
Go-SQL-Driverは軽量で高速なMySQLドライバーで、以下の特徴があります：  

1. `TCP/IPv4`、`TCP/IPv6`、`Unixドメインソケット`、またはカスタムプロトコルでの接続をサポート
2. 切断された接続の自動処理機能

このドライバーを使用することで、GoプログラムからMySQLデータベースに効率的にアクセスできます。  

Github Repo: [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql)  

# コネクションプーリング
高性能なデータベースアプリケーションを構築する場合、コネクションプーリングは絶対に必要です。  
幸いなことに、このチュートリアルで使用するオープンソースパッケージは、`database/sql`標準パッケージを使用しているため、自動的にコネクションプーリングを行います。  

これは以下を意味します：

1. データベースにクエリを実行するたびに、アプリケーション起動時に設定された接続プールから接続を使用します。
2. これらの接続は何度も再利用されます。
3. クエリを実行するたびに新しい接続を作成・破棄する必要がありません。

これにより、データベース操作のパフォーマンスが大幅に向上します。

# 実装
ローカルマシンのデータベースに接続し、基本的なinsertとselectの操作を行います。  

## MySQLデータベースへの接続
新しいmain.goファイルを作成します。  
必要なパッケージをインポートし、ローカルで実行中のデータベースへの接続を設定します。
このチュートリアルでは、`phpmyadmin`を使用してMySQLを起動し、testという名前のデータベースを作成しています。  
`sql.Open`を使用してデータベースに接続し、自動接続プールを設定します。  

```go
package main

import (
    "fmt"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    fmt.Println("Go MySQL チュートリアル")

    // データベース接続を開く
    // ローカルマシンのphpmyadminでデータベースを設定
    // データベース名は test
    db, err := sql.Open("mysql", "ユーザー名:パスワード@tcp(127.0.0.1:3306)/test")

    // 接続エラーがあれば処理
    if err != nil {
        panic(err.Error())
    }

    // main関数の実行後に接続を閉じる
    defer db.Close()
}
```

このコードで、MySQLデータベースへの基本的な接続が設定されます。

# 結果からの構造体への格納
データベースから結果セットを取得するだけでなく、それらの結果を読み取り、既存のstructsに格納して簡単に解析・修正できるようにする必要があります。  
複数の行を解析するには、.Scan(args...)メソッドを使用します。  
これは任意の数の引数を受け取り、複合オブジェクトに値を格納できます。  

```go
// Tag - シンプルな構造体
type Tag struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}
```

```go
func main() {
    // データベース接続を開く
    db, err := sql.Open("mysql", "root:pass1@tcp(127.0.0.1:3306)/tuts")
    if err != nil {
        log.Print(err.Error())
    }
    defer db.Close()

    // クエリを実行
    results, err := db.Query("SELECT id, name FROM tags")
    if err != nil {
        panic(err.Error()) // 実際のアプリではpanicではなく適切なエラー処理を行う
    }

    for results.Next() {
        var tag Tag
        // 各行の結果をtag複合オブジェクトにスキャン
        err = results.Scan(&tag.ID, &tag.Name)
        if err != nil {
            panic(err.Error()) // 実際のアプリではpanicではなく適切なエラー処理を行う
        }
        // tagのName属性を出力
        log.Printf(tag.Name)
    }
}
```

この例では、tagsデータベースから2つのカラムを取得し、.Scanを使用してtagオブジェクトに値を格納しています。  

注意：データベースから3つのフィールドを取得し、Scanに2つのパラメータしかない場合、失敗します。正確に一致する必要があります。  

# 単一行のクエリ
IDを使って単一の行を検索し、構造体に格納する場合は以下のようにします：

```go
var tag Tag
// クエリを実行
err = db.QueryRow("SELECT id, name FROM tags where id = ?", 2).Scan(&tag.ID, &tag.Name)
if err != nil {
    panic(err.Error()) // 実際のアプリではpanicではなく適切なエラー処理を行う
}

log.Println(tag.ID)
log.Println(tag.Name)
```

# 結論
このチュートリアルでは、以下のことを行いました：

- MySQLへの接続設定
- 簡単なクエリの実行
- 返された結果をstructまたはstructsの配列にマッピング

これらの基本を理解することで、MySQLを使用したGoアプリケーションの開発を進めることができます。  
このチュートリアルが役立った場合や、さらに支援が必要な場合は、コメント欄でお知らせください。  

