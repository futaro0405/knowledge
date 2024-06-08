# Reactとは
- Facebook社が開発したUIライブラリ
- UIをつくるためのコンポーネントという概念が特徴=見た目+機能
- コンポーネントを組み合わせてwebの画面をつくっていく

## Reactを使わない画面描画
- ブラウザはHTMLを画面に描画する
- Document Object Model(DOM)=HTMLにアクセスする窓口
- DOMを直接変更してHTMLを再描画するのはコストが高い
## 仮想DOMという解決策
- ブラウザのDOMツリーをJavaScriptのオブジェクトとして扱う
	- ブラウザに負担をかけずJavaScriptエンジンのメモリを使う、効率の良い再描画（レンダリング）を行うことが目標
- DOMの状態をJavaScriptで管理することができる
	- Reactのコンポーネントは「状態を持つUI」
## JSXとは
- JavaScriptの拡張言語
	- テンプレート言語ではない
- HTMLライクな記述+JavaScriptの構文 が使える
- JSXは最終的にReact要素を生成する
### なぜJSXを使う？
JSXを使わない場合
```jsx
React.createElement(
	'button',
	{className: 'btn-blue'},
	'Click me'
)
```

JSXを使うとHTMLライクに書ける
```jsx
<button classNAme={'btn-ble'}>
	Click me
</button>
```

- React.createElementはReact要素を生成する式
- 2つの構文は等価=同じ結果となる

### JSXは何をしているのか
- コンパイル時
	1. JSXは `React.createElement` の式に変換
	2. React要素を生成
-  `React.createElement` を使った構文は直感的でない
	- JSXを使うと楽に記述できる

### JSXの基礎文法
1. Reactライブラリをimportする
2. return文中にJSXの構文
	- 基本的にはHTMLと同じ
	- `class`は`className`に

```jsx
import React from 'react';

const BlueButton = () => {
	return (
		<button className={'btn-name'}>
			Click me
		</button>
	)
}
export default BlueButton;
```

1. キャメルケースで記述する
2. {}内で変数を扱える
3. 閉じタグが必要

```jsx
import React from 'react';

const Thumbnail = () => {
	const caption = '写真'
	const imagePath = '/img/image.png'

	return (
		<div>
			<p>{caption}</p>
			<img src={imagePath} alt={caption} />
		</div>
	)
}

export default Thumbnail
```

## JSXの特殊構文
1. JSXは必ず階層構造にする必要がある

```jsx:Error
return (
	<p>{caption}</p>
	<img src={imagePath} alt={caption} />
)
```

```jsx:ok
return (
	<>
		<p>{caption}</p>
		<img src={imagePath} alt={caption} />
	</>
)
```

```jsx:ok
return (
	<React.Fragment>
		<p>{caption}</p>
		<img src={imagePath} alt={caption} />
	</React.Fragment>
)
```
