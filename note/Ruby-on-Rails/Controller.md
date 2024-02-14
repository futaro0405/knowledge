MVCのうち、ModelとViewを総合的に制御する部分。
ユーザが操作するブラウザなどのクライアントから入力（リクエスト）を受け、適切な出力（レスポンス）を作成するための制御を行う。
必要に応じてModelを利用したり、Viewを呼び出したり、レスポンスを作り上げる。
## Controllerの作成
```bash
rails g controller tasks
```
## Controllerの削除
```bash
rails destroy controller tasks
```
