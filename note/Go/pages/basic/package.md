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
// StringVar 文字列のオプション
flag.StringVar(&msg, "m", "", "処理メッセージ")
// BoolVar bool型のオプション コマンドラインに与えられたらtrue なければfalse
flag.BoolVar(&x, "x", false, "拡張オプション")

// コマンドラインをパース
flag.Parse()

fmt.Println("処理数の最大値 =", max)
fmt.Println("処理メッセージ =", msg)
fmt.Println("拡張オプション =", x)
```

## fmt

```go
// fmt標準
fmt.Print("Hello")
// 改行
fmt.Println("Hello!")
```

Println系
各々の文字列は半角スペースで区切られ、文字列の最後に改行を追加

```go
fmt.Println("Hello", "world!")
fmt.Println("Hello", "world!")
// Hello world!
// Hello world!
```

Printf系
フォーマットを指定

```go
fmt.Printf("%s\n", "Hello")
fmt.Printf("%#v\n", "Hello")

// Hello
// "Hello"
```

Sprint系
出力ではなくフォーマットした結果を文字列で返す

```go
s   := fmt.Sprint("Hello")
s1 := fmt.Sprintf("%v\n", "Hello")
s2 := fmt.Sprintln("Hello")

fmt.Sprint(s)
fmt.Sprintf(s1)
fmt.Sprintln(s2)

// Hello
// Hello
//
// Hello
//
```

Fprint系
書き込み先を指定

```go
fmt.Fprint(os.Stdout, "Hello")
fmt.Fprintf(os.Stdout, "Hello")
fmt.Fprintln(os.Stdout, "Hello")

// HelloHelloHello
```

ファイルに書き込み

```go
f, _ := os.Create("test.txt")
defer f.Close()

fmt.Fprintln(f, "Fprint")
```

## fmtの詳細
### Printfについて
Goでは書式指定子 `%...` のことを __verb__ と表記しています。
#### `%v`
`%v`はさまざまな型の値を柔軟に出力することができる。
基本的なデータ型に対して`%v`は下記の書式指定子として振舞う。
interface型として本来の型が不定であるデータの内容を出力させる場合に有用。

スライス、マップ、配列、構造体についても有用。

#### すべての型に使えるverb
論理値(bool): `%t`
符号付き整数(int, int8など): `%d`
符号なし整数(uint, uint8など): `%d`
浮動小数点数(float64など): `%g`
複素数(complex128など): `%g`
文字列(string): `%s`
チャネル(chan): `%p`
ポインタ(pointer): `%p`

`%+v`: 
`%v`と同じだが、構造体の場合にフィールド名を出力する。

`%#v`:
値のGoの文法での表現を出力する。

`%T`:
値の型のGoの文法での表現を出力する。

`%%`:
%そのものを出力したい場合に使う。

#### 論理値に使えるverb
`%t`:
trueかfalse
#### 整数に使えるverb
`%d`:
10進数で出力する

`%+d`:
10進数で出力し、正の整数でも符号を付与する

`%(数値)d`:
10進数で出力し、(数値)で指定した桁数だけ左を半角スペースで埋める

`%-(数値)d`:
10進数で出力し、(数値)で指定した桁数だけ右を半角スペースで埋める

`%0(数値)d`:
10進数で出力し、(数値)で指定した桁数だけ左を0で埋める

`%b`:
2進数で出力する

`%o`:
8進数で出力する

`%#o`:
0付き8進数で出力する

`%x`:
16進数で出力する(a-fは小文字)

`%#x`:
0x付き16進数で出力する(a-fは小文字)

`%X`:
16進数で出力する(A-Fは大文字)

`%#X`:
0x付き16進数で出力する(A-Fは大文字)

`%U`:
Unicodeコードポイントに対応する文字で出力する
#### 浮動小数点数・複素数に使えるverb
`%f`:
実数表現で出力する

`%F`:
実数表現で出力する(%fと同じ)

`%e`:
仮数と指数表現で出力する(eは小文字)

`%E`:
仮数と指数表現で出力する(Eは大文字)

`%g`:
指数部が大きい場合は%e、それ以外は%fで出力する

`%G`:
指数部が大きい場合は%E、それ以外は%Fで出力する
#### 文字列([]byteも同じ)に使えるverb

`%s`:
そのままの書式で出力する

