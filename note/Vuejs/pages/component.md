# コンポーネント
Vue.jsのコンポーネントは、UIを独立した再利用可能なパーツに分割するための仕組みです。
これにより、各部分を個別に考えて開発することができます。
通常、アプリケーションはコンポーネントがネストされたツリー構造を持っています。
これはHTMLの要素をネストする方法に似ていますが、Vue.jsでは独自のコンポーネントモデルを使用し、カスタムのコンテンツやロジックをカプセル化できます。
また、VueコンポーネントはネイティブのWebコンポーネントとも連携可能です。
## コンポーネントの定義
### 単一ファイルコンポーネント（SFC）
ビルドステップを使用する場合、Vueコンポーネントは通常、`.vue`拡張子のファイルとして定義します。
これを**単一ファイルコンポーネント（Single File Component, SFC）** と呼びます。

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

この例では、`<script setup>`ブロック内で状態を管理し、`<template>`ブロックでUIを定義しています。ボタンをクリックすると、`count`の値が増加します。

### JavaScriptオブジェクトによるコンポーネント定義
ビルドステップを使用しない場合、VueコンポーネントはプレーンなJavaScriptオブジェクトとして定義できます。
このオブジェクトにはVue特有のオプションが含まれています。
```javascript
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // DOM 内テンプレートをターゲットにすることもできます
  // template: '#my-template-element'
}
```

ここでは、テンプレートがJavaScriptの文字列としてインライン化されています。
Vueはこれをその場でコンパイルしてレンダリングします。
また、HTMLの`<template>`要素を使用して、IDセレクターで指定することも可能です。
#### 複数のコンポーネントのエクスポート
一つのファイルから複数のコンポーネントをエクスポートすることもできます。
通常はデフォルトエクスポートを使用しますが、名前付きエクスポートを使えば、同じファイル内に複数のコンポーネントを定義できます。

このように、Vue.jsのコンポーネントはUIの構築をシンプルでモジュール化された方法で行うための基本的な構成要素です。

## コンポーネントの使用
### 子コンポーネントのインポートと使用
Vue.jsで他のコンポーネント（子コンポーネント）を使用するには、親コンポーネントでそれをインポートする必要があります。
例えば、`ButtonCounter.vue`というファイルにカウント機能のコンポーネントがあるとしましょう。
このコンポーネントは、そのファイルのデフォルトエクスポートとして提供されます。
```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

このコードでは、`ButtonCounter`コンポーネントをインポートし、`<ButtonCounter />`としてテンプレート内で使用しています。
`<script setup>`構文を使用することで、インポートしたコンポーネントはテンプレート内で自動的に利用可能になります。
### グローバル登録とローカル登録
コンポーネントはグローバルに登録することもできます。
これにより、アプリケーション全体でインポートなしにコンポーネントを使用できるようになります。
### コンポーネントの再利用
コンポーネントは何度でも再利用できます。
以下の例では、同じ`ButtonCounter`コンポーネントを3回使用しています。
```vue
<template>
  <h1>Here are many child components!</h1>
  <ButtonCounter />
  <ButtonCounter />
  <ButtonCounter />
</template>
```

各ボタンをクリックすると、それぞれが別々のカウントを維持します。
これは、コンポーネントを使用するたびに新しいインスタンスが作成されるためです。
### タグの使用方法
Vue.jsでは、ネイティブのHTML要素と区別するために、コンポーネントのタグ名にパスカルケース（例: `ButtonCounter`）を使用することが推奨されます。
ネイティブHTMLタグは大文字と小文字を区別しませんが、VueのSFCは大文字小文字を区別するタグ名を使用できます。
また、コンポーネントを自閉タグとして閉じる際に`/>`を使用できます。
```vue
<ButtonCounter />
```

しかし、DOM内でテンプレートを直接作成する場合（例えば、ネイティブの`<template>`要素の中で）、ブラウザはネイティブのHTMLパーサーの動作に従います。
そのため、その場合はケバブケース（例: `button-counter`）を使用し、クロージングタグを明示する必要があります。

```html
<!-- DOM の中にテンプレートが書かれた場合 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

