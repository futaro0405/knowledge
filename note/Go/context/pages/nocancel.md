# キャンセル・タイムアウトの伝播を切る
`context`パッケージに新しく`WithoutCancel`関数が追加されました。  
この機能を理解するには、まず`context`の基本的な考え方を押さえることが大切です。  

## `WithoutCancel`関数の使用場面
`context`の基本原則を理解した上で、新しい`WithoutCancel`関数がなぜ必要なのか、どんな時に使うのかを見ていきましょう。  

`context`の基本的な考え方は

- 情報の共有と伝達
  - 複数の並行処理（ゴールーチン）間でデータを共有します。
  - リクエストに関連する情報（例：ユーザーID）を伝えます。
- 親子関係の原則
  - 基本的に、親の設定は子に引き継がれます。
  - 必要に応じて、一部の情報を更新したり追加したりできます。

です。  

具体例として

- 値の管理方法
  - キーと値のペアで情報を保存します。
  - キーには特別な型を使い、意図しない変更を防ぎます。
  - 値を変更したい場合は、専用の関数（例：SetValue）を用意します。
- タイムアウトとキャンセルの扱い
  - 親でタイムアウトやキャンセルを設定すると、自動的に子にも適用されます。
  - タイムアウトの時間は調整可能ですが、基本的に子に引き継がれます。

このような原則がある中で、`WithoutCancel`関数は特別なケースに対応するために導入されました。  
次の部分では、この関数が必要となる具体的な状況や、使用方法について詳しく説明します。  
この新機能を使うことで、コンテキストの基本原則に例外を設け、より柔軟なプログラム設計が可能になります。  

## 親の設定を子に引き継がせたくない場合
通常、コンテキストでは親の設定を子が引き継ぎますが、時にはこれが問題を引き起こす場合があります。  
Goコミュニティから、以下のような状況で親のタイムアウトやキャンセル設定を子に適用させたくないという要望が出てきました。  

### 重要な後処理を確実に行いたい場合
例として、データベースの一連の操作が途中で中断された時のロールバック処理が挙げられます。これらの処理は、親の処理が中断されても必ず完了させる必要があります。

### バックグラウンド処理を継続させたい場合
例として、長時間実行が必要な計算処理が挙げられます。  
このような処理は、それを開始させた元の処理が終了しても続行させたいことがあります。  

### 従来の対処法と新しい解決策
以前は、このような場合に`context.Background()`を使って新しいコンテキストを作成していました。  
しかし、この方法では親コンテキストの持つ重要な情報（key-valueのペア）を引き継ぐことができませんでした。  

そこで導入されたのが`WithoutCancel`関数です。  
この関数を使うと、**親コンテキストの重要な情報（key-valueのペア）を保持したまま**、**キャンセルやタイムアウトの設定だけを無効化した**新しい子コンテキストを作ることができます。  

この新機能により、必要な情報は引き継ぎつつ、特定の処理だけを親の影響から「保護」することが可能になりました。  
これにより、より柔軟で安全なプログラム設計が実現できるようになったのです。  

## `WithoutCancel`関数の実践的な使用例
それでは、`WithoutCancel`関数の具体的な使い方を見ていきましょう。  
以下の例を通じて、この関数がどのように動作するかを理解できます。  

まず、親のキャンセルが子に伝わる通常の動作を示すコードを見てみましょう。  

```go
func main() {
  ctx1, _ := context.WithCancel(context.Background())

  go func(ctx1 context.Context) {
    ctx2, cancel2 := context.WithCancel(ctx1)

    go func(ctx2 context.Context) {
      ctx3, _ := context.WithCancel(ctx2)

      go func(ctx3 context.Context) {
				select {
				case <-ctx3.Done():
					fmt.Println("G3 canceled")
				}
			}(ctx3)

			select {
			case <-ctx2.Done():
				fmt.Println("G2 canceled")
			}
    }(ctx2)

    cancel2()

    select {
		case <-ctx1.Done():
			fmt.Println("G1 canceled")
		}
  }(ctx1)

  time.Sleep(time.Second)
}
```

```bash
$ go run main.go

G2 canceled
G3 canceled
```

このコードを実行すると、`ctx2`がキャンセルされると同時に`ctx3`もキャンセルされます。  

次に、`WithoutCancel`関数を使って、`ctx3`を`ctx2`のキャンセルから保護してみます。  

```go
func main() {
  ctx1, _ := context.WithCancel(context.Background())

  go func(ctx1 context.Context) {
    ctx2, cancel2 := context.WithCancel(ctx1)

    go func(ctx2 context.Context) {
      ctx3 := context.WithoutCancel(ctx2) // ここが変更点

      go func(ctx3 context.Context) {
        select {
				case <-ctx3.Done():
					fmt.Println("G3 canceled")
				}
      }(ctx3)

      select {
			case <-ctx2.Done():
				fmt.Println("G2 canceled")
			}
    }(ctx2)

    cancel2()

    select {
		case <-ctx1.Done():
			fmt.Println("G1 canceled")
		}
  }(ctx1)

  time.Sleep(time.Second)
}
```

```bash
$ go run main.go

G2 canceled
```

`ctx3`は`ctx2`のキャンセルの影響を受けないため、"G3 canceled"は表示されません。 

この例で示したように、WithoutCancelを使うことで、特定の処理を親のキャンセルから「保護」することができます。  
これは、重要なクリーンアップ処理や、親の処理とは独立して続ける必要があるバックグラウンド処理などに特に有用です。  

## WithoutCancel関数の詳細な仕様
`WithoutCancel`関数は、名前から想像される以上の機能を持っています。  
[公式ドキュメント（pkg.go.dev）](https://pkg.go.dev/context#WithoutCancel)には以下のような説明があります。  

> (WithoutCancel関数によって生成される)コンテキストはDeadlineやErrを返しません。  
> Done()メソッドにて得られるチャネルはnilです。  

名前は「WithoutCancel」（キャンセルなし）ですが、実際にはキャンセルだけでなくタイムアウトも無効化します。  
つまり、この関数で作られたコンテキストは、手動でキャンセルされることもなく（明示的キャンセル）、時間切れで自動的に終了することもありません（暗黙的キャンセル）。  

この仕様により、`WithoutCancel`関数で作成されたコンテキストは親のコンテキストの影響を完全に受けなくなります。  

## まとめ
`WithoutCancel`関数を使うと、親のタイムアウトやキャンセル設定を受け継がない新しい`context`を作れます。  
しかし、今自分が扱っているコンテキストにはどのようなタイムアウト・キャンセル設定が適用されるのか見通しが悪くなる・可読性を損なう危険性もあります。  
