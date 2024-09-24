# Errメソッド
contextに含まれている`Err`メソッドの概要、使いどころについて設営します。  

## キャンセルとタイムアウトの区分
プログラムを途中で止める方法は「手動で止める（キャンセル）の場合」と「時間切れ（タイムアウト）で自動に止まる場合」があります。  
しかし、`Done`メソッドを使ってプログラムがなぜ止まったかを判断することはできません。  

```go
func generator(ctx context.Context, num int) <-chan int {
  out := make(chan int)

	go func() {
    defer wg.Done()

	LOOP:
		for {
			select {
			case <-ctx.Done():
				// タイムアウトで止まったのか？
				// それともキャンセルされて止まったのか？
				// Doneメソッドだけでは判定不可
				break LOOP
			case out <- num:
			}
		}

		close(out)
		fmt.Println("generator closed")
	}()
	return out
}
```

## contextにある２種類のエラー
contextには、プログラムが止まった理由を表す２種類のエラーが定義されています。  

- `Canceled`
  - 手動でプログラムを止めた時に使われます
- `DeadlineExceeded`
  - 時間切れで自動的に止まった時に使われます

## Errメソッド
contextの`Err`メソッドを使うとプログラムが止まった理由が分かります。  

- キャンセルされていない場合: `nil`
- 手動でキャンセルされた場合: `Canceled`エラー
- 時間切れの場合: `DeadlineExceeded`エラー

この`Err`メソッドを使えば、プログラムが止まった理由によって違う処理をすることができます。  

```go
select {
case <-ctx.Done():
  if err := ctx.Err(); errors.Is(err, context.Canceled) {
    // 手動で止められた場合の処理
    fmt.Println("canceled")
  }else if errors.Is(err, context.DeadlineExceeded) {
    // タイムアウトだった場合の処理
    fmt.Println("deadline")
  }
}
```