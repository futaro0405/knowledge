## 関数と宣言
### 関数とは
ある一連の手続きを1つの処理としてまとめる機能。
### 関数宣言
`function`キーワードで関数を定義する。

```
// 関数宣言
function 関数名(仮引数1, 仮引数2) {
  // 処理
  return 関数の返り値;
}

// 関数呼び出し
const 関数の結果 = 関数名(引数1, 引数2);
```
## 関数の引数
JavaScriptでは関数に定義された引数の個数と呼び出した時の引数の個数が異なる場合でも関数が呼び出せる。
### 引数が少ないとき
余った仮引数には`undefined`の値が代入される
```
function echo(x, y) {
  return [x, y];
}
console.log(echo(1, 2)); // [1, 2]
console.log(echo(1)); // [1, undefined]
```
#### デフォルト引数
仮引数に引数が渡されない場合に代入される値を指定できる。
```
function 関数名(仮引数1 = デフォルト値1, 仮引数2 = デフォルト値2) {
}
```
#### OR演算子でのデフォルト引数
デフォルト引数が導入されるまでは、OR演算子(||)を使ったデフォルト値の指定をしていた。
```
function 関数名(value1, value2) {
  const value111 = Value1 || "デフォルト値";
  const value222 = Value2 || "デフォルト値";
}
```
##### 問題点
OR演算子(||)では左辺のオペランドがfalsyな値のとき、右辺のオペランドを評価するため左辺が空文字列を指定した場合でもデフォルト値が入ります。
デフォルト引数を使って書くようにしましょう。
- falsyな値
  - false
  - undefined
  - null
  - 0
  - 0n
  - NaN
  - ""(空文字)
##### 例

```
function addPrefix(text, prefix) {
  const pre = prefix || "デフォルト";
  const pre = text;
}
  
console.log(addPrefix("文字列")); // デフォルト文字列
console.log(addPrefix("文字列", "")); // デフォルト文字列
```
Nullish coalescing演算子(??)を利用することで、OR演算子(||)の問題を避けつつデフォルト値を指定できる。
```
function addPrefix(text, prefix) {
  const pre = prefix ?? "デフォルト：";
  return pre + text;
}
  
console.log(addPrefix("文字列")); // "デフォルト：文字列"
console.log(addPrefix("文字列", "")); // "文字列"
console.log(addPrefix("文字列", "カスタム")); // "カスタム：文字列"
```
### 引数が多いとき
関数の仮引数に対し引数の個数が多いとき、あふれた引数は無視される。
  
### 可変長引数
引数の個数が固定ではなく任意の引数を受け取れる引数のことを可変長引数という。
#### Rest parameters(残余引数)
仮引数名の前に`...`をつけることで引数に配列として渡される。
通常の仮引数と組み合わせるとき、必ず末尾の仮引数として定義する必要がある。
##### 例
```
function fn(...args) {
  console.log(args);
}
fn("a", "b", "c");
  
# 通常の仮引数との組み合わせ
function fn(arg1, ...restArgs) {
  console.log(arg1); // "a"
  console.log(restArgs); // ["b", "c"]
}
fn("a", "b", "c");
```

#### 例

```
function fn(x, y, z) {
  console.log(x);
  console.log(y);
  console.log(z);
}
const array = [1, 2, 3];
  
fn(...array);
fn(array[0], array[1], array[2]);
```
### arguments
`arguments`という変数を使用することで可変長引数を扱うことができる。
`arguments`は関数に渡された引数がすべて入った`Array-like`なオブジェクトで、配列のようにインデックスで要素にアクセスできるが`Array`のメソッドは利用できない特性がある。
#### 例

```
function fn() {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}
fn("a","b","c");
```
Rest parametersが利用できる環境では`arguments`変数を使うべきでない。
- Arrow Functionでは利用できない。
- Array-likeオブジェクトであるため、Arrayメソッドが利用できない
- 関数が可変長変数を受け付けるかを判断しずらい
## 関数の引数と分割代入
関数の引数に分割代入を使用することで以下のように定義できる。
```
function printUserId({ id }) {
  console.log(id);
}
const user = {
  id: 42
};
printUserId(user);
# 配列を用いた分割代入
function print([first, second]) {
  console.log(first); // 1
  console.log(second); // 2
}
const array = [1, 2];
print(array);
```

## 関数はオブジェクト

関数はオブジェクトの一種。関数名の`()`をつけることで関数として処理を呼び出せる。
`()`をつけなければ関数をオブジェクトとして参照できる。
関数は他の値と同じように変数へ代入したり、関数の引数として渡すことが可能。
関数が値として扱えることを、ファーストクラスファンクション（第一級関数）という。
### 例
```
function fn() {
  console.log("fn呼び出し");
}
const myFunc = fn;
myFunc();
```

## 関数式
関数を変数として代入する式。
名前を持たない関数を匿名関数（または無名関数）と呼ぶ。
```
// 関数式は変数名で参照できるため、"関数名"を省略できる（匿名関数）
const 変数名 = function() {
}
// 関数宣言では"関数名"は省略できない
function 関数名() {
}
```
関数式で関数名を定義することはできるがこの関数名を関数外から呼び出すことはできない。
関数の中で再帰的に関数を呼び出す際に用いられる。
```

const factorial = function innerFact(n) {
  if (n === 0) {
    return 1;
  }
  return n * innerFact(n - 1);
};

console.log(factorial(3));
```

## Arrow Function
`=>`を使い、匿名関数を定義する。
省略記法があり、次の場合に短縮してかける。
- 関数の仮引数が1つのとき()は省略
- 関数の処理が1つの式である場合に、ブロックとreturn文を省略
### 例
```
const 変数名 = () => {
  return 戻り値;
}
// 省略形
const fn = () =>{};
const fn = (x) =>{};
const fn = x =>{};
const fn = (x, y) =>{};

const fn = x =>{ return x * x; };
const fn = x => x * x;
```