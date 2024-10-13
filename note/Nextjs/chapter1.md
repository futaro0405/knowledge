# 新しいプロジェクトの作成
パッケージマネージャーとして`pnpm`の使用をお勧めします。
`pnpm`は`npm`や`yarn`より高速で効率的です。
`pnpm`がインストールされていない場合は、次のコマンドでグローバルにインストールできます。

```bash
npm install -g pnpm
```

Next.jsアプリを作成するには、ターミナルを開きプロジェクトを保存したいフォルダに`cd`で移動し以下のコマンドを実行します。

```bash
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
```

このコマンドは`create-next-app`を使用します。
これはNext.jsアプリケーションをセットアップするコマンドラインインターフェース（CLI）ツールです。
上記のコマンドでは、このコースのスターター例を`--example`フラグで指定しています。

# プロジェクトの探索
一からコードを書くチュートリアルとは異なり、このコースではコードの大部分が既に書かれています。
これは、既存のコードベースで作業することが多い実際の開発環境をより反映しています。

私たちの目標は、アプリケーションのコードをすべて書くことなく、Next.jsの主要機能の学習に集中できるようにすることです。
インストール後、コードエディタでプロジェクトを開き、`nextjs-dashboard`に移動してください。

```bash
cd nextjs-dashboard
```

ここで、プロジェクトの探索に時間をかけましょう。
## フォルダ構造
プロジェクトには以下のようなフォルダ構造があります。

### `/app`
アプリケーションのすべてのルート、コンポーネント、ロジックが含まれています。
主にここで作業することになります。
### `/app/lib`
アプリケーションで使用される関数が含まれています。
再利用可能なユーティリティ関数やデータフェッチ関数などです。
### `/app/ui`
アプリケーションのすべてのUIコンポーネントが含まれています。
カード、テーブル、フォームなどです。
時間を節約するため、これらのコンポーネントは事前にスタイリングされています。
### `/public`
アプリケーションのすべての静的アセット（画像など）が含まれています。
### 設定ファイル
アプリケーションのルートに`next.config.js`などの設定ファイルがあります。
これらのファイルのほとんどは`create-next-app`で新しいプロジェクトを開始する際に作成され、事前設定されています。
このコースではこれらを修正する必要はありません。

これらのフォルダを自由に探索してください。  
コードの動作をすべて理解できなくても心配する必要はありません。

## プレースホルダーデータ
ユーザーインターフェースを構築する際、プレースホルダーデータがあると便利です。
データベースやAPIがまだ利用できない場合、以下のような方法があります。

- JSONフォーマットまたはJavaScriptオブジェクトとしてプレースホルダーデータを使用する。
- mockAPIなどのサードパーティサービスを使用する。

このプロジェクトでは、`app/lib/placeholder-data.ts`にプレースホルダーデータを用意しています。
ファイル内の各JavaScriptオブジェクトはデータベースのテーブルを表しています。
例えば、請求書テーブルは以下のようになっています。

```ts:/app/lib/placeholder-data.ts
const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  // ...
];
```

データベースのセットアップに関する章では、このデータを使用してデータベースをシード（初期データで populated）します。

## TypeScript
多くのファイルに`.ts`や`.tsx`の拡張子がついているのに気づくかもしれません。
これは、プロジェクトがTypeScriptで書かれているためです。
私たちは現代のWeb開発の状況を反映したコースを作成したいと考えました。

TypeScriptを知らなくても大丈夫です - 必要に応じてTypeScriptのコードスニペットを提供します。

まずは`/app/lib/definitions.ts`ファイルを見てみましょう。
ここでは、データベースから返される型を手動で定義しています。
例えば、請求書テーブルは以下のような型を持っています。

```typescript:/app/lib/definitions.ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
```

TypeScriptを使用することで、誤って間違ったデータ形式（例えば、請求書の`amount`に`number`の代わりに`string`を渡すなど）をコンポーネントやデータベースに渡すことを防げます。

**TypeScript開発者の方へ：**

- ここではデータ型を手動で宣言していますが、より型安全性を高めるためには、データベーススキーマに基づいて自動的に型を生成するPrismaやDrizzleをお勧めします。
- Next.jsはプロジェクトがTypeScriptを使用しているかを検出し、必要なパッケージと設定を自動的にインストールします。また、Next.jsにはコードエディタ用のTypeScriptプラグインが付属しており、オートコンプリートと型安全性のサポートを提供します。

# 開発サーバーの起動
プロジェクトのパッケージをインストールするために、`pnpm i`を実行してください。

```bash
pnpm i
```

その後、開発サーバーを起動するために`pnpm dev`を実行します。

```bash
pnpm dev
```

`pnpm dev`はポート`3000`でNext.jsの開発サーバーを起動します。
正常に動作しているか確認しましょう。

ブラウザで`http://localhost:3000`を開いてください。
ホームページは意図的にスタイルが適用されていない状態で表示されるはずです。

