MVCのうち、アプリケーション固有のデータや処理の扱いの部分。
データとデータに関わるビジネスロジック（アプリケーション特有の処理）をオブジェクトとして実装したもの。
データベースへの保存や読み込みもModelが担当。

## Modelの作成
```bash
rails g model task name:string address:string
```
## Modelの削除
```bash
rails destroy model task
```
