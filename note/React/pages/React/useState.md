## なぜstateを使うのか
- Reactコンポーネント内の値を書き換えたい
	- コンポーネント内の要素をDOMで直接書き換える
	- 新しい値を使って再描画（再レンダリング）させる
- Reactコンポーネントが再描画するきっかけは
	- stateが変更されたとき
	- propsが変更されたとき

## useStateの使い方
### useStateによるstateの宣言

```js
const [state, setState] = useState(initialState)
```

- __state__：現在の状態
- __setState__：更新関数
- __initialState__：初期値
### stateの更新

```js
setState(newState)
```

### 具体例

```js
const [message, setMessage] = useState('react')
const [likes, setLikes] = useState(0)
const [isPublished, setIsPublished] = useState(false)

setIsPublished(true)
```

### propsとstateの違い
- 両者とともに再描画のきっかけになる
	- propsは引数のようにコンポーネントに渡される値
	- stateはコンポーネントの内部で宣言・制御される値
### stateをpropsに渡す
- 更新関数はそのままpropsとして渡さず関数化する
- 関数をpropsに渡すときは注意

```jsx:components/Article.jsx
const Article = (props) => {
	const [isPublished, setIsPublished] = useState(false)
	const publishArticle = () => {
		setIsPublished(true)
	}
	return (
		<div>
			<Title title={props.title} />
			<Content content={props.contnt} />
			<PublishButton isPublished={isPublished} onClick={publishArticle} />
		</div>
	);
};
```

### propsへ関数を渡す際の注意点
- コールバック関数か関数自体を渡す
- propsに渡すときに関数を実行しない
#### OKな関数の渡し方

```jsx
<PublishButton isPublished={isPublished} onClick={publishArticle} />
<PublishButton isPublished={isPublished} onClick={() => publishArticle()} />
```

#### NGな関数の渡し方
onClick内で関数を実行してしまっているため、無限レンダリングが起きる

```jsx
<PublishButton isPublished={isPublished} onClick={publishArticle()} />
```

## 引数を使って更新する
- 入力フォームでよく使う
- `onChange`イベントでhandleName関数に渡す
- handleName関数のパラメータであるeventを更新関数に渡す

```js
import React, {useState} from 'react';

const TextInput = () => {
	const [name, setName] = useState('')
	const handleName = (event) => {
		setName(event.target.value)
	}
	return (
		<input
			onChange={(event) => handleName(event)}
			type={'text'}
			value={name}
		/>
	);
};
```

## prevStateを活用する
- useStateの更新関数で使える特殊な`prevState`
- `prevState`は更新前のstate
- `prevState`に更新を加えてreturn

```js
import React, {useState} from 'react';

const Counter = () => {
	const [count, setCount] = useState(0)
	const countUp = () => {
		setCount(prevState => prevState + 1)
	}
	const countDown = () => {
		setCount(prevState => prevState - 1)
	}
	return (
		<>
			<p>現在のカウント数：{count}</p>
			<button onClick={countUp}>up</button>
			<button onClick={countDown}>down</button>
		</>
	);
};
```

`setCount( count + 1)`の場合、バグが生まれる

## ON/OFFを切り替えるボタン
- prevStateで受け取った値を`!`で反転してreturnする
- 三項演算子によってopenがtrue/falseで表示を切り替える

```js
import React, {useState} from 'react';

const ToggleButton = () => {
	const [count, setOpen] = useState(false)
	const toggle = () => {
		setOpen(prevState => !prevState)
	}
	return (
		<button onClick={toggle}>
			{open ? 'OPEN' : 'CLOSE'}
		</button>
	);
};
export default ToggleButton;
```

