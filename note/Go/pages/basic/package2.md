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

# sort

```go
i := []int{5, 3, 2, 4, 5, 6, 4, 8, 9, 8, 7, 10}
s := []string{"a", "z", "j"}

// Int型のsort
sort.Ints(i)
// String型のsort
sort.Strings(s)

fmt.Println(i, s)

// [2 3 4 4 5 5 6 7 8 8 9 10] [a j z]
```

## sliceのsort

```go
type Entry struct {
	Name  string
	Value int
}

func main() {
	el := []Entry{
		{"A", 20},
		{"F", 40},
		{"i", 30},
		{"b", 10},
		{"t", 15},
		{"y", 30},
		{"c", 30},
		{"w", 30},
	}
	
	// sort.Slice([slice], [条件式])
	sort.Slice(el, func(i, j int) bool { return el[i].Name < el[j].Name })
	fmt.Println(el)
}

// [{A 20} {F 40} {b 10} {c 30} {i 30} {t 15} {w 30} {y 30}]
```

## slicetableのsort

```go
type Entry struct {
	Name  string
	Value int
}

func main() {
	el := []Entry{
		{"A", 20},
		{"F", 40},
		{"i", 30},
		{"b", 10},
		{"t", 15},
		{"y", 30},
		{"c", 30},
		{"w", 30},
	}
	
	// sort.Slice([slice], [条件式])
	sort.SliceStable(el, func(i, j int) bool { return el[i].Name < el[j].Name })
	fmt.Println(el)
}

// [{A 20} {F 40} {b 10} {c 30} {i 30} {t 15} {w 30} {y 30}]
```

sliceとslicetableのsortは何が異なるか
違いは安定ソートであるかどうか
ソートのアルゴリズムのうち同等なデータのソートがソート前の順番とソート後で保存されているか
ソート途中の各状態で常に順番の位置関係を保っていること

## カスタムsort

```go
type Entry struct {
	Name  string
	Value int
}
type List []Entry

func (l List) Len() int {
	return len(l)
}
func (l List) Swap(i, j int) {
	l[i], l[j] = l[j], l[i]
}
// ここをカスタマイズする
func (l List) Less(i, j int) bool {
	if l[i].Value == l[j].Value {
		return (l[i].Name < l[j].Name)
	} else {
		return (l[i].Value < l[j].Value)
	}
}

func main() {
	m := map[string]int{"ada": 1, "hoge": 4, "basha": 3, "poeni": 3}
	
	lt := List{}
	for k, v := range m {
		e := Entry{k, v}
		lt = append(lt, e)
	}
	// Sort
	sort.Sort(lt)
	fmt.Println(lt)
	// Reverse
	sort.Sort(sort.Reverse(lt))
	fmt.Println(lt)
}
```

# context
APIのサーバやクライアントを使う際にコンテキストを提供してキャンセルやタイムアウトを行える仕組み
```go
func longProcess(ctx context.Context, ch chan string) {
	fmt.Println("開始")
	time.Sleep(2 * time.Second)
	fmt.Println("終了")
	ch <- "実行結果"
}

func main() {
	ch := make(chan string)
	// context作成
	ctx := context.Background()
	// 1秒間のタイムアウトを付与して再定義
	ctx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	go longProcess(ctx, ch)

L:
	for {
		select {
		case <-ctx.Done():
			fmt.Println("##########Error###########")
			fmt.Println(ctx.Err())
			break L
		case s := <-ch:
			fmt.Println(s)
			fmt.Println("success")
			break L
		}
	}
	fmt.Println("ループ抜けた")
}
```

# net/url
URL文字列を処理する機能を備えたパッケージ
URLのパースや生成ができる

## URLのパース

```go
u, _ := url.Parse("http://example.com/search?a=1&b=2#top")
fmt.Println(u.Scheme)
fmt.Println(u.Host)
fmt.Println(u.Path)
fmt.Println(u.RawQuery)
fmt.Println(u.Fragment)

fmt.Println(u.IsAbs())
fmt.Println(u.Query())

// http
// example.com
// /search
// a=1&b=2
// top
// map[a: [1] b: [2]]
```

## URLの生成

```go
// URL型の構造体のポインタを生成
url := &url.URL{}
url.Scheme = "https"
url.Host = "google.com"
q := url.Query()
q.Set("q", "Golang")

// quaryの文字列のエスケープなどができる
url.RawQuery = q.Encode()

fmt.Println(url)

// https://google.com?q=Golang
```

# net/http
httpクライアントとサーバ機能がまとめられたパッケージ

## client
### GET

```go
res, _ := http.Get("https://example.com")

fmt.Println(res.StatusCode)

fmt.Println(res.Proto)

fmt.Println(res.Header["Date"])
fmt.Println(res.Header["Content-Type"])

fmt.Println(res.Request.Method)
fmt.Println(res.Request.URL)

defer res.Body.Close()
body, _ := ioutil.ReadAll(res.Body)
fmt.Print(string(body))
```

