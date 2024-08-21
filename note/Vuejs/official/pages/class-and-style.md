# クラスとスタイルのバインディング

Vue.jsでは、HTML要素にCSSクラスやインラインスタイルを動的に追加したり変更したりできます。
これにより、要素の見た目をリアルタイムで変えることができます。
この操作を簡単にするために、Vueは`v-bind`を使ってクラスやスタイルをバインドする機能を提供しています。
## HTMLクラスのバインディング

### オブジェクトを使ったクラスの切り替え

`v-bind:class`（省略形は`:class`）を使うと、オブジェクトを渡してCSSクラスを動的に変更できます。
例えば、次のように書くと、`isActive`が`true`のときに`active`クラスが適用されます:

```html
<div :class="{ active: isActive }"></div>
```

さらに、複数のクラスを動的に切り替えることもできます。例えば、`isActive`と`hasError`という2つの状態に基づいてクラスを変更する場合:

```javascript
const isActive = ref(true)
const hasError = ref(false)
```

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

上記の例では、`isActive`が`true`のときに`active`クラスが、`hasError`が`true`のときに`text-danger`クラスが適用されます。

算出プロパティを使って、さらに柔軟にクラスを管理できます。
例えば、次のように書くと、複雑な条件に基づいてクラスを適用できます:

```javascript
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

```html
<div :class="classObject"></div>
```
### インラインスタイルのバインディング

**オブジェクトを使ったスタイルのバインディング**

インラインスタイルも`v-bind:style`（省略形は`:style`）を使って動的に設定できます。
例えば、次のように色やフォントサイズを動的に変更できます。
```javascript
const activeColor = ref('red')
const fontSize = ref(30)
```

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

**スタイルオブジェクトを使った簡素化**

スタイルが多い場合、スタイルオブジェクトを使ってテンプレートを簡素化できます:

```javascript
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```

```html
<div :style="styleObject"></div>
```

**配列を使った複数のスタイル適用**

複数のスタイルオブジェクトを配列で渡すこともできます。
これにより、複数のスタイルを要素に適用できます:

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

#### まとめ

Vue.jsでは、クラスとスタイルを動的にバインドするために`v-bind`を使います。これにより、オブジェクトや配列を使って効率的に見た目を管理でき、コードをより簡潔で読みやすくできます。また、算出プロパティを使って複雑なロジックを簡単に管理できるため、開発がスムーズに進みます。