`%(数値)s`:
(数値)で指定した桁数だけ左を半角スペースで埋める

`%e`:
Goの文法上のエスケープをした文字列で出力する(ダブルクォート付与)

`%q`:

`%x`:
16進数表現で出力する(a-fは小文字)

`%X`:
16進数表現で出力する(A-Fは大文字)
## log
シンプルなログ作成のための機能がまとめられたパッケージ

```go
// ログの出力先を標準出力に変更
log.SetOutput(os.Stdout)

log.Print("Log\n")
log.Println("Log2")
log.Printf("Log%d\n", 3)

// 2024/07/07 01:02:03 Log
// 2024/07/07 01:02:03 Log2
// 2024/07/07 01:02:03 Log3
```

```go
log.SetOutput(os.Stdout)

log.Fatal("Log\n")
log.Fatalln("Log2")
log.Fatalf("Log%d\n", 3)

// 2024/07/07 01:02:03 Log
// exit status 1
```

ログのfatalはosのExitを伴った処理となるのでこの段階で終了される

panicは文字列を出力してパニック状態にしてプログラムを強制終了させる
```go
log.SetOutput(os.Stdout)

log.Panic("Log\n")
log.Panicln("Log2")
log.Panicf("Log%d\n", 3)
```

任意のファイルを作成し、出力先に指定
`on.Create`: ファイルを作成

```go
f, err := os.Create("test.log")
if err != nil {
	return	
}
// 作成したio.Write型のファイルを出力先に指定
log.SetOutput(f)
log.Println("ファイルに書き込む")
```

ログのフォーマットを指定

```go
log.SetOutput(os.Stdout)
// ログのフォーマットを指定する
// 標準のログフォーマット
log.SetFlags(log.LstdFlags)
log.Println("A")

// マイクロ秒を追加
log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
log.Printlln("B")

// 時刻とファイルの行番号（短縮形）
log.SetFlags(log.Ltime | log.Lshortfile)
log.Printlln("C")

log.setFlags(log.LstdFlags)
// ログのプリフィックスを設定
log.SetPrifix("[LOG]")
log.Printlln("E")

// 2024/07/07 01:02:03 A
// 2024/07/07 01:02:03.655117 B
// 01:02:03 main.go:24: C
// [LOG]2024/07/07 01:02:03 E
```

ロガーの生成
デフォルトで設定されているロガーは全体に適用されている
新規でロガーを生成してログパッケージのデフォルトのロガーと異なる新しいロガーを生成する

```go
logger := log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Lshortfile)
logger.Fatalln("message")

_, err = os.Open("fdafdsafa")

if err != nil {
	log.Fatalln("Exit", err)
}
```

## strconv
goの基本的なデータとストリング型の相互変換をサポートする機能がまとめられたパッケージ

```go
bt := true
fmt.Printf("%T\n", strconv.FormatBool(bt))

// string
```

整数を文字列に変換

```go
 // -100を10進数の文字列に変換
i := strconv.FormatInt(-100, 10)
fmt.Printf("%v, %T\n", i, i)
// 上と同じ
i2 := strconv.Itoa(100)
fmt.Printf("%v, %T\n", i2, i2)

// -100 string
// 100 string
  ```

浮動小数点型を文字列に変換
第1引数： データ
第2引数： 浮動小数点型の書式を表す文字でフォーマットパッケージにおける書式指定子と同様の意味
第3引数： 桁数の制限。-1を指定した場合、文字列化に必要な桁数が自動で設定される
第4引数： 文字列化する浮動小数点型の精度。ビット数。

```go
// 浮動小数点型を文字列に変換
fmt.Println(strconv.FormatFloat(123.456, 'E', -1, 64))
// 指数表現による文字列化（小数点以下2桁まで）
fmt.Println(strconv.FormatFloat(123.456, 'e', 2, 64))
// 実数表現による文字列化
fmt.Println(strconv.FormatFloat(123.456, 'f', -1, 64))
// 実数表現による文字列化（小数点2桁まで）
fmt.Println(strconv.FormatFloat(123.456, 'f', 2, 64))
// 指数部の大きさで変動する表現による文字列化
fmt.Println(strconv.FormatFloat(123.456, 'g', -1, 64))
fmt.Println(strconv.FormatFloat(123456789.123, 'f', -1, 64))
// 指数部の大きさで変動する表現による文字列化（仮数部全体が4桁まで）
fmt.Println(strconv.FormatFloat(123.456, 'g', 4, 64))
// 指数部の大きさで変動する表現による文字列化（仮数部全体が8桁まで）
fmt.Println(strconv.FormatFloat(123456789.123, 'G', 8, 64))
```

