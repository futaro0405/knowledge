# ストリーミング
前章では、Next.jsの異なるレンダリング方法について学びました。  
また、遅いデータフェッチがアプリケーションのパフォーマンスにどのように影響するかについても議論しました。  
ここでは、遅いデータリクエストがある場合にユーザー体験を向上させる方法を見ていきましょう。  

この章では... 以下のトピックを扱います：  

1. ストリーミングとは何か、そしていつ使用するか。
2. `loading.tsx`とSuspenseを使用してストリーミングを実装する方法。
3. ローディングスケルトンとは何か。
4. ルートグループとは何か、そしていつ使用するか。
5. アプリケーションのどこにSuspenseの境界を配置するべきか。

これらのトピックを通じて、遅いデータ取得がある場合でもユーザー体験を向上させる方法を学びます。  

# ストリーミングとは何か？
ストリーミングは、ルートをより小さな「チャンク」に分割し、それらが準備できた順にサーバーからクライアントに段階的に送信するデータ転送技術です。  

![[Pasted image 20241011231457.png]]

ストリーミングを使用することで、遅いデータリクエストがページ全体をブロックするのを防ぐことができます。  
これにより、すべてのデータが読み込まれるのを待たずに、ページの一部をユーザーに表示し、操作させることができます。  

![[Pasted image 20241011231516.png]]

ストリーミングはReactのコンポーネントモデルとうまく連携します。  
各コンポーネントを1つの_チャンク_と考えることができるからです。  

Next.jsでストリーミングを実装する方法は2つあります：  

1. ページレベルで、`loading.tsx`ファイルを使用する。
2. 特定のコンポーネントに対して、`<Suspense>`を使用する。

これがどのように機能するか見ていきましょう。  

# `loading.tsx`を使用した全ページのストリーミング
`/app/dashboard`フォルダ内に`loading.tsx`という新しいファイルを作成してください：  

**/app/dashboard/loading.tsx**
```jsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

`http://localhost:3000/dashboard` を更新すると、以下のように表示されるはずです：

![[Pasted image 20241011231728.png]]

ここで起こっていることは以下の通りです：  

1. `loading.tsx`はSuspenseの上に構築されたNext.jsの特別なファイルで、ページコンテンツが読み込まれている間に表示する代替UIを作成できます。
2. `<SideNav>`は静的なので、即座に表示されます。動的コンテンツが読み込まれている間でも、ユーザーは`<SideNav>`を操作できます。
3. ユーザーはページの読み込みが完了するのを待たずに別のページに移動できます（これは中断可能なナビゲーションと呼ばれます）。

おめでとうございます！ストリーミングを実装しました。  
しかし、ユーザー体験をさらに向上させることができます。  
`Loading...`テキストの代わりにローディングスケルトンを表示してみましょう。  

## ローディングスケルトンの追加
ローディングスケルトンは、UIの簡略版です。  
多くのウェブサイトでは、コンテンツが読み込み中であることをユーザーに示すためのプレースホルダー（またはフォールバック）として使用されています。  
`loading.tsx`に追加したUIは静的ファイルの一部として埋め込まれ、最初に送信されます。  
その後、残りの動的コンテンツがサーバーからクライアントにストリーミングされます。  

`loading.tsx`ファイル内で、`<DashboardSkeleton>`という新しいコンポーネントをインポートしてください：  

**/app/dashboard/loading.tsx**
```jsx
import DashboardSkeleton from '@/app/ui/skeletons';
 
export default function Loading() {
  return <DashboardSkeleton />;
}
```

その後、`http://localhost:3000/dashboard`を更新すると、以下のように表示されるはずです：  

![[Pasted image 20241011232124.png]]

## ルートグループを使用してローディングスケルトンのバグを修正する
現在、ローディングスケルトンは請求書ページと顧客ページにも適用されています。  

`loading.tsx`がファイルシステム内で`/invoices/page.tsx`と`/customers/page.tsx`よりも上位のレベルにあるため、これらのページにも適用されています。  

これをルートグループを使用して変更できます。  
dashboardフォルダ内に`/(overview)`という新しいフォルダを作成し、`loading.tsx`と`page.tsx`ファイルをこのフォルダ内に移動してください：  

![[Pasted image 20241011232318.png]]

これにより、`loading.tsx`ファイルはダッシュボード概要ページにのみ適用されるようになります。  

ルートグループを使用すると、URLパス構造に影響を与えずにファイルを論理的なグループに整理できます。  
括弧`()`を使用して新しいフォルダを作成すると、その名前はURLパスに含まれません。  
したがって、`/dashboard/(overview)/page.tsx`は`/dashboard`になります。  

ここでは、ルートグループを使用して`loading.tsx`がダッシュボード概要ページにのみ適用されるようにしています。  
ただし、ルートグループを使用してアプリケーションをセクション（例：`(marketing)`ルートと`(shop)`ルート）に分けたり、大規模なアプリケーションの場合はチームごとに分けたりすることもできます。  

  
## コンポーネントのストリーミング
これまで、ページ全体をストリーミングしていました。  
しかし、React Suspenseを使用して特定のコンポーネントをより細かくストリーミングすることもできます。  

Suspenseを使用すると、アプリケーションの一部の描画を、ある条件が満たされるまで（例：データが読み込まれるまで）延期できます。  
動的コンポーネントをSuspenseでラップし、動的コンポーネントが読み込まれている間に表示するフォールバックコンポーネントを渡すことができます。  

遅いデータリクエスト`fetchRevenue()`を覚えていれば、これがページ全体を遅くしているリクエストです。  
ページ全体をブロックする代わりに、Suspenseを使用してこのコンポーネントのみをストリーミングし、ページの残りのUIをすぐに表示できます。  

そのためには、データフェッチをコンポーネントに移動する必要があります。  
コードを更新して、どのようになるか見てみましょう：  

`/dashboard/(overview)/page.tsx`から`fetchRevenue()`とそのデータのすべてのインスタンスを削除します：  

**/app/dashboard/(overview)/page.tsx**
```tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // remove fetchRevenue
 
export default async function Page() {
  const revenue = await fetchRevenue() // delete this line
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
 
  return (
    // ...
  );
}
```

次に、Reactから`<Suspense>`をインポートし、`<RevenueChart />`をそれでラップします。  
フォールバックコンポーネントとして`<RevenueChartSkeleton>`を渡すことができます。  

**/app/dashboard/(overview)/page.tsx**
```tsx
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';
 
export default async function Page() {
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
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

最後に、`<RevenueChart>`コンポーネントを更新して独自のデータをフェッチし、渡されていたプロップを削除します。  

**/app/ui/dashboard/revenue-chart.tsx**
```tsx
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
 
// ...
 
export default async function RevenueChart() { // Make component async, remove the props
  const revenue = await fetchRevenue(); // Fetch data inside the component
 
  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);
 
  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }
 
  return (
    // ...
  );
}
```

これでページを更新すると、`<RevenueChart>`にフォールバックスケルトンが表示されている間に、ダッシュボード情報がほぼ即座に表示されるはずです：

![[Pasted image 20241012120300.png]]

