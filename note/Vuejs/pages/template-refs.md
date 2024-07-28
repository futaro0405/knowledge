# テンプレート参照
Vue.jsでは、ほとんどのDOM操作がVueの宣言的なレンダリングによって抽象化されます。
しかし、時々、DOM要素に直接アクセスする必要がある場合があります。
そんなときに「ref」という特殊な属性を使います。

### refの使い方
テンプレート内で特定の要素に`ref`を設定すると、その要素に直接アクセスできるようになります。
例えば、次のように`<input ref="input">`とすると、この要素への参照を取得できます。
```vue
<template>
  <input ref="input">
</template>
```

Vue.jsでDOM要素に直接アクセスしたいとき、`ref`属性を使うことでその要素を参照できます。この`ref`を使うと、DOM要素や子コンポーネントに直接アクセスが可能になります。

#### `ref`の使用例

次のコード例では、テンプレート内の`<input>`要素に`ref="input"`を設定しています。
`ref`の値である`input`と一致する名前の`ref`をJavaScriptで宣言することで、この要素にアクセスできます。


```vue
<script setup>
import { ref, onMounted } from 'vue' 
// input要素の参照を保持するためにrefを宣言
const input = ref(null) 
// コンポーネントがマウントされたときに実行
onMounted(() => {
	input.value.focus()
 // input要素にフォーカスを当てる
})
</script>

<template>
	<input ref="input" />
	<!-- ref属性を設定 -->
</template>
```

#### `setup()`関数を使った方法

`<script setup>`を使用しない場合、`setup()`関数内で`ref`を宣言し、返り値として返す必要があります。


```javascript
export default {
	setup() {
		const input = ref(null);
		return {
			input
		};
	}
}
```
#### 注意点
1. **マウント後にアクセス可能**: `ref`で取得した要素には、コンポーネントがマウントされた後でしかアクセスできません。初回レンダリング時には`null`です。
    
2. **参照の監視**: 要素がまだマウントされていない場合や、`v-if`などでアンマウントされた場合、参照は`null`になる可能性があります。`watchEffect`などを使って参照の変化を監視し、適切に対応することが重要です。
```javascript
watchEffect(() => {
  if (input.value) {
    input.value.focus();
  } else {
    // 要素がまだ存在しない、またはアンマウントされた
  }
});
```

このようにして、Vue.jsのComposition APIを使ってDOM要素にアクセスする方法を理解することができます。
これにより、より柔軟にDOM操作が可能になります。

### 関数を使った`ref`の使用

Vue.jsでは、`ref`属性を使ってDOM要素にアクセスする際、単に文字列キーを使う代わりに、関数を指定することもできます。
この方法を使うと、要素の参照をどのように管理するかを柔軟に決めることができます。

#### 使用方法

`ref`属性に関数を設定すると、その関数はコンポーネントがマウントされるときや更新されるたびに呼び出されます。
関数は要素への参照を受け取り、その参照をプロパティや`ref`に保存するなどの操作ができます。

```vue
<script setup>
  import { ref } from 'vue'
  // input要素の参照を保持するための変数を宣言
  const input = ref(null)
  // 関数を定義
  const setInputRef = (el) => {
    // elはDOM要素への参照
    input.value = el
  }
  // input要素がアンマウントされたとき、elはnullになります
</script>

<template>
  <input :ref="setInputRef" />
</template>
```

#### 使い方のポイント

1. **動的な`:ref`バインディング**: `:ref="setInputRef"`のように、関数を`ref`にバインドすることで、参照の名前を示す文字列ではなく、動的に処理を行うことが可能になります。
2. **要素のアンマウント時**: 要素がアンマウントされる（例えば、`v-if`ディレクティブによって条件付きで表示される場合など）と、`ref`に渡される関数の引数は`null`になります。これにより、要素の存在状態に応じた処理を実行することができます。
3. **インライン関数やメソッドの使用**: 必要に応じて、`setInputRef`のようなインライン関数を使うだけでなく、別途メソッドとして定義することもできます。