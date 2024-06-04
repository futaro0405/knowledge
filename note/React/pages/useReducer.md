## useReducerとは
状態管理のためのhooksで、useStateと似たような機能。useStateはuseReducerに内部実装されている。

`(state, action) => newState` という型のreducerを受け取り、現在のstateとdispatch関数の両方を返す。

```jsx
const [state, dispatch] = useReducer(reducer,'初期値')
```
- `reducer`は`state`を更新するための関数で、`dispatch`は、`reducer`を実行するための呼び出し関数。（変数を宣言するときに、stateの更新方法をあらかじめ設定しておくことが出来る。）

### dispatch(action)で実行
- `action`は何をするのかを示すオブジェクト　
- `{type: increment, payload: 0}`のように、`type`プロパティ（`action`の識別子）と値のプロパティで構成されている。

### useStateとuseReducerの比較

|                | useState          | useReducer                 |
| -------------- | ----------------- | -------------------------- |
| 扱えるstateのtype  | 数値、文字列、オブジェクト、論理値 | オブジェクト、配列                  |
| 関連するstateの取り扱い | ☓                 | 複数を同時に取り扱うことが出来る           |
| ローカルorグローバル    | ローカル              | グローバル useContext()と一緒に取り扱う |
## 使用例
### sample1: stateが単数

```tsx:counter.jsx
//useReducerをimport
import React, {useReducer} from 'react'

const initialState = 0

//countStateとactionを渡して、新しいcountStateを返すように実装する
const reducerFunc = (countState, action)=> {
	//reducer関数にincrement、increment、reset処理を書く
	//どの処理を渡すかはactionを渡すことによって判断する
	switch (action){
		case 'increment':
			return countState + 1
		case 'decrement':
			return countState - 1
		case 'reset':
			return initialState
		default:
			return countState
	}
}

const Counter = () => {
	//作成したreducerFunc関数とcountStateをuseReducerに渡す
	//useReducerはcountStateとdispatchをペアで返すので、それぞれを分割代入
	const [count, dispatch] = useReducer(reducerFunc, initialState)
	//カウント数とそれぞれのactionを実行する<Button/>を設置する
	return (
		<>
			<h2>カウント：{count}</h2>
			<Button onClick={()=>dispatch('increment')}>
				increment
			</Button>
			<Button onClick={()=>dispatch('decrement')}>
				decrement
			</Button>
			<Button onClick={()=>dispatch('reset')}>
				reset
			</Button>
		</>
  )
}

export default Counter
```

### sample2：useReducerを使って外部APIを取得

```js:App.js
//useReducerとuseReducerをReactからimport
import React, {useReducer,useEffect} from 'react'
import './App.css'
//axiosをimport
import axios from 'axios'

//initialStateを作成
const initialState = {
	isLoading: true,
	isError: '',
	post: {}
}

//reducerを作成、stateとactionを渡して、新しいstateを返すように実装
const dataFetchReducer = (dataState, action) =>{
	switch(action.type) {
		case 'FETCH_INIT':
			return {
				isLoading: true,
				post: {},
				isError: ''
			}
		//データの取得に成功した場合
		//成功なので、isErrorは''
		//postにはactionで渡されるpayloadを代入
		case 'FETCH_SUCCESS':
			return {
				isLoading: false,
				isError: '',
				post: action.payload,
			}
		//データの取得に失敗した場合
		//失敗なので、isErrorにエラーメッセージを設定
		case 'FETCH_ERROR':
			return {
				isLoading: false,
				post: {},
				isError: '読み込みに失敗しました'
		    }
		//defaultではそのまま渡ってきたstateを返しておく
	    default:
		    return dataState
	  }
}

const App = () => {
	//initialStateとreducer関数をuseReducer()に読み、stateとdispatchの準備
	const [dataState, dispatch] = useReducer(dataFetchReducer, initialState)

	useEffect(()=>{
		//http getリクエストをurlを書く
		axios
		.get('https://jsonplaceholder.typicode.com/posts/1')
		//リクエストに成功した場合
		.then(res =>{
		//dispatch関数を呼び、type:には'FETCH_SUCCESS'、payloadには受け取ったデータを代入する
			dispatch({type:'FETCH_SUCCESS', payload: res.data})
		})
		//リクエストに失敗した場合catchの中に入ってくる
		.catch(err => {
			dispatch({type: 'FETCH_ERROR'})
		})
	})

	return (
		<div className='App'>
			//Loadingが終わったら記事のタイトルを表示
			<h3>
				{dataState.isLoading ? 'Loading...': dataState.post.title}
			</h3>
			//エラーがあった場合の処理
			<p>
				{dataState.isError ? dataState.isError : null}
			</p>
		</div>
	)
}

export default App
```

