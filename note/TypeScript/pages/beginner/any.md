# any
基本的な型宣言以外に`any`という型宣言がある。
`any`はどんな値でも入れることができ、最初に代入した値と別の値で上書きすることが可能。
`any`型はTypeScriptでの型定義を無視する行為でTypeScriptの恩恵を受けられないので、極力使用しない。

```index.ts
let nickname = "tarou"; // 文字列型
let age = 20; // 数値型
let isActive = true; //論理型
let something: any = 'a'
something = 1 // any型は別の型で上書きできる。
```
