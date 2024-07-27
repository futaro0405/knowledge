# 条件付きレンダリング
## v-if
`v-if` ディレクティブは、特定の条件が満たされたときに要素を表示したい場合に使用されます。
このディレクティブが指定された要素は、条件が真 (`true`) のときだけ表示されます。

例:

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
```

上記の例では、`awesome` という変数が真の場合に「Vue is awesome!」というメッセージが表示されます。

## v-else

`v-if` に対して "else block" を追加するために `v-else` を使用します。`v-else` ディレクティブが指定された要素は、`v-if` の条件が偽 (`false`) のときに表示されます。

例:
```vue
<button @click="awesome = !awesome">Toggle</button>
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

ここでは、ボタンをクリックすると `awesome` の値が反転し、それに応じてメッセージが切り替わります。`v-else` は常に `v-if` または `v-else-if` の直後に記述しなければなりません。

#### v-else-if

`v-else-if` は、複数の条件を処理したいときに使用します。これは `v-if` の "else if block" として機能し、複数回連結して使うことができます。

例:
```vue
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```

この例では、`type` 変数の値に応じて異なるブロックが表示されます。`v-else-if` も `v-if` または他の `v-else-if` の直後に記述しなければなりません。
#### `<template>` 要素での v-if の使用

`v-if` は単一の要素に対して使いますが、複数の要素を条件に応じて切り替えたい場合は `<template>` 要素と併用します。この `<template>` 要素自体は最終的に DOM にレンダリングされません。

例:

```vue
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

ここでは、`ok` が真の場合に `<h1>` と `<p>` が表示されます。
#### v-show

`v-show` は条件によって要素を表示・非表示にするもう一つの方法です。`v-if` と異なり、`v-show` では要素が常に DOM に存在し、単に `display` CSS プロパティを切り替えることで表示・非表示を制御します。

例:
```vue
<h1 v-show="ok">Hello!</h1>
```

この例では、`ok` の値が真のときに「Hello!」が表示されます。`v-show` は `<template>` 要素をサポートせず、`v-else` とも連動しません。

#### v-if と v-show の使い分け

`v-if` は、条件が真の場合に要素やコンポーネントを初めてレンダリングする「遅延レンダリング」方式です。一方、`v-show` は初めから要素がレンダリングされ、条件によって表示・非表示を切り替えます。

- 頻繁に表示・非表示を切り替える必要がある場合は `v-show` を使用
- 表示の切り替えがあまりない場合や、初期表示で要素を隠したい場合は `v-if` を使用

#### v-if と v-for の同時使用

`v-if` と `v-for` を同じ要素で使用することは一般的に推奨されていません。もし使用する場合は、`v-if` が先に評価されます。詳細はスタイルガイドやリストレンダリングのガイドを参照してください。