# Promise
非同期処理をより簡単に、可読性が上がるようにしたもの
callbackによる非同期処理ではcallback関数をつなげていったときコードの可読性が下がる。
Promiseを使うことでより直感的に記述できる
## Promise構文
Promiseの引数としてcallback関数を設定する。
このcallback関数には`resolve`、`reject`の引数を指定する。

`resolve`が呼ばれた場合には`then`メソッドの中のコールバック関数が実行される
`then`のcallback関数にはresolveの引数が渡される

`reject`:promiseのcallback関数内で何らかのエラーが発生したときにそれをpromiseに通知するために使用する関数
rejectが呼ばれた場合にはcatchメソッドの中のcallback関数が実行されrejectで渡った引数がわたる
その後finallyが実行される
finally共通の終了処理引数を持たない

```js
new Promise(function(resolve, reject) {
	resolve("hello");
	// reject("bye");
}).then(function(data) {
	console.log(data); // hello
}).catch(function(data) {
	console.log(data); // bye
}).finally(function() {
	console.log('end);
})
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

## 例

```js
new Promise(function(resolve, reject) {
	console.log('promise');
	// reject("bye");
	resolve("hello");
}).then(function(data) {
	console.log('then:' + data);
	return data;
}).then(function(data) {
	console.log('then:' + data);
	return data;
}).then(function(data) {
	throw new Error();
}).catch(function(data) {
	console.log('catch:' + data);
}).finally(function() {
	console.log('finally');
})
console.log('global end');
```

```js
promise
global end
then hello
then hello
catch
finally
```