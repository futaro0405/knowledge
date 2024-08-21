# トランジショングループ
`<TransitionGroup>` は、リスト内の要素の追加、削除、または順序変更時にアニメーションを適用するための組み込みコンポーネントです。
これにより、リスト操作に対する視覚的なフィードバックをユーザーに提供できます。
`<TransitionGroup>` は、`<Transition>` コンポーネントと多くの点で似ていますが、いくつかの重要な違いがあります。
## `<Transition>` との違い
### ラッパー要素の指定
`<Transition>` では、自動的にラップされる要素はありませんが、`<TransitionGroup>` ではラッパー要素が必要です。
`tag` プロップを使用して、ラップする要素のタグ名を指定します。
### トランジションモード
`<Transition>` のトランジションモード（`in-out` や `out-in`）は、排他的な要素同士を交互にトランジションさせるためのものでしたが、`<TransitionGroup>` では利用できません。
### ユニークなキーの必要性
 `<TransitionGroup>` 内の各子要素は、常にユニークな `key` 属性を持つ必要があります。
 これにより、Vueがどの要素が追加、削除、または再順序されるべきかを識別できるようになります。
### CSS トランジションクラスの適用
CSS トランジションクラスは、グループやコンテナ全体ではなく、リスト内の各要素に適用されます。
### 使用例
以下は、`<TransitionGroup>` を使用した簡単な例です。
この例では、リスト内のアイテムが追加、削除されるときにフェードイン/フェードアウトのアニメーションを適用しています。
```vue
<template>
  <div>
    <button @click="addItem">アイテム追加</button>
    <button @click="removeItem">アイテム削除</button>

    <transition-group tag="ul" name="fade">
      <li v-for="item in items" :key="item.id">{{ item.text }}</li>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, text: 'アイテム 1' },
        { id: 2, text: 'アイテム 2' },
        { id: 3, text: 'アイテム 3' }
      ]
    };
  },
  methods: {
    addItem() {
      const nextId = this.items.length + 1;
      this.items.push({ id: nextId, text: `アイテム ${nextId}` });
    },
    removeItem() {
      this.items.pop();
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
```
### 注意点
- **DOM 内テンプレートでの使用**: `<TransitionGroup>` を DOM 内テンプレートで使用する場合は、`<transition-group>` として参照する必要があります。これは、Vue が HTML 内のタグを小文字に変換するためです。

`<TransitionGroup>` を使用すると、リストの操作に対してユーザーに自然な視覚フィードバックを提供し、ユーザーエクスペリエンスを向上させることができます。
## Enter / Leave トランジション
以下は `<TransitionGroup>` を用いて、`v-for` リストに enter / leave トランジションを適用する例です:

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

## 移動のトランジション
上のデモには明らかな欠陥があります。
項目を挿入または削除すると、上下の項目がスムーズに移動するのではなく、即座に "ジャンプ" して移動します。
これを解決するには、いくつかの CSS ルールを追加します:

```css
.list-move, /* 移動する要素にトランジションを適用 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* leave する項目をレイアウトフローから外すことで
   アニメーションが正しく計算されるようになる */
.list-leave-active {
  position: absolute;
}
```

## 時差をもたせたリストのトランジション
JavaScript のトランジションとデータ属性でやりとりすることで、リスト内のトランジションをずらすこともできます。
まず、項目のインデックスを DOM 要素の data 属性としてレンダリングします:

```vue
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

そして、JavaScript のフックで、data 属性に応じた遅延を持たせて要素をアニメーションさせます。
この例では、GSAP ライブラリーを使ってアニメーションを行います:

```js
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```
