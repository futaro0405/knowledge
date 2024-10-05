# Golang ORM
このチュートリアルでは、Go-ORMまたはGORMを使用してsqlite3データベースと簡単にやり取りする方法を学びます。
ORMは開発者と基礎となるデータベース技術の間の仲介者のように機能します。これにより、通常のオブジェクト操作で作業し、複雑なSQL文を作成せずにオブジェクトを保存できます。
SQLを直接扱いたくないがデータベースが必要な場合、ORMはコードベースの複雑さを効果的に減らします。

# インストール
`jinzhu/gorm`をインストールするには、以下のgo getコマンドを実行します：

```bash
go get -u github.com/jinzhu/gorm
```

これを実行後、任意のGoプロジェクトでjinzhu/gormをインポートできるようになります。

# 簡単な例
例えば、特定のAPIエンドポイントがアクセスされたときに新しいユーザーとそのメールアドレスをデータベースに保存するGo REST APIを作成したいとします。

ユーザーを以下のようなGo structで定義できます：

```go
// ユーザー構造体
type User struct {
    gorm.Model
    Name  string
    Email string
}
```

`User`モデルを定義した後、新しいユーザーをsqlite3データベースに保存するAPIエンドポイントを公開できます。

# 私たちのAPI
4つの異なるCRUDエンドポイントを持つ非常にシンプルなAPIを作成します。
これらは全ユーザーの取得、新規ユーザーの追加、ユーザーの削除、ユーザーの更新を行います。
`GORM`を使用することで、標準的な生のSQLを使用する場合と比べて、これらのエンドポイントの作成がはるかに簡単になります。

```go
package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/gorilla/mux"
)

func allUsers(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "All Users Endpoint Hit")
}

func newUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "New User Endpoint Hit")
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Delete User Endpoint Hit")
}

func updateUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Update User Endpoint Hit")
}

func handleRequests() {
    myRouter := mux.NewRouter().StrictSlash(true)

    myRouter.HandleFunc("/users", allUsers).Methods("GET")
    myRouter.HandleFunc("/user/{name}", deleteUser).Methods("DELETE")
    myRouter.HandleFunc("/user/{name}/{email}", updateUser).Methods("PUT")
    myRouter.HandleFunc("/user/{name}/{email}", newUser).Methods("POST")

    log.Fatal(http.ListenAndServe(":8081", myRouter))
}


func main() {
    fmt.Println("Go ORM Tutorial")

    // Handle Subsequent requests
    handleRequests()
}
```

go run main.goを実行してこの新しいAPIを起動できます。このAPIは、ORM基盤のソリューションを構築するための基本となります。

# SQLite3データベースの作成と自動スキーマ移行
プロジェクトの次のステップはデータベースの作成です。
このチュートリアルでは、使用と設定が簡単なsqlite3データベースを使用します。

注意：GORMのダイアレクトを切り替えることで、他のデータベース技術に比較的簡単に変更できます。

`db.AutoMigrate(&User{})`を呼び出すことで、GORMを使用してデータベース内にUserテーブルを自動的に作成できます。
これにより、テーブル作成のSQLスクリプトを書く手間が省けます。

```go
func initialMigration() {
    db, err := gorm.Open("sqlite3", "test.db")

    if err != nil {
        fmt.Println(err.Error())
        panic("failed to connect database")
    }
    defer db.Close()

    db.AutoMigrate(&User{})
}

func main() {
    fmt.Println("Go ORM Tutorial")

    initialMigration()

    handleRequests()
}
```

`initialMigration`関数を`main`関数内で呼び出すことで、プログラム起動時にデータベースとテーブルが自動的に作成されます。

# 全ユーザーエンドポイントの更新
`allUsers()`関数内では、データベース内の全Userレコードを検索し、それをJSONにエンコードしてレスポンスとして返します。
`db.Find(&users)`を呼び出すことで、データベース内の全ユーザーを検索できます。

```go
func allUsers(w http.ResponseWriter, r *http.Request) {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    var users []User
    db.Find(&users)
    fmt.Println("{}", users)

    json.NewEncoder(w).Encode(users)
}
```

この関数で、データベースから全ユーザーを取得し、JSONとしてクライアントに返します。

# 新規ユーザーエンドポイントの更新
`newUser()`関数を更新して、新しいユーザーをデータベースに挿入できるようにします。
これには、APIリクエストのクエリパラメータからユーザー名とメールアドレスを解析する必要があります。

エンドポイントのパスパラメータを解析し、それを使って新しいUserオブジェクトを作成します。
そして、`db.Create(&User{Name: name, Email: email})`を呼び出してSQLiteデータベースに挿入します：

```go
func newUser(w http.ResponseWriter, r *http.Request) {
    fmt.Println("新規ユーザーエンドポイントにアクセスがありました")

    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("データベース接続に失敗しました")
    }
    defer db.Close()

    vars := mux.Vars(r)
    name := vars["name"]
    email := vars["email"]

    db.Create(&User{Name: name, Email: email})
    fmt.Fprintf(w, "新規ユーザーが正常に作成されました")
}
```

この関数で、パスパラメータから情報を取得し、新しいユーザーをデータベースに追加します。

# ユーザー削除エンドポイント
`deleteUser()`関数は、パスパラメータで渡されたnameと一致するユーザーを削除します。
これは基本的な実装で、同じ名前の複数のユーザーが存在する場合の処理は行っていませんが、このプロジェクトでは良い例となります。

```go
func deleteUser(w http.ResponseWriter, r *http.Request) {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("データベース接続に失敗しました")
    }
    defer db.Close()

    vars := mux.Vars(r)
    name := vars["name"]

    var user User
    db.Where("name = ?", name).Find(&user)
    db.Delete(&user)

    fmt.Fprintf(w, "ユーザーが正常に削除されました")
}
```

この関数では、指定された名前のユーザーを検索し、見つかった場合に削除します。

