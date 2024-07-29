## コンポーネントのイベント
Vueのコンポーネントは、カスタムイベントを発行し、それに応じてアクションを実行することができます。
これは、親コンポーネントが子コンポーネントからのイベントを受け取って処理するための主要な手段です。
### イベントの発行
コンポーネント内でイベントを発行するには、組み込みの `$emit` メソッドを使用します。
例えば、ボタンがクリックされたときにイベントを発行する場合、次のように記述します。
```vue
<!-- MyComponent.vue -->
<template>
  <button @click="$emit('some-event')">Click Me</button>
</template>
```
### イベントの購読
親コンポーネントは、子コンポーネントのカスタムイベントを `v-on` ディレクティブ（または `@` の省略形）を使ってリスン（購読）できます。
```vue
<!-- ParentComponent.vue -->
<template>
  <MyComponent @some-event="handleEvent" />
</template>

<script>
export default {
  methods: {
    handleEvent() {
      console.log('Event received!');
    }
  }
}
</script>
```

この例では、`MyComponent` が `some-event` イベントを発行すると、親コンポーネントの `handleEvent` メソッドが呼び出されます。
### 一度だけイベントをリスンする: `.once` 修飾子
イベントリスナーに `.once` 修飾子を付けると、イベントが一度だけリスンされ、その後自動的に削除されます。

```vue
<MyComponent @some-event.once="handleEvent" />
```
### イベント名の大文字・小文字の使い分け
イベント名も、自動的に大文字・小文字が変換されます。
例えば、キャメルケースで定義されたイベント名は、ケバブケースでリスンできます。
以下のように記述するのが一般的です。
```vue
<!-- 子コンポーネント -->
<button @click="$emit('myEvent')">Click Me</button>

<!-- 親コンポーネント -->
<MyComponent @my-event="handleEvent" />
```
### イベントのバブリング
ネイティブのDOMイベントとは異なり、コンポーネントのカスタムイベントはバブリングしません。
つまり、子コンポーネントから発行されたイベントは、その親コンポーネントでしかキャッチできません。
兄弟コンポーネントや深くネストしたコンポーネント間でデータを共有する場合は、外部のイベントバスやVuexなどのグローバルな状態管理ツールを使用することを検討してください。

イベントのバブリングがないため、イベントの伝播を明示的に制御したい場合には、イベントバスのような仕組みを使うか、親コンポーネントでイベントを受け取ってから再度発行する形でデータの伝達を行います。

## イベントの引数
イベントに特定の値を渡すと便利な場合があります。
例えば、`<BlogPost>`コンポーネントに、テキストの拡大量を決定させたい場合を考えてみましょう。
このような場合、`$emit`に追加の引数を渡して値を提供できます。
### 例1: インラインのアロー関数を使った方法
```html
<template>
  <button @click="$emit('increaseBy', 1)">
    Increase by 1
  </button>
</template>
```

このようにしてボタンをクリックすると、`increaseBy`イベントが発生し、その際に引数として`1`が渡されます。

次に、親コンポーネントでこのイベントを購読する際、インラインのアロー関数を使ってイベントの引数にアクセスできます。
```vue
<template>
  <MyButton @increase-by="(n) => count += n" />
</template>
```
### 例2: メソッドを使った方法
また、イベントハンドラーがメソッドの場合は以下のように書けます。
```vue
<template>
  <MyButton @increase-by="increaseCount" />
</template>
```

この場合、その値はメソッドの最初のパラメーターとして渡されます。
```js
function increaseCount(n) {
  count.value += n;
}
```
### TIP
`$emit()`に渡されたイベント名の後にあるすべての追加の引数は、リスナーにそのまま転送されます。
たとえば、`$emit('foo', 1, 2, 3)`とすると、リスナー関数は3つの引数を受け取ります。

