## Default export

```js:export.jsx
const Button = () => {
	return <button>テスト</button>;
};

export default Button;
```

```js:import.jsx
import Button from '@/components/Button';
```

importする側で対象を命名する必要がある

```js
import ScrollButton from '@/components/Button';
import SubmitButton from '@/components/Button';
```

対象を自分で命名できることは便利ではあるが、ページごとに
  

### React.lazyを使用する時はDefault exportしか使えない

ここではReact.lazyについてあまり触れませんが、簡潔に説明するとファイルを分割して遅延読み込みができる機能です。