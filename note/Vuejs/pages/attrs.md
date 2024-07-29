# フォールスルー属性
## 属性の継承
__フォールスルー属性__ とは、コンポーネントに渡されたが、そのコンポーネントの`props`や`emits`で宣言されていない属性や`v-on`イベントリスナーのことです。
例としては、`class`、`style`、`id`属性などがあります。

コンポーネントが単一のルート要素をレンダリングする時、フォールスルー属性は自動的にルート要素の属性に追加されます。

```vue
<!-- MyButton.vue -->
<template>
  <button>Click Me</button>
</template>
```

親コンポーネントでこのコンポーネントを使うと、以下のようになります。

```vue
<!-- Parent.vue -->
<template>
  <MyButton class="large" />
</template>
```

最終的なDOMは以下のようにレンダリングされます。

```html
<button class="large">Click Me</button>
```

この場合、`MyButton`は`class`を受け入れる`props`を宣言していません。
そのため、`class`はフォールスルー属性として扱われ、自動的に`<button>`要素に追加されます。

### `class`と`style`のマージ
もし、子コンポーネントのルート要素にすでに`class`や`style`属性がある場合、それらの属性は親から継承された`class`や`style`の値とマージされます。

```vue
<!-- MyButton.vue -->
<template>
  <button class="btn">Click Me</button>
</template>
```

すると、最終的なDOMは以下のようになります。

```html
<button class="btn large">Click Me</button>
```
### `v-on`リスナーの継承

同じルールが`v-on`イベントリスナーにも適用されます。

```vue
<!-- Parent.vue -->
<template>
  <MyButton @click="onClick" />
</template>
```

`click`リスナーは`MyButton`のルート要素である`<button>`要素に追加されます。
`<button>`がクリックされた時、親コンポーネントの`onClick`メソッドがトリガーされます。
もし`<button>`がすでに`v-on`でバインドされた`click`リスナーを持っている場合、両方のリスナーがトリガーされます。

#### ネストされたコンポーネントの継承

あるコンポーネントが他の1つのコンポーネントをルートノードとしてレンダリングする場合、そのコンポーネントが受け取ったフォールスルー属性は自動的にその子コンポーネントに転送されます。

```vue
<!-- MyButton.vue -->
<template>
  <BaseButton />
</template>
```
#### 属性の継承の無効化

コンポーネントに自動的な属性の継承をさせたくない場合は、`inheritAttrs: false`を設定できます。

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// セットアップのロジック
</script>
```

属性の継承を無効にする場合、テンプレート内で`$attrs`として直接アクセスできます。

```vue
<template>
  <span>Fallthrough attributes: {{ $attrs }}</span>
</template>
```

`$attrs`オブジェクトには、コンポーネントの`props`や`emits`オプションで宣言されていないすべての属性が含まれます。

```vue
<template>
  <div class="btn-wrapper">
    <button class="btn" v-bind="$attrs">Click Me</button>
  </div>
</template>
```

#### 複数のルートノードでの属性継承

複数のルートノードを持つコンポーネントは、自動的に属性をフォールスルーする動作がありません。`$attrs`が明示的にバインドされていない場合、警告が出ます。

```vue
<!-- CustomLayout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```
#### JavaScript内でフォールスルー属性にアクセスする
必要に応じて、`<script setup>`内で`useAttrs()` APIを使用してフォールスルー属性にアクセスできます。

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

もし`<script setup>`を使用していない場合、`attrs`は`setup()`コンテキストのプロパティとして公開されます。

```js
export default {
  setup(props, ctx) {
    // フォールスルー属性が ctx.attrs として公開される
    console.log(ctx.attrs)
  }
}
```

`attrs`オブジェクトは常に最新のフォールスルー属性を反映していますが、リアクティブではありません。
リアクティビティが必要な場合は、`props`を使ってください。
または、`onUpdated()`を使用して、更新されるたびに最新の`attrs`による副作用を実行することもできます。
