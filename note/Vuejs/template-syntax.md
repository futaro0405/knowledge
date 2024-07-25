# テンプレート構文
VueではHTMLをベースとしたテンプレート構文を使用しています。
テンプレートは最適化されたJavaScriptにコンパイルされます。
アプリの状態変化を察知し再レンダリングが必要な最小限のDOM操作を行います。
仮想DOMを熟知している場合は、テンプレートの代わりにレンダ関数を直接記述することもできます。また、オプションでJSXもサポートしています。

## テキスト展開
テンプレート構文の中で最も基本となる形式は __マスタッシュ構文（二重中括弧）__ によるテキスト展開です。

```html:template
<span>Message:{{ msg }}</span>
```

マスタッシュの中身はプロパティの値（`msg`）に変換されます。
`msg`が更新されるたびマスタッシュの中身も更新されます。

マスタッシュの中ではデータはプレーンテキストとして解釈されます。
本来のHTMLを出力したい場合は、`v-html`ディレクティブを使用する必要があります。

```html:template
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

```
Using text interpolation: <span style="color: red">This should be red.</span>

Using v-html directive: This should be red.
```

## 属性バインディング
HTML属性の中ではマスタッシュ構文は使用できません。
代わりに `v-bind` ディレクティブを使用します。

```html
<div v-bind:id="dynamicId"></div>
```
この例では`v-bind`ディレクティブはコンポーネントの`dynamicId`プロパティを要素のidとするように指示しています。

`v-bind` は以下のような省略記法があります。

```html
<div :id="dynamicId"></div>
```

プロパティ名と属性が同じ場合、記述を省略することができます。

```html
<!-- :id="id" と同じ -->
<div :id></div>
<!-- 同じように動きます -->
<div v-bind:id></div>
```

### 複数の属性を動的にバインドさせる
複数のプロパティを持つjavascriptオブジェクトがあるとします。
`v-bind`を引数なしで用いると複数の属性をまとめてバインドすることができます。

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```

```html
<div v-bind="objectOfAttrs"></div>
```

## JavaScriptの式を用いる
VueではデータバインディングにおいてJavaScrpt式を活用することができます。

```html:template
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join }}

<div :id="list-${id}"></div>
```

例に挙げたような式は現在のコンポーネントインスタンスのデータスコープ内でJavaScript式として評価されます。
このJavaScript式は以下の箇所で使用することができます。
- マスタッシュ構文の中
- Vueディレクティブ（`v-`で始まる属性）の中

注意しなければいけない点として、単一の式でなければ用いることができません。
式の判断として`return`の後に使えるかという判断方式がよく使われます。

```vue:template
<!-- これは文であり、式ではありません: -->
{{ var a = 1 }}

<!-- フロー制御も動作しません。代わりに三項演算子を使用してください。 -->
{{ if (ok) { return message } }}
```

### 関数の呼び出し
コンポーネント内で定義されているメソッドであればバインディング式の中で呼び出すことができます。

```vue:template
<time :title="toTitleDate(date)" :datetime="date">
{{ formatDate(date) }}
</time>
```

バインディング式の中で呼び出される関数はコンポーネントが更新されるたびに呼び出されます。
データの変更や非同期処理をトリガーするような副作用を持たせてはいけないことに注意しましょう。


