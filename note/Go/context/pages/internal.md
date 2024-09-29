# `context`の内部実体
ここからは、「contextインターフェース」について説明します。  

## contextはインターフェース
`context.Context`型の定義を詳しく見ると、これがインターフェースであることがわかります。  

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
	Err() error
	Value(key interface{}) interface{}
}
```

インターフェースとは、一連のメソッドを定義したものです。これらのメソッドを実装する具体的な型があるはずです。  
次に、このインターフェースを実装している「具体的なcontext型」を見ていきましょう。  

## 具体型一覧
contextパッケージの中には、`context.Context`インターフェースを満たす具体型が4つ存在します。

### `context.emptyCtx`型
これは最も基本的なcontext型です。

```go
type emptyCtx int
```

特徴は以下です。  

- `context.Background()`や`context.TODO()`を呼び出すと、この型のcontextが作られます。
- 何も持たない空のcontextです。
- キャンセルできません。
- 値を持ちません。
- デッドライン（終了時刻）もありません。

この型は、他のcontextの起点として使われることが多いです。  

### `context.cancelCtx`型
この型は、キャンセル可能なcontextを表します。  

```go
type cancelCtx struct {
  Context
  mu       sync.Mutex
  done     atomic.Value
  children map[canceler]struct{}
  err      error
}
```

特徴は以下です。  

- 内部にdoneチャネルを持ちます。これはキャンセルの状態を管理するために使われます。
- キャンセルを子のcontextに伝えることができます（キャンセル伝播）。
- errフィールドにキャンセルの理由を保存します。これはErr()メソッドで取得できます。

この型は、処理を途中で止められるようにしたい場合に使います。例えば、ユーザーが操作を中断したときなどに役立ちます。  

### `context.timerCtx`型
この型は、時間制限付きのcontextを表します。  

```go
type timerCtx struct {
  cancelCtx
  timer    *time.Timer
  deadline time.Time
}
```

特徴は以下です。  

- `cancelCtx`を内包しているので、キャンセル機能を持っています。
- タイマーと締め切り時刻（deadline）を持ちます。
- 設定した時間が経過すると自動的にキャンセルされます。

この型は、処理に制限時間を設けたい場合に使います。例えば、APIリクエストが一定時間以内に完了しない場合にタイムアウトさせるなどの用途に適しています。

### `context.valueCtx`型
この型は、データを保持できるcontextを表します。  

```go
type valueCtx struct {
  Context
  key, val interface{}
}
```

特徴は以下です。

- キーと値のペアを1つ保持します。
- 内部に別のContextを持ち、そのContextも別のキーと値を持つことができます。
- Valueメソッドを使うと、このcontextとその親のcontextが持つすべての値を取得できます。

この型は、処理の途中で必要なデータを受け渡したい場合に使います。例えば、ユーザーIDやリクエストIDなど、処理全体で共有したい情報を保持するのに適しています。

## インターフェースを使う利点
contextには3つの主な機能があります。  

- キャンセルの伝達
- タイムアウトの設定
- 値の保持と伝達

これらの機能は、それぞれ別々の型（`cancelCtx`,`timerCtx`,`valueCtx`）で実装されています。  
しかし、これらの異なる型をすべて「Context」というインターフェースでまとめることで、使いやすくなります。  

例えば：

```go
// インターフェースがない場合：
func FuncA(ctx context.CancelCtx) // キャンセル用
func FuncB(ctx context.TimerCtx)  // タイムアウト用
func FuncC(ctx context.ValueCtx)  // 値保持用

// インターフェースがある場合：
func Func(ctx context.Context)    // どの種類のcontextでも受け取れる
```

インターフェースを使うことで、関数はどの種類のcontextでも受け取れるようになり、柔軟性が高まります。  
これにより、コードの再利用性が向上し、より簡潔に書けるようになります。  

