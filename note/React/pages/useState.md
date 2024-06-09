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
	const [isPublished, set]
	return (
		<div>
			<h2>{props.title}</h2>
			<p>{props.content}</p>
		</div>
	)
};
export default Article;
```