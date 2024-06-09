## Compornets
- 見た目と機能を持つUI部品
- コンポーネントを組み合わせてページをつくる
- 大きく2種類のコンポーネントに分かれる
	- Class Component（クラスコンポーネント）
	- Functional Component（関数コンポーネント）
### Class Component（クラスコンポーネント）
```jsx
import React, { Component } from 'react'

class Button extends Component {
	render() {
		return <button>Say, {this.props.hello}</button>
	}
}
export default Button;
```

### Functional Component（関数コンポーネント）
```jsx
import React from 'react'

const Button = (props) => {
	return <button>Say, {props.hello}</button>
};
export default Button;
```

## なぜコンポーネントを使うか
- 再利用するため
	- 同じ記述を何度もする必要がない
- コードの見通しをよくするため
	- 1コンポーネント=1ファイル
	- 別ファイルに分けることでコードを読みやすくする
- 変更に強くするため
	- 修正は1か所だけでOK
## コンポーネントの基本的な使い方
- ファイル名は大文字
- 子コンポーネントでexport
- 親コンポーネントでimport

```jsx:App.jsx
import Article from "./components/Article";
function App() {
	return (
		<div>
			<Article />
		</div>
	)
}
export default App;
```

```jsx:components/Article.jsx
const Article = () => {
	return <h2>hello</h2>
};
export default Article;
```

## propsでデータを受け渡す
- 子コンポーネントの引数にpropsを指定する

```jsx:App.jsx
import Article from "./components/Article";
function App() {
	return (
		<div>
			<Article
				title={'React'}
				content={'props'}
			/>
		</div>
	)
}
export default App;
```

```jsx:components/Article.jsx
const Article = (props) => {
	return (
		<div>
			<h2>{props.title}</h2>
			<p>{props.content}</p>
		</div>
	)
};
export default Article;
```

- propsのデータは{}に記述
- 文字列、数値、真偽値、配列、オブジェクト、日付などなんでもOK
- 変数を渡すことも可能
- 文字列は{}なしでもOK
## コンポーネントの再利用
- 同じコンポーネントをいつくも呼び出すことができる
- 配列データをmap()メソッドで処理するのが一般的(実践編で解説)

```jsx
import Article from "./components/Article";
function App() {
	return (
		<div>
			<Article
				title={'React'}
				content={'props'}
			/>
			<Article
				title={'React'}
				content={'props'}
			/>
		</div>
	)
}
export default App;
```

## コンポーネントを分けよう
- 1ファイル=Ⅰコンポーネント
- なぜコンポーネントを分けるのか
	- 責務を明確にする（何のためのパーツなのか）
	- 大規模アプリでも管理しやすくするため
	- 再利用するため

## JavaScriptのモジュール機能
- プログラムをモジュールという単位に分割する
- 原則は1ファイル=1モジュール
- 必要な時は必要なモジュールのみ読み込む
### default export（名前なしexport）
- 推奨されるexport方法
- 1ファイル=1export
- 1度宣言したアロー関数をdefault export
- 名前付き関数宣言と同時にdefault export
```js
const Title = (props) => {
	return <h2>{props.title}</h2>
};
export default Title;
```

```js
export default function Title(props) {
	return <h2>{props.title}</h2>
};
```

### default import（名前なしimport）
- default exportしたモジュールをそのまま読み込む
- importモジュール名from 'ファイルパス'
```js
const Title = (props) => {
	return <h2>{props.title}</h2>
};
export default Title;
```

```js
export default function Title(props) {
	return <h2>{props.title}</h2>
};
```