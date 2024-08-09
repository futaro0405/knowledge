```go
type Person struct {
  name string
  Age int
}

func (p *Person) ToString() string {
  return fmt.Sprintf("Name=%v, Age=%v", p.Name, p.Age)
}

type Car struct {
  Number string
  Model    string
}

func (c *Car) ToString() string {
  return fmt.Sprintf("Number=%v, Model=%v", p.Number, p.Model)
}
```

このとき、PersonとCarのToStringメソッドは型が違うためまとめられない

```go
type Stringfy interface {
  ToString() string
}

func main() {
  vs := []Stringfy{
    &Person{Name: "Taro", Age: 21},
    &Car{Number: "123-456", Model: "AB-1234"},
  }

  for _, v := range vs {
    fmt.Println(v.ToString())
  }
}
// Name=Taro, Age=21
// Number=123-456, Model=AB-1234
```
 
## カスタムエラー

goにはerrorというソースコードのインターフェースが存在する
```go
type error interface {
  Error() string
}
```

カスタムエラーで独自のエラーとして返すことができる

```go
type MyError struct {
  Message string
  ErrCode int
}
func (e *MyError) Error() string {
  return e.Message
}

func RaisError() error {
  return &MyError{Message: "カスタムエラーが発生しました", ErrCode: 1234}
}

func main() {
  err := RaisError()
  fmt.Println(err.Error())
  // カスタムエラーが発生しました
  fmt.Println(err)
  // err
  // MyErrorのフィールドにアクセスしたい場合は型アサーションを使用してアクセスする必要がある

  e, ok := err.(*MyError)
  if ok {
    fmt.Println(e.ErrCode)
  }
  // 1234
}
```

## interface Stringer
 fmtパッケージに定義されているStringer型もinterfaceのひとつ
 
```go
type Stringer interface {
  String() string
}
```

```go
type Point struct {
  A int
  B string
}

func (p *Point) String() string {
  return fmt.Sprintf("<<%v, %v>>", p.A, p.B)
}

func main() {
   p := &Point{100, "ABC"}
   fmt.Pringln(p)
   // &{100 ABC}
}
```



