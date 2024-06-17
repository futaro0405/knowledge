## TypeScriptとは

- JavaScriptの**スーパーセット**となるプログラミング言語
- **静的型付け言語**であり、プログラムの正しさが**静的に検査**できる
- ライブラリやIDEなどの開発環境が充実しており、**大きなエコシステム**を持っている
- **Microsoft**が2012年に開発し、**オープンソース**で公開した
## TypeScriptはJavaScriptのスーパーセット
- **スーパーセット**とは、元の言語との**互換性**を保ちつつ、元の言語を**拡張**して作った言語のこと
- TypeScriptは、JavaScriptとの互換性を保ちつつ、JavaScriptを拡張して作った言語である
- よって、JavaScriptのコードはすべてTypeScriptとしてあつかえる
- TypeScriptは、型注釈やインターフェース、ジェネリクスなど独自の機能を追加している
### スーパーセットのメリット
- **学習のしやすさ**
	- JavaScriptの知識を活かしてTypeScriptを学べる
- **資産が活かせる**
	- 既存のJavaScriptコード資産を活かして開発できる
- **移行のしやすさ**
	- 既存のJavaScriptプロジェクトはTypeScriptへ移行がしやすい

## 静的な検査
- TypeScriptはプログラムの正しさを静的に検査できる
- JavaScriptは実行しないとバグがあるかを確かめられない
- TypeScriptは実行せずにチェックが行える
### 開発効率と品質を向上し、安心感を高める[​](https://typescriptbook.jp/#%E9%96%8B%E7%99%BA%E5%8A%B9%E7%8E%87%E3%81%A8%E5%93%81%E8%B3%AA%E3%82%92%E5%90%91%E4%B8%8A%E3%81%97%E5%AE%89%E5%BF%83%E6%84%9F%E3%82%92%E9%AB%98%E3%82%81%E3%82%8B "開発効率と品質を向上し、安心感を高める への直接リンク")
- 問題を早期に発見し、開発を効率化できる
- コーディング時に問題を発見し、修正できるため、バグを予防できる
- エディターとTypeScriptを連携させると、リアルタイムのチェックやコード補完が可能
- 問題を早期に修正できることで、製品の信頼感や安心感が高まる
- 見通しの悪い大規模なプログラムや、重要なシステムの開発では静的な検査が安心材料になる
## 検査の仕組み
- TypeScriptの検査は**型システム**に基づく
- 型システムに基づき、**コンパイル**のタイミングでプログラムを検査する
### 型システム
- 型システムは、データの種別ごとに型を与え、データに対して行える操作に制約を設ける
- これにより、変数には決められた値のみが代入され、決められた操作のみが行われることが保証され、プログラムが正確で安全になる
- 型システムは、数学の「型理論」を背景に構築され、数学的証明によりプログラムの欠陥をあぶり出せる
### 型注釈
- 変数にどのような値が代入できるのかを制約するものを「**型**」と言う
- 開発者は、変数がどのような型なのかを**型注釈**で指定する
- TypeScriptでは、型注釈を手がかりに検査が行われる
### 型推論
- 値の型が文脈で明白な場合、型が自動で判断される。この仕組みを**型推論**という
- 型推論のおかげで、開発者は型注釈を割愛でき、記述量を減らせる
### コンパイル
- TypeScriptを実行するために、JavaScriptへ変換する。この変換のことを**コンパイル**という
- 変換後のJavaScriptコードはブラウザやサーバーで実行できる
- TypeScriptの検査はコンパイルのタイミングで行われる
## 型はドキュメント、リファクタリング、ツールの充実にも寄与
- **ドキュメントになる**: 型情報はドキュメントの役割を果たし、コードの理解を助ける
- **リファクタリングが安全に**: 変数の型や関数のシグネチャを変更したとき、修正が必要な箇所がコンパイル時にすべて分かり、不注意による誤修正を減らせる
- **ツールサポートが充実**: IDEやエディターでのリアルタイムのエラーチェック、自動補完、リファクタリングツール、ナビゲーションなど、開発ツールのサポートが充実している
## 多くのエディターがTypeScriptをサポート
- Visual Studio Code
- JetBrains IDE (IntelliJ, WebStorm, PhpStorm, RubyMine, PyCharm, GoLandなど)
- Vim
- NeoVim
- Emacs (Tide)
- Atom
- Sublime Text
## 多様なソフトウェアが作れる[​](https://typescriptbook.jp/#%E5%A4%9A%E6%A7%98%E3%81%AA%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%81%8C%E4%BD%9C%E3%82%8C%E3%82%8B "多様なソフトウェアが作れる への直接リンク")
作れるものの範囲が広いことは、TypeScriptの魅力のひとつ。

- **Webアプリケーション**: TypeScriptの主戦場。フロントエンドの開発に広く使用される。
- **サーバーサイドアプリケーション**: Node.jsと組み合わせて、バックエンドやAPIサーバーを開発することが可能。
- **モバイルアプリケーション**: React Nativeなどのフレームワークを利用して、モバイルアプリケーションを開発できる。
- **デスクトップアプリケーション**: Electronを使用して、クロスプラットフォームのデスクトップアプリを開発できる。
- **クラウド関連の機能**: AWS LambdaやAzure Functionsなどのクラウドプラットフォームで、サーバーレス関数が作成できる。
- **ユーティリティーやCLIツール**: コマンドラインツールや各種ユーティリティの開発ができる。
- **インフラ構成管理(IaC)**: PulumiやAWS CDKを使用して、インフラの構成を管理することができる。
- **アプリケーションの拡張機能**: Google ChromeやVisual Studio Codeなどデスクトップアプリケーションの拡張をTypeScriptで開発できる。

