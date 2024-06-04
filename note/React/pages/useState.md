## useStateとは
useStateは、関数コンポ―ネントでstateを管理（stateの保持と更新）するためのReactフック。
stateとはコンポーネントが内部で保持する「状態」のことで、画面上に表示されるデータなど、アプリケーションが保持している状態を指す。
stateはpropsとは違い後から変更可能。

## useStateの例
```jsx
import React, { useState } from 'react'

const Counter = (props) => {
	const initialState = 1
	//const [状態変数, 状態を変更するための関数] = useState(状態の初期値);
	const [count, setCount] = useState(initialState)

	return (
		<>
			<button onClick={() => setCount(count + 1)}>+1</button>
			<p>{count}</p>
		</>
}
```

- `count`：stateの現在の値
- `setCount`：stateの現在の値を更新するための関数
- `initialState`：状態の初期値

state が更新されても `initialState` は`initialState` として保持される
