# keyof
**keyof**はオブジェクトの型からプロパティ名を型として返却する型演算子。

例えば、`OneDayMeals`というオブジェクトの型があるとする。
その型のオブジェクトから、特定のkeyの値の長さを取得する関数を作成する場合に、その関数の引数の型を、`key: 'morning' | 'lunch' | 'dinner'`と宣言する必要があるが、`keyof`を使用することで、`key: keyof OneDayMeals`と宣言することができる。

```index.ts
type OneDayMeals = {
  morning: string;
  lunch: string;
  dinner: string;
};

const meal1: OneDayMeals = {
  morning: 'フレンチトースト',
  lunch: '焼きそば',
  dinner: 'とんかつ定食'
}

const outputValueLength = (key: keyof OneDayMeals) => {
  console.log(meal1[key].length);
}
```
