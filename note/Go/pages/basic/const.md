# 定数
定数はグローバルに定義する
イニシャルを大文字にすると他のpackageからも呼び出すことが可能

```go
package main

const Pi = 3.14

func main() {
  fmt.Println(Pi)
  // 3.14

  Pi = 3
  fmt.Println(Pi)
  // err
}
```

複数の定数を定義
```go
const (
  URL      = "http://xxx.co.jp"
  SiteName = "test"
)
```

```go
const (
  A = 1
  B
  C
  D = "A"
  E
  F
)

func main() {
  fmt.Println(A, B, C, D, E, F)
  // 1 1 1 A A A
}
```

定数は最大値がないため大きい値を定義できる

```go
var Big int = 9223372036854775807 + 1

func main() {
  fmt.Println(Big - 1)
  // error overflows
}
```

```go
const Big int = 9223372036854775807 + 1

func main() {
  fmt.Println(Big - 1)
  // 9223372036854775807
}
```

`iota`: 連番を返す

```go
const (
  c0 = iota
  c1
  c2
)

func main() {
  fmt.Println(c0, c1, c2)
  // 0 1 2
}
```
















