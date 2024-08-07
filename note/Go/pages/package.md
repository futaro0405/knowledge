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
// 現在時刻の2分15秒後
t3 := time.Now()
t3 = t3.Add(2*time.Minute + 15*time.Second)
fmt.Println(t3)
```

時間の比較

```go
// 時間の比較
t5 := time.Date(2020, 7, 24, 0, 0, 0, 0, time.Local)
t6 := time.Now()

// t5 - t6
d2 := t5.Sub(t6)
fmt.Println(d2)

// 時刻を比較する 戻り値はtrue、false
// t6はt5より前か
fmt.Println(t6.Before(t5))
// t6はt5より後か
fmt.Println(t6.After(t5))
```

指定時間のスリープ

```go
// 5秒間停止
time.Sleep(5 * time.Second)
fmt.Println("5秒停止後表示")
```

## math
数学に関連した機能

mathパッケージの定数

```go
// 円周率
fmt.Println(math.Pi)
// 2の平方根
fmt.Println(math.sqrt2)
// 数値型に関する定数
// float32で表現可能な最大値
fmt.Println(math.MaxFloat32)
// float32で表現可能な0でない最小値
fmt.Println(math.SmallesNonzeroFloat32)
// float64で表現可能な最大値
fmt.Println(math.MaxFloat64)
// float64で表現可能な0でない最小値
fmt.Println(math.SmallestNonzeroFloat64)
// int64
fmt.Println(math.MaxInt64)
fmt.Println(math.MinInt64)
```

mathパッケージの関数

```go
// 絶対値
fmt.Println(math.Abs(100))
fmt.Println(math.Abs(-100))
// 累乗を求める
fmt.Println(math.Pow(0, 2))
fmt.Println(math.Pow(2, 2))
// 平方根、立方根
fmt.Println(math.Sqrt(2))
fmt.Println(math.Cbrt(8))
// 最大値、最小値
fmt.Println(math.Max(1, 2))
fmt.Println(math.Min(1, 2))
```

小数点以下の切り捨て、切り上げ

```go
// 数値の正負を問わず、小数点以下を単純に切り捨てる
fmt.Println(math.Trunc(3.14))
fmt.Println(math.Trunc(-3.14))

// 3
// -3

// 引数の数値より小さい最大の整数を返す
fmt.Println(math.Floor(3.5))
fmt.Println(math.Floor(-3.5))

// 3
// -4

// 引数の数値より大きい最小の整数を返す
fmt.Println(math.Ceil(3.5))
fmt.Println(math.Ceil(-3.5))

// 4
// -3
```

## rand
疑似乱数を生成する機能がまとめられたパッケージ。
ランタイム全体で共有される疑似乱数生成と、任意のシード値を元にした疑似乱数生成などができる。
最も単純な使い方は、`rand.Seed`へ任意のint64の数値を渡してデフォルトの疑似乱数生成器のシードを設定する方法
rand.Float64はデフォルトの疑似乱数生成器を使って、0.0<=n<1.0　の条件を満たす疑似乱数を生成する。

```go
//デフォルトの疑似乱数生成器のシードを設定
//シードに設定された数値が256に固定されているため、何度実行しても同じ内容の擬似乱数が生成される。
rand.Seed(256)

fmt.Println(rand.Float64())
fmt.Println(rand.Float64())
fmt.Println(rand.Float64())
/*
	0.813527291469711
	0.5598026045235738
	0.6695717783859498
*/
```

```go
//現在の時刻をシードに使った疑似乱数の生成
//プログラムの中で毎回異なった疑似乱数生成器のシードを設定するには、現在の時刻を利用する方法が最も手軽。
//timeパッケージを利用して、現在時刻をもとにしたシード値を設定する。
//例
//1970/1/1からの累積ナノ秒をシードに設定
fmt.Println(time.Now().UnixNano())
rand.Seed(time.Now().UnixNano())
//0~99の間の疑似乱数
fmt.Println(rand.Intn(100))
//int型の疑似乱数
fmt.Println(rand.Int())
//int32型の疑似乱数
fmt.Println(rand.Int31())
//int64型の疑似乱数
fmt.Println(rand.Int63())
//uint32型の疑似乱数
fmt.Println(rand.Uint32())
//特にrand.Intn(n)を使って0以上でnより小さい乱数を生成するパターンが使われる。

//擬似乱数生成器の生成
//rand.Seedやrand.IntnはGoのランタイム情に用意されたデフォルトの擬似乱数生成器を共有している。
//簡易的に使用する分には問題ないが、プログラムの意図しない場所で擬似乱数生成器を書き換えられてしまう危険性がある。
//解決するには、疑似乱数生成期を明示的に生成して管理する必要がある。
//rand.NewSourceにシード値を与えて、rand.Source型を生成し、
//rand.Newから独立した疑似乱数生成器を生成することができる。
//rand.Rand型にはrand.Intnなどの関数と同名のメソッドが定義されているため、デフォルト擬似乱数生成器を利用した場合を同様に操作する。

//疑似乱数生成期のソースを現在時刻から生成
src := rand.NewSource(time.Now().UnixNano())
//ソースを元に擬似乱数生成器を生成
rnd := rand.New(src)
//0~99の疑似乱数
fmt.Println(rnd.Intn(100))
```

## flag
コマンドラインからプログラムに与えられた引数やオプションなどを処理するための効率的な機能を備えたパッケージ。


```go
// コマンドラインを処理するサンプル
// go run main.go -n 20 -m message -x
var (
	max int
	msg string
	x   bool
)

// IntVar 整数オプション
flag.IntVar(&max, "n", 32, "処理数の最大値")
flag.StringVar(&msg, "m", "", "処理メッセージ")
flag.BoolVar(&x, "x", false, "拡張オプション")
flag.Parse()

fmt.Println("処理数の最大値 =", max)
fmt.Println("処理メッセージ =", msg)
fmt.Println("拡張オプション =", x)
```