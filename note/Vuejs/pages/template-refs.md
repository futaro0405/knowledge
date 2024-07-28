# テンプレート参照
Vue.jsでは、ほとんどのDOM操作がVueの宣言的なレンダリングによって抽象化されます。
しかし、時々、DOM要素に直接アクセスする必要がある場合があります。
そんなときに「ref」という特殊な属性を使います。

### refの使い方
テンプレート内で特定の要素に`ref`を設定すると、その要素に直接アクセスできるようになります。
例えば、次のように`<input ref="input">`とすると、この要素への参照を取得できます。
```vue
<template>
  <input ref="input">
</template>
```

### Composition APIを使ったrefの取得

Composition APIを使っている場合、`ref`で参照を宣言し、コンポーネントがマウントされた後にその要素にアクセスできます。

vue

コードをコピーする

`<script setup> import { ref, onMounted } from 'vue'  const input = ref(null)  onMounted(() => {   input.value.focus() }) </script>  <template>   <input ref="input" /> </template>`

`onMounted`の中で`input.value`を使って、例えばフォーカスを当てることができます。

#### 関数を使ったrefの使用

また、`ref`には関数を設定することも可能です。この場合、関数は要素が更新されるたびに呼ばれ、要素の参照を管理できます。

vue

コードをコピーする

`<template>   <input :ref="(el) => { /* el を使って何かする */ }"> </template>`

#### 子コンポーネントへのref

`ref`は子コンポーネントにも使用できます。例えば、親コンポーネントから子コンポーネントのインスタンスにアクセスするために使用します。ただし、必要な場合にのみ使用することが推奨されます。

vue

コードをコピーする

`<script setup> import { ref, onMounted } from 'vue' import Child from './Child.vue'  const child = ref(null)  onMounted(() => {   console.log(child.value) }) </script>  <template>   <Child ref="child" /> </template>`

### 注意点

- `ref`で参照する要素は、コンポーネントがマウントされた後でなければアクセスできません。
- `v-for`ループ内で使用する場合、`ref`は配列として参照を格納しますが、配列の順序が保証されないことに注意が必要です。

これらの機能を理解することで、Vue.jsでのDOM操作がより効果的に行えるようになります。