# ポインタ型
Goにはポインタという機能があります。
ポインタとは、値型に分類されるデータ構造（基本型、参照型、構造体）のメモリ上のアドレスと型の情報のことです。
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

これを解決するのがポインタ型

```go
func Double(i int) {
  i = i * 2
}

func main() {
  var n int = 100
  
  fmt.Println(n)
  fmt.Println(&n)

  // 参照渡し
  var p *int = &n

  // pにはアドレスが格納されている
  fmt.Println(p)
  // pの実態が見れる
  fmt.Println(*p)
}
// 100
// 0xc000b4008

// 100
// 0xc000b4008
```

実際に値を変えてみる

```go
// pの値に代入するとnも変わる
*p = 300
fmt.Println(n)
// 300

// nの値に代入するとpも変わる
n = 200
fmt.Println(*p)
// 200
```

このポインタを使ってDouble関数を使う

```go
// 引数としてポインタ型を受け取る
func Double(i *int) {
  *i = *i * 2
}

func main() {
  var n int = 100
  var p *int = &n
  
  // nのアドレスを渡す
  Double(&n)
  fmt.Println(n)

  // ポインタ型が格納されたpを渡す
  Double(p)
  fmt.Println(p)
}
// 200
// 400
```

値型のデータ型はこのようにポインタを使用する必要がある
sliceなどの参照型のデータ型はこの機能を含んでいる
参照型はもともと参照渡しの機能がある

```go
func Double(s []int) {
  for i, v := range s {
    s[i] = v * 2
  }
}

func main() {
  var sl []int = []int{1, 2, 3}

  Double(sl)
  fmt.Println(sl)
}
// [2 4 6]
```












