# Doneメソッド
ゴールーチンを防ぐ、またエラー発生等の原因で別ゴールーチンが実行している処理が必要なくなった場合、
- ゴールーチン呼び出し元：キャンセル処理
- 呼び出されたゴールーチン側：親からキャンセルされていないか
を調べる必要があります。
## context導入前
ゴールーチン間の情報伝達は基本的にはチャネルで行います。
また、キャンセル処理についてもキャンセルならクローズされるチャネルを導入することで実現することができます。

```go
var wg sync.WaitGroup

// キャンセルされるまでnumをひたすら送信し続けるチャネルを生成
func generator(done chan struct{}, num int) <-chan int {
	out := make(chan int)
	go func() {
		defer wg.Done()

	LOOP:
		for {
			select {
      // doneチャネルがcloseされたらbreakが実行される
			case <-done:
				break LOOP
      // キャンセルされてなければnumを送信
			case out <- num:
			}
		}

		close(out)
		fmt.Println("generator closed")
	}()
	return out
}

func main() {
	done := make(chan struct{})
	gen := generator(done, 1)

	wg.Add(1)

	for i := 0; i < 5; i++ {
		fmt.Println(<-gen)
	}
	close(done) // 5回genを使ったら、doneチャネルをcloseしてキャンセルを実行

	wg.Wait()
}
```
