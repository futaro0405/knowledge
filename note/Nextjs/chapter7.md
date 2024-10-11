# データの取得
データベースを作成し、シードしたので、アプリケーションのデータを取得するさまざまな方法について議論し、ダッシュボードの概要ページを構築しましょう。  

この章では以下のトピックを扱います。  

1. データ取得のアプローチについて学ぶ：API、ORM、SQLなど
2. サーバーコンポーネントがバックエンドリソースにより安全にアクセスするのに役立つ方法
3. ネットワークウォーターフォールとは何か
4. JavaScriptパターンを使用して並列データ取得を実装する方法

# データ取得方法の選択
**APIレイヤー**  
APIはアプリケーションコードとデータベースの間の中間層です。  
APIを使用する場合がいくつかあります。  

- APIを提供するサードパーティサービスを使用している場合。
- クライアントからデータを取得する際、データベースのシークレットをクライアントに公開しないように、サーバー上で実行されるAPIレイヤーが必要な場合。

Next.jsでは、[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)を使用してAPIエンドポイントを作成できます。  

**データベースクエリ**  
フルスタックアプリケーションを作成する場合、データベースと対話するためのロジックを書く必要もあります。  
Postgresのような[リレーショナルデータベース](https://aws.amazon.com/relational-database/)の場合、SQLやORMを使用してこれを行うことができます。  

データベースクエリを書く必要がある場合がいくつかあります。

- APIエンドポイントを作成する際、データベースと対話するためのロジックを書く必要があります。
- React Server Components（サーバー上でデータを取得）を使用している場合、APIレイヤーをスキップし、データベースのシークレットをクライアントに公開するリスクなしに直接データベースにクエリを行うことができます。

React Server Componentsについてさらに学びましょう。  

# サーバーコンポーネントを使用したデータ取得
デフォルトでは、Next.jsアプリケーションは**React Server Components**を使用します。  
Server Componentsでデータを取得することは比較的新しいアプローチであり、以下のような利点があります。  

1. Server Componentsはプロミスをサポートしており、データ取得などの非同期タスクにより簡単なソリューションを提供します。`useEffect`、`useState`、またはデータ取得ライブラリを使用せずに、`async/await`構文を使用できます。
2. Server Componentsはサーバー上で実行されるため、高コストのデータ取得やロジックをサーバー上に保持し、結果のみをクライアントに送信できます。
3. 前述のように、Server Componentsはサーバー上で実行されるため、追加のAPIレイヤーなしで直接データベースにクエリを行うことができます。

# SQLの使用
ダッシュボードプロジェクトでは、Vercel Postgres SDKとSQLを使用してデータベースクエリを記述します。  
SQLを使用する理由はいくつかあります。  

1. SQLはリレーショナルデータベースのクエリに関する業界標準です（例：ORMは内部でSQLを生成します）。
2. SQLの基本的な理解は、リレーショナルデータベースの基礎を理解するのに役立ち、他のツールにも知識を応用できます。
3. SQLは多用途で、特定のデータの取得や操作が可能です。
4. Vercel Postgres SDKはSQLインジェクションに対する保護を提供します。

SQLを使ったことがなくても心配しないでください。  
クエリは提供されています。  

`/app/lib/data.ts`に移動すると、`@vercel/postgres`から`sql`関数をインポートしているのがわかります。  
この関数を使用してデータベースにクエリを行うことができます。  

**/app/lib/data.ts**
```javascript
import { sql } from '@vercel/postgres';
 
// ...
```

任意のサーバーコンポーネント内で`sql`を呼び出すことができます。  
ただし、コンポーネントをより簡単に操作できるように、すべてのデータクエリは`data.ts`ファイルに保持されており、コンポーネントにインポートできます。  

**注意**
第6章で独自のデータベースプロバイダーを使用した場合、データベースクエリをそのプロバイダーで動作するように更新する必要があります。クエリは `/app/lib/data.ts` で見つけることができます。  

# ダッシュボード概要ページのデータ取得
データ取得の異なる方法を理解したので、ダッシュボード概要ページのデータを取得しましょう。  
`/app/dashboard/page.tsx`に移動し、以下のコードを貼り付けて、少し時間をかけて探索してください。  

**/app/dashboard/page.tsx**
```jsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
 
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
```

上記のコードについて：

- Pageは**async**コンポーネントです。これにより`await`を使用してデータを取得できます。
- データを受け取る3つのコンポーネント（`<Card>`、`<RevenueChart>`、`<LatestInvoices>`）があります。これらは現在、アプリケーションのエラーを防ぐためにコメントアウトされています。  

# `<RevenueChart/>`のデータ取得
`<RevenueChart/>`コンポーネントのデータを取得するために、`data.ts`から`fetchRevenue`関数をインポートし、コンポーネント内で呼び出します。  

**/app/dashboard/page.tsx**
```javascript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```

次に、`<RevenueChart/>`コンポーネントのコメントを解除し、コンポーネントファイル（`/app/ui/dashboard/revenue-chart.tsx`）に移動して、その中のコードのコメントを解除します。  
localhostを確認すると、`revenue`データを使用したチャートが表示されるはずです。  

![[Pasted image 20241011225332.png]]

引き続き、さらにいくつかのデータクエリをインポートしましょう！  

# `<LatestInvoices/>`のデータ取得
`<LatestInvoices />`コンポーネントには、日付順にソートされた最新の5つの請求書を取得する必要があります。  

すべての請求書を取得し、JavaScriptを使用してソートすることもできます。  
データが小さい場合は問題ありませんが、アプリケーションが大きくなると、各リクエストで転送されるデータ量とソートに必要なJavaScriptが大幅に増加する可能性があります。  

最新の請求書をメモリ内でソートする代わりに、SQLクエリを使用して最後の5つの請求書のみを取得できます。  
例えば、`data.ts`ファイルのSQLクエリは次のようになっています。  

**/app/lib/data.ts**
```ts
// Fetch the last 5 invoices, sorted by date
const data = await sql<LatestInvoiceRaw>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;
```

ページで`fetchLatestInvoices`関数をインポートします：

**/app/dashboard/page.tsx**
```javascript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // ...
}
```

次に、`<LatestInvoices />`コンポーネントのコメントを解除します。  
`/app/ui/dashboard/latest-invoices`にある`<LatestInvoices />`コンポーネント自体の関連コードもコメント解除する必要があります。  

localhostにアクセスすると、データベースから最後の5つだけが返されているのが確認できるはずです。  
データベースに直接クエリを行うことの利点が見え始めていることを願っています！  

![[Pasted image 20241011225617.png]]

# 練習：`<Card>`コンポーネントのデータ取得
今度は`<Card>`コンポーネントのデータを取得する番です。  
カードは以下のデータを表示します：

- 回収済み請求書の合計金額
- 未払いの請求書の合計金額
- 請求書の総数
- 顧客の総数

ここでも、すべての請求書と顧客を取得し、JavaScriptでデータを操作したくなるかもしれません。  
例えば、`Array.length`を使用して請求書と顧客の総数を取得できます：  

```javascript
const totalInvoices = allInvoices.length;
const totalCustomers = allCustomers.length;
```

しかし、SQLを使用すると、必要なデータだけを取得できます。  
`Array.length`を使用するよりは少し長くなりますが、リクエスト中に転送されるデータ量が少なくなります。  
これがSQLの代替案です：  

**/app/lib/data.ts**
```ts
const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
```

インポートする必要がある関数は`fetchCardData`と呼ばれます。  
この関数から返される値を分割代入する必要があります。  

**ヒント：**
- カードコンポーネントを確認して、どのデータが必要かを見てください。
- `data.ts`ファイルを確認して、関数が何を返すかを見てください。

準備ができたら、以下のトグルを展開して最終的なコードを確認してください。  

**/app/dashboard/page.tsx**
```tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from '@/app/lib/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

素晴らしい！ダッシュボード概要ページのすべてのデータを取得できました。  
ページは以下のように表示されるはずです：  

![[Pasted image 20241011230057.png]]

しかし...注意すべき2つの点があります：  

1. データリクエストが意図せずに互いをブロックし、**リクエストウォーターフォール**を作成しています。
2. デフォルトでは、Next.jsはパフォーマンス向上のためにルートを**プリレンダリング**します。これは**静的レンダリング**と呼ばれます。そのため、データが変更されても、ダッシュボードに反映されません。

この章では1番目の点について議論し、次の章で2番目の点について詳しく見ていきます。  

# リクエストウォーターフォールとは何か？
「ウォーターフォール」とは、前のリクエストの完了に依存する一連のネットワークリクエストを指します。  
データフェッチングの場合、各リクエストは前のリクエストがデータを返した後でしか開始できません。  

![[Pasted image 20241011230316.png]]

例えば、`fetchLatestInvoices()`の実行を開始する前に`fetchRevenue()`の実行が終わるのを待つ必要があります。  
以下のようになります：  

**/app/dashboard/page.tsx**
```javascript
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData(); // wait for fetchLatestInvoices() to finish
```

このパターンは必ずしも悪いわけではありません。  
次のリクエストを行う前に条件を満たしたい場合など、ウォーターフォールが必要な場合もあります。  
例えば、まずユーザーのIDとプロフィール情報を取得し、IDを取得した後に友達リストを取得するような場合です。この場合、各リクエストは前のリクエストから返されたデータに依存しています。

しかし、この動作が意図せずに発生し、パフォーマンスに影響を与えることもあります。