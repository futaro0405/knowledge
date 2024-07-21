# 値・型・変数

## boolean
TypeScriptのboolean型の型注釈は以下のように書く

```typescript
const isOk: boolean = true;
```

## number型（数値型）
1や-1などの整数と0.1などの小数を含めた数値の型。
2進数、8進数、16進数の表記も可能。
JavaScriptの数値リテラルは可読性のためにアンダースコアで区切って書けます。

```
123 // 整数
-123 // 整数(負の数)
20.315 // 小数

0b1010 // 2進数
0o755 // 8進数
0xfff // 16進数

100_000_000 // 1億

```

### number型の型注釈
TypeScriptでnumber型の型注釈は`number`を用います。

```typescript
const count: number = 123;
```

## string型 (文字列型)
TypeScriptのstring型の型注釈は`string`を用います。

```
const message: string = "Hello";
```

## null型
JavaScriptのnullは値がないことを示す値です
### nullの型注釈
TypeScriptでnull型を型注釈するには`null`を用います。
```
const x: null = null;
```

## undefined型
JavaScriptのundefinedは未定義を表すプリミティブな値です。
変数に値がセットされていないとき、戻り値が無い関数、オブジェクトに存在しないプロパティにアクセスしたとき、配列に存在しないインデックスでアクセスしたときなどに現れます。
```
let name;
console.log(name);
 
function func() {}
console.log(func());
 
const obj = {};
console.log(obj.name);
 
const arr = [];
console.log(arr[1]);
```

## undefinedの型注釈
TypeScriptでundefined型の型注釈を行うには、`undefined`を用います。

```typescript
const x: undefined = undefined;
```

## symbol型

### シンボルの型注釈
TypeScriptでシンボルの型注釈は`symbol`を用います。

```typescript
const s: symbol = Symbol();
```

## bigint型(長整数型)
JavaScriptのbigint型は、number型よりも大きな整数を扱えるプリミティブ型です。
## bigint型リテラル
JavaScriptのbigint型のリテラルは整数値の末尾に`n`をつけて書きます。

```typescript
const x = 100n;
```























