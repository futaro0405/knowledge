# テスト

**main.go**  
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

**main_test.go**  
Debug変数でテストを行うかを管理する
```go:main_test.go
package main

import "testing"

var Debug bool = false

func TestIsOne(t *testing.T) {
  i := 1
  if Debug {
    t.Skip("スキップ")
  }
  v := IsOne(i)
  if !v {
    t.Errorf("%v != %v", i 1)
  }
}
```

テストの実行
```bash
$ go test
PASS
ok golang/lesson 0.064s
```

テストの詳細を表示させる  
失敗
```bash
$ go test -v

=== RUN TestIsOne
    TestIsOne: main_test.go:15: 0 != 1
--- FAIL: TestIsOne (0.00s)
FAIL
exit status 1
FAIL golang/lesson 0.123s
```

成功
```bash
$ go test -v

=== RUN   TestIsOne
--- PASS: TestIsOne (0.00s)
PASS
ok  golang/lesson 0.055s
```

main以外のテストを実行する

**alib.go**  

```go
package alib

func Average(s []int) int {
  total := 0
  for _, i := range s {
    total = i
  }
  return int(total / len(s))
}
```

**alib_test.go**  

```go
package alib

import "testing"

var Debug bool = false

func TestAverage(t *testing.T) {
	if Debug {
		t.Skip("スキップ")
	}

	v := Average([]int{1, 2, 3, 4, 5})
	if v != 3 {
		t.Errorf("%v != %v", i ,3)
	}
}
```

```bash
// alibフォルダ内のテストを実行する
go test -v ./alib

// フォルダ内の全てのテストを実行する
got test -v ./...

// cover率
go test -cover ./...
```






















