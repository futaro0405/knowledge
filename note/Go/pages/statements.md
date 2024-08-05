# 制御構文
## if
```go
a := 1
if a == 1 {
  fmt.Println("one")
} else if a == 1 {
  fmt.Println("two")
} else {
  fmt.Println("I don't know")
}
```

簡易文付きif文
```go
if b := 100; b == 100 {
  fmt.Printin("one hundred")
}
```

```go
x := 0
if x := 2; true {
  fmt.Println(x)
}
fmt.Println(x)
// 2
// 0
```

## エラーハンドリング
```go
var s string = "100"

i, err := strconv.Atoi(s)
if err != nil {
  fmt.Println(err)
}
fmt.Printf("i = %T\n", i)
```

## for
```go
i := 0
for {
  i++
  if i == 3 {
    break
  }
  fmt.Println("Loop")
}
// Loop
// Loop
```

```go
point := 0
for point < 10 {
  fmt.Println(point)
  point++
}
```

```go
for i := 0; i < 100; i++ {
  if i == 3 {
    fmt.Println(3)
    continue
  }
  if i > 30 {
    fmt.Println("抜けた")
    break
  }
  fmt.Println(i)
}
```

配列の要素分

```go
arr := [3]int{1, 2, 3}
for i := 0; i < len(arr); i++ {
  fmt.Println(i, arr[i])
}
```

```go
for i, v := range arr {
  fmt.Println(i, v)
}
for _, v := range arr {
  fmt.Println(v)
}
```

## switch
```go
n := 4
switch n {
  case 1, 2:
    fmt.Println("1 or 2")
  case 3, 4:
    fmt.Println("3 or 4")
  default:
    fmt.Println("どれでもない")
}
```

```go
switch n := 2; n {
  case 1, 2:
	fmt.Println("1 or 2")
  case 3, 4:
	fmt.Println("3 or 4")
  default:
	fmt.Println("どれでもない")
}
```

列挙型と演算子が共存している場合はエラーになる
```go
switch n := 2; n {
case 1, 2, 3:
	fmt.Println("0 < n2 < 4")
case n > 3 && n < 6:
	fmt.Println("3 < n2 < 6")
}
// error
```

## 型switch
型アサーション
```go
func anything(a interface{}) {
  fmt.Println(a)
}

func main() {
  anything("aaa")
  anything(1)

  var x interface{} = 3
  i := x.(int)

  fmt.Println(i + 2)
  // 5
  fmt.Println(x + 2)
  // error
}
```

floatはエラー
```go
f := x.(float64)
fmt.Println(f)
// error
```

エラーにせずに実行する方法
```go
f, isFloat := x.(float64)
fmt.Println(f, isFloat)
// 0 false
```

型アサーションとこの記述を使って型で分岐させる
```go
if x == nil {
	fmt.Println("何もない")
} else if i, isInt := x.(int); isInt {
	fmt.Println(i, "x is int")
} else if s, isString := x.(string); isString {
	fmt.Println(s)
} else {
	fmt.Println("対応していない型")
}
```

switchと組み合わせ
```go
switch x.(type) {
  case int:
    fmt.Println("int")
  case string:
    fmt.Println("string")
  default:
    fmt.Println("default")
}
```

```go
func anything(a interface{}) {
  switch v := a.(type) {
    case string:
      fmt.Println(v + "!?")
    case int:
      fmt.Println(v + 1000)
  }
}

func main() {
  anything("aaa")
  anything(1)
}

// aaa!?
// 1001
```

## ラベル付きfor



















