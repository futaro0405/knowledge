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

## v-model の引数
コンポーネントの`v-model`に引数を指定することができます。
これにより、複数のデータバインディングを簡単に管理できます。
### 親コンポーネントでの使用例

```vue
<!-- Parent.vue -->
<template>
  <MyComponent v-model:title="bookTitle" />
</template>
```
### 子コンポーネントでの対応方法
子コンポーネントでは、`defineModel()`の第一引数に文字列を渡すことで、対応する引数をサポートできます。

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

このようにして、親コンポーネントで`v-model:title`を使っている場合、子コンポーネントでは`defineModel('title')`を使って対応します。
### props のオプションを指定する場合
`defineModel()`を使うときに、モデル名の後にオプションを渡すこともできます。

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title', { required: true, default: 'Unknown' })
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

この例では、`title`プロパティを必須にし、デフォルト値を`'Unknown'`に設定しています。

## 複数の v-model のバインディング
Vue.jsでは、`v-model`の引数を使って、1つのコンポーネントインスタンスに複数の`v-model`バインディングを作成できます。
これにより、特定の`props`とイベントをターゲットにできます。
### 例: 親コンポーネント

```vue
<!-- Parent.vue -->
<template>
  <UserName
    v-model:first-name="first"
    v-model:last-name="last"
  />
</template>
```

この例では、`UserName`コンポーネントに対して、`first-name`と`last-name`という2つの`v-model`バインディングを設定しています。
### 例: 子コンポーネント

```vue
<!-- UserName.vue -->
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

この例では、子コンポーネント`UserName`が`firstName`と`lastName`という2つの`props`を受け取り、それぞれの`v-model`でバインディングしています。

このようにして、複数の`v-model`バインディングを使うことで、親コンポーネントから子コンポーネントに対して複数のデータを双方向にバインドすることができます。それぞれの`v-model`は、別々の`props`に同期されますので、個別のデータ管理が容易になります。

## v-model 修飾子の処理
`v-model`には組み込みの修飾子がありますが、カスタム入力コンポーネントでカスタム修飾子をサポートすることも可能です。
ここでは、文字列の最初の文字を大文字にする`capitalize`修飾子を例にして、カスタム修飾子の使い方を説明します。
### 親コンポーネントでの使用例
```vue
<!-- Parent.vue -->
<template>
  <MyComponent v-model.capitalize="myText" />
</template>
```
#### 子コンポーネントでの対応方法
`defineModel()`の戻り値を分割代入することで、子コンポーネント内で修飾子にアクセスできます。
```vue
<!-- MyComponent.vue -->
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

修飾子に基づいて値の読み書きを条件付きで調整するために、`defineModel()`に`get`と`set`オプションを渡します。ここでは`set`オプションを使って`capitalize`修飾子を実装します。
```vue
<!-- MyComponent.vue -->
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```
このコードでは、`capitalize`修飾子が設定されている場合、入力された文字列の最初の文字を大文字に変換します。
### 引数を持つ v-model の修飾子
複数の`v-model`バインディングに異なる修飾子を使用する例です。
#### 親コンポーネント
```vue
<!-- Parent.vue -->
<template>
  <UserName
    v-model:first-name.capitalize="first"
    v-model:last-name.uppercase="last"
  />
</template>
```
### 子コンポーネント
```vue
<!-- UserName.vue -->
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```