このように、Vue.jsのコンポーネントはアプリケーションのUIを分割し、再利用可能なパーツとして構築するのに役立ちます。
## Props の受け渡し
### 基本的な使い方
Vue.jsでは、コンポーネント間でデータをやり取りするために`props`を使用します。
たとえば、ブログ記事を表示するコンポーネントを作成する際、記事のタイトルや内容などのデータを親コンポーネントから子コンポーネントに渡すために`props`を利用します。

以下は、`BlogPost.vue`というコンポーネントで、タイトルを表示するために`props`を使用する例です。
```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

この例では、`defineProps`マクロを使って、このコンポーネントが受け取る`props`のリストを宣言しています。
`defineProps`は、`<script setup>`内でのみ利用可能であり、明示的にインポートする必要はありません。
宣言された`props`は、自動的にテンプレート内で使用可能になります。
### Props の JavaScript 内でのアクセス
`defineProps`はコンポーネントに渡されたすべての`props`を含むオブジェクトを返すので、JavaScript内でアクセスすることもできます。
```javascript
const props = defineProps(['title'])
console.log(props.title)
```

`<script setup>`を使わない場合、`props`は`props`オプションで宣言され、`setup()`の第1引数として渡されます。
```javascript
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

### Props の使用方法
コンポーネントが`props`を宣言した後、親コンポーネントはカスタム属性としてデータを渡すことができます。
```vue
<template>
  <BlogPost title="My journey with Vue" />
  <BlogPost title="Blogging with Vue" />
  <BlogPost title="Why Vue is so fun" />
</template>
```

多くのアプリケーションでは、親コンポーネントに投稿の配列を保持し、それを使って子コンポーネントをレンダリングすることが一般的です。
```javascript
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

このような場合、`v-for`ディレクティブを使って複数のコンポーネントをレンダリングし、動的に`props`を渡します。
```vue
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

動的な`props`の値を渡すために、`v-bind`構文（`:title="post.title"`）を使用します。
これは、データが動的である場合に特に有用です。
## イベントの購読
Vue.js では、親コンポーネントと子コンポーネント間でデータの受け渡しだけでなく、イベントを通じた通信もサポートされています。
これにより、子コンポーネントから親コンポーネントに情報を伝達することが可能になります。
以下はその基本的な使い方の解説です。
### 親コンポーネントでのイベントハンドリング
まず、親コンポーネントが持つ状態（例えばフォントサイズ）を定義します。
この例では、`postFontSize`という`ref`を使って、ブログ記事のフォントサイズを制御します。
```javascript
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

この`postFontSize`を使って、ブログ記事のフォントサイズを動的に変更できます。
```vue
<template>
  <div :style="{ fontSize: postFontSize + 'em' }">
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
    />
  </div>
</template>

```

### 子コンポーネントからのイベント発行
次に、`BlogPost.vue`コンポーネントにボタンを追加し、クリック時にイベントを発行するようにします。
```vue
<!-- BlogPost.vue, omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

このボタンをクリックすると、`$emit`メソッドを使って`enlarge-text`というカスタムイベントが発行されます。
### 親コンポーネントでのイベントリスニング
親コンポーネントでは、`<BlogPost>`コンポーネントの`enlarge-text`イベントをリッスンし、そのハンドラーとしてフォントサイズを増やす処理を行います。
```vue
<template>
  <BlogPost
    ...
    @enlarge-text="postFontSize += 0.1"
  />
</template>
```

このようにして、子コンポーネントが特定のアクション（ボタンのクリックなど）をトリガーすると、親コンポーネントはそのイベントを受け取り、`postFontSize`を更新します。
### `defineEmits` の使用
イベントを発行する際には、`defineEmits`マクロを使用して、コンポーネントが発行するイベントを宣言することもできます。
これにより、イベントの発行が明示的になり、型情報を提供することも可能です。
```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

`defineEmits`は、発行するイベントの名前をリストとして受け取り、`$emit`メソッドと同等の`emit`関数を返します。
```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```
### `<script setup>`を使用しない場合
`<script setup>`を使用しない場合は、`emits`オプションを使って発行するイベントを宣言し、`setup`関数の第2引数から`emit`関数にアクセスします。
```javascript
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

