## モジュール管理の補足
次のレクチャーでの、パッケージをimportして実行した際に
```go
is not in GOROOT
```
表題のエラーが出てしまい、他のフォルダから変数の参照ができない場合。

ターミナルで実行してみてください。
```tarminal
go mod init
go mod tidy
```

下記記事が参考になるかと思います。  
https://qiita.com/taku-yamamoto22/items/4d6f9ff8451a0b86997b

go 1.13からはgo modでモジュール管理が推奨されていました。

プロジェクト内で`go mod init` で、依存モジュールを初期化しますと、go.modというファイルが作成されます。  
中身は、以下のような感じです。
```
module example.com/go-mod-test go 1.16
```
依存モジュールの情報は go.mod と go.sum という名前のファイルに記載されます。  

これらのファイルを git などでバージョン管理することによって、依存モジュールとそのバージョンを明確にすることができます。  

- `go build`などのビルドコマンドで、依存モジュールを自動インストールする
- `go list -m all`で、現在の依存モジュールを表示する
- `go get`で、依存モジュールの追加やバージョンアップを行う
- `go mod tidy`で、使われていない依存モジュールを削除する

実は`go mod`を直接実行することは少なく、他の`go`サブコマンドを実行したときに、自動的に処理が行われることが多いです。

例えば、後のレクチャーで出てくるiniパッケージを使う場合は、プロジェクトのルートで`go get -u "gopkg.in/go-ini/ini.v1"`を実行しますと、go.modにも依存パッケージとして記載され使用することができるかと思います。

公式の説明は以下になります。  

>GO111MODULE = onの場合、goコマンドではモジュールを使用する必要があり、GOPATHを参照することはありません。これを、モジュール対応または「モジュール対応モード」で実行されるコマンドと呼びます。  
>GO111MODULE = offの場合、goコマンドはモジュールサポートを使用しません。代わりに、ベンダーのディレクトリとGOPATHを調べて依存関係を見つけます。これを「GOPATHモード」と呼びます。  
>GO111MODULE = autoまたは未設定の場合、goコマンドは現在のディレクトリに基づいてモジュールサポートを有効または無効にします。モジュールのサポートは、現在のディレクトリにgo.modファイルが含まれる場合、またはgo.modファイルが含まれるディレクトリの下にある場合にのみ有効になります。  
>モジュール対応モードでは、GOPATHはビルド中のインポートの意味を定義しなくなりましたが、ダウンロードされた依存関係（GOPATH / pkg / mod）とインストールされたコマンド（GOBINが設定されていない場合はGOPATH / bin）を保存します。  

## scope
プログラムコードの任意の場所でどのような変数や定数、関数が参照可能かはscopeによって決まる。  
goにおけるscopeはパッケージ、ファイル、関数、ブロック、制御構文により決められる。  
関数や変数、定数、型といったプログラムの構成要素はパッケージに属しているため、パッケージのscopeを理解することは要素の可視性のコントロールのためにも重要である。  

アプリケーション開発においてパッケージ間の変数、関数の共有や、逆に隠蔽する場合の可視範囲のコントロールに使用する。  

**foo.go**

```go:foo.go
package foo

const (
  Max = 100
  min = 1
)

func ReturnMin() int {
  return min
}
```
**main.go**
```go:main.go
package main

import (
  "fmt"
  "lesson/foo"
)

func main() {
  fmt.Println(foo.Max)
  fmt.Println(foo.min)
  // 100
  // error

  fmt.Println(foo.ReturnMin())
  // 1
}
```
定数`Max`は正常に参照できる
この時、定数`min`がイニシャル小文字のため参照不可となる。  
ReturnMinメソッドを介して、定数`min`を参照することはできる。  

importパッケージの命名
`.`で省略可能

```go
import (
  f "fmt"
  ."lesson/foo"
)

func main() {
  f.Println(Max)
}
```

インポート順はアルファベット順
標準パッケージと独自パッケージを分ける
などすると見やすい

fooでインポートしたパッケージは再度mainでインポートしなければならない

### 関数のスコープ
メソッド内で宣言された定数、変数はそのメソッド内でのみ使用することができる

```go
func appName() string {
  const AppName = "GoApp"
  var Version string = "1.0"
  return AppName + " " + Version
}

func main() {
  fmt.Println(appName())
  fmt.Println(AppName, Version)
}
```

```bash
$ go run main.go
undefined: AppName
undefined: Version
```

下記は変数の再定義になってしまうのでエラー
```go
func Do(s string) (b string) {
  var b string = s
  return b
}
```

これで動く
```go
func Do(s string) (b string) {
  b = s
  return b
}
```


```go
func Do(s string) (b string) {
  b = s
  {
    b := "BBBB"
    fmt.Println(b)
  }
  fmt.Println(b)
  return b
}

func main() {
  fmt.Println(Do("AAAA"))
}
```

Doメソッド内の`{}`内は変数`b`はBBBB  
その外の`b`はAAAA

```bash
$ go run main.go
BBBB
AAAA
```
