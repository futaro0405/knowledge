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