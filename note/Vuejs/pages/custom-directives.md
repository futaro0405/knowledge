# カスタムディレクティブ​
Vueには、`v-model` や `v-show` などのデフォルトのディレクティブがありますが、それ以外にも自分で独自のカスタムディレクティブを作ることができます。

Vueではコードの再利用方法として、コンポーネントとコンポーザブルの2つがあります。
コンポーネントは大きなブロックを作るのに使い、コンポーザブルはステートフルなロジックを再利用するために使います。
一方、カスタムディレクティブは主にDOM要素に直接触れるロジックを再利用するためのものです。

カスタムディレクティブは、コンポーネントのようにライフサイクルフックを持ったオブジェクトとして定義されます。
フックはディレクティブがバインドされている要素を受け取ります。
例えば、要素がDOMに挿入されたときに入力欄に自動でフォーカスするディレクティブを作ることができます。

```vue
<script setup>
// このテンプレートで v-focus を使えるようにする
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

上のコードでは、ページが読み込まれたときや要素が動的に追加されたときに、入力欄に自動的にフォーカスが当たります。
`autofocus` 属性よりも便利です。

`<script setup>` の中で、`v` で始まるキャメルケースの変数はカスタムディレクティブとして使えます。
上の例では、`vFocus` をテンプレート内で `v-focus` として使用できます。

もし `<script setup>` を使わない場合は、カスタムディレクティブを `directives` オプションで登録できます。

```javascript
export default {
  setup() {
    /*...*/
  },
  directives: {
    focus: {
      /* ... */
    }
  }
}
```

また、アプリ全体でカスタムディレクティブを使えるようにグローバルに登録することもあります。

```javascript
const app = createApp({})

// 全てのコンポーネントで v-focus が使用可能
app.directive('focus', {
  /* ... */
})
```
## カスタムディレクティブの利用法
カスタムディレクティブは、どうしてもDOMを直接操作しないと実現できない場合に使います。
可能であれば、`v-bind` などの組み込みディレクティブを使った方が効率的でサーバーレンダリングにも適しています。
組み込みディレクティブを優先的に使用することをお勧めします。
### ディレクティブフック
ディレクティブ定義オブジェクトには、いくつかのフック関数を提供できます。

```javascript
const myDirective = {
  // バインドされた要素の属性やイベントリスナーが適用される前に呼ばれます
  created(el, binding, vnode) {
    // 詳細は下記の引数セクションを参照してください
  },
  // 要素がDOMに挿入される直前に呼ばれます
  beforeMount(el, binding, vnode) {},
  // バインドされた要素の親コンポーネントとその全ての子要素がマウントされたときに呼ばれます
  mounted(el, binding, vnode) {},
  // 親コンポーネントが更新される前に呼ばれます
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 親コンポーネントと全ての子要素が更新された後に呼ばれます
  updated(el, binding, vnode, prevVnode) {},
  // 親コンポーネントがアンマウントされる前に呼ばれます
  beforeUnmount(el, binding, vnode) {},
  // 親コンポーネントのアンマウント時に呼ばれます
  unmounted(el, binding, vnode) {}
}
```
### フックの引数
ディレクティブフックには以下の引数が渡されます:
#### `el`
ディレクティブがバインドされている要素。
DOMを直接操作するために使います。
#### `binding`
オブジェクトで、以下のプロパティを持ちます。
`value`:
ディレクティブに渡される値。
例えば `v-my-directive="1 + 1"` の場合、値は 2 になります。

`oldValue`:
更新前の値。`beforeUpdate` と `updated` でのみ利用可能です。

 `arg`:
 ディレクティブに渡される引数。
 例えば `v-my-directive:foo` の場合、引数は "foo" になります。
 
 `modifiers`:
 修飾子。
 例えば `v-my-directive.foo.bar` の場合、`modifiers` オブジェクトは `{ foo: true, bar: true }` となります。
 
`instance`:
ディレクティブが使用されるコンポーネントのインスタンス。

`dir`:
ディレクティブ定義オブジェクト。

`vnode`:
バインドされた要素を表すVNode。

`prevVnode`:
前のレンダリングからバインドされた要素を表すVNode。
`beforeUpdate` と `updated` フックでのみ利用可能です。

例として、次のようなディレクティブの使い方を考えてみましょう:
```vue
<template>
  <div v-example:foo.bar="baz"></div>
</template>
```
この場合、`binding` は以下のようなオブジェクトになります:

```javascript
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` の値 */,
  oldValue: /* 前回の更新による `baz` の値 */
}
```

組み込みのディレクティブと同様に、カスタムディレクティブの引数も動的にできます。例えば:

```vue
<template>
  <div v-example:[arg]="value"></div>
</template>
```

ここでは、ディレクティブの引数は、コンポーネントの状態にある `arg` プロパティに基づいてリアクティブに更新されます。

#### 注意

`el` 以外のディレクティブの引数は読み取り専用として扱い、決して変更しないようにしましょう。
フック間で情報を共有する必要がある場合は、要素の `dataset` を通して行うことを推奨します。

#### 関数のショートハンド

カスタムディレクティブが `mounted` と `updated` に対して同じ動作をさせ、他のフックを必要としない場合、ディレクティブを関数として定義することができます。

```vue
<template>
<div v-color="color"></div>
</template>

<script>
app.directive('color', (el, binding) => {
  // `mounted` と `updated` の両方で呼ばれます
  el.style.color = binding.value
})
</script>
```
#### オブジェクトリテラル
ディレクティブが複数の値を必要とする場合、JavaScriptのオブジェクトリテラルを渡すこともできます。
ディレクティブは有効なJavaScriptの式ならなんでも受け取れます。

```vue
<template>
  <div v-demo="{ color: 'white', text: 'hello!' }"></div>
</template>

<script>
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
</script>
```
#### コンポーネントでの使い方
コンポーネントでカスタムディレクティブを使用することは推奨されていません。
コンポーネントに複数のルートノードがある場合、予期しない動作が発生する可能性があります。

コンポーネントでカスタムディレクティブを使用すると、フォールスルー属性と同様に、カスタムディレクティブは常にコンポーネントのルートノードに適用されます。

```vue
<template>
  <MyComponent v-demo="test" />
</template>

<template>
<!-- MyComponent のテンプレート -->

<div> <!-- v-demo ディレクティブがここに適用されます -->
  <span>My component content</span>
</div>
</template>

```

コンポーネントが複数のルートノードを持つ場合、ディレクティブは無視され、警告が表示されます。
属性とは異なり、ディレクティブは `v-bind="$attrs"` で別の要素に渡すことができません。