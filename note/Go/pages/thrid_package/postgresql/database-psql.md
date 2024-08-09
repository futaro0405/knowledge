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

sqlファイルからtableを作成する

__example_psql.sql__
```sql
create table persons (
  name       varchar(255),
  age        integer
);
```

```
$ psql -U test_user -T example_sql -d testdb;
CREATE TABLE
```

データの追加

```go
Db, err = sql.Open("postgres", "user=test_user dbname=testdb password=password sslmode=disable")
if err != nil {
	log.Panicln(err)
}
defer Db.Close()

//C
cmd := "INSERT INTO persons (name, age) VALUES ($1, $2)"
_, err := Db.Exec(cmd, "Nancy", 20)
if err != nil {
	log.Fatalln(err)
}
```

データの取得

```go
//R
cmd := "SELECT * FROM persons where age = $1"
row := Db.QueryRow(cmd, 20)
var p Person
err = row.Scan(&p.Name, &p.Age)
if err != nil {
	if err == sql.ErrNoRows {
		log.Println("No row")
	} else {
		log.Println(err)
	}
}
fmt.Println(p.Name, p.Age)

cmd = "SELECT * FROM persons"
rows, _ := Db.Query(cmd)
defer rows.Close()
var pp []Person
for rows.Next() {
	var p Person
	err := rows.Scan(&p.Name, &p.Age)
	if err != nil {
		log.Println(err)
	}
	pp = append(pp, p)
}
err = rows.Err()
if err != nil {
	log.Fatalln(err)
}
for _, p := range pp {
	fmt.Println(p.Name, p.Age)
}
```

データの更新

```go
//U
cmd := "UPDATE persons SET age = $1 WHERE name = $2"
_, err := Db.Exec(cmd, 25, "Nancy")
if err != nil {
	log.Fatalln(err)
}
```

データの削除

```go
//D
cmd := "DELETE FROM persons WHERE name = $1"
_, err := Db.Exec(cmd, "Nancy")
if err != nil {
	log.Fatalln(err)
}
```

