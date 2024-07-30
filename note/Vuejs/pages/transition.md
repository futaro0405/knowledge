# トランジション
Vue には、状態の変化に応じてトランジションやアニメーションを扱うのに役立つ2つの組み込みコンポーネントがあります
## `<Transition>`
要素やコンポーネントが DOM に挿入（enter）、削除（leave）されるときにアニメーションを適用するためのコンポーネントです。
## `<TransitionGroup>`
要素やコンポーネントが `v-for` で作成されたリストに追加（inserted）、削除（removed）、移動（moved）されるときにアニメーションを適用するためのコンポーネントです。

これらのコンポーネント以外にも、Vue では他のテクニックを使ってアニメーションを適用することができます。
例えば、CSS クラスをトグルする方法や、スタイルバインディングによるステートドリブンアニメーションなどです。
### `<Transition>` コンポーネント
`<Transition>` は、組み込みコンポーネントの一つで、任意のコンポーネントのテンプレート内で登録なしに使用できます。
このコンポーネントは、デフォルトのスロットで渡された要素やコンポーネントにアニメーションを適用します。
`enter` と `leave` のアニメーションは、次の状況でトリガーされます：
- `v-if` による条件付きレンダリング
- `v-show` による条件付き表示
- `<component>` による動的コンポーネントの切り替え
- 特別な `key` 属性の変更

以下は、`<Transition>` の最も一般的な使い方の例です：
```vue
<template>
  <button @click="show = !show">Toggle</button>
  <Transition>
    <p v-if="show">hello</p>
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>

<style>
/* これらのクラスが何をするかは後ほど説明します! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
```

この例では、ボタンをクリックすることで `show` データプロパティの値がトグルされ、`<Transition>` コンポーネント内の `<p>` 要素が表示されたり非表示になったりします。

トランジションの間、以下のクラスが要素に適用されます：
- `.v-enter-active` と `.v-leave-active`: トランジション中に適用されるクラス
- `.v-enter-from` と `.v-leave-to`: トランジションの開始時と終了時に適用されるクラス
## Vueのトランジションメカニズム
Vueは、対象の要素にCSSのトランジションやアニメーションが適用されているかを自動的に判別します。
それらが適用されている場合、適切なタイミングでCSSトランジションクラスが追加／削除されます。

JavaScriptフックのリスナーが存在する場合、それらのフックが適切なタイミングで呼び出されます。

CSSによるトランジション／アニメーションが検出されず、JavaScriptのフックも提供されない場合、ブラウザーの次のアニメーションフレームで挿入・削除のためのDOM操作が実行されます。

これにより、アプリケーションの状態の変化に対してスムーズで視覚的なトランジションを提供できます。

## CSS でのトランジション
Vue.js では、状態の変化に伴うアニメーションを簡単に実装できるように、いくつかの組み込みのトランジションクラスが提供されています。
以下は、要素の `enter` と `leave` トランジションに使用される6つのクラスです。
### トランジションクラス
#### v-enter-from
`enter` の開始状態を表すクラス。
要素が挿入される前に適用され、要素が挿入された1フレーム後に削除されます。
#### v-enter-active
`enter` のアクティブ状態を表すクラス。
`enter` のすべてのフェーズで適用され、要素が挿入される前に追加され、トランジション／アニメーションが終了した時に削除されます。
このクラスで、`enter` トランジションの持続時間、遅延、イージング関数を設定できます。
#### v-enter-to
`enter` の終了状態を表すクラス。
要素が挿入された1フレーム後に追加され、トランジション／アニメーションが終了した時に削除されます。
#### v-leave-from
`leave` の開始状態を表すクラス。
`leave` トランジションが発生するとすぐに追加され、1フレーム後に削除されます。
#### v-leave-active
`leave` のアクティブ状態を表すクラス。
`leave` のすべてのフェーズで適用され、`leave` トランジションが発生するとすぐに追加され、トランジション／アニメーションが終了した時に削除されます。
このクラスで、`leave` トランジションの持続時間、遅延、イージング関数を設定できます。
#### v-leave-to
`leave` の終了状態を表すクラス。
`leave` トランジションが発生した1フレーム後に追加され、トランジション／アニメーションが終了した時に削除されます。
### 名前付きトランジション
`<Transition>` コンポーネントに `name` プロパティを指定することで、トランジションに名前を付けることができます。
これにより、デフォルトの `v-` の代わりに名前がプレフィックスとして使用されます。
例えば、`name="fade"` を設定した場合、クラスは `fade-enter-active` などになります。

```vue
<template>
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```
### CSS トランジション
CSS の `transition` プロパティを使用すると、複数のプロパティに対してアニメーションを設定できます。
また、`enter` と `leave` のトランジションに異なる持続時間やイージング関数を設定することもできます。

```vue
<template>
  <Transition name="slide-fade">
    <p v-if="show">Hello</p>
  </Transition>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```
### CSS アニメーション
CSS アニメーションを使用する場合、`*-enter-from` クラスは要素が挿入された直後に削除されず、`animationend` イベント時に削除されます。

```vue
<template>
  <Transition name="bounce">
    <p v-if="show" style="text-align: center;">Hello here is some bouncy text!</p>
  </Transition>
</template>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>

```
### カスタムトランジションクラス
`<Transition>` コンポーネントには、カスタムのトランジションクラスを指定するためのプロパティが用意されています。
これにより、既存のCSSアニメーションライブラリと組み合わせて使用することができます。

