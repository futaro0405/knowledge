# 構造体
オブジェクト指向のプログラミング言語のクラスのような存在
複数の任意の方の値をひとつにまとめたもの

```go
type User struct {
  Name string
  Age int
}
```

まとめて定義することもできる
```go
type Name struct {
  X, Y int
}
```


```go
type User struct {
  Name string
  Age int
}

func main() {
  var user1 User

  fmt.Println(user1)
// { 0}
// 初期値が表示される

  user1.Name = "username"
  user1.Age = 10
  fmt.Println(user1)
// {username 10}
}
```

暗黙的に定義
```go
user2 := User
```


















