
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

`App().jsx`で `<RecoilRoot></RecoilRoot>`で囲む。

## 状態を定義

**src/state/textState.js**
```js:src/state/textState.js
import { atom } from "recoil";

export const textState = atom({
 key: 'textState', 
 default: '',
});
```