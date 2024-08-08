# SQL文サンプル
## SELECT文
SELECT文とは、データベースからデータを取得する命令です。このSELECT文を使用することで、データベースからデータを取得することができます。
### SELECT文の基本構文
SELECT文の基本的な構文は以下の通りです。
```sql
SELECT [取得したい要素] FROM [使用テーブル];
```
欲しい情報と、どこから取ってくるかを指定すればデータを取得できます。
### 特定要素だけ表示する
基本的な構文は以下になります。
#### 実行命令
```sql
SELECT name FROM users;
```
#### 意味
「usersテーブル」から全データの「name」だけを取得。
### 「,」で複数指定
「,」で区切ることで、複数の要素を取得可能です。次の例では「名前」と「メールアドレス」のみを取得・表示しています。
#### 実行命令
```sql
SELECT name, email FROM users;
```
#### 意味
「usersテーブル」から全データの「name, email」を取得。
### * で全部指定
取得したい要素の項目に `*` を入れることで、全ての要素を取得することが可能です。
#### 実行命令
```sql
SELECT * FROM users;
```
#### 意味
「usersテーブル」から全データの「全要素」を取得。
### SELECTの基本構文(まとめ)
```sql
SELECT [取得したい要素] FROM [使用テーブル];
```
この一文だけでデータを取得することが可能です。まずはこれを覚えておきましょう。
### 「WHERE」で条件を絞る
WHEREで条件設定を行うことができます。使い方は簡単で、先ほどのSELECT文の後ろに `WHERE [条件文]` を追加するだけです。
```sql
SELECT [取得したい要素] FROM [使用テーブル] WHERE [条件文];
```
例えば、「nameがmikeのデータ」を取得する場合は以下のようになります。
#### 実行命令
```sql
SELECT * FROM users WHERE name = "mike";
```
#### 意味
「usersテーブル」の「nameがmikeのデータ」の「全要素」を取得。
## INSERT文で新規追加
データの追加はINSERT文で行います。
```sql
INSERT INTO [データを追加したいテーブル名] (要素名A, 要素名B) VALUES (要素Aに入れるデータ, 要素Bに入れるデータ);
```
例えば、userを増やすためにINSERTを行う場合は以下のようになります。
#### 実行命令
```sql
INSERT INTO users (id, name) VALUES (1, "joe");
```
「usersテーブル」に `id=1, name="joe"` のデータを追加。
#### 実行命令
```sql
SELECT * FROM users;
```
これを実行すると、データが追加されているのが確認できます。
## UPDATE文で変更
データの更新はUPDATE文を使います。
#### 実行命令
```sql
UPDATE users SET name = "nancy" WHERE id = 1;
```
#### 意味
「usersテーブル」の「id=1のデータ」の「nameを'nancy'」に更新。
## DELETE文で削除
データの削除はDELETE文を使います。
#### 実行命令
```sql
DELETE FROM users WHERE id = 1;
```
#### 意味
「usersテーブル」の「idが1のデータ」を削除。
