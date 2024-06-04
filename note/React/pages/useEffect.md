## useEffectとは
useEffectに渡された関数はレンダー結果が画面に反映された後に動作する。
つまり、関数の実行タイミングをReactのレンダリング後まで遅らせるhook。

副作用の処理（DOMの書き換え、変数代入、API通信などUI構築以外の処理）を扱う。
## useEffectの基本形
```jsx
useEffect(() => {
	console.log('副作用関数が実行されました！')
},[依存する変数の配列])
```

第2引数を指定することで、第1引数に渡された副作用関数の実行タイミングを制御することができる。
第2引数の依存配列の中身の値を比較して、副作用関数をスキップするかどうかを判断する。

|      | 説明                               | データ型 |
| ---- | -------------------------------- | ---- |
| 第1引数 | 副作用関数（戻り値はクリーンアップ関数、または何も返さない）   | 関数   |
| 第2引数 | 副作用関数の実行タイミングを制御する依存データが入る（省略可能） | 配列   |

## useEffectの例
ボタンを押したとき合わせてmeta.titleも更新するサンプル。
useEffectの第2引数に`count`を渡している。
`count`が更新されたとき副作用関数を実行。
```jsx:react.js
import React, {useState, useEffect} from 'react'

const EffectFunc = () => {
	const classes = useStyles();
	const [count, setCount] = useState(0)
	const [name, setName] = useState({
		lastName: '',
		firstName: ''
	})

	useEffect(() => {
		document.title =`${count}回クリックされました`
	},[count])

	return (
	    <>
			<p>{`${count}回クリックされました`}</p>
			<Button onClick={()=>setCount((prev) => prev + 1)}>
				ボタン
			</Button>

			<p>{`名前は${name.lastName} ${name.firstName}`}</p>
			<form className={classes.root} noValidate autoComplete="off">
				<Input
					placeholder="姓"
					value={name.lastName}
					onChange={(e)=>{setName({...name,lastName: e.target.value})}}/>
				<Input
					placeholder="名"
					value={name.firstName}
					onChange={(e)=>{setName({...name,firstName: e.target.value})}}/>
			</form>
    </>
  )
}

export default EffectFunc
```

### クリーンアップについて
クリーンアップとはイベントリスナの削除、タイマーのキャンセルなどのこと。
`クリーンアップ関数`をreturnすると、2度目以降のレンダリング時に前回の副作用を消してしまうことができる。
#### クラスコンポーネントの場合
`componentWillUnmount`は、クリーンアップ（`addEventLitener`の削除、タイマーのキャンセルなど）に使用される。
`componentDidMount`に副作用を追加し、`componentWillUnmount`で副作用を削除する。

```jsx:react.js
componentDidMount() {
	elm.addEventListener('click', () => {})
}

componentWillUnmount() {
	elm.removeEventListener('click', () => {})
}
```

#### 関数コンポーネントの場合

上記に相当するhookは以下。
「クリーンアップ関数」をreturnすることで、2度目以降のレンダリング時に前回の副作用を消してしまうことができる。
```jsx:react.js
useEffect(() => {
	elm.addEventListener('click', () => {})

	// returned function will be called on component unmount 
	return () => {
		 elm.removeEventListener('click', () => {})
	}
}, [])
```
#### ライフサイクル

useEffectでは、副作用関数がクリーンアップ関数を返すことで、マウント時に実行した処理をアンマウント時に解除する。
またその副作用関数は、毎回のレンダリング時に実行され、新しい副作用関数を実行する前に、ひとつ前の副作用処理をクリーンアップする。

このようにマウント処理とアンマウント処理の繰り返し処理のことを「ライフサイクル」と言う。

