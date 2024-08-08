# regexpの詳細
## 文字列の置換
```go
package main
 
import (
	"fmt"
	"regexp"
)
 
 
func main() {
	re1 := regexp.MustCompile(`\s+`)

	//正規表現による文字列の置換
	//正規表現にマッチした部分を別の文字列に置き換える。
	//regexp.Regexp型メソッドReplaceAllString
	//対象の文字列に正規表現のパターンにマッチする部分がない場合は、元の文字列がそのまま返される。
	//スペースを,に置き換える
	fmt.Println(re1.ReplaceAllString("AAA BBB CCC", ","))
 
	//また置換する文字列に空文字を指定することで、正規表現にマッチした部分を文字列から取り除ける
	re1 = regexp.MustCompile(`、|。`)
	fmt.Println(re1.ReplaceAllString("私は、Golangを使用する、プログラマー。", ""))
}
```

## 文字列の分割
 
```go
package main
	
import (
	"fmt"
	"regexp"
)


func main() {
	re1 := regexp.MustCompile((`(abc|ABC)(xyz|XYZ)`))
	//正規表現による文字列の分割
	//正規表現にマッチした部分で文字列を分割する場合は、regexp.Regexp型のメソッドSplitを使う
	//第二引数　分割する最大数を指定。-1でマッチした全ての箇所で分割する。[]stringで返す。
	fmt.Println(re1.Split("ASHVJV<HABCXYZKNJBJVKABCXYZ", -1))
	
	re1 = regexp.MustCompile(`\s+`)
	//スペースやタブなどの空白にマッチ。空白で分割する。
	fmt.Println(re1.Split("aaaaaaaaaa     bbbbbbb  cccccc", -1))
}
```
# sync
goの非同期処理における排他作業や同期処理を支援する機能がまとめられたパッケージ。

複数のゴルーチン間のレースコンディションを抑制しつつ、安全にデータを共有するための仕組みとしてチャネル型が提供されている。
しかし、チャネルは同期処理のあらゆる局面の解決策であるというわけではない。

そこで使用されるのが`sync`パッケージ

```go
package main
import (
	"fmt"
	"time"
)

var st struct{ A, B, C int }

func UpdateAndPrint(n int) {
	st.A = n
	time.Sleep(time.Microsecond)
	st.B = n
	time.Sleep(time.Microsecond)
	st.C = n
	time.Sleep(time.Microsecond)
	fmt.Println(st)
}

func main() {
	for i := 0; i < 5; i++ {
		go func() {
			for i := 0; i < 1000; i++ {
				UpdateAndPrint(i)
			}
		}()
	}
	for {

	}
}
// ...
// [996 996 999]
// ...
```

Mutexによる同期処理
`sync.Mutex`を使用して書き換える

```go
var st2 struct{ A, B, C int }

var mutex *sync.Mutex

// Mutexを保持するパッケージ変数
func UpdateAndPrint(n int) {
	// ロック
	mutex.Lock()

	st2.A = n
	time.Sleep(time.Microsecond)
	st2.B = n
	time.Sleep(time.Microsecond)
	st2.C = n
	time.Sleep(time.Microsecond)
	fmt.Println(st2)

	// アンロック
	mutex.Unlock()
}

func main() {
	mutex = new(sync.Mutex)

	for i := 0; i < 5; i++ {
		go func() {
			for i := 0; i < 1000; i++ {
				UpdateAndPrint(i)
			}
		}()
	}
	for {
	}
}
// ...
 // [996 996 996]
 // ...
```

ロックしている間はひとつのゴルーチンしか処理を行えない
そのため、`UpdateAndPrint()`は常にひとつのゴルーチンが一貫性をもって実行できるようになる

## ゴルーチンの処理を待ち受ける
ゴルーチンを待ち受けることで無限ループを行わないと実行されない状態を脱却する

```go
package main

import (
	"fmt"
	"sync"
)

// ゴルーチンの終了を待ち受ける
func main() {
	// sync.waitGroupを生成
	wg := new(sync.WaitGroup)
	// 待ち受けるゴルーチンの数は3
	wg.Add(3)

	go func() {
		for i := 0; i < 100; i++ {
			fmt.Println("1st Goroutine")
		}
		// 完了
		wg.Done()
	}()
	go func() {
		for i := 0; i < 100; i++ {
			fmt.Println("2nd Goroutine")
		}
		// 完了
		wg.Done()
	}()
	go func() {
		for i := 0; i < 100; i++ {
			fmt.Println("3rd Goroutine")
		}
		// 完了
		wg.Done()
	}()

	wg.Wait()
}
```

