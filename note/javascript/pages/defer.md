---
tags: javascript
---
deferとDOMContentLoadedを自分なりにかみ砕いてみた
ブラウザがHTMLをロード中に`<script>`タグに遭遇すると、DOM構築を中断しスクリプトを実行する
スクリプトの実行が完了次第、HTMLのロードを再開する
## 問題点
- 未ロードのDOM要素を認識できない
- 重いスクリプトだとページコンテンツを見ることができない
回避策として末尾に`<script>`を置く
この問題点はHTMLドキュメントをダウンロード後にスクリプトのダウンロードが開始される。
HTMLドキュメントのダウンロードが長いとかなりの遅延になる可能性がある
解決策は`defer`、`async`
## defer
defer属性はブラウザにスクリプトの読み込みを待たないようにする
DOMの構築のバックグラウンドでスクリプトをロードし、DOMが構築されたタイミングで実行される
## async
async属性はdefer属性と同じくバックグラウンドでロードを行うが、ロードが完了した時点でスクリプトを実行する
## DOMContentLoadedとの併用
defer属性のついたscriptで読み込まれた外部スクリプト内でDOMContentLoadedを使用することは避けるべき
> defer 属性の付いたスクリプトは、スクリプトが読み込まれて評価が完了するまで、 DOMContentLoaded イベントの発生が抑制されます
## DOMContentLoadedとの使い分け
MDNを自分なりに解釈したうえでそれぞれの目的は異なると思います。
### defer
重いスクリプトのロードに時間がかかり、ユーザーがページコンテンツを見ることができないという不都合を解決するため
### DOMContentLoaded
ブラウザがHTMLを完全に読み込みDOM構築されたタイミングで行うスクリプト
## jQueryのready
jQuery v1.0からv1.2.1ではIE/Safari向けに以下の実装を行っています。
IEに対してはdefer属性をつけたscriptを生成し、そのscriptの実行が完了できているかどうかを判定することでdocumentのready判定を行っています。
Safariは当時からreadyStateをサポートしていたのでそちらを利用していたようです。この仕様はjQuery Core 1.2.1まで引き継がれています。