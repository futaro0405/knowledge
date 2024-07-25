# Vue とは
webアプリケーションのUI開発に高い人気のあるJavaScriptフレームワーク。

## 単一ファイルコンポーネント
Vueでは __単一ファイルコンポーネント__ と呼ばれるHTMLに似たVueコンポーネントが使われる。
__SFC__ と訳される。
SFCはコンポーネントのロジック（JavaScript）、テンプレート（HTML）、スタイル（CSS）をひとつのファイルに収めたもの。

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

## APIスタイル
Vueコンポーネントには2種類のAPIスタイルが利用できる。
推奨されるAPIスタイルは __CompositonAPI__ 。
### OptionsAPI
__OptionsAPI__ では数々のオプションを用いてコンポーネントを定義する。

```vue
<script>
export default {
  // data() で返すプロパティはリアクティブな状態になり、
  // `this` 経由でアクセスすることができます。
  data() {
    return {
      count: 0
    }
  },

  // メソッドの中身は、状態を変化させ、更新をトリガーさせる関数です。
  // 各メソッドは、テンプレート内のイベントハンドラーにバインドすることができます。
  methods: {
    increment() {
      this.count++
    }
  },

  // ライフサイクルフックは、コンポーネントのライフサイクルの
  // 特定のステージで呼び出されます。
  // 以下の関数は、コンポーネントが「マウント」されたときに呼び出されます。
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### CompositionAPI
__CompositionAPI__ ではAPI関数をインポートしてコンポーネントを作成する。

```vue
<script setup>
import { ref, onMounted } from 'vue'

// リアクティブな状態
const count = ref(0)

// 状態を変更し、更新をトリガーする関数。
function increment() {
  count.value++
}

// ライフサイクルフック
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

# Vueアプリケーションの作成
## アプリケーションのインスタンス
Vueアプリケーションは`creteApp` 関数で新しいアプリケーションのインスタンスを作成することができる。
`createApp` に渡すオブジェクトhコンポーネントを渡す。

```js
import { createApp } from 'vue'
// ルートコンポーネントを単一ファイルコンポーネントからインポートする
import App from './App.vue'

const app = createApp(App)
```

## アプリのマウント
アプリケーションのインスタンスは`.mount()`メソッドが呼ばれるまでレンダリングを行いわない。
インスタンスにはコンテナ引数というDOM要素、セレクタ文字列（ `#app` ）が必要

```HTML:DOM
<div id="app"></div>
```

```js:
app.mount('#app')
```

アプリのルートコンポーネントのコンテンツはコンテナ要素の中でレンダリングされる。コンテナ要素自体はアプリの要素としてみなされない。
この `mount()` メソッドはすべてのアプリの設定やアセットの登録が完了した後、常に呼ばれる必要がある。
アセット登録をするメソッドとは異なり、返り値はアプリケーションのインスタンスではなく、ルートコンポーネントインスタンスであるということに注意。

### DOM内のルートコンポーネントテンプレート
通常、ルートコンポーネントのテンプレートはコンポーネント自体の一部だが、マウントコンテナ内に直接記述することで、テンプレートを別途提供することができる。

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```
