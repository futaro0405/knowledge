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
__OptionsAPI__ では数々の