### POST

```go
vs := url.Values{}

vs.Add("id", "1")
vs.Add("message", "メッセージ")
fmt.Println(vs.Encode())
// => "id=1&message=%E3%83%A1%E3%83%83%E3%82%BB%E3%83@<dtp>{lb}%BC%E3%82%B8"

res, err := http.PostForm("https://example.com/", vs)
if err != nil {
	log.Fatal(err)
}
defer res.Body.Close()
body, _ := ioutil.ReadAll(res.Body)
fmt.Print(string(body))
```

## net/http clientの応用
ヘッダーを付けたり、クエリを付けたりする場合。
### Get ver
```go
package main
 
import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)
 
//Get
 
func main() {
	//応用
	//ヘッダーをつけたり、クエリをつけたり
	//Parse 正しいURLか確認
	base, _ := url.Parse("https://example.com/")
 
	//クエリ の確認 URLの後につく
	reference, _ := url.Parse("index/lists?id=1")
 
	//ResolveReference
	//クエリをくっつけたURLを生成する。
	//相対パスから絶対URLに変換する。
	//baseのURLの末尾に文字列が入っていたとしても、正しいURLに直してくれる
	endpoint := base.ResolveReference(reference).String()
	fmt.Println(endpoint)
 
	//GET ver
	//リクエストを作成 nil部はPOST時のみ設定（バイトを入れる）
	//まだリクエストはしていない。structを作っただけ。
	req, _ := http.NewRequest("GET", endpoint, nil)
 
	//requestにheaderをつける。cash情報など
	req.Header.Add("Content-Type", `application/json"`)
 
	//URLのクエリを確認
	q := req.URL.Query()
 
	//クエリを追加
	q.Add("name", "test")
 
	//クエリを表示
	fmt.Println(q)
 
	//&など特殊文字などがある場合があるため、encodingしてからURLに追加してやる必要がある
	fmt.Println(q.Encode())
 
	//encodeしてからURLに戻す
	//日本語などを変換する
	req.URL.RawQuery = q.Encode()
 
	//実際にアクセスする
	//クライアントを作る
	var client *http.Client = &http.Client{}
 
	//結果 アクセスする
	resp, _ := client.Do(req)
 
	//読み込み
	body, _ := ioutil.ReadAll(resp.Body)
 
	//出力
	fmt.Println(string(body))
}
```
### Post ver
```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

//応用
type Account struct {
	ID       string
	PassWord string
}
 
//Post
func main() {
	//応用
	//ヘッダーをつけたり、クエリをつけたり
	//Parse 正しいURLか確認
	base, _ := url.Parse("https://example.com/")

	//クエリ の確認 URLの後につく
	reference, _ := url.Parse("index/lists?id=1")

	//Postの時のデータ
	AccountData := &Account{ID: "ABC-DEF", PassWord: "testtest"}
	data, _ := json.Marshal(AccountData)

	//ResolveReference
	//クエリをくっつけたURLを生成する。
	//相対パスから絶対URLに変換する。
	//baseのURLの末尾に文字列が入っていたとしても、正しいURLに直してくれる
	endpoint := base.ResolveReference(reference).String()
	fmt.Println(endpoint)

	//POST ver
	//bytes.NewBuffer([]byte("password")でリクエストの領域を作成
	//POSTの場合は、Bodyにデータを入れる。例えばパスワード。見られたらダメな情報はbodyに
	req, _ := http.NewRequest("POST", endpoint, bytes.NewBuffer(data))

	//requestにheaderをつける。cash情報など
	req.Header.Add("Content-Type", `application/json"`)

	//URLのクエリを確認
	q := req.URL.Query()

	//クエリを追加
	q.Add("name", "test")

	//クエリを表示
	fmt.Println(q)

	//&など特殊文字などがある場合があるため、encodingしてからURLに追加してやる必要がある
	fmt.Println(q.Encode())

	//encodeしてからURLに戻す
	//日本語などを変換する
	req.URL.RawQuery = q.Encode()

	//実際にアクセスする
	//クライアントを作る
	var client *http.Client = &http.Client{}

	//結果 アクセスする
	resp, _ := client.Do(req)

	//読み込み
	body, _ := ioutil.ReadAll(resp.Body)

	//出力
	fmt.Println(string(body))
}
```

# net/http server

```go
package main

import (
	"html/template"
	"log"
	"net/http"
)

/*
type MyHandler struct{}

func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
}
*/

func top(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("tmpl.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, "Hello World111!")
}

func main() {
	http.HandleFunc("/top", top)

	//http.ListenAndServe(":8080", &MyHandler{})
	http.ListenAndServe(":8080", nil)
}

```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Go Web Programming</title>
  </head>
  <body>
    {{ . }}
  </body>
</html>
```