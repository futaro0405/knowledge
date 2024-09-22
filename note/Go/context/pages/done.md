# Doneメソッド
**ゴールーチンリーク**を防ぐため、またエラー発生等の原因で別ゴールーチン出させている処理が必要なくなった場合などは、ゴールーチン呼び出し元からのキャンセル処理が必要になります。  

**ゴールーチンリーク**とは、なんらかの処理を行うゴールーチンがあり、その処理が途中でキャンセルされた場合、元の処理が終わったにも関わらずゴールーチンが動き続けることで無駄なリソースが使われてしまうことを言います。  

また、呼び出されたゴールーチン側からも自分が親からキャンセルされていないかを知る手段が必要です。  

このキャンセル処理を`context`を使ってどのように実現するかを学習しましょう。  

## context導入前（doneチャネルによるキャンセル処理）
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

  // 5回genを使ったら、doneチャネルをcloseしてキャンセルを実行
	close(done)

	wg.Wait()
}
```

## contextのDoneメソッドを用いたキャンセル処理
上の処理はcontextを使って、このように書き換えることができます。  

```go
var wg sync.WaitGroup

-func generator(done chan struct{}, num int) <-chan int {
+func generator(ctx context.Context, num int) <-chan int {
	out := make(chan int)
	go func() {
		defer wg.Done()

	LOOP:
		for {
			select {
-			case <-done:
+			case <-ctx.Done():
				break LOOP
			case out <- num:
			}
		}

		close(out)
		fmt.Println("generator closed")
	}()
	return out
}

func main() {
-	done := make(chan struct{})
-	gen := generator(done, 1)
+	ctx, cancel := context.WithCancel(context.Background())
+	gen := generator(ctx, 1)

	wg.Add(1)

	for i := 0; i < 5; i++ {
		fmt.Println(<-gen)
	}
-	close(done)
+	cancel()

	wg.Wait()
}
```

### キャンセルされる側の変更点
generator関数内での変更点は以下の通りです。

- generatorに渡される引数
  - キャンセル処理用のdoneチャネル -> `context`
- キャンセル有無の判定根拠
  - `<-done` -> `<-ctx.Done()`

`context`のDoneメソッドが登場しました。  
Doneメソッドから何が得られるか確認しましょう。  

Doneメソッドからは空構造体の受信専用チャネル(以下Doneメソッドチャネルと表記)が得られます。  
書き換え前に使っていたdoneチャネルも空構造体用のチャネルでした。  

2つが似ているのはある意味必然で、Doneメソッドチャネルは「呼び出し側からキャンセル処理がなされたらcloseされる」という特徴を持つのです。  
これで書き換え前のdoneチャネルと全く同じ役割を担うことができます。  

### キャンセルする側の変更点
main関数内での変更点は以下の通りです。

- doneチャネルの代わりに`context.Background()`,`context.WithCancel()`関数を用いてコンテキストを生成
- キャンセル処理が、doneチャネルの明示的`close` -> `context.WithCancel()`関数から得られた`cancel()`関数の実行に変更

#### contextの初期化
まずは、`generator`関数に渡すためのコンテキストを作らなくてはいけません。  
何もない0の状態からコンテキストを生成するためには、`context.Background()`関数を使います。

`context.Background()`関数の返り値からは、「キャンセルされない」「deadlineも持たない」「共有する値も何も持たない」状態の`context`が得られます。  
いわば「context初期化のための関数」です。  

#### contextにキャンセル機能を追加
そして、`context.Background()`から得たまっさらな`context`を`context.WithCancel()`関数に渡すことで、「Doneメソッドからキャンセル有無が判断できるcontext」と「第一返り値のコンテキストをキャンセルするための関数」を得ることができます。  

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
```

`WithCancel`関数から得られる`context`は、「引数として渡された親contextの設定を引き継いだ上で、Doneメソッドによるキャンセル有無判定機能を追加した新たな`context`」になります。  
第二返り値で得られた`cancel`関数を呼び出すことで、この`WithCancel`関数から得られる`context`のDoneメソッドチャネルをcloseさせることができます。  

```go
ctx, cancel := context.WithCancel(parentCtx)
cancel() 

// cancel()の実行により、ctx.Done()で得られるチャネルがcloseされる
// ctxはparentCtxとは別物なので、parentCtxはcancel()の影響を受けない
```

## まとめ
contextを使ったキャンセル処理のポイントは3つです。  

- キャンセル処理を伝播させるためのコンテキストは`context.WithCancel()`関数で作ることができる
- `context.WithCancel()`関数から得られる`cancel`関数で、キャンセルを指示することができる
- `cancel`関数によりキャンセルされたら、contextのDoneメソッドチャネルがcloneされるので、それでキャンセル有無を判定する

```go
// 使用した関数・メソッド
type Context interface {
	Done() <-chan struct{}
	// (以下略)
}
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
```
