# 宣言的レンダリング
HTMLを拡張したtemplate構文を用いて、JavaScriptのStateに基づいてHTMLがどのように見えるか記述することができる。
Stateが変更されると、HTMLは自動的に更新される。

`reactive()` APIを使用することで変更されたときに更新されるTriggerを宣言することができる。
`reactive()` はオブジェクト（配列、`Map`など ）に対してのみ動作する。
`ref()` は任意の値の型をとる。
`value` プロパティを用いることで値を使用することができる。

