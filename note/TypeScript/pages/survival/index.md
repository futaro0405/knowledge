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