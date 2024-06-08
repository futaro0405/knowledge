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