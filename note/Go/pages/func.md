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
}

func main() {
  i, i2 := Div(9, 3)
  fmt.Println(i, i3)
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






















