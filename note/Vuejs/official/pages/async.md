# 非同期コンポーネント
## 非同期コンポーネントの使い方
大規模なアプリケーションでは、アプリを小さなチャンクに分割し、必要なときにのみコンポーネントをサーバーから読み込むことが重要です。
Vueには、このための `defineAsyncComponent` 関数があります。
### 基本的な使用方法
`defineAsyncComponent` 関数は、Promise を返すローダー関数を受け取ります。
このローダー関数内で、サーバーからコンポーネントを読み込む処理を行います。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // サーバーからコンポーネントを読み込む
    resolve(/* 読み込まれたコンポーネント */)
  })
})
// AsyncComp を通常のコンポーネントと同じように使用する
```

### 動的インポートの使用
ESモジュールの動的インポートを使って、非同期コンポーネントを簡単に定義できます。
Vite や webpack などのバンドラーがサポートしているため、Vue SFC（Single File Component）もインポートできます。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

これにより、`AsyncComp` はページ上で実際にレンダリングされる際にコンポーネントを読み込みます。
### グローバル登録
非同期コンポーネントは、通常のコンポーネントと同様に `app.component()` を使ってグローバルに登録できます。

```js
import { createApp } from 'vue'
import { defineAsyncComponent } from 'vue'

const app = createApp({})

app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

また、親コンポーネント内で直接定義することも可能です。

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```
### ローディングとエラーの状態
非同期コンポーネントの読み込みには時間がかかることがあるため、ローディングやエラーの状態をハンドリングするためのオプションがあります。

```js
import { defineAsyncComponent } from 'vue'
import LoadingComponent from './LoadingComponent.vue'
import ErrorComponent from './ErrorComponent.vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Foo.vue'),
  loadingComponent: LoadingComponent,
  delay: 200, // ローディングコンポーネント表示前の遅延（ミリ秒）
  errorComponent: ErrorComponent,
  timeout: 3000 // エラーコンポーネント表示までのタイムアウト（ミリ秒）
})
```

- **`loadingComponent`**: コンポーネントの読み込み中に表示されるコンポーネントです。
- **`delay`**: ローディングコンポーネントが表示されるまでの遅延時間です。デフォルトは200msで、高速ネットワークでのちらつきを防ぐためです。
- **`errorComponent`**: ローダー関数が失敗したときに表示されるコンポーネントです。
- **`timeout`**: 指定された時間を超えるとエラーコンポーネントが表示されます。デフォルトは `Infinity` です。

#### `Suspense` との組み合わせ

非同期コンポーネントは、ビルトインコンポーネント `<Suspense>` と組み合わせて使用することができます。これにより、非同期コンポーネントが読み込まれるまでの間、ローディング状態を表示するなどの制御が可能です。詳細は Vue の `<Suspense>` ドキュメントを参照してください。