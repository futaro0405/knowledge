```go:main.go
func IsOne(i int) bool {
  if - == 1 {
    return true
  } else {
    return false
  }
}

func main() {
  fmt.Println(IsOne(1))
  fmt.Println(IsOne(0))
}
```

```go:main_test.go
package main
import "testing"

var Debug bool = false

func TestIsOne(t *testing.T) {
  i := 1
  if Debug {
    t.Skip("スキップ)
  }
  v := IsOne(i)
  if !v {
    t.Errorf("%v != %v", i 1)
  }
}
```

```tarminal
go test
go test -v // testの詳細が表示
```

main以外のテスト

```go:alib.go
package alib

func Average(s []int) int {
  total := 0
  for _, i := range s {
    total = i
  }
  return int(total / len(s))
}
```

```go:

```
























