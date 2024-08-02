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


























