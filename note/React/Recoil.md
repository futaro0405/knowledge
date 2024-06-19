
## 初期設定

```
npm install recoil
```

```jsx
import { RecoilRoot } from "recoil";

function App() {
	return (
		<RecoilRoot>
			<Component />
		</RecoilRoot>
	);
}

export default App;
```

`App().jsx`で `<RecoilRoot></RecoilRoot>`で囲むことでRecoil Hooksが利用できるようになります。

## Stateを定義

**src/state/textState.js**

```js:src/state/textState.js
import { atom } from "recoil";

export const textState = atom({
	key: 'textState', 
	default: '',
});
```
RecoilではStateは`atom`という概念で表現されます。
`atom` は一意のキー（`key`）と初期値（`default`）を持つjavascriptオブジェクトです。

## Stateの読み書き

**src/pages/Home.jsx**

```tsx:src/pages/Home.jsx
import { useRecoilState } from "recoil";
import { textState } from "../state/textState";

export default function Home() {
	const [text, setText] = useRecoilState(textState);

	function handleChange(e) {
		setText(e.target.value);
	}
	return (
		<div>
			<input type="text" value={text} onChange={handleChange} />
			<p>You entered: {text}</p>
		</div>
	);
}
```

定義したstateを読み書きします。
stateを読み書きするために、`useRecoilState` というHooksを使用します。
`useRecoilState` の引数は先ほど定義した `atom` を指定します。

## Stateの読み取り
`useRecoilValue` を使用すると