# crypt
MD5ハッシュ値を生成

```go
package main

import (
	"crypto/md5"
	"fmt"
	"io"
)

func main() {
	// MD5ハッシュ値を生成
	// 任意の文字列からMD5ハッシュ値を生成する処理例
	h := md5.New()
	
	io.WriteString(h, "ABCDE")

	fmt.Println(h.Sum(nil))

	s := fmt.Sprintf("%x", h.Sum(nil))
	fmt.Println(s)
}
```

crypt詳細
sha ver

```go
package main
 
import (
	"fmt"
	"io"
	
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
)
 
func main() {
	//------------------------------
	/* SHA-1 */
	s1 := sha1.New()
	io.WriteString(s1, "ABCDE")
	fmt.Printf("%x\n", s1.Sum(nil))
	// => "7be07aaf460d593a323d0db33da05b64bfdcb3a5"
	
	//------------------------------
	/* SHA-256 */
	s256 := sha256.New()
	io.WriteString(s256, "ABCDE")
	fmt.Printf("%x\n", s256.Sum(nil))
	// => "f0393febe8baaa55e32f7be2a7cc180bf34e52137d99e056c817a9c07b8f239a"
	
	//------------------------------
	/* SHA-512 */
	s512 := sha512.New()
	io.WriteString(s512, "ABCDE")
	fmt.Printf("%x\n", s512.Sum(nil))
	// => "9989a8fcbc29044b5883a0a36c146fe7415b1439e995b4d806ea0af7da9ca4390eb92@<dtp>{lb}a604b3ecfa3d75f9911c768fbe2aecc59eff1e48dcaeca1957bdde01dfb"
}
```

# json
エンコーダとデコーダの機能を提供するパッケージ

## 構造体からjsonテキストへの変換

```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"
)

type A struct{}

type User struct {
//	ID         int              `json:"id,string"` string型
//	ID         int              `json:"-"` 表示しない
	ID         int              `json:"id"`
	Name    string         `json:"name"`
	Email     string        `json:"email"`
	Created  time.Time `json:"created"`
	A           *A            `json:"A",omitempty`
	// omitempty 値を隠す
	// stractはポインタを渡して隠す
}

func main() {
	u := new(User)
	u.ID = 1
	u.Name = "test"
	u.Email = "example@example.com"
	u.Created = time.Now()

	// Marshal JSONに変換
	// bs: 構造体をJSONに変換した値をbyteのsliceで受け取る
	bs, err := json.Marshal(u)
	if err != nil {
		log.Fatal(err)
	}
	
	fmt.Println(string(bs))
}

// {"id":1, name:"test", "email":"example@example.com", created: "2024-01-01 20:00:00"}
```

## JSONから構造体へ変換

```go

fmt.Printf("%T\n", bs)

u2 :＝ new(User)

// Unmarshal JSONをデータに変換
if err := json.Unmarshal(bs, &u2); err != nil {
	fmt.Println(err)
}
fmt.Println(u2)
```

## Marshalのカスタム

```go
type A struct{}

type User struct {
	ID      int       `json:"id"`
	Name    string    `json:"name"`
	Email   string    `json:"email"`
	Created time.Time `json:"created"`
	A       *A        `json:"A",omitempty`
}

func (u User) MarshalJSON() ([]byte, error) {
	v, err := json.Marshal(&struct {
		Name string
	}{
		Name: "Mr " + u.Name,
	})
	return v, err
}

func main() {
	u := new(User)
	u.ID = 1
	u.Name = "test"
	u.Email = "example@example.com"
	u.Created = time.Now()

	bs, err := json.Marshal(u)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(bs))
}
```

## UnMarshalのカスタム

```go
type A struct{}

type User struct {
	ID      int       `json:"id"`
	Name    string    `json:"name"`
	Email   string    `json:"email"`
	Created time.Time `json:"created"`
	A       *A        `json:"A",omitempty`
}

func (u *User) UnmarshalJSON(b []byte) error {
	type User2 struct {
		Name string
	}
	var u2 User2
	err := json.Unmarshal(b, &u2)
	if err != nil {
		fmt.Println(err)
	}
	u.Name = u2.Name + "!"
	return err
}

func main() {
	u := new(User)
	u.ID = 1
	u.Name = "test"
	u.Email = "example@example.com"
	u.Created = time.Now()

	bs, err := json.Marshal(u)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(bs)
	fmt.Println(string(bs))

	fmt.Printf("%T\n", bs)

	var u2 User

	if err := json.Unmarshal(bs, u2); err != nil {
		fmt.Println(err)
	}
	fmt.Println(u2)
}

```

