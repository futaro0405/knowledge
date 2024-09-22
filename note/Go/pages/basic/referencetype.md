# 参照型
## slice
配列によく似たデータ型
配列と違い、`[]`内に要素数を指定しない。

```go
var sl []int
var sl2 []int = []int{100, 200}

sl3 := []string{"A", "B"}
```

make関数を使用してsliceを生成することもできる

```go
sl := make([]int, 5)
// [0 0 0 0 0]

var sl2 []int = []int{100, 200}
sl2[0] = 1000
// [1000 200]

sl3 := []string{1, 2, 3, 4, 5}
fmt.Println(sl3[0])
// 1
fmt.Println(sl3[2:4])
// [3 4]
fmt.Println(sl3[:2])
// [1 2]
fmt.Println(sl3[2:])
// [3 4 5]
fmt.Println(sl3[:])
// [1 2 3 4 5]
fmt.Println(sl3[len(sl3)-1])
// 5
fmt.Println(sl3[1: len(sl3)-1])
// [2 3 4]
```

## append
sliceは可変長の配列になっているので要素を追加することができる
`append`を使用してsliceの最後に要素を追加できる

```go
sl := []int{1, 2}
// [1 2]

// 要素を追加する
sl = append(sl, 3)
// [1 2 3]

// 要素を複数追加する
sl = append(sl, 4, 5, 6)
// [1 2 3 4 5 6]
```

`make`を使用してint型の要素を５つ格納する
この時、初期値０で生成される

```go
sl2 := make([]int, 5)
fmt.Println(sl2)
// [0 0 0 0 0]
```

sliceにはキャパシティというものが存在する。メモリを気にする必要がある場合は設定する。

容量以上の要素が追加されるとメモリの消費が倍になってしまいます。
メモリーを気にするような開発の場合は、容量にも気をつけます。
最初は気にせずやるほうがいいと思います。

```go
// 要素数を調べてみる
fmt.Println(len(sl2))
// 5

// キャパシティを調べてみる
fmt.Println(cap(sl2))
// 5

// キャパシティも合わせて設定してみる
sl3 := make([]int, 5, 10)

fmt.Println(len(sl3))
// 要素数は5
fmt.Println(cap(sl3))
// キャパシティは10

sl3 = append(sl3, 1, 2, 3, 4, 5, 6)

fmt.Println(len(sl3))
// 要素数は12
fmt.Println(cap(sl3))
// キャパシティは20
```

過剰にメモリを確保してしまうと実行速度が落ちたりする。
良質なパフォーマンスを実現するには、容量の管理も気にします。

## sliceのコピー
参照型のデータ型は値を渡すと同じアドレスが格納されます。
そのため、両方更新される
参照型は`slice`、`map`、`channel`など

```go
sl := []int{100, 200}

// アドレスが格納される
sl2 := sl

sl2[0] = 1000

// 両方更新されている
fmt.Println(sl)
// [1000 200]
fmt.Println(sl2)
// [1000 200]
```

参照型ではなく、int型の場合の例も確認してみます。

```go
var i int = 10
i2 := i
i2 = 100

// i2だけ更新されている
fmt.Println(i, i2)
// 10 100
```

参照型をコピーする場合はcopyを使う。

```go
sl := []int{1, 2, 3, 4, 5}
sl2 := make([]int, 5, 10)

n := copy(sl2, sl)

fmt.Println(n, sl2)
// 5 [1 2 3 4 5]
```

この時、nはコピーに成功した数が格納されます。

## slice for

forループを用いて、sliceの要素を表示してみます。

```go
sl := []stirng("A", "B", "C")

// i:インデックス番号
// v:要素
for i, v := range sl {
	fmt.Println(i, v)
}
// 0 A
// 1 B
// 2 C
```

少し工夫した書き方もあります。

```go
sl := []stirng("A", "B", "C")

// 書き方その１
for i := range sl {
	fmt.Println(i, sl[i])
}

// 書き方その２
for i := 0; i < len(sl); i++ {
	fmt.Println(i, sl[i])
}
```

どちらも同じ結果が得られます。

## 可変長引数
可変長の引数を許容するようなSum関数を作成してみます。

```go
func Sum(s ...int) int {
  n := 0
  for _, v := range s {
    n += v
  }
  return n
}

func main() {
	fmt.Println(Sum(1, 2, 3))
	// 6
	fmt.Println(Sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
	// 55
	fmt.Println(Sum())
	// 0

	// sliceを引数として渡すことも可能
	sl := []int{1, 2, 3}
	fmt.Println(Sum(sl...))
	// 6
}
```

## map
key, valueの形式で配列を作ることができる

```go
var m = map[string]int{"A": 100, "B": 200}
fmt.Println(Sum())
// map["A":100  "B":200]

// 改行しても使える
m2 := map[string]int{
  "A": 100,
  "B": 200,
}

// make関数を使って空のmapを作る
m3 := make(map[int]string)
// map[]
m3[1] = "JAPAN"
m3[2] = "USA"
// map[1:JAPAN 2:USA]

// 値の取り出し
fmt.Println(m[1])
// JAPAN

// エラーハンドリングもある
s, ok := m[1]
fmt.Println(s, ok)
// JAPAN true
if !ok {
	fmt.Println("error")
}

s, ok := m[3]
//  false

// mapから要素を削除
delete(m4, 3)

// 要素数を調べる
len(m)
```
## map for

forループを使ってmapの値を取り出す

```go
m := map[string]int{
  "apple": 100,
  "Banana": 200,
}

// k: キー
// v: 値
for k, v := range m {
	fmt.Println(k, v)
}
// apple 100
// Banana 200

// キーだけ取り出す
for k := range m {
	fmt.Println(k)
}
// apple
// Banana
```

