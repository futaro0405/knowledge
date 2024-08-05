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
