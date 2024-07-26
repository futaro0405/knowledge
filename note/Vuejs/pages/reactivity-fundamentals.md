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

















