
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
`useRecoilValue` を使用するとStateの取得のみをすることができます。

**src/pages/text.jsx**

```jsx:src/pages/text.jsx
import { textState } from "../state/textState";
import { useRecoilValue } from "recoil";
import { Link } from "@mui/material";

export default function Text() {
	const text = useRecoilValue(textState);

	return (
		<div>
			<p>You entered: {text}</p>
			<Link to="/">ホームへ</Link>
		</div>
	);
}
```

## Stateの更新
`useSetRecoilState`を使用するとstateの更新だけを行うことができます。
更新した値を返すことはありません。


**src/pages/text.jsx**

```jsx:src/pages/text.jsx
import { textState } from "../state/textState";
import { useRecoilValue } from "recoil";
import { Button } from "@mui/material";

export default function Text() {
	const setText = useSetRecoilState(textState);

	const updateText = () => {
		const newText = "text";
		setText(newText);
	}

	return (
		<div>
			<p>You entered: {text}</p>
			<Button onClick={updateText}>text</Link>
		</div>
	);
}
```

## 計算されたStateを定義
複数の `atom` を組み合わせて計算されたstateを定義することもできます。

**src/state/textState.js**
```js:src/state/textState.js
import { atom, selector } from "recoil";

export const charCountState = selector({
	key: 'charCountState',
	get: ({ get }) => {
		const text = get(textState);
		return text.length;
	},
});
```

`selector` は `atom` と同じような構造のオブジェクトで、 `get`プロパティに関数を指定して計算された状態を定義できます。
`get` 関数の第一引数には使用したい `atom` や `selector`を指定します。

## 計算されたStateを使用
`selector` はStateを返すだけなので更新関数は存在しません。
よって、 `useRecoilValue` で値を取得します。

```js
import { useRecoilState, useRecoilValue } from "recoil";
import { charCountState, textState } from "../state/textState";
import { ChangeEvent } from "react";

export default function Home() {
	const [text, setText] = useRecoilState(textState);
	const charCount = useRecoilValue(charCountState);

	function handleChange(e) {
		setText(e.target.value);
	}
	return (
		<div>
			<input type="text" value={text} onChange={handleChange} />
			<p>You entered: {text}</p>
			<p>Character count: {charCount}</p>
			<Link href="/text">textへ</Link>
		</div>
	);
}
```

## selectorを使用するメリット
`selector`を使用する主なメリットは、複数の`atom`から取得されたデータを元に、より複雑な状態を計算できることです。
また、メモ化された関数を提供するため、複数回呼び出される場合でも、最初の呼び出しで計算された結果を返します。さらに、コードをシンプルにし、アプリケーション全体で共有される状態の複雑さを減らすことができます。

