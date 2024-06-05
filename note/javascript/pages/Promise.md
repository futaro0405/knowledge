# Promise
非同期処理をより簡単に、可読性が上がるようにしたもの
callbackによる非同期処理ではcallback関数をつなげていったときコードの可読性が下がる。
Promiseを使うことでより直感的に記述できる
## Promise構文
Promiseの引数としてcallback関数を設定する。
このcallback関数には`resolve`、`reject`の引数を指定する。

`resolve`が呼ばれた場合には`then`メソッドの中のコールバック関数が実行される
`then`の

`reject`:promiseのcallback関数内で何らかのエラーが発生したときにそれをpromiseに通知するために使用する関数
rejectが呼ばれた場合にはcatchメソッドの中のcallback関数が実行されrejectで渡った引数がわたる
その後finallyが実行される
finally共通の終了処理引数を持たない

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

`new Promise`のcallback関数は同期的に処理されるが、`then`、`catch`、`finally`は非同期的に処理される
```js
new Promise(
	同期処理
).then(
	非同期処理（resolveを待つ）
).catch(
	非同期処理（rejectを待つ）
).finally(
	非同期処理（then、catchを待つ）
);
```
