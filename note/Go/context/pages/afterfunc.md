# キャンセル・タイムアウト後のクリーンアップ処理
`context.AfterFunc`機能は、プログラムが途中で止まった場合に、何をするか（後処理）を簡単に行なうことができる機能です。  

## `AfterFunc`関数の使い方
`AfterFunc`関数を使うと、プログラムが止まった時に自動的に行う処理を前もって設定することができます。  

### Cancelでプログラムが止まった場合

```go
ctx, cancel := context.WithCancel(context.Background())
stop := context.AfterFunc(ctx, func() {
    fmt.Println("後処理が終わりました")
})
defer stop()

// （メインの処理）

cancel()
// プログラムを止める
```

これを実行した場合、プログラムが止まった後に「後処理が終わりました」と表示されます。  

### タイムアウトでプログラムが止まった場合

```go
ctx, cancel := context.WithTimeout(
  context.Background(),
  3*time.Second
)
defer cancel()

stop := context.AfterFunc(ctx, func() {
  fmt.Println("後処理が終わりました")
})
defer stop()

// （メインの処理）
```

これを実行すると3秒後にプログラムが自動的に止まり、「後処理が終わりました」と表示されます。  

## `stop`関数
`AfterFunc`関数を使用すると戻り値として`stop`関数が得られます。  
この関数は、設定した後処理をキャンセルしたい時に使います。  
後処理のキャンセルに成功したらtrueを、失敗したらfalseを返します。  
いつ呼び出しても安全無ように設計されているので、`defer stop()`のように使うのもよいでしょう。  

## `AfterFunc`の使い道
`context.AfterFunc`関数が役立つのは以下のような場面と考えられます。  

- プログラムが止まった時に、待機中の他の処理も全て解放する。
- プログラムが止まった時に、データの読み込みも止める。
- あるプログラムの一部が止まったら、別の部分も同時に止める。

これらは、例えばサーバーを安全に停止する時などに便利です。  
このように、`AfterFunc`を使うと、プログラムが止まった後の処理をより簡単に、そしてきれいに書けるようになります。  
