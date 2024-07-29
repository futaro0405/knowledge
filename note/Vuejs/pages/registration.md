# コンポーネントの登録
Vue.jsでコンポーネントを使うときは、そのコンポーネントがどこで使われるかをVueに知らせる必要があります。これを「登録」と呼びます。
登録方法には「グローバル登録」と「ローカル登録」の2種類があります。

## グローバル登録
アプリ全体でコンポーネントを使えるようにする方法です。
以下のコードのように、`.component()`メソッドを使います。

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // コンポーネントの登録名
  'MyComponent',
  // コンポーネントの実装
  {
    /* ... */
  }
)
```

もしシングルファイルコンポーネント（SFC）を使っている場合は、`.vue`ファイルをインポートして登録します。
```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

さらに、複数のコンポーネントを一度に登録することもできます。
```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

これらのグローバルに登録されたコンポーネントは、アプリケーションのどこでも使うことができます。
```html
<template>
  <!-- どのコンポーネントでもこのコンポーネントが使えます -->
  <ComponentA/>
  <ComponentB/>
  <ComponentC/>
</template>
```

この仕組みによって、サブコンポーネント（他のコンポーネントの内部で使用されるコンポーネント）でもグローバルに登録されたコンポーネントが使えるようになります。つまり、上記の`ComponentA`、`ComponentB`、`ComponentC`は、アプリ内のどのコンポーネントでも使用できます。

この説明を参考にして、Vue.jsのコンポーネント登録の仕組みを理解してくださいね。質問があれば、いつでもどうぞ！