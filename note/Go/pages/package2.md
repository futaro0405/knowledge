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

}
```
