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
user := User{}
```

初期値を設定
```go
user := User{Name: "username", Age: 10}
```

初期値の省略
宣言の順番に入れる必要がある
```go
user := User{"username", 10}
```

`new`を使って宣言
User型のポインタが返ってくる
```go
user := new(User)
// &{ 0}
```

アドレス演算子を使うとnewと同じようになる
```go
user := &User{}
```

どのように使うか

```go
func UpdateUser(user User) {
  user.Name = "A"
  user.Age = 100
}
func UpdateUser2(user *User) {
  user.Name = "A"
  user.Age = 100
}

func main() {
  user1 := User{Name: "user1", Age: 10}
  user8 := &User{}
  
  UpdateUser(user1)
  // {user1 10}
  // 更新されていない
  UpdateUser2(user2)
  // &{A 100}
  // 更新されている
}
```

## 構造体のメソッド
任意の型に特化した関数を定義するための仕組み

```go
type User struct {
  Name string
  Age int
}

func(u User) SayName() {
  fmt.Println(u.Name)
}

func(u User) SatName(name string) {
  u.Name = name
}

func main() {
  user1 = User{Name: "user1"}
  user1.SayName()
  user1.SatName("A")
  user1.SayName()
}
// user1
// user1
```

コピーに対してsetNameを行ってしまっている


















