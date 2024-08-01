integer型

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





