文字列を真偽値に変換
```go
// trueに変換できる文字列
bt1, _ := strconv.ParseBool("true")
fmt.Printf("%v, %T\n", bt1, bt1)
bt2, _ := strconv.ParseBool("1")
bt3, _ := strconv.ParseBool("t")
bt4, _ := strconv.ParseBool("T")
bt5, _ := strconv.ParseBool("TRUE")
bt6, _ := strconv.ParseBool("True")
fmt.Println(bt2, bt3, bt4, bt5, bt6)

// falseへ変換できる文字列
bf1, ok := strconv.ParseBool("false")
if ok != nil {
	fmt.Println("Convert Error")
}
fmt.Printf("%v, %T\n", bf1, bf1)
bf2, _ := strconv.ParseBool("0")
bf3, _ := strconv.ParseBool("f")
bf4, _ := strconv.ParseBool("F")
bf5, _ := strconv.ParseBool("FALSE")
bf6, _ := strconv.ParseBool("False")
fmt.Println(bf2, bf3, bf4, bf5, bf6)
```

文字列を整数型に変換

第1引数： データ
第2引数： 何進数か
第3引数： 精度。0の場合int型

```go
i3, _ := strconv.ParseInt("12345", 10, 0)
fmt.Printf("%v, %T\n", i3, i3)
i4, _ := strconv.ParseInt("-1", 10, 0)
fmt.Printf("%v, %T\n", i4, i4)

i10, _ := strconv.Atoi("123")
fmt.Println(i10)
```

文字列を浮動小数点型に変換

```go
fl1, _ := strconv.ParseFloat("3.14", 64)
fl2, _ := strconv.ParseFloat(".2", 64)
fl3, _ := strconv.ParseFloat("-2", 64)
fl4, _ := strconv.ParseFloat("1.2345e8", 64)
fl5, _ := strconv.ParseFloat("1.2345E8", 64)
fmt.Println(fl1, fl2, fl3, fl4, fl5)
```

## strings
文字列操作の機能がまとめられたパッケージ
文字列の検索、結合、置換、その他処理

### 文字列の結合
```go
s1 := strings.Join([]string{"A", "B", "C"}, ",")
s2 := strings.Join([]string{"A", "B", "C"}, "")
fmt.Println(s1, s2)

// A,B,C ABC
```

### 文字列の検索

```go
// 文字列が含まれる部分文字列を検索する
// 含まれている場合Int型でindex番号を返す
i1 := strings.Index("ABCDE", "A")
i2 := strings.Index("ABCDE", "D")
fmt.Println(i1, i2)

// 0 3

// 検索対象の文字列が複数含まれる場合
// 最後の部分文字列が開始されるidex返す
i3 := strings.LastIndex("ABCDABCD", "BC")
fmt.Println(i3)

// 5

// 検索対象のどれかが最初に現れるindexを返す
i4 := strings.IndexAny("ABC", "ABC")
// 検索対象のどれかが最後に現れるindexを返す
i5 := strings.LastIndexAny("ABC", "ABC")
fmt.Println(i4, i5)

// 0 2

// 検索対象の文字列が指定した文字列から開始されるか
b1 := strings.HasPrefix("ABC", "A")
// 検索対象の文字列が指定した文字列で終わるか
b2 := strings.HasSuffix("ABC", "C")
fmt.Println(b1, b2)

// true true

// 指定した文字列が含まれているか
b3 := strings.Contains("ABC", "B")
// 指定した文字列の中でいづれかの文字列が含まれるか
b4 := strings.ContainsAny("ABCDE", "BD")
fmt.Println(b3, b4)

// true true

// 指定した文字列が何回出現するか
i6 := strings.Count("ABCABC", "B")
// この場合文字列の長さ+1
i7 := strings.Count("ABCABC", "")
fmt.Println(i6, i7)

// 2 7
```

### 文字列を繰り返し結合

