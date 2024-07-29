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

この例では、`title`は文字列型、`likes`は数値型であることを示しています。
`?`を使うことで、propsがオプショナルであることも示せます。

このように、Vueではpropsの型を明確にすることで、より堅牢なコードを書くことができ、エラーを早期に発見するのにも役立ちます。
## Propsの渡し方の詳細
### Props名の大文字・小文字の使い分け
Vueでは、props名を宣言する際にcamelCase（キャメルケース）を使用することが一般的です。
camelCaseは、JavaScriptの有効な識別子であり、テンプレート内でpropsを参照する際にも便利です。

```js
defineProps({
  greetingMessage: String
})
```

```html
<span>{{ greetingMessage }}</span>
```

子コンポーネントにpropsを渡す際には、DOM内テンプレートを除いて、camelCaseを使用することができます。
しかし、通常はHTMLの属性に合わせてkebab-case（ケバブケース）を使用します。
これは、VueコンポーネントとネイティブのHTML要素の区別を明確にし、テンプレートの可読性を向上させるためです。

```vue
<MyComponent greeting-message="hello" />
```

コンポーネントのタグ名にはPascalCaseを用いることが推奨されますが、propsを渡す際にはcamelCaseを使用することには特段のメリットがないため、一般的にはkebab-caseが使用されます。
### 静的なpropsと動的なprops
propsには、静的な値や動的な値を渡すことができます。

#### 静的なprops
静的な値は、そのまま指定してpropsとして渡します。
```vue
<BlogPost title="My journey with Vue" />
```
  
#### 動的なprops
動的な値を渡すには、`v-bind`またはそのショートカットである`:`を使用します。
```vue
<!-- 変数の値を動的に渡す -->
<BlogPost :title="post.title" />

<!-- 複雑な式の結果を動的に渡す -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```
#### さまざまな型の値を渡す
propsには、文字列以外のさまざまな型の値を渡すことができます。
##### 数値
```vue
<BlogPost :likes="42" />
<BlogPost :likes="post.likes" />
```
   
##### 真偽値
```vue
<!-- 値なしで指定すると`true`と見なされます -->
<BlogPost is-published />
<BlogPost :is-published="false" />
<BlogPost :is-published="post.isPublished" />
```
   
##### 配列

4. **オブジェクト**:
    
    template
    
    コードをコピーする
    
    `<BlogPost :author="{ name: 'Veronica', company: 'Veridian Dynamics' }" /> <BlogPost :author="post.author" />`
    

#### オブジェクトを使った複数のpropsのバインディング

オブジェクトのすべてのプロパティをpropsとして渡したい場合、`v-bind`にオブジェクトを渡します。

js

コードをコピーする

`const post = {   id: 1,   title: 'My Journey with Vue' }`

template

コードをコピーする

`<BlogPost v-bind="post" />`

これは次のように書いた場合と同じ意味です。

template

コードをコピーする

`<BlogPost :id="post.id" :title="post.title" />`

このように、`v-bind`を使用することで、オブジェクトのプロパティをまとめてpropsとして渡すことができます。