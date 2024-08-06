# ポインタ型
Goにはポインタという機能があります。
ポインタとは、値型に分類されるデータ構造(基本型、参照型、構造体）のメモリ上のアドレスと型の情報のことです。
Goではこれを使って、データ構造を間接的に参照、操作ができる様になっている。
主に値型の操作に使われ、参照型は元からその機能を含んでいる為、基本的には不要となっています。

```go
func Double(i int) {
  i = i * 2
}

func main() {
  var n int = 100
  
  fmt.Println(n)
  fmt.Println(&n)
  Double(n)
  fmt.Println(n)
}

// 100
// 0xc000b4008
// 100
```

この場合、Double関数に渡されるnはiにコピーされ実行されるため、nの値は変わらない。

```go
func Double(i int) {
  i = i * 2
}

func main() {
  var n int = 100
  
  fmt.Println(n)
  fmt.Println(&n)

  var p *int = &n
  fmt.Println(p)
  fmt.Println(*p)
}
// 100
// 0xc000b4008
// 100
// 0xc000b4008
```

```go
*p = 300
fmt.Println(n)
// 300
n = 200
fmt.Println(*p)
// 200
```

このポインタを使ってDouble関数を使う

```go
func Double(i *int) {
  *i = *i * 2
}

func main() {
  var n int = 100
  var p *int = &n
  
  fmt.Println(n)
  Double(&n)
  fmt.Println(n)

  Double(p)
  fmt.Println(p)
}
// 100
// 200
// 400
```
















