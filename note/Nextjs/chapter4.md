# レイアウトとページの作成
これまで、あなたのアプリケーションにはホームページしかありませんでした。  
**レイアウト**と**ページ**を使用して、さらに多くのルートを作成する方法を学びましょう。  

この章では以下のトピックを扱います。  

- ファイルシステムルーティングを使用して`dashboard`ルートを作成する。
- 新しいルートセグメントを作成する際のフォルダとファイルの役割を理解する。
- 複数のダッシュボードページで共有できるネストされたレイアウトを作成する。
- コロケーション、部分的レンダリング、ルートレイアウトとは何かを理解する。

# ネストされたルーティング
Next.jsは、**フォルダ**を使用してネストされたルートを作成するファイルシステムルーティングを使用します。  
各フォルダは**URLセグメント**にマッピングされる**ルートセグメント**を表します。  

![[Pasted image 20241010211132.png]]

`layout.tsx`と`page.tsx`ファイルを使用して、各ルートに対して個別のUIを作成できます。  

`page.tsx`は、Reactコンポーネントをエクスポートする特別なNext.jsファイルで、ルートにアクセスするために必要です。  
あなたのアプリケーションには既にページファイルがあります。  
`/app/page.tsx` - これは `/` ルートに関連付けられたホームページです。  

ネストされたルートを作成するには、フォルダを互いにネストし、その中に`page.tsx`ファイルを追加します。  

![[Pasted image 20241010211259.png]]

`/app/dashboard/page.tsx`は`/dashboard`パスに関連付けられています。  
どのように機能するか見るために、このページを作成してみましょう！  

# ダッシュボードページの作成
`/app`内に`dashboard`という新しいフォルダを作成します。  
次に、`dashboard`フォルダ内に以下の内容の新しい`page.tsx`ファイルを作成します。  

**/app/dashboard/page.tsx**
```typescript
export default function Page() {
  return <p>Dashboard Page</p>;
}
```

開発サーバーが実行中であることを確認し、`http://localhost:3000/dashboard`にアクセスしてください。  
"Dashboard Page"というテキストが表示されるはずです。  

これがNext.jsで異なるページを作成する方法です。  
フォルダを使用して新しいルートセグメントを作成し、その中に`page`ファイルを追加します。  

`page`ファイルに特別な名前を付けることで、Next.jsはUIコンポーネント、テストファイル、その他の関連コードをルートと一緒に[配置](https://nextjs.org/docs/app/building-your-application/routing#colocation)することを可能にしています。  
`page`ファイル内のコンテンツのみが公開されます。  
例えば、`/ui`と`/lib`フォルダはルートと一緒に`/app`フォルダ内に 配置されています。

# 練習：ダッシュボードページの作成
さらにルートを作成する練習をしましょう。  
ダッシュボードに、以下の2つのページを追加してください。  

1. **顧客ページ**：このページは `http://localhost:3000/dashboard/customers` でアクセスできるようにします。現時点では、`<p>Customers Page</p>`要素を返すだけで構いません。
2. **請求書ページ**：請求書ページは `http://localhost:3000/dashboard/invoices`でアクセスできるようにします。こちらも現時点では、`<p>Invoices Page</p>`要素を返すだけで構いません。

この練習問題に少し時間をかけて取り組んでください。  
準備ができたら、解答を確認するために下のトグルを展開してください。  

## 回答
以下のようなフォルダ構造になっているはずです。

![[Pasted image 20241010212831.png]]

### 顧客ページ

**/app/dashboard/customers/page.tsx**
```typescript
export default function Page() {
  return <p>Customers Page</p>;
}
```

### 請求書ページ

**/app/dashboard/invoices/page.tsx**
```typescript
export default function Page() {
  return <p>Invoices Page</p>;
}
```

# ダッシュボードレイアウトの作成
ダッシュボードには通常、複数のページで共有されるナビゲーションがあります。  
Next.jsでは、特別な`layout.tsx`ファイルを使用して、複数のページ間で共有されるUIを作成できます。  
ダッシュボードページのレイアウトを作成しましょう！  

`/dashboard`フォルダ内に`layout.tsx`という新しいファイルを作成し、以下のコードを貼り付けてください。  

**/app/dashboard/layout.tsx**
```typescript
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

このコードには複数の要素があるので、詳しく見ていきましょう。  

まず、`<SideNav />`コンポーネントをレイアウトにインポートしています。  
このファイルにインポートされたコンポーネントはすべてレイアウトの一部となります。  

`<Layout />`コンポーネントは`children`プロップを受け取ります。  
この子要素はページまたは別のレイアウトになります。  
この場合、`/dashboard`内のページは自動的に`<Layout />`内にネストされます。  

変更を保存し、localhostで確認して、すべてが正しく動作しているか確認してください。  
以下のように表示されるはずです。  



Next.jsでレイアウトを使用する利点の1つは、ナビゲーション時にページコンポーネントのみが更新され、レイアウトは再レンダリングされないことです。これを部分的レンダリングと呼びます：

[アニメーションが表示されるはずですが、この環境では表示できません]