## 発行するイベントの宣言
`defineEmits()`マクロを使うと、コンポーネントが発行するイベントを明示的に宣言できます。
### 例1: `defineEmits()`の使用
```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```
`<template>`で使用する`$emit`メソッドは、`<script setup>`セクション内では直接アクセスできません。
しかし、`defineEmits()`は同等の関数を返すので、それを使用します。
```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

`defineEmits()`マクロは関数内では使用できないので、`<script setup>`内に直接記述する必要があります。
### 例2: 明示的な`setup`関数の使用
`<script setup>`の代わりに、明示的な`setup`関数を使う場合は、イベントは`emits`オプションで宣言し、`emit`関数は`setup()`コンテキストで公開されます。
```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```
`setup()`コンテキストの他のプロパティと同様に、`emit`は安全に分割代入できます。
```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```
### オブジェクト構文のサポートとTypeScriptの使用
`emits`オプションと`defineEmits()`マクロはオブジェクト構文もサポートしています。
TypeScriptを使用する場合は、引数の型付けができ、発行されるイベントのペイロードのランタイムバリデーションを実行できます。
```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // バリデーションの合否を示すために
    // `true` または `false` を返す
  }
})
</script>
```
TypeScriptを使用している場合、純粋な型アノテーションを使って発行するイベントを宣言することもできます。
```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```
### 詳細: コンポーネントのemitの型付け
コンポーネントがどのように動作するべきかを明確にするために、発行されるすべてのイベントを定義することが推奨されます。
これにより、Vueは既知のリスナーをフォールスルー属性から除外し、サードパーティのコードによって手動でディスパッチされたDOMイベントによるエッジケースを回避できます。
#### TIP
ネイティブイベント（例: `click`）が`emits`オプションに定義されている場合、リスナーはコンポーネントが発行する`click`イベントのみを購読し、ネイティブの`click`イベントには反応しなくなります。
## イベントのバリデーション
発行するイベントは、`props`の型バリデーションと同様に、オブジェクト構文で定義する場合にバリデーションを行えます。
バリデーションを追加するには、"emitの呼び出しに渡された引数"を受け取り、"イベントが正当かどうかを示す真偽値"を返す関数をイベントに割り当てます。
### 例: イベントのバリデーションの追加

```vue
<script setup>
const emit = defineEmits({
  // バリデーションなし
  click: null,

  // submitイベントのバリデーション
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

この例では、`submit`イベントのバリデーションを設定しています。
`submit`イベントが発行されるとき、引数として`email`と`password`が渡されます。
これらの引数が両方とも存在する場合にのみ、バリデーションが通り、`true`を返します。
そうでない場合は警告メッセージが表示され、`false`を返します。
### 詳細な説明
#### イベントの宣言
```js
const emit = defineEmits({
  click: null,
  submit: ({ email, password }) => {
    if (email && password) {
      return true;
    } else {
      console.warn('Invalid submit event payload!');
      return false;
    }
  }
});
```

    
    
    コードをコピーする
    
    `const emit = defineEmits({   click: null,   submit: ({ email, password }) => {     if (email && password) {       return true;     } else {       console.warn('Invalid submit event payload!');       return false;     }   } });`
    
    - `click`イベントにはバリデーションがありません。
    - `submit`イベントには、`email`と`password`が存在するかどうかをチェックするバリデーション関数が定義されています。
2. **イベントの発行**:
    
    vue
    
    コードをコピーする
    
    `function submitForm(email, password) {   emit('submit', { email, password }); }`
    
    - この関数は、`submit`イベントを発行し、引数として`email`と`password`を渡します。バリデーション関数が呼び出され、引数が正当であるかどうかをチェックします。

### 注意点

- **バリデーション関数**は、`true`または`false`を返す必要があります。`true`を返すとイベントが発行され、`false`を返すと発行されません。
- イベントが正当でない場合、警告メッセージを表示するなど、適切な処理を行うことが推奨されます。

このようにして、イベントの引数が正しいかどうかをチェックすることで、コンポーネントの信頼性と安全性を高めることができます。