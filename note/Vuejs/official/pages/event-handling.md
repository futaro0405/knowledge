# イベントハンドリング
## イベントの購読
`v-on`ディレクティブを使用して、DOMイベントに対して何かしらのアクションを実行します。
これは`@`で省略できます。
例えば、`v-on:click="handler"`は`@click="handler"`としても書けます。

ハンドラーには次の2つのタイプがあります。
1. **インラインハンドラー**: クリックなどのイベントが発生したときに実行されるJavaScript式。これはHTMLの`onclick`属性に似ています。
2. **メソッドハンドラー**: コンポーネント内に定義されたメソッド名を使います。
### インラインハンドラー
インラインハンドラーは簡単な処理に使われます。

```js
const count = ref(0)
```

```vue
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

上記の例では、ボタンをクリックすると`count`の値が1増えます。
### メソッドハンドラー
メソッドハンドラーは、より複雑なロジックを持つイベントに使用されます。

```vue
<script setup>
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  if (event) {
    alert(event.target.tagName)
  }
}
</script>

<template>
  <button @click="greet">Greet</button>
</template>
```

この例では、ボタンをクリックすると`greet`メソッドが呼ばれ、アラートが表示されます。
### メソッド vs インラインハンドラーの識別
テンプレートコンパイラは、文字列がJavaScriptの識別子かどうかをチェックし、それがメソッドハンドラーかインラインハンドラーかを決定します。
例えば、`foo`や`foo.bar`はメソッドハンドラーとして扱われ、`foo()`や`count++`はインラインハンドラーとして扱われます。

### インラインハンドラーでメソッドを呼び出す
メソッドをインラインハンドラー内で呼び出すこともできます。

```vue
<script setup>
function say(message) {
	alert(message)
} 
</script>
<template>
	<button @click="say('hello')">Say hello</button>
	<button @click="say('bye')">Say bye</button>
</template>
```

この場合、`say`メソッドにカスタムの引数を渡せます。
### インラインハンドラーでイベント引数にアクセスする
インラインハンドラーで元のDOMイベントにアクセスしたい場合は、特殊な`$event`変数を使います。

```vue
<script setup>
function warn(message, event) {
	if (event) event.preventDefault();   alert(message);
}
</script>

<template>
	<button @click="warn('Form cannot be submitted yet.', $event)">Submit</button>
</template>
```

または、アロー関数を使っても同様の効果が得られます。
### イベント修飾子
イベントハンドラーで`event.preventDefault()`や`event.stopPropagation()`を使用する代わりに、Vueのイベント修飾子を使うことができます。
修飾子はドットで続けて書きます。

```vue
<template>
	<a @click.stop="doThis"></a>
	<form @submit.prevent="onSubmit"></form>
</template>
```

修飾子には以下のものがあります：
- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`
```vue
<!-- クリックイベントの伝搬は停止します -->
<a @click.stop="doThis"></a>

<!-- サブミットイベントはもはやページをリロードしません -->
<form @submit.prevent="onSubmit"></form>

<!-- 修飾子は繋げることができます -->
<a @click.stop.prevent="doThat"></a>

<!-- ただの修飾子として使用できます -->
<form @submit.prevent></form>

<!-- event.target が 要素それ自身であるときだけ ハンドラーが呼び出されます-->
<!-- つまり、子要素である場合 -->
<div @click.self="doThat">...</div>
```
## キー修飾子
特定のキーが押されたときにのみイベントをトリガーしたい場合、キー修飾子を使います。

```vue
<template>
	<input @keyup.enter="submit" />
</template>
```

`@keyup.enter`はEnterキーが押されたときのみ`submit`メソッドを呼び出します。

Vue はもっともよく使われるキーのためにエイリアスが提供されます:
- `.enter`
- `.tab`
- `.delete` ( "Delete" と "Backspace" キーの両方をキャプチャします )
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`
### システム修飾子
CtrlキーやShiftキーなどの修飾子キーが押されたときにのみイベントをトリガーしたい場合に使います。

```vue
<template>
	<input @keyup.alt.enter="clear" />
	<div @click.ctrl="doSomething">Do something</div>
</template>
```
### .exact 修飾子
イベントが発火するために必要なキーの正確な組み合わせを指定するのに使用します。

```vue
<template>
	<button @click.ctrl.exact="onCtrlClick">A</button>
	<button @click.exact="onClick">A</button>
</template>
```



### マウスボタン修飾子
特定のマウスボタンがクリックされたときにのみイベントをトリガーします。
修飾子を使うことで、より簡潔で読みやすいコードを書けるようになります。
