## 分割代入（Destructuring assignment）
配列から値を取り出し、あるいはオブジェクトからプロパティを取り出して別の変数に代入する式。
```
# 配列リテラル
const x = [1, 2, 3, 4, 5];
const [y, z] = x;
console.log(y); // 1
console.log(z); // 2
  
# オブジェクトリテラル
const obj = {
  a: 1,
  b: 2
};
const {a, b} = obj;
// これは以下と同じ
// const a = obj.a;
// const b = obj.b;
```