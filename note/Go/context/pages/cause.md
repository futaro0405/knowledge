# Causeの利用
`Cause`機能は、なぜcontextがキャンセル・他有無アウトしたかの理由を判定することができます。  
## Cause機能導入前の問題点
以前は、プログラムが途中で止まったとき、その理由を正確に知ることは困難でした。  

- キャンセルの場合：
  - 複数の関数でキャンセル処理を行っている場合、どの関数がキャンセルの原因なのか分からない
- タイムアウトの場合：
  - 複数の場所でタイムアウトを設定している場合、どのタイムアウトが発動したのか分からない

## Causeを使った解決方法
Cause機能を使うとこれらの問題を解決することができます。  
### キャンセルの場合
`context.WithCancelCause`関数を使ってcontextを作成することで、キャンセルする時に理由を指定できます。  
そして、`context.Cause`関数でその理由を取得することができます。  

**例**  
```go
goCopyctx, cancel := context.WithCancelCause(context.Background())

cancel(errors.New("キャンセルの理由"))

fmt.Println(context.Cause(ctx))
// "キャンセルの理由" が表示されます
```

### タイムアウトの場合
`context.WithTimeoutCause`関数を使ってcontextを作成することで、タイムアウトの理由を指定できます。  
そして、`context.Cause`関数でその理由を取得することができます。  

**例**  
```go
goCopyctx, _ := context.WithTimeoutCause(
  context.Background(),
  3*time.Second,
  errors.New("タイムアウトの理由")
)

// 3秒後...
fmt.Println(context.Cause(ctx))
// "タイムアウトの理由" が表示されます
```

この新しい機能を使うことで、プログラムが途中で止まった理由をより正確に知ることができ、デバッグや問題解決がしやすくなります。

