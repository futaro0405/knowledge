# Provide / Inject
`provide` と `inject` は、親コンポーネントから深くネストされた子コンポーネントまでデータを渡すための仕組みです。
これにより、props の「バケツリレー」問題を解決できます。
通常、データは props を使って親から子へ渡されますが、複数の中間コンポーネントがデータを使用しない場合でも、すべての中間コンポーネントに props を渡す必要があります。
### `provide` と `inject` の基本構造
- **provide**: 親コンポーネントでデータを提供します。
- **inject**: 子コンポーネントでそのデータを注入します。
#### 例: `provide` と `inject` の使用
##### 親コンポーネント
```vue
<template>
  <div>
    <DeepChild />
  </div>
</template>

<script>
import DeepChild from './DeepChild.vue';

export default {
  components: { DeepChild },
  provide() {
    return {
      themeColor: 'blue',
      userName: 'John Doe'
    }
  }
}
</script>
```

##### 子コンポーネント
```vue
<template>
  <div :style="{ color: themeColor }">
    Hello, {{ userName }}!
  </div>
</template>

<script>
export default {
  inject: ['themeColor', 'userName']
}
</script>

```

この例では、親コンポーネントで `themeColor` と `userName` を `provide` しています。
これらのデータは中間コンポーネントを通さずに直接 `DeepChild` コンポーネントで `inject` されています。
## `provide`
`provide` は、コンポーネントのツリー内でデータを提供し、これを子孫コンポーネントに注入するための機能です。
### 基本的な使用方法
`provide` を使うには、`vue` から `provide` 関数をインポートし、`setup` 関数内で呼び出します。

```vue
<script setup>
import { provide } from 'vue'

provide('message', 'hello!')
</script>
```

上記の例では、`message` というキーで `'hello!'` という値を提供しています。
### `setup` 関数を使わない場合
`<script setup>` を使用しない場合、`setup` 関数内で `provide` を呼び出します。

```js
import { provide } from 'vue'

export default {
  setup() {
    provide('message', 'hello!')
  }
}
```
### インジェクションキーと値
`provide` 関数は2つの引数を取ります。
1. **キー**: インジェクションキー。文字列または `Symbol` を使用します。このキーは、子孫コンポーネントが値を探すのに使用します。
2. **値**: 提供する任意の値。リアクティブなデータ（例えば `ref` など）も提供できます。
### リアクティブな値を提供する
リアクティブな値を提供することで、提供された値にリアクティブな更新を行うことができます。

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

上記の例では、`count` というリアクティブな `ref` を `key` というキーで提供しています。
この場合、子孫コンポーネントはリアクティブな `count` にアクセスし、更新を受け取ることができます。

### アプリケーションレベルでの `provide`
`provide` をアプリケーションレベルで使用することも可能です。
これにより、アプリケーション全体で共通のデータを提供できます。

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide('message', 'hello!')
```

アプリケーションレベルの `provide` は、アプリケーション全体でレンダリングされるすべてのコンポーネントからアクセス可能です。
これは特にプラグインを作成する際に有用で、プラグインがコンポーネントを使用して値を提供できない場合でも、データを提供することができます。

`provide` を使うことで、コンポーネント間でのデータ共有が容易になり、props のバケツリレーを避けることができます。
また、アプリケーション全体で共通のデータを持つ場合にも便利です。

## `inject`
`inject` は、祖先コンポーネントが提供するデータを受け取るために使用されます。
`inject` を使用することで、props を通じてのデータ伝達が不要になり、より簡潔にデータを取得できます。
### 基本的な使用方法
`inject` を使用するには、`vue` から `inject` 関数をインポートし、`setup` 関数内で呼び出します。

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

上記の例では、`'message'` というキーで提供された値を `message` に格納しています。

### `<script setup>` を使わない場合
`<script setup>` を使用しない場合、`setup` 関数内で `inject` を呼び出します。

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```
### インジェクションのデフォルト値
キーが提供されていない場合に備えて、デフォルト値を設定することができます。

```js
// デフォルト値として "default value" を使用
const value = inject('message', 'default value')
```

### デフォルト値のファクトリー関数
デフォルト値の生成にコストがかかる場合、ファクトリー関数を使用して、必要なときにのみデフォルト値を生成することができます。

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

3 番目の引数として `true` を渡すことで、`inject` にデフォルト値をファクトリー関数として扱うよう指示します。
### リアクティビティの利用
リアクティブな値を `provide` / `inject` する際には、できるだけプロバイダー側でリアクティブな状態の管理を行うことが推奨されます。これにより、メンテナンスが容易になります。

子孫コンポーネントからデータを更新する必要がある場合は、更新関数を提供するのが一般的です。

```vue
<!-- プロバイダーコンポーネント -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>

<!-- インジェクターコンポーネント -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```
### 値の読み取り専用にする
提供された値がインジェクターコンポーネントで変更されないようにするためには、`readonly()` でラップすることができます。

```vue

```

#### シンボルキーの利用

シンボルキーを使用すると、複数の依存関係を管理する際にキーの衝突を避けることができます。

js

コードをコピーする

`// keys.js export const myInjectionKey = Symbol()  // プロバイダーコンポーネント import { provide } from 'vue' import { myInjectionKey } from './keys.js'  provide(myInjectionKey, { /* 提供するデータ */ })  // インジェクターコンポーネント import { inject } from 'vue' import { myInjectionKey } from './keys.js'  const injected = inject(myInjectionKey)`

シンボルキーはユニークな識別子として扱われるため、キーの衝突を避け、他の開発者と共有する際にも便利です。