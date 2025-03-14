# Deadlineメソッドとタイムアウト
`context.WithCancel`関数を使って作られたcontextは、`cancel()`関数を呼ぶことで手動でキャンセル処理を行いました。  
しかし、「一定時間後に自動的にタイムアウトされるようにしたい」という場合があるでしょう。  

contextには、指定したDeadlineに達したら自動的にDoneメソッドチャネルをcloseする機能を組み込むことができます。  

## context導入前 - doneチャネルを用いる場合のキャンセル処理
contextを用いずにユーザーが定義したdoneチャネルによってキャンセル信号を伝播させる場合は、一定時間経過後のタイムアウトは`time.After`関数から得られるチャネルを明示的に使う必要があります。  

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
			case <-done: // doneチャネルがcloseされたらbreakが実行される
				break LOOP
			// case out <- num: これが時間がかかっているという想定
			}
		}

		close(out)
		fmt.Println("generator closed")
	}()
	return out
}

func main() {
	// doneチャネルがcloseされたらキャンセル
	done := make(chan struct{})
	gen := generator(done, 1)
	deadlineChan := time.After(time.Second)

	wg.Add(1)

LOOP:
	for i := 0; i < 5; i++ {
		select {
		case result := <-gen: // genから値を受信できた場合
			fmt.Println(result)
		case <-deadlineChan: // 1秒間受信できなかったらタイムアウト
			fmt.Println("timeout")
			break LOOP
		}
	}
	close(done)

	wg.Wait()
}
```
## contextを使った実装
contextを使って書き換えることができます。  

```go
var wg sync.WaitGroup

func generator(ctx context.Context, num int) <-chan int {
	out := make(chan int)

	go func() {
		defer wg.Done()

	LOOP:
		for {
			select {
			case <-ctx.Done():
				break LOOP
			// case out <- num: これが時間がかかっているという想定
			}
		}

		close(out)
		fmt.Println("generator closed")
	}()
	return out
}

func main() {
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(time.Second))
	gen := generator(ctx, 1)

	wg.Add(1)

LOOP:
	for i := 0; i < 5; i++ {
		select {
		case result, ok := <-gen:
			if ok {
				fmt.Println(result)
			} else {
				fmt.Println("timeout")
				break LOOP
			}
		}
	}
	cancel()

	wg.Wait()
}
```

### キャンセルされる側の変更点
`generator`関数内での変更点は以下の通りです。

- `generator`に渡される引数
  - キャンセル処理用の`done`チャネル -> `context`に変更
- キャンセル有無の判定根拠
  - `<-done` -> `<-ctx.Done()`に変更

この変更については、前章の「Doneメソッドによるキャンセル有無判定」と内容は変わりありません。  

明示的なキャンセル処理から一定時間経過後の自動タイムアウトへの変更によって生じる差異は、キャンセルする側で生成するcontextに現れます。  

### キャンセルする側の変更点
`main`関数内での変更点は以下の通りです。

- `done`チャネルの代わりに`context.Background()`, `context.WithDeadline()`関数を用いてコンテキストを生成
- `select`文中でのタイムアウト有無の判定方法
- キャンセル処理
  - `done`チャネルの明示的`close` -> `context.WithDeadline()`関数から得られた`cancel()`関数の実行に変更

## 自動タイムアウト機能の追加
### `WithDeadline`関数
`context.WithDeadline`関数を使うことで、指定された時刻に自動的にDoneメソッドチャネルがcloseされるcontextを作成することができます。  

```go
func WithDeadline(parent Context, d time.Time) (Context, CancelFunc)
```

`WithDeadline`関数から得られる`context`は、「引数として渡された親`context`の設定を引き継いだ上で、`Done`メソッドチャネルが第二引数で指定した時刻に自動closeされる新たな`context`」になります。  
また、タイムアウト時間前にキャンセル処理を行いたいという場合は、第二返り値で得られた`cancel`関数を呼び出すことでも`Done`メソッドチャネルを手動でcloseさせることができます。  

```go
ctx, cancel := context.WithDeadline(parentCtx, time.Now().Add(time.Second))
// このctxは、時刻time.Now().Add(time.Second)に自動キャンセルされる

