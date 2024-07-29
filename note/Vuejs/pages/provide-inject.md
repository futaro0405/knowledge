# Provide / Inject
`provide` と `inject` は、親コンポーネントから深くネストされた子コンポーネントまでデータを渡すための仕組みです。
これにより、props の「バケツリレー」問題を解決できます。
通常、データは props を使って親から子へ渡されますが、複数の中間コンポーネントがデータを使用しない場合でも、すべての中間コンポーネントに props を渡す必要があります。
この状況を "props のバケツリレー" と呼びます。

#### `provide` と `inject` の基本構造

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

vue

コードをコピーする

`<template>   <div :style="{ color: themeColor }">     Hello, {{ userName }}!   </div> </template>  <script> export default {   inject: ['themeColor', 'userName'] } </script>`

この例では、親コンポーネントで `themeColor` と `userName` を `provide` しています。これらのデータは中間コンポーネントを通さずに直接 `DeepChild` コンポーネントで `inject` されています。

### `provide` / `inject` の活用例

`provide` と `inject` は、特に以下のようなケースで有用です。

1. **グローバル設定**: テーマカラー、ユーザー設定、国際化データなど、アプリケーション全体で共有する必要がある設定を提供できます。
2. **依存関係の注入**: サービスやユーティリティ関数などのオブジェクトを提供し、コンポーネント内でこれらを利用することができます。
3. **コンポーネント間の通信**: 複数のコンポーネント間で共有する必要があるデータを、props やイベントを使用せずに渡すことができます。

### 注意点

- `provide` で提供されたデータはリアクティブではありません。提供するデータをリアクティブにする場合、`reactive` または `ref` を使用してデータを包む必要があります。
- `provide` と `inject` は親子関係のあるコンポーネント間でのみ機能します。提供されたデータはツリー内の兄弟コンポーネント間では共有されません。

これにより、`provide` と `inject` を使用することで、コンポーネントツリー内の深い場所でデータを簡単に共有し、管理することができます。