# Goで並行処理(応用編)
## "Share by communicating" 思想
Goの並行プログラミングにおける重要な概念で、「メモリを共有することで通信するのではなく、通信することでメモリを共有する」という考え方です。
主なポイントとして2つのアプローチがあります。

- チャネルを使用して値を送受信する
- `sync.Mutex` などを使用して同じメモリを共有する

Goのチャネルはもともとゴールーチンセーフになるように設計されています。
そのため「実装が難しい危険なメモリ共有をするくらいなら、チャネルを使って値をやり取りした方が安全」という考え方をするのです。

## 「拘束」パターン
「拘束」は、チャネルの使用範囲を制限し、安全性を高めるGoの並行処理パターンです。

1. チャネルを関数内で作成
2. 受信専用チャネル（`<-chan`）として返す
3. 送信操作を関数内のゴールーチンに限定

```go
func restFunc() <-chan int {
	// 1. チャネルを定義
	result := make(chan int)

	// 2. ゴールーチンを立てて
	go func() {
		defer close(result) // 4. closeするのを忘れずに

		// 3. その中で、resultチャネルに値を送る処理をする
		// (例)
		for i := 0; i < 5; i++ {
			result <- 1
		}
	}()

	// 5. 返り値にresultチャネルを返す
	return result
}
```

利点

- 外部からの予期しない送信を防ぐ
- チャネルの用途が明確になる
- 並行処理の安全性が向上

注意点

- ゴールーチンのライフサイクル管理が必要
- エラー処理の方法を考慮する

この「拘束」パターンは、値を生成し続けるチャネル（「ジェネレータ」とも呼ばれる）を作成する際によく使用されます。
このパターンを理解し適切に使用することで、より安全で明確な並行プログラミングが可能になります。

## select文
`select`文は、複数のチャネル操作を同時に待ち受け、準備ができた操作を実行する Go の構文です。

主な特徴：

1. 複数のチャネル操作を並行して待つ
2. 準備ができた操作をランダムに選択して実行
3. すべてのケースがブロックされている場合、`default`節があればそれを実行

```go
gen1, gen2 := make(chan int), make(chan int)

// goルーチンを立てて、gen1やgen2に送信したりする

if n1, ok := <-gen1; ok {
	// 処理1
	fmt.Println(n1)
} else if n2, ok := <-gen2; ok {
	// 処理2
	fmt.Println(n2)
} else {
	// 例外処理
	fmt.Println("neither cannot use")
}
```

利点：

- デッドロックを回避できる
- 複数のチャネルを効率的に扱える
- タイムアウト処理やキャンセル処理の実装が容易

注意点：

- `default`節がない場合、どのケースも準備できていないとブロックする
- 複数のケースが準備できている場合、選択はランダム

`select`文を使用することで、複数のチャネルを安全かつ効率的に扱う並行処理が可能になります。

## select文の実践的な使用

```go
select {
case num := <-gen1:  // gen1から受信できるとき
	fmt.Println(num)
case num := <-gen2:  // gen2から受信できるとき
	fmt.Println(num)
default:  // どっちも受信できないとき
	fmt.Println("neither chan cannot use")
}
```

gen1とgen2がどっちも使えるときは、どちらかがランダムに選ばれます。
書き込みでも同じことができます。

```go
select {
case num := <-gen1:  // gen1から受信できるとき
	fmt.Println(num)
case channel<-1: // channelに送信できるとき
	fmt.Println("write channel to 1")
default:  // どっちも受信できないとき
	fmt.Println("neither chan cannot use")
}
```

## バッファありチャネルはセマフォの役割
バッファありチャネルは、並行処理の数を制限するセマフォ[^1]として使用できます。

[^1]:セマフォは、共有（保護された）リソース上で同時に操作できるタスクの数を制限する方法

主なポイントは

1. **同時実行数の制御**
    - チャネルのバッファサイズが同時実行可能な処理数を決定
