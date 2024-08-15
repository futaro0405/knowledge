# contextの概要
## contextの役割
`context`型の主な役割は3つです。
- 処理の締め切りの伝達
- キャンセル信号の伝播
- リクエストスコープ地の伝播
## contextの意義
contextはひとつの処理が複数のゴールーチンをまたいで行われるときに役に立つ。
### 処理が複数のゴールーチンをまたぐ例
httpリクエストを受け取り`http.HandleFunc`関数で処理する場合、main関数が立てたゴールーチンがレスポンスを返す処理を行う。

```go
func main() {
  // ハンドラ関数の定義
  h1 := func(w http.ResponseWriter, _ *http.Request) {
    io.WriteString(w, "Hello from a HandleFunc #1\n")
  }
  h2 := func(w http.ResponseWriter, _ *http.Request) {
    io.WriteString(w, "Hello from a HandleFunc #2\n")
  }

  // リクエストはハンドラh1で受け付ける
  http.HandleFunc("/", h1)
  // endpointに来た陸えすてゃハンドラh2で受け付ける
  http.HandleFunc("/endpoint", h2)

  // サーバ起動
  log.Fatal(http.ListenAndServe(":8080", nil))
}
```

またデータベースに接続してデータの取得が行われる場合はまた別のゴールーチンが立てられる。
このように、Goは意識しなくてもライブラリが複数のゴールーチン上で処理がまたがる。
ひとつの処理を行うためにいくつものゴールーチンが木構造敵に積みあがっていく。

![[Pasted image 20240814201400.jpg]]

### 複数個のゴールーチンが絡むことによって生じる煩わしさとは
処理が複数個のゴールーチンにまたがる場合困難になる点は「情報伝達全般」。
Goでは「異なるゴールーチン間での情報共有はチャネルを使った伝達を使う」問考え方をとっている。
#### 困難その1_暗黙的に起動されるゴールーチンへの情報伝達
事前に新規のゴールーチンを使用することがわかっている場合は、予め情報伝達用のチャネルを引数として渡すことで解決する。

```go
type MyInfo int

// 情報伝達用チャネルを引数に入れる
func myFunc(ch chan MyInfo) {
}

func main() {
  info := make(chan MyInfo)
  // 新規ゴールーチン起動時にinfoチャネルを渡す
  go myFunc(info)
}
```

今回の例では`myFunc`のような独自関数であればこの方法で解決できる。
しかし、ライブラリ内のゴールーチンがどのように実装されているかはわからない。

#### 困難その2_拡張性の乏しさ
先ほどの例で`MyInfo`型以外の別の型を伝達する必要がある場合
- `MyInfo`型を`interface{}`型等で対応できるようにする
- `MyInfo2`型などの別のチャネルを定義する
の対策が考えられる。
しかし、前者は静的型付けの良さを捨ててしまっている、受信側で型を判別する手段がないという弱点がある。
後者は可変長に対応できないなどの弱点がある。
このようにチャネルを使うことで伝達する情報の型制約が入ってしまうこと、拡張を困難にしてしまうことが考えられる。
#### 困難3_伝達制御の難しさ
ゴールーチンが複数起動する例を考える。

```go
func myFunc2(ch chan MyInfo) {
  // do something
}

func myFunc(ch chan MyInfo) {
  // 情報伝達のチャネルinfo1, info2, info3を用意
  go myFunc2(info1)
  go myFunc2(info2)
  go myFunc2(info3)
}

func main() {
  info := make(chan MyInfo)
  go myFunc(info)

  close(info)
}
```
`main`関数内で`myFunc`関数をクローズしています。
ここでは`myFunc`関数内で動いているゴールーチンにキャンセル信号を送信しています。このゴールーチンがどのようにキャンセル信号を処理するかを追うことができません。
## contextによる解決
contextではゴールーチン間での情報伝達の
- 処理の締め切りを伝達
- キャンセル信号の伝播
- リクエストスコープ値の伝達
について、ゴールーチン上で起動される関数の第一引数に`context.Context`型を渡すだけで実現できます。