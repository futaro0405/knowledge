# 標準package
## os

### `os.Exit()`
任意の時点で終了

```go
import (
	"os"
)

func main() {
  os.Exit(1)
  fmt.Println("Start")
}
```

`defer`文も実行されない

```go
defer func() {
	fmt.Println("defer")
}
os.Exit(0)

// exit status 0
```

ログのフィルタ

```go
func main() {
	_, err = os.Open("A.txt")
	if err != nil {
		log.Fatalln(err)
	}
}
```

`os.Open`でA.txtを呼び出しているがディレクトリ内に存在しないため、エラーハンドリングで`log.fatalln()`でエラーを出力する
`log.fatalln()`は何らかのエラーが発生したときにエラーを出しながら終了させる
引数として与えられた値を出力した後`os.Exit`の位置で実行される


```go
func main() {
	fmt.Println(os.Args[0])
	fmt.Println(os.Args[1])
	fmt.Println(os.Args[2])
	fmt.Println(os.Args[3])

	// os.Argsの要素数を表示
	fmt.Printf("length=%d\n", len(os.Args))
	// os.Argsの中身をすべて表示
	for i, v := range os.Args {
		fmt.Println(i, v)
	}
}
```

ビルドして実行ファイルにする

```tarminal
$ go build -o getargs main.go
$ ./getargs 123 456 789

./getargs
123
456
789
length=4
0 ./getargs
1 123
2 456
3 789
```

引数ありで実行する
`os.Args[]`に格納される。このArgsはstring型のsliceで任意のコマンドライン引数が格納される。
注意点として`Args[0]`はコマンドライン名が入る。
`Args[1]`から引数が格納される。

### ファイル操作
#### `Open`

```go
func main() {
	f, err := os.Open("test.txt")
	if err != nil {
		lig.Fatalln(err)
	}

	defer f.Close()
}
```

#### `Create`
新規ファイルを作成する
既に存在する場合は削除されて新規で作成されるため注意

```go
func main() {
  f, _ := os.Create("foo.txt")
  f.Write([]byte("Hello\n"))
  f.WriteAt([]byte("Golang"), 6)
  f.Seek(0, os.SEEK_END)
  f.WriteString("Yeah")
}
```

`Write`： 書き込み
`WriteAt`： ofset1を6文字目に指定して書き込み
`Seek`：`SEEK_END`を指定することでファイルの末尾にoffsetを移動
`WriteString`： 文字列を書き込み

```file
Hello
GolangYeah
```
#### `Read`
```go
func main() {
	f, err := os.Open("foo.txt")
}
```

















