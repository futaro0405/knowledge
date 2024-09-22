# contextの概要
## contextの役割
`context`型の主な役割は3つです。
- 処理の締め切りの伝達
- キャンセル信号の伝播
- リクエストスコープ値の伝播

## contextの意義
contextはひとつの処理が複数のゴールーチンをまたいで行われるときに役に立ちます。

### 処理が複数のゴールーチンをまたぐ例
例として、httpサーバを立てる場合について考えてみます。  
httpリクエストを受け取ったとき、`http.HandleFunc`関数で登録されたhttpハンドラにレスポンスを返す処理が行われます。  

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
このとき、内部では、`http.ListenAndServe`関数がHTTPサーバを起動すると`main`関数が動いているゴールーチンが動作し、リクエストが届くたびに新しいゴールーチンが作成されます。  
そして、作成されたゴールーチンでリクエストを処理します。  

さらにハンドラ内で行う処理の中で、データベースに接続してデータの取得を行う処理などが実行された場合は、また別のゴールーチンが立てられます。  

このように、Goは意識していなくても、ライブラリが複数のゴールーチンを使用して処理します。  
いくつものゴールーチンが木構造的に積み上がっていくことになるでしょう。  

![[Pasted image 20240814201400.jpg]]

### 複数個のゴールーチンが絡むことによって生じる煩わしさとは
それでは、処理が複数個のゴールーチンにまたがると、どのような不都合があるのでしょうか。  
それは「情報伝達全般」です。  
Goでは「異なるゴールーチン間での情報共有はチャネルを使った伝達を使う」という考え方をとっています。

#### 困難その1_暗黙的に起動されるゴールーチンへの情報伝達
事前に新規のゴールーチンを使用することがわかっている場合は、予め情報伝達用のチャネルを引数として渡すことで解決します。

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

今回の例では`myFunc`のような独自関数であればこの方法で解決できます。
しかし、既存ライブラリ内の意識していないところで起動されるゴールーチンがどのように実装されているかはわかりません。

#### 困難その2_拡張性の乏しさ
先ほどの例で`MyInfo`型以外の別の型を伝達する必要がある場合はどうしたらいいでしょうか。  

- `MyInfo`型を`interface{}`型等で対応できるようにする
- `MyInfo2`型などの別のチャネルを定義する

の対策が考えられる。  
しかし、前者は静的型付けの良さを捨ててしまっている、受信側で型を判別する手段がないなどの弱点があります。  
後者は可変長に対応できないなどの弱点があります。  
このようにチャネルを使うことで伝達する情報の型制約・数制約が入ってしまうことが、拡張を困難にしています。
#### 困難3_伝達制御の難しさ
ゴールーチンが複数起動する例を考える。

```go
func myFunc2(ch chan MyInfo) {
	// do something
	// (ただし、引数でもらったchがcloseされたら処理中断)
}

func myFunc(ch chan MyInfo) {
	// 情報伝達用のチャネルinfo1, info2, info3を
	// 何らかの手段で用意
	go myFunc2(info1)
	go myFunc2(info2)
	go myFunc2(info3)

	// do something
	// (ただし、引数でもらったchがcloseされたら処理中断)
}

func main() {	
	info := make(chan MyInfo)
	go myFunc(info)

	close(info) // 別のゴールーチンで実行されているmyFuncを中断させる
}
```

`main`関数内でチャネル`info`がcloseされています。  
チャネル`info`は`myFunc`関数に渡されているためcloseすることで`myFunc`関数内で動いているゴールーチンにキャンセル信号を送信します。  
このゴールーチンがどのようにキャンセル信号を処理するかを追うことができません。

#### contextによる解決
contextではゴールーチン間での情報伝達の
- 処理の締め切りを伝達
- キャンセル信号の伝播
- リクエストスコープ値の伝達
について、ゴールーチン上で起動される関数の第一引数に`context.Context`型を渡すだけで実現できます。

## contextの定義
それでは、`context.Context`型の定義を確認してみましょう。  

```go
type Context interface {
  Deadline() (deadline time.Time, ok bool)
  Done() <-chan strict{}
  Err() error
  Value(key interface{}) interface()
}
```

`Deadline()`,`Done()`,`Err()`,`Value()`という4つのメソッドが確認できます。  
この4つのメソッドを使って、異なるゴールーチンの情報を得ることができます。  
contextの4つのメソッドは冪等性を持つように設計せれているので、メソッドをいつ呼び出しても得られる情報は同じです。  

また、ゴールーチンの呼び出し側では、伝達したい情報を内包した`Context`を作って関数の引数に渡すことで、異なるゴールーチンと情報をシェアできるように設定します。  

```go
func myFunc(chx context.Context) {
  // ctxからメインゴールーチン側の情報を得られる
  // （例）
  // ctx.Doneからキャンセル有無の確認
  // ctx.DeadLineで締め切り時間・締め切り有無の確認
  // ctx.Errでキャンセル理由の確認
  // ctx.Valueで値共有
}

func main() {	
	var ctx context.Context
	ctx = (ユースケースに合わせたcontextの作成)

  // myFunc側に情報をシェア
	go myFunc(ctx)
}```