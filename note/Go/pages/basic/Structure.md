# 構造体
オブジェクト指向のプログラミング言語のクラスのような存在
複数の任意の型の値をひとつにまとめたもの

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

定義したuser型を使用してみる

```go
type User struct {
  Name string
  Age  int
}

func main() {
  var user1 User

  fmt.Println(user1)
  // 初期値が表示される（空文字と0）
  // { 0}

  user1.Name = "username"
  user1.Age = 10
  fmt.Println(user1)
// {username 10}
}
```

暗黙的に定義方法
```go
type User struct {
  Name string
  Age  int
}

func main() {
  user := User{}

  // 初期値を設定
  user := User{Name: "username", Age: 10}
}
```

初期値を省略して設定することもできる。
注意が必要で、宣言の順番に入れる必要がある
```go
type User struct {
  Name string
  Age  int
}

func main() {
  user := User{}

  // 初期値を設定
  user := User{"username", 10}
}
```

`new`を使って宣言することもできる  
User型のポインタが返ってくるため、`&`がついている

```go
user2 := new(User)
fmt.Println(user2)
// &{ 0}
```

アドレス演算子を使うとnewと同じようになる
```go
user3 := &User{}
fmt.Println(user3)
// &{ 0}
```

どのように使うか

```go
func UpdateUser(user User) {
  user.Name = "A"
  user.Age = 100
}

// こちらはポインタ型で引数を取得
func UpdateUser2(user *User) {
  user.Name = "A"
  user.Age = 100
}

func main() {
  user1 := User{Name: "user1", Age: 10}
  user2 := &User{}
  
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

func(u User) SetName(name string) {
  u.Name = name
}

func main() {
  user1 = User{Name: "user1"}
  user1.SayName()

  user1.SetName("A")
  user1.SayName()
}
// user1
// user1
```

コピーに対してsetNameを行ってしまっている

```go
func (u *User) setName(name string) {
  u.Name = name
}
```

メソッドのレシーバをポインタ型に修正するとsetされる
キホンはポインタ型にするほうがいい

## 構造体の埋め込み
構造体はフィールドに構造体を埋め込むことができる


```go
type T struct {
  User User
}

type User struct {
  Name string
  Age int
}

func main() {
  t := T{User : User{Name: "user1", Age: 10}}
  fmt.Println(t)
  // {{user1 10}}

  fmt.Println(t.User)
  // {user1 10}

  fmt.Println(t.User.NAme)
  // user1
}
```

型名を省略できる
その場合は呼び出しを省略できる

```go
// フィールドの宣言を省略する場合
type T struct {
  User
}

func main() {
  t := T{User : User{Name: "user1", Age: 10}}

  fmt.Println(t.NAme)
  // user1
}
```

Userフィールドのメソッドも使用できる
```go
func (u *User) SetName() {
  u.Name = "A"
}

func main() {
  t := T{User : User{Name: "user1", Age: 10}}

  t.User.SetName()
  fmt.Println(t.Name)
  // A
}
```

## 構造体のコンストラクタ

```go
type User struct {
  Name string
  Age int
}

func NewUser(name string, age int) *User {
  return &User(Name: name, Age: age)
}

func main() {
  user := NewUser("user", 10)
  fmt.Println(user)
  fmt.Println(*user)
}
// &{user 10}
// {user 10}
```

## 構造体とslice

```go
type User struct {
  Name string
  Age int
}

type Users []*User

// 同じ
/*
type Users struct {
 Users []*Users
}
*/

func main() {
  user1 := User(Name: "user1", Age: 10)
  user2 := User(Name: "user2", Age: 10)
  user3 := User(Name: "user3", Age: 10)
  user4 := User(Name: "user4", Age: 10)

  users := Users{}

  users = append(users, &user1)
  users = append(users, &user2)
  users = append(users, &user3, &user4)

  for _, u := range users {
    fmt.Println(*u)
  }


  // make関数を使用する
  users2 := make([]*User, 0)
  users2 = append(users2, &user1, &user2)
}
// {user1 10}
// {user2 10}
// {user3 10}
// {user4 10}
```

## mapと構造体
mapと構造体を組み合わせることも可能  

```go
type User struct {
  Name string
  Age int
}

func main() {
  m := map[int]User{
    1: {Name: "user1", Age: 10},
    2: {Name: "user2", Age: 20},
  }
  // map[1: {Name: "user1", Age: 10} 2: {Name: "user2", Age: 20},]

  m2 := map[User]string{
    {Name: "user1", Age: 10}: "Tokyo",
    {Name: "user2", Age: 20}: "LA",
  }

  // makeを使って宣言することも可能
  m3 := make(map[int]User)
  m3[1] = User{Name: "user3"}
  // map[1: {user3 0}]

  // forループでmapの中身を取り出す
  for _, v := range m {
    fmt.Println(v)
  }
  // {Name: "user1", Age: 10}
  // {Name: "user2", Age: 20}
}

```

## struct 独自型

```go
type Myint int

func main() {
  var m1 MyInt
  fmt.Println(m)
  fmt.Println("%T\n", m1)

  // Myint型とint型は計算ができない
  i := 100
  fmt.Println(m1 + i)
  // error
}
```

関数に用いることもできる

```go
func (mi MyInt) Print() {
  fmt.Println(mi)
}
```

独自宣言したMyInt型とint型は計算できない
