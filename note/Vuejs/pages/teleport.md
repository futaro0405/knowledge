# Teleport
`<Teleport>`は、Vue.jsの組み込みコンポーネントで、あるコンポーネントのテンプレートの一部を、そのコンポーネントのDOM階層の外にある別のDOMノードに「テレポート」するために使います。
## 基本的な使い方
時々、次のようなシナリオに遭遇することがあります。
論理的にはコンポーネントのテンプレートの一部であるが、視覚的にはVueアプリケーション外のDOMのどこかに表示されるべきものがあります。

もっとも一般的な例は、フルスクリーンのモーダルを構築するときです。
理想的には、モーダルのボタンとモーダル自体を同じコンポーネントに収めたいものです。
これらは両方ともモーダルの開閉状態に関連しているからです。
しかし、これではモーダルがボタンと一緒にレンダリングされ、アプリケーションのDOM階層に深くネストされることになります。
これによりCSSでモーダルを配置する際に、いくつかの厄介な問題を引き起こす可能性があります。
### 例
次のようなHTML構造を考えてみましょう：

```html
<template>
  <div class="outer">
    <h3>Vue Teleport Example</h3>
    <div>
      <MyModal />
    </div>
  </div>
</template>
```

そして、以下が `<MyModal>` の実装です：

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

このコンポーネントには、モーダルを開くためのトリガーとなる`<button>`と、モーダルのコンテンツとセルフクローズするためのボタンを含む`.modal`クラスの`<div>`が含まれています。
このコンポーネントを初期のHTML構造の中で使う場合、いくつかの問題が生じる可能性があります：

1. `position: fixed`は、祖先の要素に`transform`、`perspective`、`filter`プロパティが設定されていない場合、ビューポートに対して相対的に要素を配置するだけです。例えば、祖先である`<div class="outer">`をCSS`transform`でアニメーションさせようとすると、モーダルレイアウトが崩れてしまいます。
2. モーダルの`z-index`は、それを含む要素によって制約されます。もし`<div class="outer">`と重なった、より高い`z-index`の値が設定された別の要素があれば、モーダルコンポーネントを覆ってしまうかもしれません。

`<Teleport>`は、ネストされたDOM構造から抜け出せるようにすることで、これらの問題を回避するクリーンな方法を提供します。
それでは、`<MyModal>`を修正して、`<Teleport>`を使用するようにしてみましょう：

```vue
<template>
  <button @click="open = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```

`<Teleport>`の`to`ターゲットには、CSSセレクター文字列か、存在するDOMノードが必要です。
ここでは、Vueに「このテンプレートフラグメントをテレポートして、`body`タグに転送する」ように指示しています。

### 注意点
- `<Teleport>`の`to`ターゲットは、`<Teleport>`コンポーネントがマウントされたときに、すでにDOMに存在している必要があります。
- 理想的には、Vueアプリケーション全体の外側にある要素であるべきです。
- Vueでレンダリングされる別の要素をターゲットにする場合は、その要素が`<Teleport>`の前にマウントされていることを確認する必要があります。

## コンポーネントでの使用
`<Teleport>`を使うと、DOMの構造を変えて特定の要素を別の場所に移動させることができますが、それによってコンポーネントの論理的な階層構造は変わりません。
### ポイント
#### 論理的な階層構造
`<Teleport>`があるコンポーネントは、依然としてその親コンポーネントの論理的な子要素です。
つまり、プロパティの受け渡しやイベントの発行は、通常通り動作します。
#### Vue Devtools
コンポーネントが実際にレンダリングされる場所ではなく、論理的な親子関係に基づいて表示されます。

具体的には、`<Teleport>`を使っても以下の点は変わりません：
- **プロパティの受け渡し**: 親コンポーネントから子コンポーネントへのプロパティの受け渡しは、通常通り行われます。
- **イベントの発行**: 子コンポーネントが親コンポーネントに対してイベントを発行する動作も変わりません。
- **依存性の注入**: 親コンポーネントから子コンポーネントへの依存性の注入（provide/injectパターン）も期待通りに動作します。

このように、`<Teleport>`を使用することでDOMの構造を変えることができますが、Vueのコンポーネントシステムの基本的な動作には影響を与えないことが特徴です。
## Teleport を無効化する
条件によって`<Teleport>`を無効にしたい場合があります。
例えば、デスクトップではオーバーレイとしてコンポーネントをレンダリングし、モバイルではインラインでレンダリングしたい場合です。
こういった場合、`<Teleport>`には`disabled`プロパティがあり、これを動的にトグルすることができます。
### 使い方
以下のように、`<Teleport>`の`disabled`プロパティを使用して、特定の条件に基づいて`<Teleport>`を無効化することができます：

```vue
<template>
  <Teleport :disabled="isMobile">
    ...
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const isMobile = ref(false)

// メディアクエリの変更を検知して isMobile を更新する
const updateIsMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 768px)").matches
}

// 初期状態の設定
updateIsMobile()

// ウィンドウのリサイズイベントを監視して動的に更新
window.addEventListener('resize', updateIsMobile)
</script>
```
### 説明
- **`<Teleport :disabled="isMobile">`**: `isMobile`が`true`の場合、`<Teleport>`は無効化され、子要素は親コンポーネントの位置にそのままレンダリングされます。`isMobile`が`false`の場合、通常通り`<Teleport>`が動作し、指定されたターゲットに子要素を移動させます。
- **`isMobile`**: モバイルデバイスかどうかを判定するためのフラグ。ここではメディアクエリを使って、ウィンドウの幅が768ピクセル以下の場合に`true`になります。
- **`updateIsMobile`関数**: メディアクエリの結果に基づいて`isMobile`を更新する関数です。
- **`window.addEventListener('resize', updateIsMobile)`**: ウィンドウのリサイズイベントを監視して、`isMobile`を動的に更新します。

これにより、デバイスの種類に応じて`<Teleport>`の有効・無効を切り替えることができます。

## 同じターゲットに複数の Teleport
複数の`<Teleport>`コンポーネントが同じターゲット要素にコンテンツをマウントすることができます。
これは、再利用可能な`<Modal>`コンポーネントの複数のインスタンスが同時にアクティブになるような場合に便利です。
### 使い方の例
以下のように、複数の`<Teleport>`コンポーネントを同じターゲット要素にマウントすることができます：
```vue
<template>
  <Teleport to="#modals">
    <div>A</div>
  </Teleport>
  <Teleport to="#modals">
    <div>B</div>
  </Teleport>
</template>
```
### レンダリング結果
このコードのレンダリング結果は次のようになります：

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```
### 説明
- **ターゲット要素**: `<Teleport>`の`to`属性により、コンテンツが移動するターゲット要素を指定します。ここでは、ターゲット要素として`id="modals"`を持つ要素を指定しています。
- **順番**: 複数の`<Teleport>`コンポーネントが同じターゲット要素にマウントされる場合、順番は単純に追加される順番です。つまり、先にマウントされたものの後に配置されます。
これにより、複数のモーダルや他の要素を一箇所にまとめて表示することができ、管理が容易になります。
