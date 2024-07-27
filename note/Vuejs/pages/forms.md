# フォーム入力バインディング
## 基本的なアイデア
Vue.jsでは、フォームの入力要素とJavaScriptのデータを同期させるために、`v-model`ディレクティブを使います。
これにより、フォームの値が自動的にJavaScriptの状態と連携します。
### `v-model` の使用方法
`v-model`を使うと、フォーム要素の値をJavaScriptのデータに簡単にバインドできます。
たとえば、テキスト入力でユーザーが入力した内容を `message` というデータにリアルタイムで反映するには、以下のようにします。
```vue
<input v-model="message" placeholder="edit me" />
<p>Message is: {{ message }}</p>
```
### さまざまなフォーム要素のバインディング
- **テキスト入力 (`<input type="text">`) と `<textarea>`**:
	- これらは `value` プロパティと `input` イベントを使用してバインドされます。
- **チェックボックス (`<input type="checkbox">`) とラジオボタン (`<input type="radio">`)**:
    - `checked` プロパティと `change` イベントでバインドされます。
- **セレクトボックス (`<select>`)**:
    - `value` プロパティと `change` イベントでバインドされます。

チェックボックスやラジオボタンの場合、`v-model`は選択されている値を対応するデータプロパティに格納します。
### チェックボックス
#### チェックボックス (単一)
```vue
<input type="checkbox" v-model="isChecked" />
```

#### チェックボックス (複数)
配列やセットにチェックされたアイテムを格納します。
```

```
		
    vue
    
    コードをコピーする
    
    `<input type="checkbox" v-model="checkedNames" value="Jack" />`
    
- **ラジオボタン**:
    
    - 選択されたラジオボタンの値がデータプロパティに設定されます。
    
    vue
    
    コードをコピーする
    
    `<input type="radio" v-model="picked" value="One" />`
    

#### セレクトボックス

- **単一選択**:
    
    vue
    
    コードをコピーする
    
    `<select v-model="selected">   <option>A</option>   <option>B</option> </select>`
    
- **複数選択**:
    
    - 配列に選択されたオプションを格納します。
    
    vue
    
    コードをコピーする
    
    `<select v-model="selected" multiple>   <option>A</option>   <option>B</option> </select>`
    

#### バインディングする値の設定

`v-model`でバインドされる値は通常文字列ですが、`v-bind`を使うことでオブジェクトや他のデータ型をバインドできます。

vue

コードをコピーする

`<input type="checkbox" v-model="toggle" :true-value="trueValue" :false-value="falseValue" />`

#### 修飾子

- **`.lazy`**:
    
    - `input` イベントの代わりに `change` イベント後にデータを更新します。
    
    vue
    
    コードをコピーする
    
    `<input v-model.lazy="msg" />`
    
- **`.number`**:
    
    - 数字としてデータを扱います。
    
    vue
    
    コードをコピーする
    
    `<input v-model.number="age" />`
    
- **`.trim`**:
    
    - 入力から空白を自動的に取り除きます。
    
    vue
    
    コードをコピーする
    
    `<input v-model.trim="msg" />`
    

#### カスタムコンポーネントでの使用

カスタムコンポーネントでも `v-model` を使ってバインドが可能です。詳細はVueの公式ドキュメントを参照してください。

以上が、Vue.jsのフォーム入力バインディングに関する基本的な説明です。これを使うと、フォームデータの扱いが非常に簡単になります。