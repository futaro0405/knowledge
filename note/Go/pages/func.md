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




























