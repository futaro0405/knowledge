# Promiseチェーン
Promiseを使って非同期処理を順次実行すること

```js
function sleep(val) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			console.log(val++);
			resolve(val);
		}, 1000);
	});
}

sleep(0).then(function(val) {
	return sleep(val);
}).then(function(val) {
	return sleep(val);
}).then(function(val) {
	return sleep(val);
}).then(function(val) {
	return sleep(val);
}).then(function(val) {
	return sleep(val);
})
```
