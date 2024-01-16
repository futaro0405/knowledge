プロパティの集合。
プロパティとは、名前（キー）と値（バリュー）がついになっているもの。
```
const color = {
  red: "red",
  green: "green",
  blue: "blue",
}
```
## 省略記法
プロパティ名と使用する変数名が同じ場合は省略して書くことができる。
```
const name = "名前";
const obj = {
  name
};
console.log(obj); // {name: "名前" }
```
## プロパティへのアクセス
```
const obj = {
  key: "value"
};
// ドット記法
console.log(obj.key);
// ブラケット記法
console.log(obj["key"]);
```
ドット記法では、プロパティ名は識別子の命名規則を満たす必要がある。  
ブラケット記法では任意の文字列をプロパティ名として指定できる。  
また、変数を指定することもできる。
```
const languages = {
  ja: "日本語",
  en: "英語"
};
  
const myLang = "ja";
console.log(languages[myLang]); // "日本語"
```
# オブジェクトと分割代入
`オブジェクト.プロパティ名`でアクセスすると冗長となる。
プロパティを変数に定義することで冗長になることを防ぐ。
```
const languages = {
  ja: "日本語",
  en: "英語"
}

const ja = languages.ja;
const en = languages.en;
console.log(ja); // "日本語"
console.log(en); // "英語"
```
この変数への代入には分割代入を利用することができる。
```
const languages = {
  ja: "日本語",
  en: "英語"
}

const {ja, en} = languages;
console.log(ja); // "日本語"
console.log(en); // "英語"
```
# プロパティの追加
プロパティはドット記法、ブラケット記法で追加できる。
## ドット記法でプロパティを追加
```
const obj = {};
obj.key = "value";
console.log(obj.key);
```
## ブラケット記法でプロパティを追加
```
const key = "key-string";
const obj = {};

obj[key] = "value of key";
console.log(obj[key]);
# オブジェクト内でも使用可能
const obj = {
  [key]: "vakue",
};
console.log(obj[key]);
```
プロパティを初期化以外で追加するとそのオブジェクトの持つプロパティがわかりにくくなる。  
作成後はできる限りプロパティの追加は行わないことがよい。  
# プロパティの削除
`delete`演算子を利用することでプロパティを削除できる。
```
const obj = {
  key1: "value1",
  key2; "value2"
};
// プロパティ削除
delete obj.key1;
```
# プロパティの存在確認
## in演算子
```
const obj = { key: undefined };

if ("key" in obj) {
  console.log("keyプロパティが存在する");
}
```
## Object.hasOwn静的メソッド
```
const obj = { key: undefined };
if (Object.hasOwn(obj: "key")) {
  console.log("objはkeyプロパティをもつ");
}
```
## Object.prototype.hasOwnPropertyメソッド
```
const obj = { key: undefined };
if (Object.hasOwnProperty("key")) {
  console.log("objはkeyプロパティをもつ");
}
```
`hasOwnProperty`メソッドは欠点があるため`hasOwn`メソッドをつかう。  
プロパティが存在するかが重要な場合は`in`演算子、または`Object.hasOwn`静的メソッドを使う。  
# オブジェクトの列挙
- `Object.keys`メソッド
  - オブジェクトのプロパティ名の配列を返す
- `Object.values`メソッド
  - オブジェクトの値の配列を返す
- `Object.entries`メソッド
  - オブジェクトのプロパティ名と値の配列を返す
```
const obj = {
  "one": 1,
  "two": 2,
  "three": 3
};

console.log(Object.keys(obj));
// ["one", "two", "three"]
console.log(Object.values(obj));
// [1,2,3]
console.log(Object.enties(obj));
// [["one", 1],["two", 2],["three", 3]]
```
# オブジェクトのマージと複製
`Object.assign`メソッドは、あるオブジェクトを別のオブジェクトに代入できる。  
`Object.assign`を使うことでオブジェクトの複製、マージができる。
## オブジェクトのマージ
```
const objectA = { a: "a" };
const objectA = { b: "b" };
const merged = Object.assign({}, objectA, objectB);
console.log(merged); // { a: "a", b: "b" }
```
第一引数にオブジェクトを指定した場合はそのオブジェクトのプロパティが追加される。
プロパティ名が重複した場合、後ろのオブジェクトのプロパティにより上書きされる。
```
const objectA = { a: "a" };
const objectA = { b: "b" };
const merged = Object.assign(ObjectA, ObjectB,);
console.log(merged); // { a: "a", b: "b" }
console.log(objectA); // { a: "a", b: "b" }
console.log(merged === objectA); // true
```
## spread構文でのマージ
配列の要素を展開する`...`（spread構文）でオブジェクトのマージを行うこともできる。  
オブジェクトのspread構文は必ず新しいオブジェクトを作成する。  
```
const objectA = { a: "a" };
const objectA = { b: "b" };
const merged = {
  ...objectA,
  ...objectB
};
console.log(merged); // { a: "a", b: "b" }
```
# オブジェクトの複製
```
const shallowClone = (obj) => {
  return Object.assign({}, obj);
};
const obj = { a: "a" };
const cloneObj = shallowClone(obj);
console.log(cloneObj); // { a: "a" }
// オブジェクトを複製しているため、別オブジェクトになる
console.log(obj === cloneObj); // false
```