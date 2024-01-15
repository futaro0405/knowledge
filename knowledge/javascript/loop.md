## while
```
while (条件式){
}
```

## do-while
```
do {
}while(条件式)
```
## for

```
for(初期化式; 条件式; 増分式) {
}
```

## 配列のforEachメソッド

```
const array = [1, 2, 3];
array.forEach(currentValue => {
});
```

## 配列のsomeメソッド
配列の各要素をテストする処理をコールバック関数として受け取る。
コールバック関数が一度でも`true`を返したらloopを終了し、someメソッドはtrueを返す。
```
function isEven(num) {
  return num % 2 === 0;
}
const number = [1, 5, 10, 15, 20];
console.log(number.some(isEven));
```

## 配列のfilterメソッド
配列から特定の値だけ集めた新しい配列を作る`filter`メソッド
```
function isEven(num) {
  return num % 2 === 0;
}
const array = [1, 5, 10, 15 20];
console.log(array.filter(isEven));
```

## for...of
`Symbol.iterator`メソッドを実装したオブジェクトを __iterable__ とよび、iterableオブジェクトはfor..ofで反復処理できる。
```
const array = [1, 2, 3];
for (const value of array) {
  console.log(vakue);
}
// 1
// 2
// 3
```