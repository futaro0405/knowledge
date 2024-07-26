# リアクティビティの基礎
## `ref()`
`ref()`関数を用いてリアクティブな状態の宣言を行います。

```js
import { ref } from 'vue'

const count = ref(0)
```

コンポーネントのテンプレート内で`ref`にアクセスするためには`setup()`関数を宣言します。

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // ref をテンプレートに公開します
    return {
      count
    }
  }
}
```

```html
<div>{{ count }}</div>
```

## `<script setup>`
`setup()`は単一コンポーネントでは`<script setup>`によって短縮することができます。

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

### ref を使う理由
Vueのリアクティビティを理解するために普通の変数と`ref()`の違いを理解します。

`ref()`を使用すると変数の値を変更したときにVueがその変更を検知してDOMを自動的に更新します。
コンポーネントが最初にレンダリングされたとき、Vueはレンダリング中に使用されたすべての`ref()`を監視し、値が更新されると対応するコンポーネントが再レンダリングされます。

一方、JavaScriptの変数ではそのアクセスや更新を∨ueが検知することができません。

`ref()`のもうひとつの利点は閡数に渡してもリアクティビティの監視が維持されることです。これにより、複雑なロジックを再利用可能なコードにリファクタリングする際に便利です。

さらに、`ref()` は深くネストしたオブジェクトや配列、Mapなどのどんな型の値も保持できます。下記の例では、`ref()` にネストされたオブジェクトや配列が含まれています。

```javascript
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // これらは期待通りに動作します。
  obj.value.nested.count++
  obj.value.arr.push('baz')
}

```

### DOM 更新のタイミング

リアクティブな状態を変更すると、VueはDOMを自動的に更新します。しかし、DOMの更新は同期的には行われません。
代わりに、Vueは更新を「next tick」までバッファリングし、どれだけ状態を変更しても各コンポーネントは一度だけ更新されます。

状態変化後のDOM更新を待つために、`nextTick()` というグローバルAPIを使用できます。

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // DOM が更新されました
}
```

## reactive()

`reactive()` は、オブジェクトをリアクティブにするためのAPIです。
`ref` が特別なオブジェクトでラップするのに対して、`reactive()` はオブジェクト自体をリアクティブにします。

```javascript
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

```html
<button @click="state.count++">
  {{ state.count }}
</button>
```


`reactive()` を使用すると、ネストされたオブジェクトもリアクティブになります。
また、`ref` の値がオブジェクトである場合、内部では `reactive()` が呼び出されます。

`reactive()` の制限として、
- オブジェクト型のデータにのみ適用され、プリミティブ型のデータには使えません。
- リアクティブなオブジェクト全体を置き換えることはできません。
- リアクティブなオブジェクトのプロパティをローカル変数に分割代入したり、そのプロパティを関数に渡したりすると、リアクティビティの接続が失われる可能性があります。

これらの理由から、リアクティブな状態を宣言する際には、通常は `ref()` を使用することが推奨されます。

### ref のアンラップについて

**リアクティブなオブジェクトのプロパティとしての ref**

`ref` は、Vueでリアクティブなデータを保持するための特別なオブジェクトです。
`ref` がリアクティブなオブジェクトのプロパティとして使用されると、自動的に「アンラップ」されます。
これは、`ref` の `.value` プロパティを直接使わなくても、通常のプロパティのようにアクセスできるという意味です。

```javascript
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

ここでは、`state` オブジェクトの `count` プロパティが `ref` オブジェクトであるにもかかわらず、直接 `state.count` としてアクセスできることがわかります。
また、`state.count` に新しい値を代入すると、元の `count` の値も更新されます。

もし、`state.count` に新しい `ref` を割り当てると、元の `ref` はそのオブジェクトから切り離されます。

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 元の ref は state.count から切り離されました
console.log(count.value) // 1
```

このように、新しい `ref` を設定すると、`state.count` は新しい `ref` を参照するようになります。

#### 配列やコレクションの場合の注意点

リアクティブなオブジェクトとは異なり、`ref` がリアクティブな配列やMapのようなネイティブコレクションの要素として使われる場合、自動的にはアンラップされません。

例えば、以下のようになります:

javascript

コードをコピーする

`const books = reactive([ref('Vue 3 Guide')]) // .value を使わないといけません console.log(books[0].value)  const map = reactive(new Map([['count', ref(0)]])) // .value を使わないといけません console.log(map.get('count').value)`

このように、配列やMap内の `ref` にアクセスするときは、`.value` を明示的に使う必要があります。

**テンプレートでの ref のアンラップ**

テンプレートで `ref` を使う場合、特定の条件下でのみ自動的にアンラップされます。`ref` がテンプレートのトップレベルのプロパティである場合、例えば以下のようなコードでは正しく動作します:

javascript

コードをコピーする

`const count = ref(0) const object = { id: ref(1) }`

html

コードをコピーする

`<!-- これは動作します --> {{ count + 1 }}`

しかし、ネストされたオブジェクト内の `ref` には自動アンラップは適用されません。例えば、以下のようなコードでは期待通りの動作をしません:

html

コードをコピーする

`<!-- これは動作しません --> {{ object.id + 1 }}`

この場合、`object.id` がアンラップされないため、レンダリング結果が `[object Object]1` となります。これを避けるためには、`id` をトップレベルのプロパティに分割代入する必要があります:

javascript

コードをコピーする

`const { id } = object`

html

コードをコピーする

`<!-- これで動作します --> {{ id + 1 }}`

このようにすると、レンダリング結果は「2」になります。

さらに、テキスト補間（`{{ }}`）内で `ref` の値が最終的な表示値になる場合、`ref` は自動的にアンラップされます。つまり、次のようにしても `1` が表示されます:

html

コードをコピーする

`{{ object.id }}`

これは、`{{ object.id.value }}` と同じ意味です。