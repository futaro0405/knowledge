変数を定義する
var 変数名 型 = 値
```go
package main

import "fmt"

func main() {
  // 整数型
  var i int = 100
  fmt.Println(i)

  // 文字列型
  var s string = "Hello Go"
  fmt.Println(s)
}
```

まとめて定義する

```go
var t, f bool = true, false
  fmt.Println(t, f)
```

異なる型でまとめて定義する

```go
var (
  i2 int = 200
  s2 string = "Golang"
)
```

変数の型だけ

```go
var i3 int
var s3 string
fmt.Println(i3, s3)
// 0

i3 = 300
s3 = "Go"
fmt.Println(i3, s3)
// 300 Go

i3 = 350
fmt.Println(i3)
// 350
```

暗黙的な定義
変数名 := 値

```go
i4 := 400
fmt.Println(i4)
// 400

i4 = 450
fmt.Println(i4)
// 450

i4 := 480
fmt.Println(i4)
// error

i4 := "Hello"
fmt.Println(i4)
// error
```

暗黙的な定義は関数の中でしか定義できない

```go
var i5 int = 500
s5 := "Hello"

func main() {
  fmt.Println(i5)
  // 500
  fmt.Println(s5)
  // error
} 
```

基本的には明示的な定義を行う