cancel() 
// 明示的にcancelさせることも可能

// ctxはparentCtxとは別物なので、parentCtxはcancel()の影響を受けない
```

### `WithTimeout`関数
自動タイムアウトするタイミングを、時刻ではなく時間で指定したい場合は、`context.WithTimeout`関数を使います。  

```go
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```

そのため、`WithDeadline`関数を用いた`context`生成は`WithTimeout`関数を使って書き換えることもできます。  
例えば、以下の2つはどちらも「1秒後にタイムアウトさせるcontext」を生成します。  

```go
// 第二引数に時刻 = time.Timeを指定
ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(time.Second))

// 第二引数に時間 = time.Durationを指定
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
```
## タイムアウト有無の判定
contextによる自動タイムアウトの導入によって、main関数内でタイムアウトしたか否かを判定するロジックが変わっています。  

変更前では「一定時間経っても返答が得られないかどうか」は、呼び出し側であるmain関数中で、case文と`time.After`関数を組み合わせる形で判定する必要がありました。  

しかし、変更後はタイムアウトした場合、genチャネルを得るために呼び出された側である`generator`関数中でgenチャネルのclose処理まで行われるようになります。  
そのため、タイムアウトかどうかを判定するためには、「genチャネルからの受信が、チャネルcloseによるものなのか否か(=okのbool値に対応)」を見るだけで実現できるようになりました。  

## 明示的なキャンセル処理の変更
`context`導入によって、明示的なキャンセル指示の方法が「doneチャネルの明示的`close` -> `cancel`関数の実行」に変わっています。  

`WithDeadline`関数・`WithTimeout`関数による自動タイムアウトが行われると、`Done`メソッドチャネルが自動的にcloseされます。  
それでは、タイムアウトされた後に`cancel`関数を呼び出すといったいどうなるのでしょうか。  
closedなチャネルをcloseしようとするとpanicになりますが、そうなってしまうのでしょうか。  

正解は「**panicにならず、正常に処理が進む**」です。  

`context`生成時に得られる`cancel`関数は、「すでに`Done`メソッドチャネルがcloseされているときに呼ばれたら、何もしない」というような制御がきちんと行われています。そのためpanicに陥ることはありません。  

そのため、ドキュメントでは「タイムアウト設定をしていた場合にも、明示的にcancelを呼ぶべき」という記述があります。  

## `Deadline`メソッドによるタイムアウト有無・時刻の確認
あるcontextにタイムアウトが設定されているかどうか確認したい、ということもあるでしょう。  
そのような場合は`Deadline`メソッドを使います。  

contextの`Deadline`メソッドの定義を確認してみましょう。　　
```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
}
```

第二返り値のbool値を確認することで「そのcontextにタイムアウトが設定されているか」を評判することができます。  
設定されていれば、true、されていなければfalseです。  
設定されている場合は第一返り値にはタイムアウト時刻が格納されます。  

```go
ctx := context.Background()
fmt.Println(ctx.Deadline())

fmt.Println(time.Now())
ctx, _ := context.WithTimeout(ctx, 2*time.Second)
fmt.Println(ctx.Deadline())
```

```bash
0001-01-01 00:00:00 +0000 UTC false
2021-08-22 20:03:53.352015 +0900 JST m=+0.000228979
2021-08-22 20:03:55.352177 +0900 JST m=+2.000391584 true
```

## まとめ
contextでタイムアウトを行う場合のポイントは以下4つです。

- 自動タイムアウトさせるためのcontextは`WithDeadline`関数・`WithTimeout`関数で作れる
- タイムアウトが設定されているcontextは、指定時刻にDoneメソッドチャネルがcloneされる
- `WithDeadline`関数・`WithTimeout`関数それぞれから得られるcancel関数で、タイムアウト前後にもキャンセルを明示的に指示することができる
- そのcontextのタイムアウト時刻・そもそもタイムアウトが設定されているかどうかは`Deadline`メソッドで確認できる

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
}

func WithDeadline(parant Context, d time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```