2. **ブロッキングの利用**
    - バッファが満杯になると、追加の送信操作がブロック
    - これにより、並行処理の数を自動的に制限

```go
var sem = make(chan int, MaxOutstanding)

func handle(r *Request) {
    sem <- 1    // Wait for active queue to drain.
    process(r)  // May take a long time.
    <-sem       // Done; enable next request to run.
}

func Serve(queue chan *Request) {
    for {
        req := <-queue
        go handle(req)  // Don't wait for handle to finish.
    }
}
```

動作：
- `sem`チャネルが満杯になると、新しい`handle`の実行がブロック
- 処理が完了すると、チャネルから値を取り出し、新しい処理を許可

利点：
- シンプルな実装で並行処理数を制御
- リソースの過剰使用を防止
- ゴールーチンの数を管理しやすい

このパターンは、リーキーバケットアルゴリズムなど、レート制限の実装にも応用できます。

## FanIn
FanInは、複数のチャネルからの入力を1つのチャネルにまとめる並行処理パターンです。

## 基本(Google I/O 2012 ver.)
まとめたいチャネルの数が固定の場合は、`select`文を使って簡単に実装できます。

```go
func fanIn1(done chan struct{}, c1, c2 <-chan int) <-chan int {
	result := make(chan int)

	go func() {
		defer fmt.Println("closed fanin")
		defer close(result)
		for {
			// caseはfor文で回せないので(=可変長は無理)
			// 統合元のチャネルがスライスでくるとかだとこれはできない
			// →応用編に続く
			select {
			case <-done:
				fmt.Println("done")
				return
			case num := <-c1:
				fmt.Println("send 1")
				result <- num
			case num := <-c2:
				fmt.Println("send 2")
				result <- num
			default:
				fmt.Println("continue")
				continue
			}
		}
	}()

	return result
}
```

このFanInを使用例は、例えばこんな感じになります。

```go
func main() {
	done := make(chan struct{})

	gen1 := generator(done, 1) // int 1をひたすら送信するチャネル(doneで止める)
	gen2 := generator(done, 2) // int 2をひたすら送信するチャネル(doneで止める)

	result := fanIn1(done, gen1, gen2) // 1か2を受け取り続けるチャネル
	for i := 0; i < 5; i++ {
		<-result
	}
	close(done)
	fmt.Println("main close done")

	// これを使って、main関数でcloseしている間に送信された値を受信しないと
	// チャネルがブロックされてしまってゴールーチンリークになってしまう恐れがある
	for {
		if _, ok := <-result; !ok {
			break
		}
	}
}
```

ポイント：

- `select`文を使用して複数チャネルを同時に監視
- `done`チャネルでゴールーチンの終了を制御
- メインルーチン終了後も残った値を適切に処理し、リークを防ぐ

FanInパターンは、複数のデータソースを効率的に1つのストリームにまとめる際に有用です。
## 応用(並行処理本ver.)

FanInでまとめたいチャネル群が可変長変数やスライスで与えられている場合は、`select`文を直接使用することができません。  
このような場合でも動くようなFanInが、並行処理本の中にあったので紹介します。

```go
func fanIn2(done chan struct{}, cs ...<-chan int) <-chan int {
	result := make(chan int)

	var wg sync.WaitGroup
	wg.Add(len(cs))

	for i, c := range cs {
		// FanInの対象になるチャネルごとに
		// 個別にゴールーチンを立てちゃう
		go func(c <-chan int, i int) {
			defer wg.Done()

			for num := range c {
				select {
				case <-done:
					fmt.Println("wg.Done", i)
					return
				case result <- num:
					fmt.Println("send", i)
				}
			}
		}(c, i)
	}

	go func() {
		// selectでdoneが閉じられるのを待つと、
		// 個別に立てた全てのゴールーチンを終了できる保証がない
		wg.Wait()
		fmt.Println("closing fanin")
		close(result)
	}()

	return result
}
```

![](https://static.zenn.studio/images/copy-icon.svg)![](https://static.zenn.studio/images/wrap-icon.svg)