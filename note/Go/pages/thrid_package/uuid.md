# uuidの準備
```go
go get "github.com/google/uuid"
```
でuuidをインストールしてください。

# uuid
ソフトウェア所じゅでオブジェクトを一位に識別するための識別子

```go
package main

import (
	"fmt"

	"github.com/google/uuid"
)

func main() {
	uuidObj, _ := uuid.NewUUID()
	fmt.Println("  ", uuidObj.String())

	uuidObj2, _ := uuid.NewRandom()
	fmt.Println("  ", uuidObj2.String())
}
```

例：3cc807ab-8e31-3071-aee4-f8f03781cb91

いろんなバージョンがあるので、紹介。
```go
package main
 
import (
	"fmt"

	"github.com/google/uuid"
)
 
func main() {
	fmt.Println("version1 NewUUID --")
	for i := 0; i < 10; i++ {
		uuidObj, _ := uuid.NewUUID()
		fmt.Println("  ", uuidObj.String())
	}
	
	fmt.Println("version3 NewMD5 --")
	for i := 0; i < 10; i++ {
		uuidObj, _ := uuid.NewUUID()
		data := []byte("wnw8olzvmjp0x6j7ur8vafs4jltjabi0")
		uuidObj2 := uuid.NewMD5(uuidObj, data)
		fmt.Println("  ", uuidObj2.String())
	}
	
	fmt.Println("version5 NewSHA1 --")
	for i := 0; i < 10; i++ {
		uuidObj, _ := uuid.NewUUID()
		data := []byte("wnw8olzvmjp0x6j7ur8vafs4jltjabi0")
		uuidObj2 := uuid.NewSHA1(uuidObj, data)
		fmt.Println("  ", uuidObj2.String())
	}
	
	fmt.Println("version4 NewRandom --")
	for i := 0; i < 10; i++ {
		uuidObj, _ := uuid.NewRandom()
		fmt.Println("  ", uuidObj.String())
	}
}
```