# ウォッチャー

## 基本の例

算出プロパティを使うと、データから新しい値を計算できますが、状態が変化するたびに特定の処理（副作用）を行いたい場合があります。
例えば、DOMの変更や非同期処理の結果に応じて他の状態を更新する場合です。

VueのComposition APIでは、`watch`関数を使うことで、特定のリアクティブなデータが変更されたときにコールバックを実行できます。

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// watch 関数は ref を直接扱えます
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

この例では、`question`というリアクティブな変数が変更されるたびに`watch`が呼び出されます。新しい質問が`?`を含む場合、APIに問い合わせて答えを取得し、`answer`変数に設定します。

## 監視ソースの種類

`watch`関数の最初の引数は、監視対象の「ソース」です。
これは以下のような様々なタイプのリアクティブなデータを受け取ることができます。

### 単一の ref
```js
const x = ref(0)

watch(x, (newX) => {
  console.log(`x is ${newX}`)
})
```
### getter 関数
```js
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)
```  

### 複数のソースの配列
```js
const y = ref(0)

watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意点として、リアクティブオブジェクトのプロパティを直接監視することはできません。
例えば、以下のコードは動作しません。

```js
const obj = reactive({ count: 0 })

// これは動作しません
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})
```

その代わりに、getterを使って監視するプロパティを指定します。

```js
// 代わりに、getter を使います:
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

これにより、リアクティブオブジェクトの特定のプロパティが変更されたときにコールバックが呼び出されます。