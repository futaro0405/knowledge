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
```vue
<BlogPost :comment-ids="[234, 266, 273]" />
<BlogPost :comment-ids="post.commentIds" />
```
##### オブジェクト
```vue
<BlogPost :author="{ name: 'Veronica', company: 'Veridian Dynamics' }" />
<BlogPost :author="post.author" />
```
#### オブジェクトを使った複数のpropsのバインディング
オブジェクトのすべてのプロパティをpropsとして渡したい場合、`v-bind`にオブジェクトを渡します。
```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

```vue
<BlogPost v-bind="post" />
```

これは次のように書いた場合と同じ意味です。
```vue
<BlogPost :id="post.id" :title="post.title" />
```

このように、`v-bind`を使用することで、オブジェクトのプロパティをまとめてpropsとして渡すことができます。
## 一方向のデータフロー
Vueのコンポーネントでは、propsに一方向のデータフローが適用されます。
これは、親コンポーネントから子コンポーネントへデータが流れ、その逆は許されないということです。
この仕組みにより、親のデータが誤って子コンポーネントによって変更されることを防ぎ、アプリケーションのデータフローが分かりやすくなります。

親コンポーネントが更新されると、子コンポーネントに渡されたpropsも自動的に最新の値に更新されます。
そのため、子コンポーネント内でpropsの値を直接変更することは避けるべきです。
もしpropsを変更しようとすると、Vueがコンソールに警告を表示します。
```js
const props = defineProps(['foo'])

// ❌ 警告: propsは読み取り専用です！
props.foo = 'bar'

```
### Propsを変更したい場合
propsを変更したい場合には、次のような状況が考えられます。
#### 1.初期値として使用し、その後ローカルで管理するデータにする場合
この場合、ローカルのデータプロパティとして定義し、その初期値にpropsを使用します。
これにより、propsの更新からローカルデータが切り離されます。
```js
const props = defineProps(['initialCounter'])

// props.initialCounterはcounterの初期値としてのみ使用されます
const counter = ref(props.initialCounter)
```
#### 2.変換が必要なデータを受け取る場合
propsを元に計算されたデータが必要な場合、算出プロパティを使用します。
算出プロパティは、propsが変更されるたびに自動的に更新されます。
```js
const props = defineProps(['size'])

// props.sizeの値に基づいて計算される算出プロパティ
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```
#### オブジェクトや配列のpropsの扱い
オブジェクトや配列をpropsとして受け取った場合、そのプロパティや要素を変更することは技術的には可能です。
これは、JavaScriptにおけるオブジェクトや配列の参照渡しの特性によるものです。

ただし、このような操作は推奨されません。
理由は、子コンポーネントが親の状態に影響を与えることが難しくなり、アプリケーションのデータフローが不透明になる可能性があるためです。
特に、親と子コンポーネントが密接に結びついていない場合は、子コンポーネントがpropsを直接変更するのではなく、イベントを発行して親コンポーネントに通知し、必要な変更を行ってもらうのがベストプラクティスです。
## Propsのバリデーション
Vueでは、コンポーネントに渡されるpropsに対してバリデーションを設定できます。
これにより、propsの型や必須性、デフォルト値などの要件を指定し、条件を満たさない場合には警告を出すことで、予期せぬエラーを防ぐことができます。
### 基本的なバリデーション
`defineProps()`マクロを使用して、propsに対するバリデーションをオブジェクトとして定義します。
以下はその例です。
```js
defineProps({
  // 基本的な型チェック
  propA: Number,

  // 複数の型の可能性
  propB: [String, Number],

  // 必須の文字列
  propC: {
    type: String,
    required: true
  },

  // 必須だが null になる可能性がある文字列
  propD: {
    type: [String, null],
    required: true
  },

  // デフォルト値を持つ数値
  propE: {
    type: Number,
    default: 100
  },

  // デフォルト値を持つオブジェクト
  propF: {
    type: Object,
    default(rawProps) {
      return { message: 'hello' }
    }
  },

  // カスタムのバリデーター関数
  propG: {
    validator(value, props) {
      // 値が特定の文字列であることをチェック
      return ['success', 'warning', 'danger'].includes(value)
    }
  },

  // デフォルト値を持つ関数
  propH: {
    type: Function,
    default() {
      return () => 'Default function'
    }
  }
})
```
### バリデーションの詳細
#### `type`
値の型を指定します。
`String`や`Number`、`Boolean`などのネイティブコンストラクターやカスタムクラスを指定できます。
#### `required`
必須のpropsであることを示します。
デフォルトは`false`です。
#### `default`
デフォルト値を指定します。
オブジェクトや配列のデフォルト値はファクトリー関数で返します。
#### `validator`
値がカスタムのバリデーションロジックを通過するかどうかをチェックする関数です。
### 特定の型チェック
propsの型チェックには、以下のネイティブコンストラクターを使用できます：
- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`
また、カスタムクラスやコンストラクター関数も使用できます。
例えば、`Person`クラスがある場合、そのインスタンスであることを確認するために以下のように使用します。
```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

defineProps({
  author: Person
})
```
これにより、Vueは`author`プロパティが`Person`クラスのインスタンスであるかどうかを検証します。
### その他の注意点
- `required: true` が指定されていないpropsはデフォルトでオプションです。
- `Boolean` 以外のオプションのpropsは、値が指定されないと`undefined`になります。
- `Boolean` のpropsは、値が指定されないと`false`になります。`default: undefined` を指定すると、非真偽値のpropsとして扱われます。

propsのバリデーションが失敗すると、Vueは開発ビルドでコンソールに警告を出します。
これは特に、他の開発者が再利用することを目的としたコンポーネントで有用です。

