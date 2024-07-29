# コンポーネントのv-model

#### 基本的な使い方

コンポーネントで`v-model`を使用すると、双方向バインディングを実現できます。Vue 3.4以降では、`defineModel()`マクロを使うことが推奨されています。

#### 子コンポーネントの例
```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>

```
#### 親コンポーネントの例
```vue
<!-- Parent.vue -->
<template>
  <Child v-model="countModel" />
</template>
```

`defineModel()`が返す値は`ref`です。
これは他の`ref`と同じようにアクセスしたり変更したりできますが、親の値とローカルの値の双方向バインディングとして動作します。
- `model.value`は親の`v-model`にバインドされた値と同期されます。
- 子が`model.value`を変更すると、親にバインドされている値も更新されます。
### ネイティブの入力要素へのバインド
```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```
### 内部の仕組み
`defineModel`は便利なマクロです。
コンパイラーはこれを次のように展開します。
1. `modelValue`という名前の`props`: ローカル`ref`の値が同期されます。
2. `update:modelValue`という名前のイベント: ローカル`ref`の値が変更されたときに発行されます。
3.4以前では、上記の子コンポーネントは以下のように実装されていました:
```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```
すると、親コンポーネントの`v-model="foo"`は次のようにコンパイルされます:
```vue
<!-- Parent.vue -->
<template>
  <Child
    :modelValue="foo"
    @update:modelValue="$event => (foo = $event)"
  />
</template>
```

この実装は冗長ですが、内部で何が起こっているのかを理解するのに役立ちます。
### `defineModel`のオプション
`defineModel`は`props`を宣言するので、元となる`props`のオプションを`defineModel`に渡して宣言できます。
#### `v-model`を必須にする
```js
const model = defineModel({ required: true })
```
#### デフォルト値を提供する
```js
const model = defineModel({ default: 0 })
```
#### 注意点
もし`defineModel`の`props`にデフォルト値を指定し、親コンポーネントからこの`props`に何も値を与えなかった場合、親と子のコンポーネント間で同期が取れなくなる可能性があります。
以下の例では、親コンポーネントの`myRef`は`undefined`ですが、子コンポーネントの`model`は`1`です。
```js
// 子コンポーネント:
const model = defineModel({ default: 1 })

// 親コンポーネント:
const myRef = ref()

```

```html
<Child v-model="myRef"></Child>
```

このように、`v-model`を使うことで、親と子コンポーネント間での双方向バインディングを簡単に実現できます。
また、`defineModel`を使うことで、冗長なコードを減らし、より簡潔に記述できます。
