# Valueメソッド
プログラムの中で情報を渡すとき、`context`を使い受け渡しを行うと便利です。  
特に、たくさんの情報を一度に渡したい時に役立ちます。  

## 従来の方法：関数の引数を使う
例えば、ユーザーID、認証トークン、トレースIDを渡したい場合、`generator`関数の引数を3つ追加することで対応します。  

```go
func generator(ctx context.Context, num int, userID int, authToken string, traceID int) {
    // 処理
    fmt.Println("log: ", userID, authToken, traceID)
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
	gen := generator(ctx, 1, 2, "xxxxxxxx", 3)
}
```

ですが、この方法だと新しい情報を追加するたびに関数の引数を増やさなければなりません。  

## contextを使う方法
`context`を使うことで煩わしい実装を行う必要はありません。  

```go
goCopyfunc generator(ctx context.Context, num int) {

    // 処理

    userID    := ctx.Value("userID").(int)
    authToken := ctx.Value("authToken").(string)
    traceID   := ctx.Value("traceID").(int)

    fmt.Println("log: ", userID, authToken, traceID)
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())

    ctx = context.WithValue(ctx, "userID", 2)
    ctx = context.WithValue(ctx, "authToken", "xxxxxxxx")
    ctx = context.WithValue(ctx, "traceID", 3)
    gen := generator(ctx, 1)
}
```

contextに情報を追加するには、`context.WithValue`関数を使います。  

```go
ctx = context.WithValue(ctx, "キー", 値)
```

contextから情報を取り出すには、`Value`メソッドを使います。

```go
値 := ctx.Value("キー")
```

ただし、取り出した値は`interface{}`型なので、使う時に適切な型に変換する必要があります。  

### 注意点
contextを使うと、関数に渡す情報が見えにくくなることがあります。  
取り出した値は必ず型の確認（型アサーション）をしましょう。  

contextを使うと情報の受け渡しが簡単になりますが、使い方には注意が必要です。  


# Valueメソッドを有効に使うtips
`context`を使って値を渡すのは便利ですが、注意点もあります。  
ここでは、contextで値を安全に使うためのコツを説明します。  

## Tips1: キー（key）の選び方
contextに値を入れる時は「キー」を使います。このキーの選び方が重要です。  
キーには「**比較できる値**」を使う必要があります。  
例えば、数字、文字列、ポインタなどです。  

ですが、異なるパッケージで同じキーを使うと問題が起きる可能性があります。  

### 解決策
**各パッケージで独自のキーの型を作る**  

```go
type myKey struct{}
ctx = context.WithValue(ctx, myKey{}, "値")
```

こうすることで、他のパッケージと衝突する心配がなくなります。  

## Tips2: 値（value）の選び方
contextに入れる値にも気をつける必要があります。  
**避けるべき値**は、

- 関数の動作を変える重要な値
- 型の安全性が必要な値
- 変更される可能性がある値
- 複数のゴールーチンで安全に使えない値

**適している値**は、

- リクエストに関連する情報（ユーザーID、認証トークン、処理IDなど）
- リクエストの処理中に変わらない値
- 複数のゴールーチンで安全に共有できる値

contextを使って値を渡す時は
- 独自のキーの型を作って使う
- リクエストに関連する、変わらない情報を値として使う

これらの点に気をつければ、contextを安全に効果的に使えます。  
contextは便利ですが、使い方を間違えるとプログラムが分かりにくくなる可能性があるので注意しましょう。  