» [TypeScriptの射程圏について詳しく知る](https://typescriptbook.jp/overview/range-of-typescript)

## TypeScriptを導入した企業の感想[​](https://typescriptbook.jp/#typescript%E3%82%92%E5%B0%8E%E5%85%A5%E3%81%97%E3%81%9F%E4%BC%81%E6%A5%AD%E3%81%AE%E6%84%9F%E6%83%B3 "TypeScriptを導入した企業の感想 への直接リンク")

- **[Slack](https://slack.engineering/typescript-at-slack/)**: コードベースが大規模になっても、型システムが安全性と信頼性を保証してくれる。
- **[Airbnb](https://www.reddit.com/r/typescript/comments/aofcik/38_of_bugs_at_airbnb_could_have_been_prevented_by/)**: TypeScriptを使っていたらAirbnbの38%ものバグを未然に防げた。
- **[ヤフー株式会社](https://codezine.jp/article/detail/16905)**: 静的型付けによりコードの品質とメンテナンス性が向上し、IDEとの連携により開発者の生産性が向上した。
- **[LINE株式会社](https://logmi.jp/tech/articles/322702)**: ちょっとした修正でもかかるQAのコストを、TypeScript化によって抑制。
- **[Sansan株式会社](https://buildersbox.corp-sansan.com/entry/2021/06/24/110000)**: 型がドキュメントとしての役割を果たし、コードリーディングや他チームのコード変更に役立った。採用の文脈でアピールポイントにもなった。
- **[ラクスル株式会社](https://techblog.raksul.com/entry/2020/10/07/after-introducing-typescript-to-existing-product/)**:型システムの恩恵が得られる、エディターの入力補完を受けられる、コード=ドキュメントという状況を作りやすい。

## 基本的な型[​](https://typescriptbook.jp/#%E5%9F%BA%E6%9C%AC%E7%9A%84%E3%81%AA%E5%9E%8B "基本的な型 への直接リンク")

### プリミティブ型[​](https://typescriptbook.jp/#%E3%83%97%E3%83%AA%E3%83%9F%E3%83%86%E3%82%A3%E3%83%96%E5%9E%8B "プリミティブ型 への直接リンク")

- [`boolean`](https://typescriptbook.jp/reference/values-types-variables/boolean): 真偽値。
- [`number`](https://typescriptbook.jp/reference/values-types-variables/number): 数値。
- [`string`](https://typescriptbook.jp/reference/values-types-variables/string): 文字列。
- [`bigint`](https://typescriptbook.jp/reference/values-types-variables/bigint): 大きな整数。
- [`symbol`](https://typescriptbook.jp/reference/values-types-variables/symbol): 一意の値を示す。
- [`undefined`](https://typescriptbook.jp/reference/values-types-variables/undefined): 値が定義されていない状態を示す。
- [`null`](https://typescriptbook.jp/reference/values-types-variables/null): 値が存在しない状態を示す。

`   const isReady: boolean = false;  const age: number = 25;  const fullName: string = "John Doe";  const bigNumber: bigint = 100n;  const uniqueSymbol: symbol = Symbol("unique");  const notDefined: undefined = undefined;  const empty: null = null;   `

コピー

### 特殊な型[​](https://typescriptbook.jp/#%E7%89%B9%E6%AE%8A%E3%81%AA%E5%9E%8B "特殊な型 への直接リンク")

- [`any`](https://typescriptbook.jp/reference/values-types-variables/any): 何でも代入できる型。型が不明な場合に使用する。その値に対する操作の制限がなく、型の安全性は弱まる。
- [`unknown`](https://typescriptbook.jp/reference/statements/unknown): any型と似て、何でも代入できる型。その値に対する操作は制限され、型の安全性が保たれる。
- [`void`](https://typescriptbook.jp/reference/functions/void-type): 値が存在しないことを示す。関数が何も返さない場合に使用する。
- [`never`](https://typescriptbook.jp/reference/statements/never): 決して何も返さないことを示す。エラーを投げる関数や無限ループの関数の戻り値として使用する。

`   const a: any = 100; // 代入できる  console.log(a * 3); // 操作もできる  300  const x: unknown = 100; // 代入はできる  console.log(x * 3); // 操作はできない  'x' is of type 'unknown'.'x' is of type 'unknown'.  // 戻り値のない関数  function doSomething(): void {}  // 戻り値を返すことがありえない関数  function throwError(): never {    throw new Error();  }   `

コピー

## 型エイリアス[​](https://typescriptbook.jp/#%E5%9E%8B%E3%82%A8%E3%82%A4%E3%83%AA%E3%82%A2%E3%82%B9 "型エイリアス への直接リンク")

- [型エイリアス](https://typescriptbook.jp/reference/values-types-variables/type-alias)は既存の型を新たな名前で定義する機能。
- より複雑な型を簡素に表現したり、コードの可読性を向上するのに役立つ。

`   type StringOrNumber = string | number;  let value: StringOrNumber;  value = "hello"; // string型が代入可能  value = 123; // number型も代入可能   `

コピー

## 構造的部分型[​](https://typescriptbook.jp/#%E6%A7%8B%E9%80%A0%E7%9A%84%E9%83%A8%E5%88%86%E5%9E%8B "構造的部分型 への直接リンク")

- TypeScriptは[構造的部分型](https://typescriptbook.jp/reference/values-types-variables/structural-subtyping)を採用している。
- 構造的部分型では、変数の代入可否を、構造が互換しているかに着目して判定する。

`  type Summary = { name: string };  type Detail = { name: string; age: number };  const johnDetail: Detail = { name: "John", age: 28 };  const summary: Summary = johnDetail; // 代入できる。構造的部分型として互換があるため  const johnSummary: Summary = { name: "John" };  const detail: Detail = johnSummary; // 代入できない。構造的部分型として互換がない（ageを含まないため）  Property 'age' is missing in type 'Summary' but required in type 'Detail'.Property 'age' is missing in type 'Summary' but required in type 'Detail'.`

コピー

## 配列[​](https://typescriptbook.jp/#%E9%85%8D%E5%88%97 "配列 への直接リンク")

### 配列リテラル[​](https://typescriptbook.jp/#%E9%85%8D%E5%88%97%E3%83%AA%E3%83%86%E3%83%A9%E3%83%AB "配列リテラル への直接リンク")

- 配列の値を作るには[配列リテラル](https://typescriptbook.jp/reference/values-types-variables/array/array-literal)(`[]`)を使う。
- `[要素1, 要素2, ...]`の形で配列の初期値を設定できる。

`   const numbers = [1, 2, 3];   `

コピー

### 配列の型注釈[​](https://typescriptbook.jp/#%E9%85%8D%E5%88%97%E3%81%AE%E5%9E%8B%E6%B3%A8%E9%87%88 "配列の型注釈 への直接リンク")

- [配列の型注釈](https://typescriptbook.jp/reference/values-types-variables/array/type-annotation-of-array)には`型名[]`または`Array<型名>`を使う。

`   let numbers: number[];  let strings: Array<string>;   `

コピー

### 配列要素へのアクセス[​](https://typescriptbook.jp/#%E9%85%8D%E5%88%97%E8%A6%81%E7%B4%A0%E3%81%B8%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9 "配列要素へのアクセス への直接リンク")

- [配列要素にアクセスする](https://typescriptbook.jp/reference/values-types-variables/array/how-to-access-elements-in-an-array)にはインデックス（インデックス）を使う。
- 0から始まる整数を指定して配列の値を取得し、代入も可能。

`   const colors = ["red", "green", "blue"];  console.log(colors[0]);  'red'  colors[1] = "yellow";  console.log(colors);  ['red', 'yellow', 'blue']   `

コピー

### 読み取り専用配列[​](https://typescriptbook.jp/#%E8%AA%AD%E3%81%BF%E5%8F%96%E3%82%8A%E5%B0%82%E7%94%A8%E9%85%8D%E5%88%97 "読み取り専用配列 への直接リンク")

- [読み取り専用配列](https://typescriptbook.jp/reference/values-types-variables/array/readonly-array)は値の変更ができない配列を表す。
- 配列の型注釈に`readonly`をつけると読み取り専用配列となる。
- `ReadonlyArray<型名>`でも読み取り専用配列が宣言でき、`readonly 型名[]`と機能は同じ。

`  const numbers: readonly number[] = [1, 2, 3];  const strings: ReadonlyArray<string> = ["hello", "world"];  numbers[0] = 4; // 値を変更できない  Index signature in type 'readonly number[]' only permits reading.Index signature in type 'readonly number[]' only permits reading.  strings.push("!"); // 要素を追加できない  Property 'push' does not exist on type 'readonly string[]'.Property 'push' does not exist on type 'readonly string[]'.`

コピー

### 配列のループ[​](https://typescriptbook.jp/#%E9%85%8D%E5%88%97%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%97 "配列のループ への直接リンク")

- [配列をループする](https://typescriptbook.jp/reference/values-types-variables/array/how-to-loop-an-array)ための`for...of`構文もある。

`   const numbers = [1, 2, 3];  for (const num of numbers) {    console.log(num); // 1, 2, 3と出力される  }   `

コピー

## タプル型[​](https://typescriptbook.jp/#%E3%82%BF%E3%83%97%E3%83%AB%E5%9E%8B "タプル型 への直接リンク")

- [タプル型](https://typescriptbook.jp/reference/values-types-variables/tuple)を使うと、配列の要素数と要素の型が固定される。
- それぞれの要素のインデックスごとに型が決まる。

`  let tuple: [string, number];  tuple = ["hello", 10]; // 代入できる  tuple = [10, "hello"]; // 順序が正しくないため、代入できない  Type 'number' is not assignable to type 'string'.   Type 'string' is not assignable to type 'number'.Type 'number' is not assignable to type 'string'.   Type 'string' is not assignable to type 'number'.  tuple = ["hello", 10, "world"]; // 要素が多すぎるため代入できない  Type '[string, number, string]' is not assignable to type '[string, number]'.   Source has 3 element(s) but target allows only 2.Type '[string, number, string]' is not assignable to type '[string, number]'.   Source has 3 element(s) but target allows only 2.`

コピー

### タプルの要素へのアクセス[​](https://typescriptbook.jp/#%E3%82%BF%E3%83%97%E3%83%AB%E3%81%AE%E8%A6%81%E7%B4%A0%E3%81%B8%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9 "タプルの要素へのアクセス への直接リンク")

- タプルの要素にアクセスする場合も配列同様にインデックス（インデックス）を使用する。

`   const tuple: [string, number] = ["hello", 10];  console.log(tuple[0]);  'hello'   `

コピー

## オブジェクト[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88 "オブジェクト への直接リンク")

### オブジェクトリテラル[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%AA%E3%83%86%E3%83%A9%E3%83%AB "オブジェクトリテラル への直接リンク")

- オブジェクトの作り方は[オブジェクトリテラル](https://typescriptbook.jp/reference/values-types-variables/object/object-literal)(`{}`)を使う。
- `{ プロパティキー: 値, ... }` の形でオブジェクトの初期値を設定できる。

`   const john = { name: "John", age: 20 };   `

コピー

### プロパティアクセス[​](https://typescriptbook.jp/#%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9 "プロパティアクセス への直接リンク")

- ドット`.`を使ってオブジェクトのプロパティにアクセスできる。

`   console.log(john.name);  'John'   `

コピー

### オブジェクトの型注釈[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E5%9E%8B%E6%B3%A8%E9%87%88 "オブジェクトの型注釈 への直接リンク")

- [オブジェクトの型注釈](https://typescriptbook.jp/reference/values-types-variables/object/type-annotation-of-objects)は`{プロパティ1: 型1, プロパティ2: 型2, ...}`の形で記述する。

`   let obj: { name: string; age: number };   `

コピー

### readonlyプロパティ[​](https://typescriptbook.jp/#readonly%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3 "readonlyプロパティ への直接リンク")

- [`readonly`](https://typescriptbook.jp/reference/values-types-variables/object/readonly-property)をつけたプロパティは代入できない。

`  let obj: { readonly name: string; age: number };  obj = { name: "John", age: 20 };  obj.name = "Tom";  Cannot assign to 'name' because it is a read-only property.Cannot assign to 'name' because it is a read-only property.`

コピー

### オプションプロパティー[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%83%BC "オプションプロパティー への直接リンク")

- [オプショナルプロパティー](https://typescriptbook.jp/reference/values-types-variables/object/optional-property)`?`をつけたプロパティは省略可能。

``   let obj: { name: string; age?: number };  obj = { name: "John" }; // `age`プロパティがなくてもエラーにならない   ``

コピー

### オブジェクトメソッド[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89 "オブジェクトメソッド への直接リンク")

- 関数をプロパティに持つオブジェクトを定義できる。

`   const obj = {    a: 1,    b: 2,    sum(): number {      return this.a + this.b;    },  };  console.log(obj.sum());  3   `

コピー

### インデックス型[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E5%9E%8B "インデックス型 への直接リンク")

- オブジェクトは[インデックス型](https://typescriptbook.jp/reference/values-types-variables/object/index-signature)を利用して任意のキーの値を取得することができる。
- インデックス型プロパティの型注釈は`[キー名: プロパティキーの型]: プロパティ値の型` の形で記述する。

`   let obj: { [key: string]: number };  obj = { key1: 1, key2: 2 };  console.log(obj["key1"]);  1  console.log(obj["key2"]);  2   `

コピー

### Shorthand property names[​](https://typescriptbook.jp/#shorthand-property-names "Shorthand property names への直接リンク")

- プロパティの値がすでに定義されている変数である場合、そのプロパティ名を省略して記述できる([shorthand property names](https://typescriptbook.jp/reference/values-types-variables/object/shorthand-property-names))。

`   const name = "John";  const age = 20;  const obj = { name, age };  console.log(obj);  { name: 'John', age: 20 }   `

コピー

### オプショナルチェーン[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%8A%E3%83%AB%E3%83%81%E3%82%A7%E3%83%BC%E3%83%B3 "オプショナルチェーン への直接リンク")

- プロパティが存在するかどうか不確定である場合、`?.`演算子（[オプショナルチェーン](https://typescriptbook.jp/reference/values-types-variables/object/optional-chaining)）で安全にアクセスできる。

`   function printLength(obj: { a?: string }) {    console.log(obj.a?.length);  }  printLength({ a: "hello" });  5  printLength({});  undefined   `

コピー

## Map[​](https://typescriptbook.jp/#map "Map への直接リンク")

### Mapオブジェクト[​](https://typescriptbook.jp/#map%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88 "Mapオブジェクト への直接リンク")

- [Mapオブジェクト](https://typescriptbook.jp/reference/builtin-api/map)はキーとそれに対応する値を対にしたコレクション。
- キーはオブジェクトも含め任意の値が可能。

`   const map = new Map();  map.set("name", "John");  map.set("age", "20");  console.log(map.get("name"));  'John'   `

コピー

### Mapの型注釈[​](https://typescriptbook.jp/#map%E3%81%AE%E5%9E%8B%E6%B3%A8%E9%87%88 "Mapの型注釈 への直接リンク")

- Mapの型注釈は`Map<キーの型, 値の型>`の形で記述する。

`   let people: Map<string, number>;   `

コピー

### Mapのループ[​](https://typescriptbook.jp/#map%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%97 "Mapのループ への直接リンク")

- Mapオブジェクトは`for...of`でループすると、各エントリーがキーと値の配列として順に取得できる。
- 要素の順序は、要素を追加した順が保証されている。

`   for (const [key, value] of map) {    console.log(key, value);  }   `

コピー

## Set[​](https://typescriptbook.jp/#set "Set への直接リンク")

### Set オブジェクト[​](https://typescriptbook.jp/#set-%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88 "Set オブジェクト への直接リンク")

- [Setオブジェクト](https://typescriptbook.jp/reference/builtin-api/set)は同じ値が存在しないコレクション。
- Setの要素は何でも可能である。

`   const set = new Set();  set.add(1);  set.add(2);  set.add(2); // 同じ値は追加されない。  console.log(set);  Set {1, 2}   `

コピー

### Setの型注釈[​](https://typescriptbook.jp/#set%E3%81%AE%E5%9E%8B%E6%B3%A8%E9%87%88 "Setの型注釈 への直接リンク")

- Setの型注釈は`Set<要素の型>`の形で記述する。

`   let numSet: Set<number>;   `

コピー

### Setのループ[​](https://typescriptbook.jp/#set%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%97 "Setのループ への直接リンク")

- SetもMap同様に`for...of`でループすることが可能。
- 順序は`add`した順。

`   for (const value of set) {    console.log(value);  }   `

コピー

## 列挙型 (Enum)[​](https://typescriptbook.jp/#%E5%88%97%E6%8C%99%E5%9E%8B-enum "列挙型 (Enum) への直接リンク")

### 列挙型の基本[​](https://typescriptbook.jp/#%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%AE%E5%9F%BA%E6%9C%AC "列挙型の基本 への直接リンク")

- [列挙型](https://typescriptbook.jp/reference/values-types-variables/enum)(enum)は、関連する一連の数値または文字列値の集まりを定義する。
- 列挙型は`enum`キーワードを使用して定義する。

`   enum Color {    Red,    Green,    Blue,  }   `

コピー

### 列挙型に値を設定[​](https://typescriptbook.jp/#%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%AB%E5%80%A4%E3%82%92%E8%A8%AD%E5%AE%9A "列挙型に値を設定 への直接リンク")

- 列挙体の値は文字列リテラルまたは数値リテラルで指定できる。

`   enum Color {    Red = "red",    Green = "green",    Blue = "blue",  }   `

コピー

### 列挙型の利用[​](https://typescriptbook.jp/#%E5%88%97%E6%8C%99%E5%9E%8B%E3%81%AE%E5%88%A9%E7%94%A8 "列挙型の利用 への直接リンク")

- 列挙型の各値にアクセスするにはドット演算子を使用する。

`   const myColor: Color = Color.Red;   `

コピー

## ユニオン型[​](https://typescriptbook.jp/#%E3%83%A6%E3%83%8B%E3%82%AA%E3%83%B3%E5%9E%8B "ユニオン型 への直接リンク")

- [ユニオン型](https://typescriptbook.jp/reference/values-types-variables/union)は複数の型のうちのいずれかをとる値を表現できる。
- `型1 | 型2 | ...`の形式で使う。
- ひとつ以上の異なる型の値を同じ変数で扱う場合に使用する。

`   let value: boolean | number;  value = true; // 代入できる  value = 100; // 代入できる   `

コピー

### 判別可能なユニオン型[​](https://typescriptbook.jp/#%E5%88%A4%E5%88%A5%E5%8F%AF%E8%83%BD%E3%81%AA%E3%83%A6%E3%83%8B%E3%82%AA%E3%83%B3%E5%9E%8B "判別可能なユニオン型 への直接リンク")

- [判別可能なユニオン型](https://typescriptbook.jp/reference/values-types-variables/discriminated-union)は、共通のリテラル型のプロパティを持つ特別なユニオン型。
- 共通のプロパティを利用して、型を判別できる。

`   type Triangle = { kind: "triangle"; base: number; height: number };  type Rectangle = { kind: "rectangle"; width: number; height: number };  type Shape = Triangle | Rectangle;  function getArea(shape: Shape): number {    // 共通のプロパティkindを利用して型を判定する    switch (shape.kind) {      case "triangle":        // この節ではshapeがTriangle型に絞り込まれる        return (shape.base * shape.height) / 2;      case "rectangle":        //  この節ではshapeがRectangle型に絞り込まれる        return shape.width * shape.height;    }  }   `

コピー

## インターセクション型[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%82%BB%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E5%9E%8B "インターセクション型 への直接リンク")

- [インターセクション型](https://typescriptbook.jp/reference/values-types-variables/intersection)は複数の型を1つに結合した新しい型を定義する。
- `型1 & 型2 & ...`の形式で使う。
- その結果として生じた型は、それぞれの型が持つすべてのプロパティとメソッドを備えている。

`   type Octopus = { swims: boolean };  type Cat = { nightVision: boolean };  type Octocat = Octopus & Cat;  const octocat: Octocat = { swims: true, nightVision: true };  console.log(octocat);  { swims: true, nightVision: true }   `

コピー

## 分割代入[​](https://typescriptbook.jp/#%E5%88%86%E5%89%B2%E4%BB%A3%E5%85%A5 "分割代入 への直接リンク")

- 分割代入を使うと、配列の各要素を一度に変数に代入できる([配列の分割代入](https://typescriptbook.jp/reference/values-types-variables/array/destructuring-assignment-from-array))。

`   const [a, b] = [1, 2];  console.log(a);  1  console.log(b);  2   `

コピー

- 分割代入により、オブジェクトのプロパティを個別の変数へ代入できる([オブジェクトの分割代入](https://typescriptbook.jp/reference/values-types-variables/object/destructuring-assignment-from-objects))。

`   const obj = {    name: "John",    age: 20,  };  const { name, age } = obj;  console.log(name);  'John'  console.log(age);  20   `

コピー

## 条件分岐[​](https://typescriptbook.jp/#%E6%9D%A1%E4%BB%B6%E5%88%86%E5%B2%90 "条件分岐 への直接リンク")

- TypeScriptではJavaScriptと同様に、条件分岐には`if`構文や`switch`構文が利用できる。

### [if-else文](https://typescriptbook.jp/reference/statements/if-else)[​](https://typescriptbook.jp/#if-else%E6%96%87 "if-else文 への直接リンク")

`   const age: number = 20;  if (age >= 20) {    console.log("You are an adult.");  } else {    console.log("You are a minor.");  }  'You are an adult.'   `

コピー

### [switch文](https://typescriptbook.jp/reference/statements/switch)[​](https://typescriptbook.jp/#switch%E6%96%87 "switch文 への直接リンク")

`   const color: string = "blue";  switch (color) {    case "red":      console.log("Color is red.");      break;    case "blue":      console.log("Color is blue.");      break;    default:      console.log("Color is neither red nor blue.");  }  'Color is blue.'   `

コピー

### 型の絞り込み[​](https://typescriptbook.jp/#%E5%9E%8B%E3%81%AE%E7%B5%9E%E3%82%8A%E8%BE%BC%E3%81%BF "型の絞り込み への直接リンク")

- 条件分岐を利用すると、その節内では型が自動的に絞り込まれる([制御フロー分析と型ガードによる型の絞り込み](https://typescriptbook.jp/reference/statements/control-flow-analysis-and-type-guard))。

`   let value: string | number;  // 50%の確率でstring型またはnumber型の値を代入する  value = Math.random() < 0.5 ? "Hello" : 100;  if (typeof value === "string") {    // この節ではvalueはstring型として扱われる    console.log(value.toUpperCase());  } else {    // この節ではvalueはnumber型として扱われる    console.log(value * 3);  }   `

コピー

## 関数[​](https://typescriptbook.jp/#%E9%96%A2%E6%95%B0 "関数 への直接リンク")

- TypeScriptではアロー関数や関数宣言に型注釈をつけることができる。

### [アロー関数](https://typescriptbook.jp/reference/functions/arrow-functions)[​](https://typescriptbook.jp/#%E3%82%A2%E3%83%AD%E3%83%BC%E9%96%A2%E6%95%B0 "アロー関数 への直接リンク")

``   const greet = (name: string): string => {    return `Hello ${name}`;  };  console.log(greet("John"));  'Hello John'   ``

コピー

### [関数宣言](https://typescriptbook.jp/reference/functions/function-declaration)[​](https://typescriptbook.jp/#%E9%96%A2%E6%95%B0%E5%AE%A3%E8%A8%80 "関数宣言 への直接リンク")

``   function greet(name: string): string {    return `Hello ${name}`;  }  console.log(greet("John"));  'Hello John'   ``

コピー

### 分割代入引数[​](https://typescriptbook.jp/#%E5%88%86%E5%89%B2%E4%BB%A3%E5%85%A5%E5%BC%95%E6%95%B0 "分割代入引数 への直接リンク")

- 関数の引数に配列またはオブジェクトリテラルを展開することができる([分割代入引数](https://typescriptbook.jp/reference/functions/destructuring-assignment-parameters))。

``   const printCoord = ({ x, y }: { x: number; y: number }) => {    console.log(`Coordinate is (${x}, ${y})`);  };  printCoord({ x: 10, y: 20 });  'Coordinate is (10, 20)'   ``

コピー

### 型ガード関数[​](https://typescriptbook.jp/#%E5%9E%8B%E3%82%AC%E3%83%BC%E3%83%89%E9%96%A2%E6%95%B0 "型ガード関数 への直接リンク")

- 特定の型であることを判定する関数([型ガード関数](https://typescriptbook.jp/reference/functions/type-guard-functions))を利用することで、型が絞り込まれる。

`   function isString(value: any): value is string {    return typeof value === "string";  }  function printLength(value: any) {    if (isString(value)) {      // この節ではvalueはstring型として扱われる      console.log(value.length);    }  }  printLength("hello");  5   `

コピー

### オプション引数[​](https://typescriptbook.jp/#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E5%BC%95%E6%95%B0 "オプション引数 への直接リンク")

- 関数の引数には`?`をつけることで任意とすることができる([オプション引数](https://typescriptbook.jp/reference/functions/optional-parameters))。

``   function greet(name?: string) {    if (name === undefined) {      return "Hello!";    } else {      return `Hello ${name}!`;    }  }  console.log(greet("John"));  'Hello John!'  console.log(greet());  'Hello!'   ``

コピー

### デフォルト引数[​](https://typescriptbook.jp/#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E5%BC%95%E6%95%B0 "デフォルト引数 への直接リンク")

- 関数の引数には`=`を使ってデフォルトの値を設定することができる([デフォルト引数](https://typescriptbook.jp/reference/functions/default-parameters))。

``   function greet(name: string = "Mystery") {    return `Hello ${name}!`;  }  console.log(greet("John"));  'Hello John!'  console.log(greet());  'Hello Mystery!'   ``

コピー

### 残余引数[​](https://typescriptbook.jp/#%E6%AE%8B%E4%BD%99%E5%BC%95%E6%95%B0 "残余引数 への直接リンク")

- `...`を使って[残余引数](https://typescriptbook.jp/reference/functions/rest-parameters)(任意の数の引数)を設定することができる。

`   function sum(...numbers: number[]) {    return numbers.reduce((total, num) => total + num, 0);  }  console.log(sum(1, 2, 3, 4, 5));  15   `

コピー

## クラス[​](https://typescriptbook.jp/#%E3%82%AF%E3%83%A9%E3%82%B9 "クラス への直接リンク")

### クラス構文[​](https://typescriptbook.jp/#%E3%82%AF%E3%83%A9%E3%82%B9%E6%A7%8B%E6%96%87 "クラス構文 への直接リンク")

- JavaScriptの[クラス](https://typescriptbook.jp/reference/object-oriented/class)構文はそのまま利用できる。
- [フィールド](https://typescriptbook.jp/reference/object-oriented/class/fields)宣言に型注釈をつけることができる。

``   class Person {    name: string;    age: number;    constructor(name: string, age: number) {      this.name = name;      this.age = age;    }    introduce(): void {      console.log(`My name is ${this.name} and I am ${this.age} years old.`);    }  }  const john = new Person("John", 20);  john.introduce();  'My name is John and I am 20 years old.'   ``

コピー

### アクセス修飾子[​](https://typescriptbook.jp/#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E4%BF%AE%E9%A3%BE%E5%AD%90 "アクセス修飾子 への直接リンク")

- `public`(デフォルト)、`protected`、`private`の3つの[アクセス修飾子](https://typescriptbook.jp/reference/object-oriented/class/access-modifiers)が利用できる。

``  class Person {    public name: string;    private age: number;    constructor(name: string, age: number) {      this.name = name;      this.age = age;    }    introduce(): void {      console.log(`My name is ${this.name} and I am ${this.age} years old.`);    }  }  const john = new Person("John", 20);  console.log(john.name); // 'John'が出力される  console.log(john.age); // エラー（privateなのでアクセスできない）  Property 'age' is private and only accessible within class 'Person'.Property 'age' is private and only accessible within class 'Person'.``

コピー

### クラスのreadonly修飾子[​](https://typescriptbook.jp/#%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AEreadonly%E4%BF%AE%E9%A3%BE%E5%AD%90 "クラスのreadonly修飾子 への直接リンク")

- [`readonly`修飾子](https://typescriptbook.jp/reference/object-oriented/class/readonly-modifier-in-classes)をつけたプロパティは、読み取り専用となる。
- `readonly`修飾子はアクセス修飾子と併用可能。

``  class Person {    readonly name: string;    private readonly age: number;    constructor(name: string, age: number) {      this.name = name;      this.age = age;    }    introduce(): void {      console.log(`My name is ${this.name} and I am ${this.age} years old.`);    }  }  const john = new Person("John", 20);  john.name = "Tom"; // エラー（readonlyのため変更不可）  Cannot assign to 'name' because it is a read-only property.Cannot assign to 'name' because it is a read-only property.``

コピー

### Constructor shorthand[​](https://typescriptbook.jp/#constructor-shorthand "Constructor shorthand への直接リンク")

- TypeScriptでは、コンストラクタパラメータにアクセス修飾子をつけることで、自動的にそのフィールドが定義される([constructor shorthand](https://typescriptbook.jp/reference/object-oriented/class/constructor-shorthand))。
- これによりコードの簡略化が図れる。

``   class Person {    constructor(public name: string, private age: number) {}    introduce(): void {      console.log(`My name is ${this.name} and I am ${this.age} years old.`);    }  }  const john = new Person("John", 20);  john.introduce();  'My name is John and I am 20 years old.'   ``

コピー

### フィールドの初期化子[​](https://typescriptbook.jp/#%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E3%81%AE%E5%88%9D%E6%9C%9F%E5%8C%96%E5%AD%90 "フィールドの初期化子 への直接リンク")

- フィールド宣言の際に直接初期値を設定できる([フィールドの初期化子](https://typescriptbook.jp/reference/object-oriented/class/field-initializers))。

`   class Counter {    count = 0; // 初期値を0に設定    //    ^^^初期化子    increment(): void {      this.count++;    }  }  const counter = new Counter();  console.log(counter.count);  0  counter.increment();  console.log(counter.count);  1   `

コピー

### 静的フィールドと静的メソッド[​](https://typescriptbook.jp/#%E9%9D%99%E7%9A%84%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E3%81%A8%E9%9D%99%E7%9A%84%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89 "静的フィールドと静的メソッド への直接リンク")

- `static`キーワードを使うことで、インスタンスではなくクラス自体に関連するフィールドやメソッドを定義できる([静的フィールド](https://typescriptbook.jp/reference/object-oriented/class/static-fields)、[静的メソッド](https://typescriptbook.jp/reference/object-oriented/class/static-methods))。

`   class MyClass {    static x = 0;    static printX(): void {      console.log(MyClass.x);    }  }  MyClass.printX();  0   `

コピー

### this型[​](https://typescriptbook.jp/#this%E5%9E%8B "this型 への直接リンク")

- メソッド内で`this`を返すことで、メソッドの呼び出しを直列につなげるメソッドチェーンを可能にする([メソッドチェーン](https://typescriptbook.jp/reference/object-oriented/class/return-this-type))。

`   class MyClass {    value = 1;    increment(): this {      this.value++;      return this;    }    add(v: number): this {      this.value += v;      return this;    }    print(): this {      console.log(this.value);      return this;    }  }  new MyClass().increment().add(3).print();  5   `

コピー

### クラスの継承[​](https://typescriptbook.jp/#%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AE%E7%B6%99%E6%89%BF "クラスの継承 への直接リンク")

- `extends`キーワードにより、[クラスの継承](https://typescriptbook.jp/reference/object-oriented/class/class-inheritance)が可能。
- スーパークラスのプロパティ・メソッドの値は、サブクラスからアクセス可能。

``   class Animal {    name: string;    constructor(name: string) {      this.name = name;    }    greet(): string {      return `Hello, my name is ${this.name}`;    }  }  class Dog extends Animal {    bark(): string {      return "Woof!";    }  }  const dog = new Dog("Max");  console.log(dog.greet());  'Hello, my name is Max'  console.log(dog.bark());  'Woof!'   ``

コピー

### `instanceof`演算子[​](https://typescriptbook.jp/#instanceof%E6%BC%94%E7%AE%97%E5%AD%90 "instanceof演算子 への直接リンク")

- [`instanceof`演算子](https://typescriptbook.jp/reference/object-oriented/class/instanceof-operator)は、オブジェクトが特定のクラスのインスタンスであるかを判定できる。

`   class Animal {}  class Dog extends Animal {}  const dog = new Dog();  console.log(dog instanceof Dog);  true  console.log(dog instanceof Animal);  true   `

コピー

### 抽象クラス[​](https://typescriptbook.jp/#%E6%8A%BD%E8%B1%A1%E3%82%AF%E3%83%A9%E3%82%B9 "抽象クラス への直接リンク")

- `abstract`キーワードにより、[抽象クラス](https://typescriptbook.jp/reference/object-oriented/class/abstract-class)を定義できる。
- 抽象クラスはインスタンス化できず、他のクラスが継承するための基底クラスに使用される。

`   abstract class Animal {    abstract makeSound(): void;    move(): void {      console.log("roaming the earth...");    }  }  class Dog extends Animal {    makeSound(): void {      console.log("Woof Woof");    }  }  const dog = new Dog();  dog.move();  'roaming the earth...'  dog.makeSound();  'Woof Woof'   `

コピー

### ゲッターとセッター[​](https://typescriptbook.jp/#%E3%82%B2%E3%83%83%E3%82%BF%E3%83%BC%E3%81%A8%E3%82%BB%E3%83%83%E3%82%BF%E3%83%BC "ゲッターとセッター への直接リンク")

- ゲッターやセッターは、オブジェクトのプロパティを取得・設定するためのメソッド。
- ゲッターは`get`キーワードで、セッターは`set`キーワードで定義する。

`   class Circle {    private _radius: number;    constructor(radius: number) {      this._radius = radius;    }    // ゲッター    get radius(): number {      return this._radius;    }    // セッター    set radius(radius: number) {      if (radius <= 0) {        throw new Error("Invalid radius value");      }      this._radius = radius;    }  }  const circle = new Circle(5);  console.log(circle.radius);  5  circle.radius = 3;  console.log(circle.radius);  3  circle.radius = -2;  // 例外: 'Invalid radius value'   `

コピー

### インターフェース[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9 "インターフェース への直接リンク")

- TypeScriptのインターフェースは、プロパティ、メソッド、クラスなどの形状を定義する能力を持つ。
- インターフェースを使用する主な目的は、特定のクラスまたはオブジェクトが特定のプロパティまたはメソッドを保持することを強制する。

`   interface Printable {    print(): void;  }  class MyClass implements Printable {    print(): void {      console.log("Hello, world!");    }  }   `

コピー

### インターフェース構文[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E6%A7%8B%E6%96%87 "インターフェース構文 への直接リンク")

- TypeScriptの[インターフェース](https://typescriptbook.jp/reference/object-oriented/interface)はオブジェクトの形状を定義することが可能。
- インターフェースはプロパティやメソッドのシグネチャを記述できる。

`   interface Point {    readonly x: number;    readonly y: number;    sum(): number;  }  const point: Point = {    x: 10,    y: 20,    sum: function () {      return this.x + this.y;    },  };   `

コピー

### インターフェースのreadonly修飾子[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%AEreadonly%E4%BF%AE%E9%A3%BE%E5%AD%90 "インターフェースのreadonly修飾子 への直接リンク")

- インターフェース内でreadonly修飾子を使用して、プロパティを読み取り専用に設定できる。
- これにより、プロパティの値が一旦設定されると後から変更できなくなる。

`  interface Point {    readonly x: number;    readonly y: number;  }  const p1: Point = { x: 10, y: 20 };  p1.x = 5;  Cannot assign to 'x' because it is a read-only property.Cannot assign to 'x' because it is a read-only property.`

コピー

## 例外処理[​](https://typescriptbook.jp/#%E4%BE%8B%E5%A4%96%E5%87%A6%E7%90%86 "例外処理 への直接リンク")

- TypeScriptでは[例外処理](https://typescriptbook.jp/reference/statements/exception)のためにtry / catch / finally ブロックを使用できる。
- 例外が発生した場合（つまり、エラーオブジェクトをスローした場合）catchブロックが実行される。

`   try {    throw new Error("An error occurred!");  } catch (error) {    console.log(error);  }   `

コピー

### try-catch-finally構文[​](https://typescriptbook.jp/#try-catch-finally%E6%A7%8B%E6%96%87 "try-catch-finally構文 への直接リンク")

- tryブロック内のコードは、エラーを検出し、catchブロックはエラーをハンドリングする。
- finallyブロックはエラーの有無に関係なく実行される。

`   try {    throw new Error("Oops, something went wrong.");  } catch (error) {    console.log(error);  } finally {    console.log("This is the finally block. It always gets executed.");  }   `

コピー

### 例外クラス[​](https://typescriptbook.jp/#%E4%BE%8B%E5%A4%96%E3%82%AF%E3%83%A9%E3%82%B9 "例外クラス への直接リンク")

- TypeScriptでは、カスタムエラークラスを作成することも可能。
- Errorクラスを継承したカスタムクラスで、具体的なエラータイプを作成することができる。

``   class CustomError extends Error {    code = "CustomError";    constructor(message?: string) {      super(message);    }  }  try {    throw new CustomError("This is a custom error");  } catch (error) {    if (error instanceof CustomError) {      console.log(`${error.code}: ${error.message}`);    }  }   ``

コピー

## 非同期処理[​](https://typescriptbook.jp/#%E9%9D%9E%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86 "非同期処理 への直接リンク")

- TypeScriptでは、[非同期プログラミング](https://typescriptbook.jp/reference/asynchronous)をサポートしていて、コード内で時間を要する処理を効率的に扱うことができる。

### Promise[​](https://typescriptbook.jp/#promise "Promise への直接リンク")

- [Promise](https://typescriptbook.jp/reference/asynchronous/promise)は非同期操作の最終的な完了（または失敗）とその結果の値を表す。

`   const promise = new Promise((resolve, reject) => {    setTimeout(() => {      resolve("Promise resolved");    }, 2000);  });  promise.then((data) => {    console.log(data);  });  'Promise resolved'   `

コピー

### async/await 構文[​](https://typescriptbook.jp/#asyncawait-%E6%A7%8B%E6%96%87 "async/await 構文 への直接リンク")

- 非同期処理をより直感的に書くことができる[async構文](https://typescriptbook.jp/reference/asynchronous/async)と[await構文](https://typescriptbook.jp/reference/asynchronous/await)を導入している。
- async/await 構文を使うと、非同期コードをあたかも同期コードであるかのように書ける。

`   function delay(ms: number) {    return new Promise((resolve) => setTimeout(resolve, ms));  }  async function asyncFunction() {    console.log("Start");    await delay(2000);    console.log("End");  }  asyncFunction();  'Start'  // 2秒後  'End'   `

コピー

## ジェネリクス[​](https://typescriptbook.jp/#%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AA%E3%82%AF%E3%82%B9 "ジェネリクス への直接リンク")

- TypeScriptの[ジェネリクス](https://typescriptbook.jp/reference/generics)を使用すると、型の再利用性が向上し、型の一貫性を保つことができる。
- ジェネリクスを使用すると、[型変数](https://typescriptbook.jp/reference/generics/type-variables)を導入でき、これにより機能の一部を一般化できる。

`   // Tが型変数  function identity<T>(arg: T): T {    return arg;  }  // 型変数Tにstringを割り当てる  const output1 = identity<string>("myString");            const output1: string  // 型変数Tにnumberを割り当てる  const output2 = identity<number>(100);            const output2: number   `

コピー

## モジュール[​](https://typescriptbook.jp/#%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB "モジュール への直接リンク")

- TypeScriptのモジュールシステムは、他のモジュールと共有するコードと、モジュール内部限定のコードとを分けることを可能にする([モジュール](https://typescriptbook.jp/reference/modules))。

greeter.ts

``   export function greet(name: string) {    return `Hello, ${name}!`;  }   ``

コピー

main.ts

`   import { greet } from "./greeter";  console.log(greet("TypeScript"));  'Hello, TypeScript!'   `

コピー

### importとexport[​](https://typescriptbook.jp/#import%E3%81%A8export "importとexport への直接リンク")

- モジュール内で定義した関数や変数を外部に公開するには、exportを使用する。
- モジュールが公開した関数や変数を利用するには、importを使用する。

math.ts

`   export function square(x: number) {    return x * x;  }  export function cube(x: number) {    return x * x * x;  }   `

コピー

main.ts

`   import { square, cube } from "./math";  console.log(square(2));  4  console.log(cube(2));  8   `

コピー

### default export[​](https://typescriptbook.jp/#default-export "default export への直接リンク")

- defaultキーワードを使用すると、モジュールがデフォルトで1つの値のみをエクスポートすることを意味する。
- default exportは、importする際に別名を指定することが可能である。

greeter.ts

``   export default function greet(name: string) {    return `Hello, ${name}!`;  }   ``

コピー

main.ts

`   import greetFunction from "./greeter";  console.log(greetFunction("TypeScript"));  'Hello, TypeScript!'   `

コピー

### 再export[​](https://typescriptbook.jp/#%E5%86%8Dexport "再export への直接リンク")

- モジュールは、別のモジュールからエクスポートされたものを再エクスポートすることができる。

math.ts

`   export function add(x: number, y: number) {    return x + y;  }   `

コピー

index.ts

`   // 再エクスポート  export { add } from "./math";   `

コピー

main.ts

`   import { add } from "./index";  console.log(add(2, 3));  5   `

コピー

### type importとtype export[​](https://typescriptbook.jp/#type-import%E3%81%A8type-export "type importとtype export への直接リンク")

- 型だけをエクスポート・インポートすることもできる。

types.ts

`   export type MyObject = {    name: string;    age: number;  };   `

コピー

main.ts

`   import type { MyObject } from "./types";  //     ^^^^型インポート  const obj: MyObject = {    name: "TypeScript",    age: 3,  };   `

コピー

## 型レベルプログラミング[​](https://typescriptbook.jp/#%E5%9E%8B%E3%83%AC%E3%83%99%E3%83%AB%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0 "型レベルプログラミング への直接リンク")

- TypeScriptには、typeof演算子やkeyof演算子、ユーティリティータイプなど、型レベルでプログラミングをするためのさまざまな機能が搭載されている。

### typeof型演算子[​](https://typescriptbook.jp/#typeof%E5%9E%8B%E6%BC%94%E7%AE%97%E5%AD%90 "typeof型演算子 への直接リンク")

- [typeof演算子](https://typescriptbook.jp/reference/type-reuse/typeof-type-operator)は、変数名から型を逆算できる。

`   const object = {    name: "TypeScript",    version: 3.9,  };  type ObjectType = typeof object;             type ObjectType = {     name: string;     version: number; }   `

コピー

### keyof型演算子[​](https://typescriptbook.jp/#keyof%E5%9E%8B%E6%BC%94%E7%AE%97%E5%AD%90 "keyof型演算子 への直接リンク")

- [keyof演算子](https://typescriptbook.jp/reference/type-reuse/keyof-type-operator)を使うと、object型のすべてのキーを文字列リテラルのユニオン型として取得できる。

`  type Point = {    x: number;    y: number;  };  type Key = keyof Point;         type Key = keyof Point  const key1: Key = "x"; // 代入OK  const key2: Key = "y"; // 代入OK  const key3: Key = "z"; // 代入不可  Type '"z"' is not assignable to type 'keyof Point'.Type '"z"' is not assignable to type 'keyof Point'.`

コピー

### ユーティリティ型[​](https://typescriptbook.jp/#%E3%83%A6%E3%83%BC%E3%83%86%E3%82%A3%E3%83%AA%E3%83%86%E3%82%A3%E5%9E%8B "ユーティリティ型 への直接リンク")

- TypeScriptは、既存の型から新しい型を作成するためのさまざまな一般的な型操作を提供している。

#### Required[​](https://typescriptbook.jp/#required "Required への直接リンク")

- [`Required`](https://typescriptbook.jp/reference/type-reuse/utility-types/required)は、オプションプロパティーを必須プロパティーにするユーティリティ型。

`   type Person = {    name: string;    age?: number;  };  type RequiredPerson = Required<Person>;               type RequiredPerson = {     name: string;     age: number; }  // ageがオプションでなくなっている点に注目   `

コピー

#### Partial[​](https://typescriptbook.jp/#partial "Partial への直接リンク")

- [`Partial`](https://typescriptbook.jp/reference/type-reuse/utility-types/partial)は、型のすべてのプロパティをオプションにするユーティリティ型。

`   type Person = {    name: string;    age: number;  };  type OptionalPerson = Partial<Person>;               type OptionalPerson = {     name?: string | undefined;     age?: number | undefined; }   `

コピー

#### Readonly[​](https://typescriptbook.jp/#readonly "Readonly への直接リンク")

- [`Readonly`](https://typescriptbook.jp/reference/type-reuse/utility-types/readonly)は、型のすべてのプロパティをreadonlyにするユーティリティ型。それらのプロパティは再代入できない。

`   type Person = {    name: string;    age: number;  };  type ReadonlyPerson = Readonly<Person>;               type ReadonlyPerson = {     readonly name: string;     readonly age: number; }   `

コピー

#### Record[​](https://typescriptbook.jp/#record "Record への直接リンク")

- [`Record`](https://typescriptbook.jp/reference/type-reuse/utility-types/record)は、オブジェクトのすべてのプロパティ値を特定の型に設定するユーティリティ型。

`   type ThreeLetterRecord = Record<"one" | "two" | "three", string>;                type ThreeLetterRecord = {     one: string;     two: string;     three: string; }   `

コピー

#### Pick[​](https://typescriptbook.jp/#pick "Pick への直接リンク")

- [`Pick`](https://typescriptbook.jp/reference/type-reuse/utility-types/pick)は、オブジェクトから特定のプロパティだけを拾い出すユーティリティ型。

`   type Person = {    name: string;    age: number;    address: string;  };  type PersonNameAndAge = Pick<Person, "name" | "age">;                type PersonNameAndAge = {     name: string;     age: number; }   `

コピー

#### Omit[​](https://typescriptbook.jp/#omit "Omit への直接リンク")

- [`Omit`](https://typescriptbook.jp/reference/type-reuse/utility-types/omit)は、オブジェクトから特定のプロパティを省いた型を作るユーティリティ型。

`   type Person = {    name: string;    age: number;    address: string;  };  type PersonWithoutAddress = Omit<Person, "address">;                  type PersonWithoutAddress = {     name: string;     age: number; }   `

コピー

#### Exclude[​](https://typescriptbook.jp/#exclude "Exclude への直接リンク")

- [`Exclude`](https://typescriptbook.jp/reference/type-reuse/utility-types/exclude)は、ユニオン型から特定の型を除外するユーティリティ型。

`   type T1 = number | string | boolean;  type T2 = Exclude<T1, boolean>;         type T2 = string | number   `

コピー

#### Extract[​](https://typescriptbook.jp/#extract "Extract への直接リンク")

- [`Extract`](https://typescriptbook.jp/reference/type-reuse/utility-types/extract)は、ふたつのユニオン型の共通の部分を抽出するユーティリティ型。

`   type T1 = number | string | boolean;  type T2 = string | boolean;  type T3 = Extract<T1, T2>;         type T3 = string | boolean   `

コピー

#### NonNullable[​](https://typescriptbook.jp/#nonnullable "NonNullable への直接リンク")

- `NonNullable`は、nullまたはundefinedを含む型からいずれも除外するユーティリティ型。

`   type T1 = string | null | undefined;  type T2 = NonNullable<T1>;         type T2 = string   `

コピー

### Mapped types[​](https://typescriptbook.jp/#mapped-types "Mapped types への直接リンク")

- [Mapped types](https://typescriptbook.jp/reference/type-reuse/mapped-types)を使うと、既存の型から新しい型を生成できる。
- Mapped typesは、オブジェクトの各プロパティを”マップ”し、新しいオブジェクトを生成する。

`   type Person = {    name: string;    age: number;  };  type ReadOnlyPerson = { readonly [K in keyof Person]: Person[K] };               type ReadOnlyPerson = {     readonly name: string;     readonly age: number; }   `

コピー

### インデックスアクセス型[​](https://typescriptbook.jp/#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E5%9E%8B "インデックスアクセス型 への直接リンク")

- [インデックスアクセス型](https://typescriptbook.jp/reference/type-reuse/indexed-access-types)を使うと、型のプロパティの型を取得できる。

`   type Person = {    name: string;    age: number;  };  type Name = Person["name"];          type Name = string   `