```vue
<template>
  <Transition
    enter-active-class="animate__animated animate__tada"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <p v-if="show">Hello</p>
  </Transition>
</template>
```
### トランジションとアニメーションの併用
`<Transition>` コンポーネントで `type` プロパティを使用して、`animation` または `transition` のどちらを使用するかを明示的に指定できます。
これは、同じ要素にトランジションとアニメーションの両方を適用する場合に便利です。

```vue
<template>
  <Transition type="animation">...</Transition>
</template>
```
### ネストされたトランジションと明示的なトランジション期間の設定
ネストされた要素にもトランジションを適用する場合、ネストされた要素に対してもクラスを設定できます。
また、トランジションの持続時間を明示的に設定することで、すべてのトランジションが終了するまで待つことができます。

```vue
<template>
  <Transition name="nested" :duration="550">
    <div v-if="show" class="outer">
      <div class="inner">Hello</div>
    </div>
  </Transition>
</template>

<style>
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

.nested-enter-active .inner {
  transition-delay: 0.25s;
}
</style>

```

### パフォーマンスに関する考慮事項
`transform` や `opacity` などのプロパティは、アニメーションに使用する際に効率的です。
これらのプロパティはドキュメントのレイアウトに影響を与えないため、コストのかかるCSSレイアウトの再計算を引き起こしません。
また、これらのプロパティはGPUハードウェアアクセラレーションを利用できるため、スムーズなアニメーションが実現できます。

## JavaScript フック
`<Transition>`コンポーネントは、要素の表示/非表示の際にトランジションを適用するための強力なツールです。
これを使用して、JavaScriptフックを利用してカスタムアニメーションや処理を追加できます。
以下に、各イベントフックの役割と使い方を示します。
### HTML部分
```html
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
    <!-- トランジションの対象要素 -->
    <div v-if="show">トランジションする要素</div>
  </Transition>
</template>
```
### JavaScript部分
```javascript
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    onBeforeEnter(el) {
      // 要素がDOMに挿入される前に呼ばれる
      // enter-from状態を設定するために使用する
      console.log('before enter');
    },
    onEnter(el, done) {
      // 要素がDOMに挿入された次のフレームで呼ばれる
      // アニメーションの開始時に使用する
      console.log('enter');
      done(); // トランジションの終了を示すために呼ぶ
    },
    onAfterEnter(el) {
      // enterトランジションが完了したときに呼ばれる
      console.log('after enter');
    },
    onEnterCancelled(el) {
      // enterトランジションが完了する前にキャンセルされたときに呼ばれる
      console.log('enter cancelled');
    },
    onBeforeLeave(el) {
      // leaveフックの前に呼ばれる
      console.log('before leave');
    },
    onLeave(el, done) {
      // leaveトランジションの開始時に呼ばれる
      console.log('leave');
      done(); // トランジションの終了を示すために呼ぶ
    },
    onAfterLeave(el) {
      // leaveトランジションが完了し、要素がDOMから取り除かれたときに呼ばれる
      console.log('after leave');
    },
    onLeaveCancelled(el) {
      // v-showトランジションでのみ有効。キャンセルされたときに呼ばれる
      console.log('leave cancelled');
    }
  }
};
```
### `:css="false"` の使用
JavaScriptのみでトランジションをコントロールする場合は、`:css="false"`を設定することで、VueにCSSトランジションの検出をスキップするよう指示できます。
これにより、誤ったCSSトランジションへの干渉を防ぎ、パフォーマンスが若干向上することがあります。

```html
<template>
  <Transition @enter="onEnter" :css="false">
    <div v-if="show">トランジションする要素</div>
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    onEnter(el, done) {
      // カスタムトランジションロジック
      // doneコールバックを呼び出してトランジションの終了を示す
      done();
    }
  }
};
</script>

```
### アニメーションライブラリの利用

GSAPやAnime.js、Motion Oneなどのアニメーションライブラリを使用して、よりリッチなアニメーションを実装することも可能です。これらのライブラリを使用する場合でも、`done`コールバックを適切なタイミングで呼び出して、トランジションが完了したことをVueに通知する必要があります。

これらのフックや設定を使用することで、Vue.jsアプリケーションでカスタマイズされたトランジションとアニメーションを作成し、ユーザーエクスペリエンスを向上させることができます。
## トランジションの再利用
トランジションは再利用可能なコンポーネントとしてラップすることができます。
例えば、以下のようにしてトランジションのロジックをコンポーネント化し、他の部分で簡単に再利用することができます。

```vue
<!-- MyTransition.vue -->
<template>
  <Transition @enter="onEnter" @leave="onLeave">
    <slot></slot>
  </Transition>
</template>

<script>
export default {
  methods: {
    onEnter(el, done) {
      // カスタムエンタートランジションロジック
      done();
    },
    onLeave(el, done) {
      // カスタムリーブトランジションロジック
      done();
    }
  }
};
</script>
```

この`MyTransition`コンポーネントを使うことで、他のコンポーネントで同じトランジションを簡単に適用できます。

これらのフックを駆使することで、トランジションやアニメーションを細かく制御し、よりリッチなユーザー体験を提供することができます。