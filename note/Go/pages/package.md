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
	if err != nil {
		log.Fatalln(err)
	}
	defer f.Close()
	
	bs := make([]byte, 128)
	n, err := f.Read(bs)
	fmt.Println(n)
	fmt.Println(string(bs))

	bs2 := make([]byte, 128)
	nn, err := f.ReadAt(bs2, 10)
	fmt.Println(nn)
	fmt.Printlln(string(bs2))
}

// 16
// Hello
// GolangYeah
// 6
// ngYeah
```

`f.Read(bs)`
bsをReadで読み込んだ内容を書き込む
戻り値として読み込んだバイト数とエラーを返す

`f.ReadAt(bs2, 10)`
10byte目から読み込む

## `Openfile`

`O_RDONLY`：読み込み専用
`O_WRONLY`：書き込み専用
`O_RDWR`：読み書き可能
`O_APPEND`：ファイル末尾に追記
`O_CREATE`：ファイルがなければ作成
`O_TRUNC`：可能であればファイルの内容をオープン時に空にする

`0666`パーミッション
`|`を用いて複数のフラグをしてすることもできる。

```go
f, err := os.Openfile("foo.txt", os.O_RDWR|O_CREATE, 0666)
if err != nil {
	log.Fatalln(err)
}
defer f.Close()

bs := make([]byte, 128)
n, err := f.Read(bs)
fmt.Println(n)
fmt.Println(string(bs))
```

## time

```go
func main() {
	// 時間の生成
	// 今の時間
	t := time.Now()
	fmt.Println(t)

	// 指定した時間を生成 2020/06/10 10:10:10
	t2 := time.Date(2020, 6, 10, 10, 10, 10, 0, time.Local)
	fmt.Println(t2)
	// 年
	fmt.Println(t2.Year())
	// 通算日
	fmt.Println(t2.YearDay())
	// 月
	fmt.Println(t2.Month())
	// 曜日
	fmt.Println(t2.Weekday())
	// 日
	fmt.Println(t2.Day())
	// 時
	fmt.Println(t2.Hour())
	// 分
	fmt.Println(t2.Minute())
	// 秒
	fmt.Println(t2.Second())
	// ナノ秒
	fmt.Println(t2.Nanosecond())
	// タイムゾーン
	fmt.Println(t2.Zone())

	fmt.Printf("%T\nt", time.June)
	fmt.Printf("%T\n", time.June.String())
}
```

time.Duration型は時間の間隔を表現する

```go
// 時刻の間隔を表現
fmt.Println(time.Hour)
fmt.Printf("%T\n", time.Hour)
fmt.Println(time.Minute)
fmt.Println(time.Second)
fmt.Println(time.Millisecond)
fmt.Println(time.Microsecond)
fmt.Println(time.Nanosecond)

// 1h0m0s
// time.Duration
// 1m0s
// 1s
// 1ms
// 1μs
// 1ns

// time.Duration型を文字列から生成する
d, _ := time.ParseDuration("2h30m")
fmt.Println(d)
```

time.Duration型はtime.Time型と合わせて使用すると威力を発揮する。
time.Time型に任意の時間間隔を与えることができる

```go
t3 := time.Now()
t3 = t3.Add(2*time.Minute + 15*time.Second)
fmt.Println(t3)

t5 := time.Date(2020, 7, 24, 0, 0, 0, 0, time.Local)
t6 := time.Now()

d2 := t5.Sub(t6)
fmt.Println(d2)

fmt.Println(t6.Before(t5))
fmt.Println(t6.After(t5))
fmt.Println(t5.Before(t6))
fmt.Println(t5.After(t6))

t7 := time.Date(2020, 10, 1, 9, 0, 0, 0, time.Local)
t8 := time.Date(2020, 10, 1, 0, 0, 0, 0, time.UTC)
fmt.Println(t7.Equal(t8))
//fmt.Println(t7.Equal(t6))

t9 := t5.AddDate(1, 0, 0)
t10 := t5.AddDate(0, -1, 0)
t11 := t5.AddDate(0, 0, 1)
t12 := t5.AddDate(0, 2, -12)
fmt.Println(t9)
fmt.Println(t10)
fmt.Println(t11)
fmt.Println(t12)

t13, err := time.Parse("2006/01/02", "2020/06/10")
if err != nil {
	log.Fatal(err)
}
fmt.Println(t13)

t14, err := time.Parse(time.RFC822, "27 Nov 15 18:00 JST")
if err != nil {
	log.Fatal(err)
}
fmt.Println(t14)

fmt.Printf("%T\n", t13.Format("2006/01/02"))

utc := t14.UTC()
fmt.Println(utc)

jst := t.Local()
fmt.Println(jst)

unix := t13.Unix()
fmt.Println(unix)

time.Sleep(5 * time.Second)
fmt.Println("5秒停止後表示")

ch := time.Tick(3 * time.Second)
for {
	t15 := <-ch
	fmt.Println(t15)
}

ch2 := time.After(5 * time.Second)
fmt.Println(<-ch2)
OuterLoop:
for {
	select {
	case m := <-ch:
		fmt.Println(m)
	case <-time.After(2 * time.Second):
		fmt.Println("Timed Out")
		break OuterLoop
	}
}
```
























