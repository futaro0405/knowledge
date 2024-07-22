```js
import { reactive, effect } from './reactivity.esm-browser.js';

const obj = reactive({ a: 0 });
effect(() => {
	console.log("effect", obj.a);
});

const obj2 = reactive({ a: 0 });
effect(() => {
	console.log("effect2", obj2.a);
});

obj.a = 1;
obj2.a = 2;
```
