# 標準package
## os

### `os.Exit()`
任意の時点で終了

```go
import (
	"os"
)

func main() {
  os.Exit(1)
  fmt.Println("Start")
}
```

`defer`文も実行されない

```go
defer func() {
	fmt.Println("defer")
}
os.Exit(0)

// exit status 0
```

ログのフィルタ

```go
func main() {
	_, err = os.Open("A.txt")
	if err != nil {
	}
}
```




















