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