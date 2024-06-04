## Contextとは
Contextによってコンポーネントツリー間におけるデータの橋渡しについて、すべての階層ごとに渡す必要性がなくなり、propsバケツリレーをしなくても下の階層でContextに収容されているデータにアクセスできるようになる。

## useContextとは?
useContextとは、Context機能をよりシンプルに使えるようになった機能。
親からPropsで渡されていないのに、Contextに収容されているデータへよりシンプルにアクセスできるというもの。

## 使用例
```jsx:ContextA.jsx
import React from 'react'
import ContextB from './ContextB'

const ContextA = () => <ContextB/>

export default ContextA
```

```jsx:ContextB.jsx
import React from 'react'
import ContextC from './ContextC'

const ContextB = () => <ContextC/>

export default ContextB
```

```jsx:ContextC.jsx
//ReactからuseContextをimport
import React, {useContext} from 'react'
//AppコンポーネントからUserContext, HobbyContextをimport
import {UserContext, HobbyContext} from '../../App'

const ContextC = () => {
	//useContextの引数に、UserContextやHobbyContextを渡すことによって、
	//AppコンポーネントでProviderに渡したvalueの値を変数に代入することが出来る
	const user = useContext(UserContext)
	const hobby = useContext(HobbyContext)
	return (
		<p>{user.name}{user.age}歳: 趣味は{hobby}です。</p>
	)
}

export default ContextC
```

```js:App.js
// ReactからcreateContextとuseStateをimport
import React, {createContext, useState} from 'react'
import './App.css';
import Context from './components/ContextSample/ContextA'

//createContextを使ってUserContextとHobbyContextを作成
export const UserContext = createContext()
export const HobbyContext = createContext()

function App() {
	//useStateを使ってuserを作成
	const [user, setUser] = useState({
		name: 'セイラ',
		age: '17'
	})

	//useStateを使ってhobbyを作成
	const [hobby, setHobby] = useState('キャンプ')

	return (
		<div className='App'>
			//UserContext.Providerを作成、valueにはuserをセット
			<UserContext.Provider value={user}>
				//HobbyContext.Providerを作成、valueにはhobbyをセット
				<HobbyContext.Provider value={hobby}>
					<Context/>
				</HobbyContext.Provider>
			</UserContext.Provider>
		</div>
	)
}

export default App
```

`React.createContext`からの戻り値を受け取り、そのコンテクストの現在値を返す。
`React.createContext`の現在値は、ツリー内でこのフックを呼んだコンポーネントの直近にある `<Context.Provider>` の `value`の値によって決まる。

`useContext`を呼び出すコンポーネントはコンテクストの値が変化するたびに毎回再レンダーされる。
