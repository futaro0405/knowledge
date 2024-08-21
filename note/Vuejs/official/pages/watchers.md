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
## ディープ・ウォッチャー
Vueでは、リアクティブなオブジェクトの変更を監視するために`watch()`関数を使用します。
このとき、ディープ・ウォッチャーが自動的に生成され、オブジェクトの全てのネストされたプロパティの変更も監視されます。

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // ネストされたプロパティの変更があると実行される
  // 注意: `newValue` と `oldValue` は同じオブジェクトを指しているため、
  // 変更前後で内容が変わらないことがあります。
})

obj.count++
```

上記のコードでは、`obj`オブジェクトの`count`プロパティが変更されると`watch()`のコールバックが実行されます。

#### getterを使った監視

リアクティブなオブジェクトを返すgetterを使うと、オブジェクト全体が異なるオブジェクトに置き換わったときだけコールバックが実行されます。

```js
watch(
  () => state.someObject,
  () => {
    // state.someObject が置き換わった時のみ実行されます。
  }
)
```

しかし、`deep`オプションを明示的に指定することで、getterを使用した場合でもディープ・ウォッチャーとして動作させることができます。

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    //注意: `newValue` は、`oldValue` と同じだとみなされます。
    //state.someObject が置き替わらない*限りは*。
  },
  { deep: true }
)
```
#### 使用上の注意

ディープ・ウォッチャーは、監視対象のオブジェクトの全てのネストされたプロパティを監視するため、データ構造が大きくなるとパフォーマンスに影響を与える可能性があります。
そのため、ディープ・ウォッチャーを使う際は、必要な場合にのみ使用し、パフォーマンスに注意を払うことが重要です。

### 即時ウォッチャー

通常、`watch`関数は監視対象の値が変更されるときにのみコールバックを実行します。
しかし、場合によっては、値の変更を待たずに初回のコールバックを即時に実行したいことがあります。
たとえば、初期値を基にデータを読み込み、その後の変更時にも同様の処理を行いたい場合です。
このような場合は、`immediate: true`オプションを使用します。

```js
watch(
  source,
  (newValue, oldValue) => {
    // すぐに実行され、`source` が変更されると再び実行される
  },
  { immediate: true }
)
```
### 一度きりのウォッチャー

通常のウォッチャーは、監視対象が変更されるたびにコールバックを実行します。
しかし、一度だけコールバックを実行したい場合は、`once: true`オプションを使用します。

```js
watch(
  source,
  (newValue, oldValue) => {
    // `source` が変更された時、一度だけトリガーされる
  },
  { once: true }
)
```

### `watchEffect()`の利用

`watchEffect()`は、ウォッチャーのコールバックがリアクティブな依存関係に応じて自動的に実行される関数です。
リアクティブな状態が変わるときにその影響を自動的に追跡します。

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

この場合、`todoId.value`が変更されるたびに、`watchEffect`のコールバックが再実行されます。
`immediate: true`を指定する必要はありません。

### `watch`と`watchEffect`の違い

`watch`は明示的に指定したソースのみを監視し、コールバック内でアクセスされたものは追跡しません。
一方、`watchEffect`はコールバック内でアクセスしたすべてのリアクティブな依存関係を追跡します。
### コールバックが実行されるタイミング

ウォッチャーのコールバックは、デフォルトでは、親コンポーネントの更新後かつオーナーコンポーネントのDOM更新前に呼び出されます。
もし、Vueの更新後にコールバックを実行したい場合は、`flush: 'post'`オプションを使用します。
```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

また、`watchEffect`の場合は`watchPostEffect()`というエイリアスが用意されています。

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* Vue 更新後に実行されます*/
})
```
### 同期ウォッチャー

リアクティブな変更が発生するとすぐにウォッチャーを実行したい場合は、`flush: 'sync'`オプションを使用します。

```js
watch(source, callback, {
  flush: 'sync'
})
```

また、`watchSyncEffect()`というエイリアスもあります。

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* リアクティブなデータ変更時に同期的に実行される */
})
```

ただし、同期ウォッチャーはバッチ処理がされないため、頻繁な変更が発生する場合にはパフォーマンスに影響を与える可能性があるため、慎重に使用する必要があります。
### ウォッチャーの停止
ウォッチャーは通常、オーナーコンポーネントがアンマウントされると自動的に停止されますが、非同期のコールバックでウォッチャーを生成した場合は手動で停止する必要があります。

```vue
<script setup>
import { watchEffect } from 'vue'

// これは自動的に停止します
watchEffect(() => {})

// ...これは自動では停止しません
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

非同期でウォッチャーを作成する必要がある場合は、必要に応じて手動で停止することが重要です。