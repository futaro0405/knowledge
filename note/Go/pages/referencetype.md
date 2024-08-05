## slice
配列によく似たデータ型
配列と違い、`[]`内に要素数を指定しない。

```go
var sl []int
var sl2 []int = []int{100, 200}
sl3 := []string{"A", "B"}
```

make関数を使用してsliceを生成する

```go
sl := make([]int, 5)
// [0 0 0 0 0]

var sl2 []int = []int{100, 200}
sl2[0] = 1000
// [1000 200]

sl3 := []string{1, 2, 3, 4, 5}
fmt.Println(sl3[0])
// 1
fmt.Println(sl3[2:4])
// [3 4]
fmt.Println(sl3[:2])
// [1 2]
fmt.Println(sl3[2:])
// [3 4 5]
fmt.Println(sl3[:])
// [1 2 3 4 5]
fmt.Println(sl3[len(sl3)-1])
// 5
fmt.Println(sl3[1: len(sl3)-1])
// [2 3 4]
```

## append
sliceは可変長の配列になっているので要素を追加することができる

```go
sl := []int{1, 2}
// [1 2]
sl = append(sl, 3)
// [1 2 3]
sl = append(sl, 4, 5, 6)
// [1 2 3 4 5 6]
```

`append`を使用してsliceの最後に要素を追加できる

```go
sl2 := make([]int, 5)
fmt.Println(sl2)
// [0 0 0 0 0]
```

sliceにはキャパシティが存在し、メモリを気にする必要がある開発では設定する
```go
fmt.Println(cap(sl2))
// 5
sl3 := make([]int, 5, 10)
fmt.Println(len(sl2))
// 5
fmt.Println(cap(sl3))
// 10
```

要領以上の要素が追加されるとメモリの消費が倍になってしまいます。
メモリーを気にするような開発の場合は、容量にも気をつけます。
最初は気にせずやるほうがいいと思います。

過剰にメモリを確保してしまうと実行速度が落ちたりする。
良質なパフォーマンスを実現するには、容量の管理も気にします。

## sliceのコピー

```go
sl := []int{100, 200}
sl2 := sl
sl2[0] = 1000
fmt.Println(sl)
fmt.Println(sl2)
// [1000 200]
// [1000 200]
```

参照型のデータ型はこのように値を渡すと同じアドレスが格納されます。
そのため、両方更新される
参照型： slice map channel

```go
sl := []int{1, 2, 3, 4, 5}
sl2 := make([]int, 5, 10)


n := copy(sl2, sl)

fmt.Println(n, sl2)
// 5 [1 2 3 4 5]
```

nはコピーに成功した数

## slice for

```go
sl := []stirng("A", "B", "C")
fmt.Println(sl)

for i := range sl {
}

for i := 0; i < len(sl); i++ {
}


```

## 可変長引数

```go
func Sum(s ...int) int {
  n := 0
  for _, v := range s {
    n += v
  }
  return n
}

func main() {
  fmt.Println(Sum(1, 2, 3))
  // 6
  fmt.Println(Sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
  // 55
  fmt.Println(Sum())
  // 0

  sl := []int{1, 2, 3}
  fmt.Println(Sum(sl...))
  // 6
}
```

## map
key, valueの形式で配列を作ることができる

```go
var m = map[string]int{"A": 100, "B": 200}
fmt.Println(Sum())
// map["A":100  "B":200]

// 改行しても使える
m := map[string]int{
  "A": 100,
  "B": 200
}

// make関数を使って空のmapを作る
m := make(map[int]string)
// map[]
m[1] = "JAPAN"
m[2] = "USA"
// map[1:JAPAN 2:USA]

// 値の取り出し
fmt.Println(m["A"])
// 100

// エラーハンドリングもある
s, ok := m[1]
fmt.Println(s, ok)
// JAPAN true

s, ok := m[3]
//  false

// 削除
delete(m4, 3)

// 要素数
len(m)
```
## map for
```go
m := map[string]int{
  "apple": 100,
  "Banana": 200,
}

for _, v := range m {
}

for k := range m {
}
```

## channel






























