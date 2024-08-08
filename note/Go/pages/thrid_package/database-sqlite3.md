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

