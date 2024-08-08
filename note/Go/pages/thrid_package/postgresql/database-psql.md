Postgresqlの対話的ターミナルを起動する

```
$ psql

// データベースの一覧
# \l

// 対話的ターミナルから抜ける
# \q
```

データベースを作成
```
$ psql
// userを登録
# create user test_user with password 'password';
CREATE ROLE

// USER一覧を表示
# select username from pg_user;

test_user
(3 rows)

// いったん入りなおし
# \q
$ psql

// データベースの作成
# create database testdb owner test_user;
CREATE DATABASE
```

goから接続する

```go
package main

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var Db *sql.DB
var err error

type Person struct {
	Name string
	Age  int
}

func main() {
	Db, err = sql.Open("postgres", "user=test_user dbname=testdb password=password sslmode=disable")
	if err != nil {
		log.Panicln(err)
	}
	defer Db.Close()
}
```