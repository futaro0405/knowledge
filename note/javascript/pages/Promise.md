# Promise
非同期処理をより簡単に、可読性が上がるようにしたもの
callbackによる非同期処理ではcallback関数をつなげていったときコードの可読性が下がる。
Promiseを使うことでより直感的に記述できる
## Promise構文
Promiseの引数としてcallback関数を設定する。
このcallback関数には`resolve`、`reject`の引数を指定する。

`reject`:
```js
new Promise(function(resolve, reject) {
	console.log('promise');
	// reject("bye");
	setTimeout(function() {
		resolve("hello");
	}, 1000);
}).then(function(data) {
	console.log('then:' + data);
	// throw new Error();
	return data;
}).then(function(data) {
	console.log('then:' + data);
	return data;
}).catch(function(data) {
	console.log('catch:' + data);
}).finally(function() {
	console.log('終了処理');
})
console.log('global end');
```

