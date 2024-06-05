# Promiseと並列処理
Promiseの並列処理をする`Promise.all`
反復可能オブジェクトでPromiseのインスタンスを詰める
格納された配列がすべて完了するまでthenを実行しない
thenに渡される引数は配列で渡される

```js
function sleep(val) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log(val++);
      reject(val);
    }, val * 500);
  });
}

Promise.allSettled([sleep(2), sleep(3), sleep(4)])
.then(function (data) {
  console.log(data);
}).catch(function(e) {
  console.error(e);
});

```