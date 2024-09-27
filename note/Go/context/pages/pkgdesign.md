# パッケージへのcontext導入について
さて、ここまでcontextで何ができるのか・どう便利なのかというところを見てきました。  
そこで、「自分のパッケージにもcontextを入れたい」と思う方もいるかもしれません。  

ここからは、「パッケージにcontextを導入する」にはどのようにしたらいいか、について考えていきたいと思います。  

## 既存パッケージへのコンテキスト導入
ここでは、既存の`mypkg`パッケージに`context`を導入する過程を説明します。  

### 現状の理解

```go
// mypkg パッケージ
type MyType sometype

func MyFunc(arg MyType) {
    // 何らかの処理
}
```

```go
// main パッケージ
func main() {
    // argを準備
    mypkg.MyFunc(arg)
}
```

この状況で、新たに「`MyFunc`関数に`context`を渡すようにしたい」という改修を考えます。  

### mypkg内の改修
#### コンテキスト導入の悪い例：構造体にコンテキストを埋め込む
よくいわれるNG例は、「`MyType`の型定義を改修して、`context`を内部に持つ構造体型にする」というものです。  

```go
type MyType struct {
    sometype
    ctx context.Context
}

func MyFunc(arg MyType) {
    // 処理
}
```

この方法には以下のような問題があります。

##### コンテキストのスコープが不明確になる

例えばもしも、`MyFunc`関数の中でまた新たに別の関数`AnotherFunc`を呼んでいたらどうなるでしょうか。  

```go
func MyFunc(arg MyType) {
    // 何かの処理
    AnotherFunc(arg)
}

func AnotherFunc(arg MyType) {
    // arg.ctx を使用
}
```

この場合、`AnotherFunc`が`arg.ctx`を使用していることが一目では分かりません。  
これは以下の問題を引き起こします。  

##### コンテキストの切り替えが困難
構造体にメソッドがある場合、さらに問題が複雑になります。  

```go
type MyType struct {
	sometype
	ctx context.Context
}

// メソッド1
func (*m MyType)MyMethod1() {
	// doSomething
}

// メソッド2
func (*m MyType)MyMethod2() {
	// doSomething
}
```

異なるメソッドで異なるコンテキストを使用したい場合、新しいMyTypeインスタンスを作成する必要があります。  

#### OK例: MyFuncの第一引数にcontextを追加
これらの不便さを解消するには、`context`は関数・メソッドの引数として明示的に渡す方法を取るべきです。  

```go
type MyType sometype

func MyFunc(ctx context.Context, arg MyType) {
  // doSomething
}
```

実際`context`を関数の第一引数にする形では、contextのスコープ・切り替えの面でどうなるのかについてみてみましょう。  

##### `context`のスコープ
まずは、「`MyFunc`関数の中で別の関数`AnotherFunc`を呼んでいる」というパターンです。  

```go
func MyFunc(ctx context.Context, arg MyType) {
	AnotherFunc(arg)
	// or
	AnotherFunc(ctx, arg)
}
```

前者の呼び出し方なら「`AnotherFunc`内では`context`は使っていない」、後者ならば「`AnotherFunc`でも`context`の内容が使われる」ということが簡単にわかります。  

このような明示的な`context`の受け渡しは、`context`のスコープをわかりやすくする効果があるのです。  

##### `context`の切り分け
また、`MyType`にメソッドが複数あった場合についてはどうでしょうか。  

```go
type MyType sometype

// メソッド1
func (*m MyType)MyMethod1(ctx context.Context) {
	// doSomething
}

// メソッド2
func (*m MyType)MyMethod2(ctx context.Context) {
	// doSomething
}
```

このように、`context`をメソッドの引数として渡すようにすれば、「メソッド1とメソッド2で別の`context`を使わせたい」という場合では、引数に別の`context`を渡せばいいだけなので簡単です。  
レシーバーである`MyType`を作り直すという手間は発生しません。  

### mainパッケージ内の改修
さて、`MyFunc`関数の第一引数が`context`になったことで、`main`関数側での`MyFunc`呼び出し方も変更する必要があります。  
`mypkg`パッケージ内での`context`対応が終わっており、問題なく使える状態になっているなら、以下のように普通に`context.Background`で大元の`context`を作ればOKです。  

```go
func main() {
	ctx := context.Background()
	// argを準備
	mypkg.MyFunc(ctx, arg)
}
```

しかし、「`MyFunc`の第一引数が`context`にはなっているけれども、`context`対応が本当に終わっているか分からないなあ」というときにはどうしたらいいでしょうか。  

### mainパッケージの`context`導入
`MyFunc`関数がコンテキストを受け取るように変更された後、mainパッケージでの呼び出し方も変更する必要があります。  
`mypkg`のコンテキスト対応が完了している場合、以下のように簡単に呼び出せます。  

```go
func main() {
  ctx := context.Background()
  // argを準備
  mypkg.MyFunc(ctx, arg)
}
```

ここでは、`context.Background()`を使って基本的な`context`を作成し、それを`MyFunc`に渡しています。  
しかし、`MyFunc`のコンテキスト対応が完全かどうか不明な場合の対処法については、追加の確認や対策が必要になる可能性があります。  

#### 悪い例：nilを渡す

```go
func main() {
    // argを準備
    mypkg.MyFunc(nil, arg)
}
```

これは危険です。nilコンテキストのメソッド呼び出しでプログラムがクラッシュする可能性があります。

#### 良い例：TODOを渡す
「`MyFunc`の第一引数が`context`にはなっているけれども、`context`対応が本当に終わっているか分からない」という場合に使うべきものが、contextパッケージ内には用意されています。  
それがcontext.TODOです。  

```go
func main() {
	ctx := context.TODO()
	// argを準備
	mypkg.MyFunc(nil, arg)
	mypkg.MyFunc(ctx, arg)
}
```

TODOはBackgroundのように空のcontextを返す関数です。