これにより、イベントの発行と購読が可能になり、親子コンポーネント間の通信を効率的に行えます。
## スロットを使ったコンテンツ配信
Vue.jsでは、コンポーネントにコンテンツを動的に渡すために、スロット（slot）を使用することができます。
スロットは、親コンポーネントから子コンポーネントへ任意のコンテンツを注入するためのプレースホルダーとして機能します。

#### 基本的なスロットの使用

例えば、`AlertBox`コンポーネントを作成し、その中に動的なメッセージを表示したい場合、以下のようにスロットを利用します。
```vue
<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* スタイルの定義 */
}
</style>
```

上記の例では、`<slot />`タグがコンテンツの挿入ポイントとして機能します。
親コンポーネントから渡された内容がここに表示されます。

#### 親コンポーネントでの使用例

親コンポーネントでは、`AlertBox`コンポーネントを以下のように使用して、メッセージを渡します。
```vue
<template>
  <AlertBox>
    Something bad happened.
  </AlertBox>
</template>
```

このコードは、次のようにレンダリングされます。
```html
<div class="alert-box">
  <strong>This is an Error for Demo Purposes</strong>
  Something bad happened.
</div>
```

`<slot />`タグは、親コンポーネントから渡された内容（この場合は「Something bad happened」）を表示するための場所です。

スロットは、コンポーネントの柔軟性を高め、親から子へコンテンツを動的に渡すための強力な方法です。

## 動的コンポーネント
Vue.jsでは、動的にコンポーネントを切り替えるために`<component>`要素を使用します。
この機能は、タブ付きインターフェイスなど、異なるコンポーネントを動的に表示する必要がある場合に特に便利です。
### 基本的な使用法
`<component>`要素の`is`属性には、表示するコンポーネントの名前またはコンポーネントオブジェクトを動的に指定できます。
以下は、動的コンポーネントの基本的な例です。
```vue
<template>
  <div>
    <button @click="currentTab = 'Tab1'">Tab 1</button>
    <button @click="currentTab = 'Tab2'">Tab 2</button>
    <component :is="currentTabComponent"></component>
  </div>
</template>

<script>
import Tab1 from './Tab1.vue'
import Tab2 from './Tab2.vue'

export default {
  data() {
    return {
      currentTab: 'Tab1'
    }
  },
  computed: {
    currentTabComponent() {
      return this.currentTab === 'Tab1' ? Tab1 : Tab2;
    }
  }
}
</script>
```

この例では、`currentTab`が`Tab1`または`Tab2`のいずれかに設定され、対応するコンポーネントが表示されます。`<component :is="currentTabComponent">`で指定されたコンポーネントが動的に切り替わります。
#### HTML要素の動的生成
`is`属性を使って、通常のHTML要素を動的に生成することもできます。
```vue
<template>
  <component :is="currentElement">
    This is a dynamically rendered element.
  </component>
</template>

<script>
export default {
  data() {
    return {
      currentElement: 'h1'
	  // ここを 'p' や 'div' などに変更すると異なるHTML要素が生成されます
    }
  }
}
</script>
```

### `<KeepAlive>`の使用
`<KeepAlive>`コンポーネントを使用すると、動的に切り替えたコンポーネントがアンマウントされずに「生きた」状態を維持できます。
これにより、例えば、タブが切り替わってもコンポーネントの状態が保持されます。
```vue
<template>
  <div>
    <button @click="currentTab = 'Tab1'">Tab 1</button>
    <button @click="currentTab = 'Tab2'">Tab 2</button>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import Tab1 from './Tab1.vue'
import Tab2 from './Tab2.vue'

export default {
  data() {
    return {
      currentTab: 'Tab1'
    }
  },
  computed: {
    currentTabComponent() {
      return this.currentTab === 'Tab1' ? Tab1 : Tab2;
    }
  }
}
</script>
```

この例では、`<KeepAlive>`でラップされたコンポーネントは、タブが切り替わった後でもアンマウントされず、コンポーネントの状態が保持されます。