## channel
### チャネルのイメージ
![[Pasted image 20240912215335.png]]

チャネルを使って、ゴールーチン間でデータの送受信を行う。

複数のgoルーチン間でデータの受け渡しを行うために設計されたデータ構造

### チャネルの宣言

```go
var ch1 chan int
```

サブタイプを指定することで送信専用、受信専用のチャネルを指定することができる

```go
// 受信専用
var ch2 <-chan int

// 送信専用
var ch2 chan<- int
```

この宣言はnilチャネルなので、make関数を使用して機能を持たせる
make関数を使用すると、チャネルの生成と初期化が行われるので書き込みと読み込みが可能になる

```go
// nilのチャネル
var ch1 chan int

// make関数で機能を持たせる
ch1 = make(chan int)
```

make関数を使って直接宣言することもできる
この時、容量は0で作成される

```go
ch2 := make(chan int)

fmt.Println(cap(ch1))
// 0
fmt.Println(cap(ch2))
// 0
```

このバッファサイズを指定して生成する

```go
ch3 := make(chan int, 5)
```

### チャネルの操作
チャネルはデータの送受信を行うデータ型なのでチャネルからデータを送ったり、受け取ることが可能

データをチャネルに送る

```go
// チャネルにデータを送る
ch3 <- 1

// 要素数が１増える
fmt.Println("len", len(ch3))
// len 1

// 要素を３つ追加
ch3 <- 2
ch3 <- 3
ch3 <- 4

// このとき要素数は4
fmt.Println("len", len(ch3))
// len 4

i := <-ch3
i2 := <-ch3
fmt.Println(i)
fmt.Println(i2)
// 1
// 2

// 送信した要素分、要素数が減っている
fmt.Println("len", len(ch3))
// len 2

// 直接受信することもできる
fmt.Println(<-ch3)
fmt.Println("len", len(ch3))
// 3
// len 1
```

このように先に入れたものから順番に取り出される

バッファサイズを超えた場合デッドロックになる

```go
ch3 := make(chan int, 5)

ch3 <- 1
ch3 <- 2
ch3 <- 3
ch3 <- 4
ch3 <- 5
ch3 <- 6
// fatal error: all goroutines are asleep - deadlock!
```

## チャネルとゴルーチン

```go
func reciver(c chan int) {
  for {
    i := <-c
    fmt.Println(i)
  }
}

func main() {
  ch1 := make(chan int)
  ch2 := make(chan int)

  go reciver(ch1)
  go reciver(ch2)

  i := 0
  for i < 100 {
    ch1 <- i
    ch2 <- i
    time.Sleep(50 * time.Millisecond)
    i++
  }
}
// 0
// 0
// 1
// 1
// 2
// 2
// ...
```

## チャネル close
送受信が終わったチャネルを明示的に閉じる

```go
ch1 := make(chan int, 2)

close(ch1)

i, ok := <- ch1
fmt.Println(i, ok)
// 0 false
```

チャネルのバッファ内が空かつ、closeされた状態ならokにfalseが返る

```go
ch1 := make(chan int, 2)

ch1 <- 1
close(ch1)

i, ok := <- ch1
fmt.Println(i, ok)
// 1 true


i2, ok := <- ch1
fmt.Println(i2, ok)
// 0 false
```

ゴールーチンとcloseの実例を示す

```go
// チャネルのバッファが空になるかつcloseされるまでループを繰り返す関数
func reciever(name string, ch <-chan int) {
	for {
		i, ok := <-ch
		if !ok {
			break
		}
		fmt.Println(name, i)
	}
	fmt.Println(name + "END")
}

func main() {
	ch1 := make(chan int, 2)

	go reciever("1.goroutin", ch1)
	go reciever("2.goroutin", ch1)
	go reciever("3.goroutin", ch1)

	i := 0
	for i < 100 {
		ch1 <- i
		i++
	}
	close(ch1)
	timeSleep(3 * time.Second)
}
```

## チャネル for

```go
ch1 := make(chan int, 3)
ch1 <- 1
ch1 <- 2
ch1 <- 3

for i := range ch1 {
  fmt.Println(i)
}
// 1
// 2
// 3
// deadlock
```

要素数を超えるとdeadlockになる
closeする
```go
ch1 := make(chan int, 3)
ch1 <- 1
ch1 <- 2
ch1 <- 3
close(ch1)

for i := range ch1 {
  fmt.Println(i)
}
// 1
// 2
// 3
```

## チャネル select

```go
ch1 := make(chan int, 30)
ch2 := make(chan string, 20)

ch2 <- "AAA"

e1 := <-ch1
e2 := <-ch2
fmt.Println(e1)
fmt.Println(e2)
// ch1 値がないのでdeadlock
// ch2 ch1がdeadlockなので到達できずにdeadlock
```
このように複数のゴールーチンを扱う場合、予期せずに停止してしまう恐れがある

`select`: 複数チャネルでゴルーチンを停止させることなく動作させる

```go
ch1 := make(chan int, 30)
ch2 := make(chan string, 20)

ch2 <- "AAA"

select {
case e1 := <-ch1:
	fmt.Println(e1 + 1000)
case e2 := <-ch2:
	fmt.Println(e2 + "!?")
default:
	fmt.Println("どちらでもない")
}
```

```go
ch1 := make(chan int)
ch2 := make(chan int)
ch3 := make(chan int)

// reciever
go func() {
  for {
    i := <-ch1
    ch2 <- i * 2
  }
}()

go func() {
  for {
    i2 := <-ch2
    ch3 <- i2 - 1
  }
}()

n := 0
for {
  select {
  case ch1 <- n:
    n++
   case i3 := <-ch3:
    fmt.Println("recieved", i3)
  }
  if n > 100 {
    break
  }
}
```





















