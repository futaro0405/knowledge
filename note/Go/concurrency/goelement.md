# ゴールーチンとチャネル
## ゴールーチンとは
ゴールーチンは、Go言語における並行処理の基本単位です。簡単に言えば、「他のコードと同時に実行できる関数」のことです。
### ゴールーチンの特徴
#### 定義
ゴールーチンは、同じプログラム内で独立して動作する処理の流れです。
`go` というキーワードを使って開始します。
#### 並行実行
ゴールーチンは他のコードと「並行」に実行されます。
これは、複数の処理が同時に進行しているように見えることを意味します。
#### 軽量
ゴールーチンは、通常のスレッドよりもはるかに軽量です。
多数のゴールーチンを同時に実行できます。
#### 同じアドレス空間
全てのゴールーチンは、同じプログラム内のメモリを共有します。
これにより、ゴールーチン間でのデータ共有が容易になります。
### 重要な注意点
- 「並行」と「並列」は異なる概念です。
- ゴールーチンを使って並行処理を実装しても、必ずしも並列に実行されるわけではありません。
- 実際に並列実行されるかどうかは、使用しているコンピューターのCPU数や、Go言語のランタイムの判断に依存します。

ゴールーチンを使うことで、複数の処理を効率的に管理し、プログラムの性能を向上させることができます。
ただし、適切に使用しないと、前述の並行処理の難しさ（競合状態やデッドロックなど）に直面する可能性があります。

## ゴールーチン作成
実際に`go`文を使ってゴールーチンを作ってみましょう。
まずは「今日のラッキーナンバーを占って表示する」`getLuckyNum`関数を用意しました。

```go
func getLuckyNum() {
	fmt.Println("...")

	// 占いにかかる時間はランダム
	rand.Seed(time.Now().Unix())
	time.Sleep(time.Duration(rand.Intn(3000)) * time.Millisecond)

	num := rand.Intn(10)
	fmt.Printf("Today's your lucky number is %d!\n", num)
}
```

これを新しく作ったゴールーチンの中で実行してみましょう。

```go
func main() {
	fmt.Println("what is today's lucky number?")
	go getLuckyNum()

	time.Sleep(time.Second * 5)
}
```

```bash
(実行結果)
what is today's lucky number?
...
Today's your lucky number is 1!
```

このとき、実行の様子の一例としては以下のようになっています。

![[Pasted image 20240930211417.png]]

## ゴールーチンの待ち合わせ
### 待ち合わせなし
ここで、メインゴールーチンの中に書かれていた謎の`time.Sleep()`を削除してみましょう。

```go
func main() {
	fmt.Println("what is today's lucky number?")
	go getLuckyNum()
}
```

```bash
(実行結果)
what is today's lucky number?
```

ラッキーナンバーの結果が出る前にプログラムが終わってしまいました。  
これはGoが「メインゴールーチンが終わったら、他のゴールーチンの終了を待たずにプログラム全体が終わる」という挙動をするからです。
![[Pasted image 20240930211717.png]]
### 待ち合わせあり
メインゴールーチンの中で、別のゴールーチンが終わるのを待っていたい場合は`sync.WaitGroup`構造体の機能を使います。

```go
func main() {
	fmt.Println("what is today's lucky number?")
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		getLuckyNum()
	}()

	wg.Wait()
}
```

`sync.WaitGroup`構造体は、内部にカウンタを持っており、初期化時点でカウンタの値は0です。

ここでは以下のように設定しています。

1. `sync.WaitGroup`構造体`wg`を用意する
2. `wg.Add(1)`で、`wg`の内部カウンタの値を+1する
3. `defer wg.Done()`で、ゴールーチンが終了したときに`wg`の内部カウンタの値を-1するように設定
4. `wg.Wait()`で、`wg`の内部カウンタが0になるまでメインゴールーチンをブロックして待つ

`sync.WaitGroup`を使って書き換えたコードを実行してみましょう。

```bash
(実行結果)
what is today's lucky number?
...
Today's your lucky number is 7!
```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)

今日のラッキーナンバーが表示されて、ちゃんと「サブのゴールーチンが終わるまでメインを待たせる」という期待通りの挙動を得ることができました。  
いわゆる「同期をとる」という作業をここで実現させています。  
![](https://storage.googleapis.com/zenn-user-upload/323ed9976be33eebf94c7f60.png)