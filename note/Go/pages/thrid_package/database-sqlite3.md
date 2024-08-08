```go
package main

import (
	"database/sql"
	"log"

	// コードの中で使用しないので
	_ "github.com/mattn/go-sqlite3"
)
// DBを指すポインタ
var DbConnection *sql.DB

func main() {
	DbConnection, _ := sql.Open("sqlite3", "./example.sql")
	defer DbConnection.Close()
	cmd := `CREATE TABLE IF NOT EXISTS persons(
			name STRING,
			age  INT)`

	_, err := DbConnection.Exec(cmd)
	if err != nil {
		log.Fatalln(err)
	}
}
```

example.sqlの中身を確認

```
$ sqlite3 example.sql
sqlite> .table
persons
sqlite> .exit
```

## データの追加

```go
var DbConnection *sql.DB

func main() {
	cmd := "INSERT INTO persons (name, age) VALUES (?, ?)"
	_, err := DbConnection.Exec(cmd, "Nancy", 20)
	if err != nil {
		log.Fatalln(err)
	}
}
```

```
$ go run main.go
$ sqlite3 example.sql
sqlite> SELECT * FROM persons;
Nancy | 20
sqlite> .exit
```
## データの更新

```go

var DbConnection *sql.DB

func main() {
	cmd := "UPDATE persons SET age = ? WHERE name = ?"
	_, err := DbConnection.Exec(cmd, 25, "Nancy")
	if err != nil {
		log.Fatalln(err)
	}
}
```

## データの取得

```go
var DbConnection *sql.DB

type Person struct {
	Name string
	Age  int
}

func main() {
	cmd := "SELECT * FROM persons where age = ?"
	// QueryRow 1レコードしゅ
	row := DbConnection.QueryRow(cmd, 25)
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
}
```