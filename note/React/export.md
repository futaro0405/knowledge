## Default export

```js:export.jsx
const Button = () => {
	return <button>テスト</button>;
};

export default Button;
```

```js
import ScrollButton from '@/components/Button';
```

```js
import SubmitButton from '@/components/Button';
```

### importする側で対象を命名する必要がある
対象を自分で命名できることは便利ではあるが、ページごとにコンポーネント名が統一されず、そのコンポーネントがどのようなものか不明確になる。  
### React.lazyを使用する時はDefault exportしか使えない
React.lazyはファイルを分割して遅延読み込みができる機能。

```js
const ButtonComponent = lazy(() => import('../components/Button'));
```

ButtonコンポーネントをNamed exportにするとエラーが発生する。

## Named export

```js:export.js
export const Button = () => {
  return <button>テスト</button>;
};
```

```js:import.jsx
import { Button } from '@/components/Button'
```
### import、exportで命名が統一できる
export側で命名を変更した際に、import側でエラーが出る。

```js:export
export const TestButton = () => {
	return <button>テスト</button>;
};
```

```js:import.js
import { Button } from '@/components/TestButton'
```

この場合、import側でエラーが出る。

Named exportだと変更したタイミングでエディタ上にエラーが表示され、バグを未然に防止できる。
importする際に補完が効くのでタイポ防止になる。

### TypeScriptを使用している場合、import側で型定義できる

```js
export type ApiResponse = {
  name: string;
  age: number;
};

export interface ApiResponse {
  name: string;
  age: number;
};
```

```js
 // Named import
import { ApiResponse } from './types'
// Type-Only Imports
import type { ApiResponse } from './types'
// Type Modifiers on Import Names 
import  { type ApiResponse } from './types'
```

#### Named import
Named exportした際にimportしてくる構文になります。  
そのまま型を付与すればOKです。

#### Type-Only Imports and Export  
TypeScript3.8から追加された機能。
moduleから型をimportする際に、typeを使用して型のみをimportできる構文です。  
  
しかし、この構文には制限があり値のimportと同時に使用することはできず、一つのモジュールから型情報と値どちらもimportする場合にはそれぞれimportを別に書かなくてはいけません。