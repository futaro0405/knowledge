## ライフサイクルとは
- コンポーネントが生まれてから破棄されるまでの時間の流れ
- ライフサイクルメソッドを使うと、時点に応じて処理を実行できる
- Class Component時代は以下の3メソッドが頻出だった
	- componentDidMount()
	- componentDidUpdate()
	- componentWillUnmount()
- Hooks時代はuseEffectでライフサイクルを表現
## 3種類のライフサイクル
- Mounting
	- コンポーネントが配置される（生まれる）期間
- Updating
	- コンポーネントが変更される（成長する）期間
- Unmounting
	- コンポーネントが破棄される（死ぬ）期間

![[Pasted image 20240609215532.png]]

## 副作用（effect）フックを使う
- 関数コンポーネントではuseEffectという副作用フックを使う
- 副作用=レンダリングによって引き起こされる処理

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
	useEffect(() => {
		console.log("Current count is ", count)
	})
	return (
		<>
			<p>現在のカウント数：{count}</p>
			<button onClick={countUp}>up</button>
			<button onClick={countDown}>down</button>
		</>
	);
};
```

## 第二引数の依存関係を理解
- useEffectの第二引数には配列を渡すことが可能
- 第二引数はdeps(dependencies)と呼ばれ、副作用が引き起こされるかどうかの依存関係となる

```js
// 毎回実行される
useEffect(() => {
	console.log("Current count is ", count)
})
// 初回レンダリング後のみ実行される
useEffect(() => {
	console.log("Current count is ", count)
}, [])
// triggerが変更されるたびに実行される
useEffect(() => {
	console.log("Current count is ", count)
}, [trigger])
// trigger1かtrigger2が変更されるたびに実行される
useEffect(() => {
	console.log("Current count is ", count)
}, [trigger1, trigger2])
```

## クリーンアップを理解
- コンポーネント内で外部データベースを購読したい
- useEffect内で購読処理を呼び出す
- 必要なくなったらクリーンアップ関数を使って掃除する

```js
const ToggleButton = () => {
	const [open, setOpen] = useState(false)
	const toggle = () => {
		setOpen(prevState => !prevState)
	}
	useEffect(() => {
		console.log("Current state is", open)
		if(open) {
			console.log("Subscribe detabase")
		}
		return () => {
			console.log("Unsubscribe detabase")
		}
	})
	return (
		<button onClick={toggle}>
			{open ? 'OPEN' : 'CLOSE'}
		</button>
	);
};
```

## useEffectのユースケース
- APIやデータベースから非同期通信でデータを取得（fetch）する
- 特定の値が変わったらデータを再取得（refetch）する

### GitHubのAPIからデータを取得する
- fetch APIは非同期通信で外部APIにアクセス
- GETメソッドであればURLを指定する
- res.json()メソッドで取得したデータをオブジェクト型に変換

```jsx
fetch(`https://api.github.com/users/name`)
	.then(res => res.json())
	.then(data => {
		console.log(data)
	})
	.catch(error => {
		console.error(error)
	})
```

### useEffect内で非同期通信
- 初回レンダリング後に呼び出される
- 第二引数に指定した値が変わる度に再度呼び出される
- 取得した値をuseStateの更新関数に渡す

```jsx
const [id , setId] = useState('name')
useEffect(() => {
	fetch(`https://api.github.com/users/${id}`)
		.then(res => res.json())
		.then(data => {
			console.log(data)
			setName(data.name)
		})
		.catch(error => {
			console.error(error)
		})
}, [id])
```

