# props
## Propsの宣言
Vueコンポーネントでは、`props`の宣言が必要です。
これは、外部からコンポーネントに渡されるデータ（props）が正しく処理されるようにするためです。
propsを明示的に宣言することで、Vueはそのデータをどのように扱うべきかを理解します。
### `props`の宣言方法
#### `<script setup>`を使用する場合
`<script setup>`を使用するシングルファイルコンポーネント（SFC）では、`defineProps()`マクロを使ってpropsを宣言します。
```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```
ここで、`defineProps()`に渡している引数は、コンポーネントで受け取るpropsの名前です。
この例では、`foo`という名前のpropsを受け取っています。
#### `<script setup>`を使用しない場合
`<script setup>`を使用しないコンポーネントでは、`props`オプションを使ってpropsを宣言します。
```js
export default {
  props: ['foo'],
  setup(props) {
    // setup()関数は第1引数にpropsを受け取ります。
    console.log(props.foo)
  }
}
```
`props`オプションに渡している値は、受け取るpropsの名前のリストです。
この例でも、`foo`という名前のpropsを受け取っています。
#### オブジェクト構文を使ったpropsの宣言
propsの宣言には、オブジェクト構文も使用できます。
この方法では、各プロパティにpropsの名前をキーとして指定し、対応する型を値として指定します。
```js
// <script setup> 内
defineProps({
  title: String,
  likes: Number
})
```

```js
// <script setup> 以外
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

オブジェクト宣言では、propsの名前（キー）とその型（値）を指定します。
これにより、propsの型が明確になり、他の開発者がコンポーネントを使用する際に役立ちます。
また、誤った型のデータが渡された場合、ブラウザのコンソールに警告が表示されます。
### TypeScriptとの組み合わせ
TypeScriptを使用している場合は、型アノテーションを使用してpropsの型を指定することができます。
```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

この例では、`title`は文字列型、`likes`は数値型であることを示しています。`?`を使うことで、propsがオプショナルであることも示せます。

このように、Vueではpropsの型を明確にすることで、より堅牢なコードを書くことができ、エラーを早期に発見するのにも役立ちます。