# 算出プロパティ
## 基本的な例

Vueのテンプレート内で簡単な式を書くことは便利ですが、複雑なロジックをテンプレート内に直接書くと、コードが複雑になり、メンテナンスが難しくなります。
例えば、次のように配列が入れ子になっているオブジェクトがあるとします:

```javascript
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

この `author` オブジェクトに基づいて、著者が本を出版しているかどうかを表示するメッセージをテンプレートに書くと、次のようになります:

```html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

このコードでは、`author.books.length > 0` の部分がテンプレート内のロジックで、本の数が0以上であれば「Yes」、そうでなければ「No」と表示しています。
しかし、このようにロジックをテンプレートに直接書くと、コードがわかりにくくなり、特に同じロジックを複数箇所で使用する場合、コードが冗長になりがちです。

このような場合には、__算出プロパティ__ を使うのが良い方法です。
算出プロパティを使うと、テンプレート内のロジックをより整理しやすくなります。
以下は上記の例を算出プロパティを使って書き直したものです。

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 算出プロパティの定義
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>

```


ここでは、`publishedBooksMessage` という算出プロパティを定義しています。
この算出プロパティは `computed` 関数を使って作成されており、テンプレート内で使うことができます。
`publishedBooksMessage` は `author.books` の状態に依存しているため、`author.books` が変わると、`publishedBooksMessage` の値も自動的に更新されます。

算出プロパティの利点は、テンプレートがシンプルになり、同じ計算を再利用できることです。
また、算出プロパティは依存しているデータが変わらない限りキャッシュされるため、無駄な再計算が避けられます。

## 算出プロパティとメソッドの違い

テンプレートで複雑な計算を行いたいとき、メソッドを使うこともできます。
例えば、次のようにメソッドを定義して呼び出すことも可能です:

```html
<p>{{ calculateBooksMessage() }}</p>
```

```js
<script>
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
</script>
```

この場合も同じ結果が得られますが、メソッドは毎回呼び出されるたびに計算を行うため、キャッシュされません。
算出プロパティは依存するデータが変わらない限り計算を再実行しないので効率的です。

## 書き込み可能な算出プロパティ

通常、算出プロパティは読み取り専用ですが、getterとsetterを定義することで書き込み可能にすることもできます。
例えば、次のように `fullName` を書き込み可能にすることができます:

```html
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter 関数
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter 関数
  set(newValue) {
    // 注意: ここでは、分割代入構文を使用しています。
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

この例では、`fullName = 'John Doe'` の値を設定すると、自動的に `firstName` と `lastName` が更新されるようになっています。

### ベストプラクティス

算出プロパティのgetter関数は、副作用（他のステートを変更するような動作）がないようにするべきです。
算出プロパティの役割は、依存するデータに基づいて値を計算することだけです。
他のステートを変更したり、非同期リクエストを行ったりしないようにしましょう。