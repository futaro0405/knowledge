# コンポーネント
Vue.jsのコンポーネントは、UIを独立した再利用可能なパーツに分割するための仕組みです。
これにより、各部分を個別に考えて開発することができます。
通常、アプリケーションはコンポーネントがネストされたツリー構造を持っています。
これはHTMLの要素をネストする方法に似ていますが、Vue.jsでは独自のコンポーネントモデルを使用し、カスタムのコンテンツやロジックをカプセル化できます。
また、VueコンポーネントはネイティブのWebコンポーネントとも連携可能です。
## コンポーネントの定義

### 単一ファイルコンポーネント（SFC）

ビルドステップを使用する場合、Vueコンポーネントは通常、`.vue`拡張子のファイルとして定義します。これを単一ファイルコンポーネント（Single File Component, SFC）と呼びます。

例:

vue

コードをコピーする

`<script setup> import { ref } from 'vue'  const count = ref(0) </script>  <template>   <button @click="count++">You clicked me {{ count }} times.</button> </template>`

この例では、`<script setup>`ブロック内で状態を管理し、`<template>`ブロックでUIを定義しています。ボタンをクリックすると、`count`の値が増加します。

#### JavaScriptオブジェクトによるコンポーネント定義

ビルドステップを使用しない場合、VueコンポーネントはプレーンなJavaScriptオブジェクトとして定義できます。このオブジェクトにはVue特有のオプションが含まれています。

例:

javascript

コードをコピーする

``import { ref } from 'vue'  export default {   setup() {     const count = ref(0)     return { count }   },   template: `     <button @click="count++">       You clicked me {{ count }} times.     </button>` }``

ここでは、テンプレートがJavaScriptの文字列としてインライン化されています。Vueはこれをその場でコンパイルしてレンダリングします。また、HTMLの`<template>`要素を使用して、IDセレクターで指定することも可能です。

#### 複数のコンポーネントのエクスポート

一つのファイルから複数のコンポーネントをエクスポートすることもできます。通常はデフォルトエクスポートを使用しますが、名前付きエクスポートを使えば、同じファイル内に複数のコンポーネントを定義できます。

このように、Vue.jsのコンポーネントはUIの構築をシンプルでモジュール化された方法で行うための基本的な構成要素です。