# TypeScriptのコンパイル
`ts_practice`ディレクトリ内、`index.ts`ファイルを作成する。
TypeScriptはJavaScriptの拡張言語ですので、JavaScriptのコードをそのまま記載できる。

以下のように記述してみましょう。

```typescript:index.ts
console.log('こんにちは');
```

TypeScriptはこのままでは実行することができないので、JavaScriptにコンパイルする。
コンパイルするには、`tsc`コマンドを使用して、コンパイルしたいファイル名を指定する。

Warpを開いて、以下コマンドを実行します。

```
tsc index.ts
```

`ts_practice`ディレクトリを確認すると`、index.js`ファイルが作成されており、このように記述されている。

```typescript:index.js
console.log('こんにちは');
```

これはtsファイルにて、JavaScriptの文法しか使用していないため、中身が全く同じjsファイルが作成される。

次に`index.ts`を以下のように書き換える。

```index.ts
let num: number = 10;
num = 'a';
```

変数の定義は上記のように、`let num`の後に`: 型`として、型を宣言し値を代入する。

もし`num`に別の型の値を入れようとすると、`num`の下に赤波線が引かれ、ホバーするとエラー分が表示される。

静的型付け言語はこのように、コーディング時点で型チェックを行い、エラーを検知してくれる。

では2行目を削除しましょう。

```index.ts
let num: number = 10;
```

この状態でコンパイルする。

```
tsc index.ts
```

index.jsに以下のように記述されている。

```index.js
var num = 10;
```