```go
s3 := strings.Repeat("ABC", 4)
s4 := strings.Repeat("ABC", 0)
fmt.Println(s3, s4)

// ABCABCABCABC
```

### 文字列の置換

```go
s5 := strings.Replace("AAAAA", "A", "B", 1)
s6 := strings.Replace("AAAAA", "A", "B", -1)
fmt.Println(s5, s6)

// BAAAA BBBBB
```

### 文字列の分割

```go
// セパレータ（,）で分割
s7 := strings.Split("A,B,C,D,E", ",")
fmt.Println(s7)
// セパレータ（,）を残して分割
s8 := strings.SplitAfter("A,B,C,D,E", ",")
fmt.Println(s8)
// 2分割
s9 := strings.SplitN("A,B,C,D,E", ",", 2)
fmt.Println(s9)
// セパレータを残して4分割
s10 := strings.SplitAfterN("A,B,C,D,E", ",", 4)
fmt.Println(s10)

// [A B C D E]
// [A, B, C, D, E]
// [A B C, D E]
// [A, B, C, D,E]
```

#### 大文字小文字の変換

```go
s11 := strings.ToLower("ABC")
s12 := strings.ToLower("E")

s13 := strings.ToUpper("abc")
s14 := strings.ToUpper("e")
fmt.Println(s11, s12, s13, s14)

// abc ABC E
```

### 文字列から空白を取り除く

```go
s15 := strings.TrimSpace("    -    ABC    -    ")
// 全角空白
s16 := strings.TrimSpace("　　　　ABC　　　　")
fmt.Println(s15, s16)

// -    ABC    - ABC
```

### スペースで区切られたフィールドの取得

```go
s18 := strings.Fields("a b c")
fmt.Println(s18)
fmt.Println(s18[1])

// [a b c]
// b
```

## bufio
基本的な入出力処理

```go
// 標準入出力を行単位で読み込む
// 標準入力をソースにしたスキャナの作成
scanner := bufio.NewScanner(os.Stdin)

// 入力のスキャンが成功する限り繰り返す
for scanner.Scan() {
	fmt.Println(scanner.Text())
}

// スキャンにエラーが発生した場合の処理
if err := scanner.Err(); err != nil {
	fmt.Println(os.Stderr)
}

// AAA（書き込み）
// AAA
// BBB（書き込み）
// BBB
// ^C
```

## ioutil
入出力をサポートする機能をまとめたパッケージ

```go
// 入力全体を読み込む
f, _ := os.Open("foo.txt")
bs1, _ := ioutil.ReadAll(f)
fmt.Println(string(bs1))

// Hello
// GolangYeah

// ファイルの書き込み
if err := ioutil.WriteFile("bar.txt", bs, 0666); err != nil {
	log.Fatalln(err)
}
```

## regexp
正規表現による文字列処理のためのパッケージ

```go
// 第1引数のパターンに第2引数がマッチするか
match, _ := regexp.MatchString("A", "ABC")
fmt.Println(match)

// true
```

`regexp.MatchString`と異なり、正規表現をあらかじめコンパイルしておく

```go
re1, _ := regexp.Compile("A")
match = re1.MatchString("ABC")
fmt.Println(match)

// true
```

コンパイルエラーが発生した場合にエラーを返すのではなく、直接ランタイムエラーを返す

```go
re2 := regexp.MustCompile("A")
match = re2.MatchString("ABC")
fmt.Println(match)
```

文字クラスを通常の文字リテラルに埋め込む

```go
regexp.MustCompile("\\d")
regexp.MustCompile(`\d`)
```

正規表現のフラグ

|     | フラグ一覧                              |
| --- | ---------------------------------- |
| i   | 大文字小文字を区別しない                       |
| m   | マルチラインモード（^と&が文頭、文末に加えて行頭、行末にマッチ）  |
| s   | .が`\n`にマッチ                         |
| U   | 最小マッチへの変換（`x*`は`x*?`へ、`x+`は`x+?`へ） |

```go
// i有効 ms無効
re3 := regexp.MustCompile(`(?i-ms)abc`)
match = re3.MatchString("ABC")
fmt.Println(match)

// true
```

幅を持たない正規表現のパターン

