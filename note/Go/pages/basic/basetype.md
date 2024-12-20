## integer型

```go
var i int = 100
```

int型にも種類がある
最大値、最小値に違いがある。
PCの環境依存になる。

`int0`: -128 to 127
`int16`: -32768 to 32767
`int32`: -2147483648 to 2147483647
`int64`: -9223372036854775808 to 9223372036854775807

明示的に指定することができるが型が異なるものと判定されるため注意が必要

```go
var i int = 100
var i2 int64 = 120

fmt.Println(i + i2)
// error
```

`fmt.Printf()`はフォーマットを指定してprintを実行できる
`%T`で型を調べることができる
```go
var i nt64 = 100
fmt.Printf("%T\n", i)
// int64
fmt.Printf("%T\n", int32(i))
// int32
```

## 不動小数点型

```go
var fl64 float64 = 2.4
fmt.Printf(fl64)
// 2.4
```

暗黙的に定義した場合は`float64`になる
これは環境依存ではない

```go
var fl64 float64 = 2.4
fl := 3.2
fmt.Printf(fl64 + fl)
// 5.6
fmt.Printf("%T, %T\n", fl64, fl)
//  float64, float64
```

明示的に`float32`に指定する
基本的には使わない
```go
var fl32 float32 = 2.4
fmt.Printf("%T", fl32)
// float32
```

浮動小数型は任意の実数を保持する型だが場合によっては演算が不能な特殊な方を保持することがある

```go
zero := 0.0

pinf := 1.0 / zero
fmt.Println(pinf)
// +Inf
ninf := -1.0 / zero
fmt.Println(ninf)
// -Inf
nan := zero / zero
fmt.Println(nan)
// NaN
```

## 論理値型

```go
var t, f bool = true, false
fmt.Println(t, f)
// true, false
```

## 文字列型
```go
var s string = "Hello, Golang"
fmt.Println(s)
// Hello, Golang
fmt.Printf("%T\n", s)
// string

var si string = "300"
fmt.Println(si)
fmt.Printf("%T\n", si)
// 300
// string
fmt.Println(` test
	test
		test
`)
// test
//     test
//        test
fmt.Println("\"")
// "
fmt.Println(`"`)
// "
fmt.Println(s[0])
// 72
fmt.Println(string(s[0]))
// H
```

## byte型
```go
byteA := []byte{72, 73}
fmt.Println(byteA)
fmt.Println(string(byteA))
// {72, 73}
// HI
```

```go
c := []byte("HI")
fmt.Println(c)
```

## 配列型

要素数を変更することができない
後から変更したい場合はスライス型を使う

```go
var arr1 [2]int
fmt.Println(arr1)
// [0 0 0]
fmt.Printf("%T\n", arr1)
// [3]int
```

`[3]int`という型なので変更できない

値を持たせて明示的に宣言する
```go
var arr2 [3]string = [3]string{"A", "B"}
fmt.Println(arr2)
// [A B  ]
```

暗黙的に定義
```go
  arr3 := [3]int{1, 2, 3}
  fmt.Println(arr3)
  // [1 2 3]
```

要素数に合わせて宣言する
```go
arr4 := [...]string{"C", "D"}
fmt.Println(arr4)
fmt.Printf("%T\n", arr4)
// [C D]
// [2]string
```

値の取り出し
```go
var arr2 [3]string = [3]string{"A", "B"}
fmt.Println(arr2[0])
// A
fmt.Println(arr2[1])
// B
fmt.Println(arr2[2])
// 
```

値の更新
```go
arr4 := [...]string{"C", "D"}
arr4[1] = "F"
fmt.Println(arr4)
// C F
```

```go
var arr5 [5]int
var arr6 [6]int
arr5 = arr6
// error
```

配列の要素数
```go
fmt.Println(len(arr1))
// 3
```

## interface型
あらゆる型と互換性がある
```go
var x interface{}
fmt.Println(x)
// <nil>
```

```go
x = 1
x = 3.14
x = "A"
x = [...]int{3, 4, 5, 6}
//x = 2
//var y interface{} = 3
//fmt.Println(x + y)
```

データ特有の演算はできないので注意

```go
x = 2
fmt.Println(x + 3)
// error
```

## 型変換
```go
var i int = 1
fl64 := float64(i)
fmt.Println(fl64)
fmt.Printf("i = %T\n", i)
fmt.Printf("fl64 = %T\n", fl64)
// 1
// i = int
// fl64 = float64
```

少数点以下切り捨てられる
```go
fl := 10.5
i2 := int(fl)
fmt.Println(i2)
// 10
```

```go
var s string = "100"
fmt.Printf("s = %T\n", s)
// s = string
```

string型をint型に変換する

```go
import (
  "fmt"
  "strconv"
)

func main() {
  var s string = "100"
  i, _ := strconv.Atoi(s)
  fmt.Println(i)
  fmt.Printf("i = %T\n", i)
}
```

`_`で戻り値を省略
今回はerrを省略している

```go
import (
  "fmt"
  "strconv"
)

func main() {
  var s string = "A"
  i, err := strconv.Atoi(s)
  if err != nil {
    fmt.Println(err)
  }
  fmt.Println(i)
  fmt.Printf("i = %T\n", i)
}

// err
```

int型からstring型に変換
```go
var i2 int = 200
s2 := strconv.Itoa(i2)
fmt.Println(s2)
fmt.Printf("s2 = %T\n", s2)
// s2 = string
```

string型からbyte型に変換
```go
var h string = "Hello"
b := []byte(h)
fmt.Println(b)

h2 := string(b)
fmt.Println(h2)
```
