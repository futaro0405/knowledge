# リストレンダリング
## v-for
`v-for` ディレクティブは、配列の各要素を使ってリストを表示するために使用されます。
このディレクティブは `item in items` という構文を使います。
ここで、`items` は元の配列データを指し、`item` は現在処理中の配列要素を指します。

```javascript
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

```vue
<li v-for="item in items">
  {{ item.message }}
</li>
```

この例では、`items` 配列の各要素の `message` プロパティをリスト項目として表示します。

また、`v-for` のスコープ内では、親スコープのプロパティにアクセスできるだけでなく、現在の項目のインデックスも取得できます。

```javascript
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

```vue
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

この例では、各リスト項目に親メッセージ、インデックス、アイテムのメッセージが表示されます。

`v-for` のスコープは、JavaScript の `forEach` メソッドと似ています。たとえば、次のように書けます:

```javascript
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]

items.forEach((item, index) => {
  console.log(parentMessage, item.message, index)
})
```

`v-for` では分割代入も使用できます。

```vue
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- index のエイリアスを伴う場合 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

ネストされた `v-for` でも親スコープにアクセスできます。

```vue
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

`v-for` の構文として `in` の代わりに `of` を使用することもできます:

```vue
<div v-for="item of items"></div>
```

## `v-for` をオブジェクトに適用する
`v-for` はオブジェクトの各プロパティを繰り返すこともできます。
この場合、`Object.keys()` の結果に基づいて順序が決まります。

```javascript
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

```vue
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

プロパティ名も取得する場合は、2つ目のエイリアスを使います。

```vue
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

インデックスを取得するには3つ目のエイリアスを使います。

```vue
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

## v-for で範囲を使用する

`v-for` には整数を指定して範囲を繰り返すこともできます。

```vue
<span v-for="n in 10">{{ n }}</span>
```

この場合、`n` の値は 1 から始まります。
## `<template>` に `v-for` を適用する
複数の要素をまとめてレンダリングする場合、`<template>` タグに `v-for` を適用します。
`<template>`タグ自体はレンダリングされません。

```vue
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```
## v-for と v-if の組み合わせ
`v-if` と `v-for` を同じ要素に使うのは推奨されません。
同じ要素に両方を使用すると、`v-if` が優先され、`v-for` のスコープ内の変数にアクセスできなくなります。

```vue
<!--
"todo" というプロパティがインスタンスで未定義となるため、
エラーがスローされます。
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

この場合、`todo` が未定義でエラーが発生します。これを解決するには、`<template>` タグを使用して `v-for` を移動します:

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

#### key による状態管理

`v-for` でリストをレンダリングする場合、Vueは「その場での修繕」（in-place patch）という戦略を用います。
つまり、項目の順序が変更されても、Vueはその場で要素を修正し、新しい順序に合わせます。

しかし、項目の順序が重要である場合や、子コンポーネントの状態が変更される場合は、`key` 属性を指定することで、Vueに要素の再利用を指示できます。

```vue
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

`<template>` タグに `key` を適用する場合:

```vue
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

`v-for` の `key` 属性は一意である必要があります。
また、`key` には文字列や数値などのプリミティブ型の値を使用し、オブジェクトを指定してはいけません。
## v-for をコンポーネントに適用する

コンポーネントにも `v-for` を適用できますが、この場合、コンポーネントにデータを渡すために `props` を使用します。

例:

vue

コードをコピーする

`<MyComponent   v-for="(item, index) in items"   :item="item"   :index="index"   :key="item.id" />`

#### 配列の変更の検出

Vue はリアクティブな配列の変更を検出し、それに応じてビューを更新します。これには以下のミューテーションメソッドが含まれます:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

ミューテーションしないメソッド（例: `filter()`, `concat()`, `slice()`）を使用した場合、Vueは新しい配列をレンダリングします。例えば:

javascript

コードをコピーする

`items.value = items.value.filter((item) => item.message.match(/Foo/))`

Vueは既存のDOMを効率的に再利用するため、リスト全体の再レンダリングは行いません。

#### フィルタリング/並べ替えの結果を表示する

フィルタリングや並べ替えを行いたい場合、元のデータを変更せずに算出プロパティを使用して結果を表示できます。

例:

javascript

コードをコピーする

`const numbers = ref([1, 2, 3, 4, 5])  const evenNumbers = computed(() => {   return numbers.value.filter((n) => n % 2 === 0) })`

vue

コードをコピーする

`<li v-for="n in evenNumbers">{{ n }}</li>`

ネストされた `v-for` ループの内側などで算出プロパティを使えない場合は、メソッドを使用できます。

例:

javascript

コードをコピーする

`const sets = ref([   [1, 2, 3, 4, 5],   [6, 7, 8, 9, 10] ])  function even(numbers) {   return numbers.filter((number) => number % 2 === 0) }`

vue

コードをコピーする

`<ul v-for="numbers in sets">   <li v-for="n in even(numbers)">{{ n }}</li> </ul>`

算出プロパティの中で `reverse()` や `sort()` を使用する際は、元の配列を変更しないように注意しましょう。

例:

diff

コードをコピーする

`- return numbers.reverse() + return [...numbers].reverse()`

4o