# Go JSON Tutorial
Gopherの皆さん、ようこそ！  
このチュートリアルでは、GoアプリケーションでJSONを扱う方法を包括的に見ていきます。  

JSON（JavaScript Object Notation）は、ウェブ上でデータを送受信するための最も人気のあるデータ形式です。  
主要な言語はすべてデフォルトでこのデータ形式をサポートしており、Goも例外ではありません。  

ソースコード：このチュートリアルの完全なソースコードは以下で見つけることができます：  
[TutorialEdge/go-json-tutorial](https://github.com/TutorialEdge/go-json-tutorial)  

このチュートリアルでは、GoでJSONを効果的に扱うための様々な技術を学びます。  

# JSONのマーシャリング
まず、GoでJSONをマーシャリングする方法を見ていきましょう。  
マーシャリングにより、Goオブジェクトを JSON文字列に変換できます。  

## 簡単な例
GoコードでBook構造体を定義したとします：  

```go
type Book struct {
    Title string `json:"title"`
    Author string `json:"author"`
}

// Book構造体のインスタンス
book := Book{
    Title: "Learning Concurrency in Python",
    Author: "Elliot Forbes"
}
```

Book構造体のインスタンスをJSONに変換するには、encoding/jsonパッケージを使用します：  

```go
byteArray, err := json.Marshal(book)
if err != nil {
    fmt.Println(err)
}

fmt.Println(string(byteArray))
```

このコードで、Go構造体をJSON形式に変換できます。  
エラー処理も含まれており、結果はバイト配列として返されるため、文字列に変換して出力しています。  

# 高度な例 - ネストされた構造体
マーシャリングの基本を理解したので、ネストされた構造体を含むより複雑な例を見てみましょう。  

```go
type Book struct {
    Title  string `json:"title"`
    Author Author `json:"author"`
}

type Author struct {
    Sales     int  `json:"book_sales"`
    Age       int  `json:"age"`
    Developer bool `json:"is_developer"`
}

author := Author{Sales: 3, Age: 25, Developer: true}
book := Book{Title: "Learning Concurrency in Python", Author: author}
```

ここでは、ネストされた構造体を含むより複雑な構造体を定義しました。  
構造体の定義内で、JSONタグを使用して、構造体のフィールドをマーシャリングされたJSONのフィールドに直接マッピングしています。  

```go
byteArray, err := json.Marshal(book)
if err != nil {
    fmt.Println(err)
}

fmt.Println(string(byteArray))
```

このプログラムを実行すると、以下の出力が得られるはずです：  

```
$ go run main.go
{
    "title":"Learning Concurrency in Python",
    "author":{
        "book_sales":3,
        "age":25,
        "is_developer":true
    }
}
```

この例では、ネストされた構造体を含む複雑なデータ構造をJSONに変換する方法を示しています。  

# インデント / 整形出力
JSONをより読みやすく出力したい場合は、通常の`json.Marshal()`関数の代わりに`json.MarshalIndent()`関数を使用できます。  

```go
author := Author{Sales: 3, Age: 25, Developer: true}
book := Book{Title: "Learning Concurrency in Python", Author: author}

byteArray, err := json.MarshalIndent(book, "", "  ")
if err != nil {
    fmt.Println(err)
}
```

MarshalIndentに2つの追加引数を渡しています。  
これらは、プレフィックス文字列とインデント文字列です。  
インデント文字列の長さを変更することで、より深いインデントを追加できます。  

これを実行すると、出力されるJSON文字列が以下のようにより見やすくなります：

```json
{
  "title": "Learning Concurrency in Python",
  "author": {
    "book_sales": 3,
    "age": 25,
    "is_developer": true
  }
}
```

この方法により、JSONデータを人間が読みやすい形式で出力できます。  

この例の完全なソースコードは以下の通りです：  

**main.go**  

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Book struct {
    Title  string `json:"title"`
    Author Author `json:"author"`
}

type Author struct {
    Sales     int  `json:"book_sales"`
    Age       int  `json:"age"`
    Developer bool `json:"is_developer"`
}

func main() {
    author := Author{Sales: 3, Age: 25, Developer: true}
    book := Book{Title: "Learning Concurrency in Python", Author: author}

    byteArray, err := json.Marshal(book)
    if err != nil {
        fmt.Println(err)
    }

    fmt.Println(string(byteArray))
}
```

このコードは、これまでに説明した概念をすべて組み合わせたものです。  
BookとAuthor構造体を定義し、それらのインスタンスを作成し、JSONにマーシャリングして出力しています。  

# JSONのアンマーシャリング
構造体をJSONにマーシャリングする方法を学んだので、今度は逆の操作を見てみましょう。  
JSON文字列を受け取り、それを構造体にアンマーシャリングして、通常のGo構造体として扱えるようにしたいと思います。  
これは、他のAPIを使用するGoサービスを実装する際によく行う操作です。  
これらのAPIは通常、レスポンスをJSON文字列として返します。  
この例では、小さなバッテリーセンサーからのJSON文字列を取り、この文字列を構造体にアンマーシャリングします。  

```json
{ "name": "battery sensor", "capacity": 40, "time": "2019-01-21T19:07:28Z" }
```

まず、このJSON文字列と同じフィールドを持つ構造体を定義します：

```go
type SensorReading struct {
    Name string `json:"name"`
    Capacity int `json:"capacity"`
    Time string `json:"time"`
}
```

各フィールドに`json:"KEY"`というタグを追加しています。  
これらのタグは、JSONのキーと構造体のフィールドを対応付けます。  
次に、Unmarshal関数を使ってJSON文字列を構造体にアンマーシャリングします：  

```go
jsonString := `{"name": "battery sensor", "capacity": 40, "time": "2019-01-21T19:07:28Z"}`

var reading SensorReading
err := json.Unmarshal([]byte(jsonString), &reading)
fmt.Printf("%+v\n", reading)
```

`jsonString`をバイト配列にキャストし、&readingで構造体へのポインタを渡しています。  
実行すると、以下の出力が得られます：  

```s
$ go run main.go
{Name:battery sensor Capacity:40 Time:2019-01-21T19:07:28Z}
```

これで、JSON文字列を簡単に構造体にアンマーシャリングできました。  
この構造体を通常のGoプログラムと同じように扱えるようになりました。  

# 非構造化データ
時には、読み込むJSON文字列の構造が事前にわからない場合があります。  
そのような場合、JSONをアンマーシャリングするための事前定義された構造体を生成できないかもしれません。  
このような場合、代替アプローチとして`map[string]interface{}`型を使用してアンマーシャリングすることができます。  

```go
str := `{"name": "battery sensor", "capacity": 40, "time": "2019-01-21T19:07:28Z"}`

var reading map[string]interface{}
err = json.Unmarshal([]byte(str), &reading)
fmt.Printf("%+v\n", reading)
```

ここでは、先ほどの`SensorReading`のコードを修正し、`reading`の型を`map[string]interface{}`に変更しています。  
これを実行すると、JSON文字列が文字列と要素のマップに正常に変換されたことがわかります：  

```s
$ go run main.go
map[capacity:40 time:2019-01-21T19:07:28Z name:battery sensor]
```

これは緊急時に便利なテクニックですが、JSONの構造がわかっている場合は、明示的に構造体を定義することを強くお勧めします。  
この方法は柔軟性がありますが、型の安全性が低くなるため、可能な限り構造体を使用することが望ましいです。  

# 非構造化リストの処理
前述の方法は、アンマーシャリングするルートオブジェクトが配列でない場合に適していますが、配列を`map[string]interface{}`にアンマーシャリングしようとすると問題が発生します。  
代わりに、コードを少し修正して、文字列を`[]map[string]interface{}`型のスライスにアンマーシャリングすることができます：  

```go
str := `[{"name": "battery sensor", "capacity": 40, "time": "2019-01-21T19:07:28Z"}]`

var reading []map[string]interface{}
_ = json.Unmarshal([]byte(str), &reading)
fmt.Printf("%+v\n", reading)
```

これを実行すると、以下の結果が得られます：

```
go run main.go
```

```bash
[map[capacity:40 name:battery sensor time:2019-01-21T19:07:28Z]]
```

この方法により、配列形式の非構造化JSONデータを簡単に処理できます。  
ただし、可能な限り構造体を使用することが推奨されます。  
この方法は、JSONの構造が不明な場合や動的に変化する場合に特に有用です。  