|      | パターン一覧              |
| ---- | ------------------- |
| `^`  | 文頭（mフラグが有効な場合は行頭にも） |
| `$`  | 文末（mフラグが有効な場合は行末にも） |
| `\A` | 文頭                  |
| `\z` | 文末                  |
| `\b` | ASCIIによるワード協会       |
| `\B` | 非ASCIIによるワード協会      |

```go
re4 := regexp.MustCompile(`^ABC$`)
match = re4.MatchString("ABC")
fmt.Println(match)

match = re4.MatchString("  ABC  ")
fmt.Println(match)

// true
// false
```

繰り返しを表す正規表現

|           | 繰り返しのパターン             |
| --------- | --------------------- |
| `x*`      | 0回以上は繰り返すx（最大マッチ）     |
| `x+`      | 1回以上は繰り返すx（最大マッチ）     |
| `x?`      | 0回以上1回以下は繰り返すx        |
| `X{n, m}` | n回以上m回以下は繰り返すx（最大マッチ） |
| `x{n, }`  | n回以上は繰り返すx（最大マッチ）     |
| `x{n}`    | n回繰り返すx（最大マッチ）        |
| `x*?`     | 0回以上繰り返すx（最小マッチ）      |
| `x+?`     | 1回以上繰り返すx（最小マッチ）      |
| `x??`     | 0回以上1回以下は繰り返すx（0回優先）  |
| `x{n,m}?` | n回以上m回以下は繰り返すx（最小マッチ） |
| `x{n, }?` | n回以上繰り返すx（最小マッチ）      |
| `x{n}?`   | n回繰り返すx（最小マッチ）        |

```go
re6 := regexp.MustCompile("a+b*")
fmt.Println(re6.MatchString("ab"))
fmt.Println(re6.MatchString("a"))
fmt.Println(re6.MatchString("aaaabbbbbbbb"))
fmt.Println(re6.MatchString("b"))

// true
// true
// true
// false
```

/*
	re := regexp.MustCompile("ab")
	re.MatchStrings("abc")
	//true
*/

re5 := regexp.MustCompile(".")
match = re5.MatchString("ABC")
fmt.Println(match)
match = re5.MatchString("\n")
fmt.Println(match)



re7 := regexp.MustCompile("A+?A+?X")
fmt.Println(re7.MatchString("AAX"))
fmt.Println(re7.MatchString("AAAAAAXXXX"))

re8 := regexp.MustCompile(`[XYZ]`)
fmt.Println(re8.MatchString("Y"))

re9 := regexp.MustCompile(`^[0-9A-Za-z_]{3}$`)
fmt.Println(re9.MatchString("ABC"))
fmt.Println(re9.MatchString("abcdefg"))

re10 := regexp.MustCompile(`[^0-9A-Za-z_]`)
fmt.Println(re10.MatchString("ABC"))
fmt.Println(re10.MatchString("あ"))

re1 = regexp.MustCompile(`(abc|ABC)(xyz|XYZ)`)
fmt.Println(re1.MatchString("abcxyz"))
fmt.Println(re1.MatchString("ABCXYZ"))
fmt.Println(re1.MatchString("ABCxyz"))
fmt.Println(re1.MatchString("ABCabc"))

fs1 := re1.FindString("AAAAABCXYZZZZ")
fmt.Println(fs1)
fs2 := re1.FindAllString("ABCXYZABCXYZ", -1)
fmt.Println(fs2)

fmt.Println(re1.Split("ASHVJV<HABCXYZKNJBJVKABCXYZ", -1))
re1 = regexp.MustCompile(`\s+`)
fmt.Println(re1.Split("aaaaaaaaaa     bbbbbbb  cccccc", -1))

fmt.Println(re1.ReplaceAllString("AAA BBB CCC", ","))
re1 = regexp.MustCompile(`、|。`)
fmt.Println(re1.ReplaceAllString("私は、Golangを使用する、プログラマー。", ""))

re1 = regexp.MustCompile(`(\d+)-(\d+)-(\d+)`)
s := `
0123-456-7889
111-222-333
556-787-899
`

ms := re1.FindAllStringSubmatch(s, -1)
for _, v := range ms {
	fmt.Println(v)
}

fmt.Println(re1.ReplaceAllString("Tel: 000-111-222", "$3-$2-$1"))
fmt.Println(re1.ReplaceAllString("Tel: 000-111-222", "あ-い-う"))
