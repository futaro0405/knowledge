## Reactivity
VuejsにはReactivityという機能がある。
あるオブジェクトの変更を検知してその変更が及ぼす影響を自動的に保管してくれる機能。

### 例

```javascript
import { reactive, effect } from './reactivity.esm-browser.js';

const obj = reactive({ a: 0 });
effect(() => {
	console.log(obj.a);
});

obj.a = 1;
```

```console
0
1
```

`reactive()`の引数にobujectを渡す。
`effect()`のコールバック関数は`reactive()`のオブジェクトが変更されたときに実行される。
