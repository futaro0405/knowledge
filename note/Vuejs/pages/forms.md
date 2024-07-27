# フォーム入力バインディング
Vueでは、フォームの入力要素とJavaScriptの状態を同期させることがよくあります。
これを手動で行うのは手間がかかるため、`v-model`ディレクティブが役立ちます。

```vue
<input :value="text" @input="event => text = event.target.value">
```

これを`v-model`で簡略化できます

```vue
<input v-model="text">
```

`v-model`は様々な入力要素（`<textarea>`や`<select>`含む）で使用可能で、要素に応じて自動的に適切なDOMプロパティとイベントにバインドされます。

- `<input type="text">` と `<textarea>` は `value` プロパティと `input` イベントを使用。
- `<input type="checkbox">` と `<input type="radio">` は `checked` プロパティと `change` イベントを使用。
- `<select>` は `value` プロパティと `change` イベントを使用。

### 注意点
`v-model`はフォーム要素の初期値を無視し、常にバインドされたJavaScriptの状態を使用します。
初期値はJavaScript側で設定することが推奨されます。

### 基本的な使い方
#### テキスト

```vue
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

IMEを使用する言語（中国語、日本語、韓国語など）では、`v-model`がリアルタイムに更新されない場合があり、その場合は`input`イベントリスナーと`value`バインディングを使用します。

#### 複数行テキスト
`<textarea>`内では補間が機能しないため、`v-model`を使用します。
```vue
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

#### チェックボックス
##### 単一のチェックボックス
```vue
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

##### 複数のチェックボックス
```vue
<script setup>
const checkedNames = ref([])
</script>

<template>
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
</template>
```

チェックされている名前が`checkedNames`配列に格納されます。

##### ラジオボタン
```vue
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

##### セレクトボックス
単一選択:
```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

初期値がどのオプションにもマッチしない場合、`<select>`は"unselected"状態になります。
iOSではこの状態で`change`イベントが発火しないため、空の値を持つdisabledオプションを追加することが推奨されます。

複数選択:
```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

セレクトオプションは `v-for` で動的にレンダリングすることができます。
```vue
<script setup>
const selected = ref('A')

const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
</script>

<template>
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>
</template>
```

### 値のバインディング
通常、`v-model`でバインドされる値は静的な文字列です。
しかし、動的なプロパティにバインドしたい場合は、`v-bind`を使用します。

チェックボックス:
```vue
<input type="checkbox" v-model="toggle" true-value="yes" false-value="no" />
```

ラジオボタン:
```vue
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

セレクトボックス:
```vue
<select v-model="selected">
  <option :value="{ number: 123 }">123</option>
</select>
```

## 修飾子
### `.lazy`
通常、`v-model`は各`input`イベント後にデータを同期しますが、これを`change`イベント後に同期させたい場合は`lazy`修飾子を使用します。
これにより、ユーザーが入力を終了し、要素がフォーカスを失ったタイミングでデータが更新されます。

```vue
<input v-model.lazy="msg" />
```

### `.number`
`v-model`で数値としてデータを扱いたい場合、`.number`修飾子を使用します。
これにより、ユーザーの入力が自動的に数値に変換されます。
例えば、ユーザーが数値を入力した場合、それは`parseFloat()`関数で解析され、数値として扱われます。ただし、解析できない場合は元の値がそのまま使用されます。

```vue
<input v-model.number="age" />
```

なお、`type="number"`の入力要素には、この修飾子が自動的に適用されます。
### `.trim`
ユーザーの入力から空白を自動的に取り除きたい場合、`trim`修飾子を使用します。
これにより、入力の先頭と末尾の空白が自動的に削除されます。
```vue
<input v-model.trim="msg" />
```

### コンポーネントの v-model

Vueのコンポーネントを使って、標準のHTML入力タイプが対応できない特別なニーズに応じたカスタマイズされた入力を作成することができます。これらのカスタム入力でも`v-model`を使用してデータの双方向バインディングが可能です。詳細については、Vueのコンポーネントガイドの`v-model`のセクションを参照してください。

これらの修飾子を利用することで、ユーザー入力の処理がより柔軟かつ効率的になります。