## Reactivity
VuejsにはReactivityという機能がある。
あるオブジェクトの変更を検知してその変更が及ぼす影響を自動的に保管してくれる機能。

### 例

```javascript
import { reactive, effect } from './reactivity.esm-browser.js';
const obj = { a: 0 };
obj.a = 1;
console.log
```

