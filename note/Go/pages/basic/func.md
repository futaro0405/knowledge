```go
func Plus(x int, y int) int {
  return x + y
}

// 型が同じ場合は省略できる
func Plus(x, y int) int {
  return x + y
}
```

戻り値が複数
```go 
func Div(x, y int) (int, int) {
  q := x / y
  r := x % y
  return q, r
}

func main() {
  i, i2 := Div(9, 3)
  fmt.Println(i, i2)
  // 3, 0
}
```

戻り値の変数を指定する
```go
func Double(price int) (result int) {
  result = price * 2
  return
}
```

戻り値がない関数
```go
func noreturn() {
  fmt.Println("No Return")
  return
}
```

## 無名関数
```go
func main() {
  f := func(x, y int) int {
    return x + y
  }
  i := f(1, 2)
}
```

```go
i2 := func(x, y int) int {
  return x + y
}(1, 2)
```

## 関数を返す関数
```go
func ReturnFunc() func() {
  return func() {
    fmt.Println("I'm a function")
  }
}

func main() {
  f := ReturnFunc()
}
```
## 関数を引数にとる関数
```go
func CallFunction(f func()) {
  f()
}

func main() {
  CallFunction(func() {
    fmt.Println("I'm a function")
  })
}
```
## クロージャ
Goの無名関数はクロージャ
クロージャとは日本語では関数閉包と呼ばれ、関数と関数の処理に関する関数外の環境をセットして閉じ込めたもの

```go
func Later() func(string) string {
  var store string
  return func(next string) string {
    s := store
    store = next
    return s
  }
}

func main() {
  f := Later()
  fmt.Println(f("Hello"))
  fmt.Println(f("My"))
  fmt.Println(f("name"))
  fmt.Println(f("is"))
  fmt.Println(f("Golang"))
}

// Hello
// My
// name
// is
```

最後のGolangが表示されていないことに注目
## ジェネレータとは
何らかのルールに従って連続した値を返し続ける仕組みのこと

```go
func integers() func() int {
  i := 0
  return func() int {
    i++
    return i
  }
}

func main() {
  ints := integers()
  fmt.Println(ints())
  fmt.Println(ints())
  fmt.Println(ints())
  fmt.Println(ints())

  otherints := integers()
  fmt.Println(otherints())
  fmt.Println(otherints())
  fmt.Println(otherints())
}
// 1
// 2
// 3
// 4

// 1
// 2
// 3
```































