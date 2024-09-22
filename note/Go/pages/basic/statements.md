# 制御構文
## if
```go
a := 1
if a == 1 {
  fmt.Println("one")
} else if a == 2 {
  fmt.Println("two")
} else {
  fmt.Println("I don't know")
}
```

簡易文付きif文
```go
if b := 100; b == 100 {
  fmt.Printin("one hundred")
}
```

```go
x := 0
if x := 2; true {
  fmt.Println(x)
}
fmt.Println(x)
// 2
// 0
```

## エラーハンドリング
```go
var s string = "100"

i, err := strconv.Atoi(s)
if err != nil {
  fmt.Println(err)
}
fmt.Printf("i = %T\n", i)
```

## for
```go
i := 0
for {
  i++
  if i == 3 {
    break
  }
  fmt.Println("Loop")
}
// Loop
// Loop
```

```go
point := 0
for point < 10 {
  fmt.Println(point)
  point++
}
```

```go
for i := 0; i < 100; i++ {
  if i == 3 {
    fmt.Println(3)
    continue
  }
  if i > 30 {
    fmt.Println("抜けた")
    break
  }
  fmt.Println(i)
}
```

配列の要素分

```go
arr := [3]int{1, 2, 3}
for i := 0; i < len(arr); i++ {
  fmt.Println(i, arr[i])
}
```

```go
for i, v := range arr {
  fmt.Println(i, v)
}
for _, v := range arr {
  fmt.Println(v)
}
```

## switch 式
```go
n := 4
switch n {
  case 1, 2:
    fmt.Println("1 or 2")
  case 3, 4:
    fmt.Println("3 or 4")
  default:
    fmt.Println("どれでもない")
}
```

```go
switch n := 2; n {
  case 1, 2:
	fmt.Println("1 or 2")
  case 3, 4:
	fmt.Println("3 or 4")
  default:
	fmt.Println("どれでもない")
}
```

列挙型と演算子が共存している場合はエラーになる
```go
switch n := 2; n {
case 1, 2, 3:
	fmt.Println("0 < n2 < 4")
case n > 3 && n < 6:
	fmt.Println("3 < n2 < 6")
}
// error
```

## 型switch
型アサーション
```go
func anything(a interface{}) {
  fmt.Println(a)
}

func main() {
  anything("aaa")
  anything(1)

  var x interface{} = 3
  i := x.(int)

  fmt.Println(i + 2)
  // 5
  fmt.Println(x + 2)
  // error
}
```

floatはエラー
```go
f := x.(float64)
fmt.Println(f)
// error
```

エラーにせずに実行する方法
```go
f, isFloat := x.(float64)
fmt.Println(f, isFloat)
// 0 false
```

型アサーションとこの記述を使って型で分岐させる
```go
if x == nil {
	fmt.Println("何もない")
} else if i, isInt := x.(int); isInt {
	fmt.Println(i, "x is int")
} else if s, isString := x.(string); isString {
	fmt.Println(s, isString)
} else {
	fmt.Println("対応していない型")
}
```

switchと組み合わせ
```go
switch x.(type) {
  case int:
    fmt.Println("int")
  case string:
    fmt.Println("string")
  default:
    fmt.Println("default")
}
```

```go
func anything(a interface{}) {
  switch v := a.(type) {
    case string:
      fmt.Println(v + "!?")
    case int:
      fmt.Println(v + 1000)
  }
}

func main() {
  anything("aaa")
  anything(1)
}

// aaa!?
// 1001
```

## ラベル付きfor
ラベル付き文を使用することで任意の位置まで文をスキップできます。

以下のfor文は一番深いネストの`for`からのみ抜けるため無限ループになる

```go
for {
  for {
    for {
      fmt.Println("START")
      break
    }
    fmt.Println("起動しない")
  }
  fmt.Println("起動しない")
}
fmt.Println("END")

// START
// 起動しない
// START
// 起動しない
// ...
```

Loopのラベルを付けることで`break Loop`で全体から抜けることができる

```go
Loop:
  for {
    for {
      for {
        fmt.Println("START")
        break Loop
      }
      fmt.Println("起動しない")
    }
    fmt.Println("起動しない")
  }
  fmt.Println("END")

// START
// END
```

continueの場合も考える
```go
Loop:
  for i := 0; i < 3; i++ {
    for j := 1; j < 3; j++ {
      if j > i {
        continue Loop
      }
      fmt.Println(i, j, i+j)
    }
    fmt.Println("起動しない")
  }
```

## defer
関数の終了時に実行される処理を登録することができる

```go
func TestDefer() {
	defer fmt.Println("END")
	fmt.Println("START")
}
// START
// END
```

deferで複数の処理を登録する
```go
defer func() {
  fmt.Println("1")
  fmt.Println("2")
  fmt.Println("3")
}
// 1
// 2
// 3
```

複数のdeferが登録せれた場合、後から登録されたものから実行される
```go
func RunDefer() {
  defer fmt.Println("1")
  defer fmt.Println("2")
  defer fmt.Println("3")
}

func main() {
  RunDefer()
}
// 3
// 2
// 1
```

deferを使ったリソースの解放処理

```go
file, err := os.Create("test.txt")
if err != nil {
  fmt.Println(err)
}
defer file.Close()

file.Write([]byte("Hello"))
```

```cursol
$ go run main.go
$ ls
main.go test.txt
```

## `panic`,`recover`
例外処理
goのランタイムを強制的に停止させる機能を持つため、エラーハンドリングを使用した処理のほうが推奨される
あえて使わないほうが良い

```go
func main() {
	panic("rungime error")
	fmt.Println("START")

	defer func() {
		if x := recover(); x != nil {
			fmt.Println(x)
		}
	}()
	panic("runtime error")
	fmt.Println("START")
}
// rungime error
```

`panic`:
強制的にエラーを発生させる
`recover`:
ランタイムエラーから復帰する。`defer`と合わせて使う

## `go`文
goルーチンとも呼ばれている。
goの並行処理の機能
goルーチンはスレッドよりも小さい処理単位で、暗黙的に並行処理を行ってくれる。

```go
func sub() {
  for {
    fmt.Println("sub Loop")
    time.Sleep(100 * time.Millisecond)
  }
}

func main() {
  sub()

  for {
    fmt.Println("Main Loop")
    time.Sleep(200 * time.Millisecond)
  }
}
// sub Loop
// sub Loop
// sub Loop
// ...
```

```go
func sub() {
  for {
    fmt.Println("sub Loop")
    time.Sleep(100 * time.Millisecond)
  }
}

func main() {
  go sub()

  for {
    fmt.Println("Main Loop")
    time.Sleep(200 * time.Millisecond)
  }
}
// Main Loop
// sub Loop
// sub Loop
// Main Loop
// sub Loop
// ...
```

## `init`
パッケージの初期化を目的にした特殊な関数のユニットを定義する

```go
func init() {
  fmt.Println("init")
}

func main() {
  fmt.Println("main")
}
// init
// main
```

初期化処理を確実に実行するときに使う
























