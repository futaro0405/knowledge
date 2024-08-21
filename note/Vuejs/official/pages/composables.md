# コンポーザブル
Vueアプリケーションにおいて「コンポーザブル（composable）」とは、VueのComposition APIを使って状態を持つロジックをカプセル化して再利用するための関数のことです。

フロントエンドアプリケーションを作成するとき、同じロジックを何度も使いまわす必要がある場合があります。
例えば、日付のフォーマットを複数の場所で行う場合、そのための再利用可能な関数を作成します。
この関数は、入力を受け取って即座に期待される出力を返します。
こういった状態のないロジックを再利用するためのライブラリとして、lodashやdate-fnsなどがあります。

一方で、状態のあるロジックは、時間とともに変化する状態を管理する必要があります。
例えば、ページ上のマウスの位置を追跡するロジックがあります。
他にも、タッチジェスチャーやデータベースへの接続状態を管理するような、より複雑なロジックもあります。
## マウストラッカーの例
コンポーネント内で直接Composition APIを使ってマウストラッキング機能を実装すると、次のようになります:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  Mouse position is at: {{ x }}, {{ y }}
</template>
```

しかし、複数のコンポーネントで同じロジックを再利用したい場合は、コンポーザブル関数として外部ファイルにロジックを抽出できます。

```javascript
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

そしてこれがコンポーネント内での使い方です:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>
  Mouse position is at: {{ x }}, {{ y }}
</template>

```

## コンポーザブルのネスト
コンポーザブルのさらに優れた点は、他のコンポーザブル関数を呼び出せることです。
これにより、コンポーネントを使ってアプリケーション全体を構成するのと同じように、小さくて独立したユニットを使用して複雑なロジックを構成できます。

例えば、DOMイベントリスナーを追加・削除するロジックを独自のコンポーザブルに抽出できます:

```javascript
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

これでuseMouse()コンポーザブルは次のように簡略化できます:

```javascript
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}

```
### 非同期の状態の例

useMouse()コンポーザブルは引数を取りませんでしたので、引数を使用する別の例を見てみましょう。非同期データ取得の際には、ローディング、成功、エラーといった異なる状態を扱う必要があります。

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

```

このパターンをコンポーザブルに抽出してみましょう:

```javascript
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}

```

そうすると、コンポーネントの中はこうするだけです:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>

```
### リアクティブな状態を受け取る

useFetch()は入力として静的なURL文字列を取り、一度だけ取得してそれで完了です。URLが変更されるたびに再取得したい場合はどうでしょうか？ これを実現するためには、リアクティブな状態をコンポーザブル関数に渡し、渡された状態を使ってアクションを実行するウォッチャーをコンポーザブルに作らせる必要があります。

例えば、useFetch()はrefを受け取れるようにする必要があります:

```javascript
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// 再取得のトリガーになります
url.value = '/new-url'
```

もしくは、getter関数を受け取ります:

```javascript
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

watchEffect()とtoValue() APIを使用して、既存の実装をリファクタリングできます:

```javascript
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}

```
### 慣例とベストプラクティス

#### 命名

コンポーザブル関数には「use」で始まるキャメルケースの名前をつけるのが慣例です。

#### 入力引数

コンポーザブルはリアクティビティに依存しない場合でも、refやgetterの引数を受け取れます。toValue()ユーティリティ関数を使うと便利です。

```javascript
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  const value = toValue(maybeRefOrGetter)
}

```
#### 戻り値

コンポーザブルは複数のrefを含むプレーンでリアクティブでないオブジェクトを返すのが推奨される慣例です。これにより、コンポーネントでリアクティビティを保ったまま分割代入できます。

```javascript
const { x, y } = useMouse()

```

もし、オブジェクトのプロパティとして扱いたい場合は、戻り値のオブジェクトをreactive()で包むこともできます。

```javascript
const mouse = reactive(useMouse())
```
#### 副作用
コンポーザブルで副作用（例: DOMイベントリスナーの登録やデータの取得）を起こすことは問題ありませんが、次のルールを守ることが重要です:

- onMountedやwatchEffectといったライフサイクルAPIを使用して副作用を起こす。
- Composition APIのsetup()のコンテキスト内で実行する。

コンポーザブルがsetup()の外で呼び出されると、Vueのインスタンスが見つからないためエラーが発生します。

#### テスト

コンポーザブルをテストするために、リアクティビティAPIをモックする必要はありません。setup()内でコンポーザブルを呼び出し、返されたリアクティブな値を検証することができます。

例えば、Jestを使ってuseMouse()をテストする場合:

```javascript
import { ref } from 'vue'
import { useMouse } from './mouse.js'

test('tracks mouse position', () => {
  const x = ref(0)
  const y = ref(0)

  useMouse({ x, y })

  window.dispatchEvent(new MouseEvent('mousemove', { pageX: 100, pageY: 200 }))

  expect(x.value).toBe(100)
  expect(y.value).toBe(200)
})

```
### まとめ

コンポーザブル関数は、VueのComposition APIを使ってロジックを再利用するための強力な手段です。状態のあるロジックをカプセル化し、再利用可能な形で提供することで、アプリケーションの開発をシンプルにし、保守性を高めることができます。

これで、基本的なコンポーザブルの作成方法と使い方について学びました。次は、自分のプロジェクトで実際にコンポーザブルを使ってみましょう。