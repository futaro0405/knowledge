# メタデータの追加
メタデータはSEOと共有可能性にとって非常に重要です。  
この章では、Next.jsアプリケーションにメタデータを追加する方法について説明します。  

この章で... 以下のトピックを扱います
- メタデータとは何か。
- メタデータの種類。
- メタデータを使用してOpen Graph画像を追加する方法。
- メタデータを使用してファビコンを追加する方法。

# メタデータとは何か？
ウェブ開発において、メタデータはウェブページに関する追加情報を提供します。  
メタデータはページを訪れるユーザーには見えません。  
代わりに、ページのHTML内、通常は`<head>`要素内に埋め込まれて、裏側で機能します。  
この隠された情報は、検索エンジンやウェブページの内容をよりよく理解する必要がある他のシステムにとって極めて重要です。  

# メタデータが重要な理由
メタデータは、ウェブページのSEOを向上させ、検索エンジンやソーシャルメディアプラットフォームにとってより理解しやすくアクセスしやすいものにする上で、重要な役割を果たします。  
適切なメタデータは、検索エンジンがウェブページを効果的にインデックス化するのを助け、検索結果でのランキングを改善します。  
さらに、Open Graphのようなメタデータは、ソーシャルメディアで共有されたリンクの外観を改善し、ユーザーにとってコンテンツをより魅力的で情報豊かなものにします。  

# メタデータの種類
メタデータにはさまざまな種類があり、それぞれ固有の目的を果たします。  
一般的な種類には以下があります：  

## タイトルメタデータ
ブラウザのタブに表示されるウェブページのタイトルを担当します。  
ウェブページの内容を検索エンジンが理解するのに役立つため、SEOにとって重要です。  

```html
<title>ページタイトル</title>
```

## 説明メタデータ
このメタデータはウェブページの内容の簡単な概要を提供し、検索エンジンの結果でよく表示されます。  

```html
<meta name="description" content="ページ内容の簡単な説明。" />
```

## キーワードメタデータ
このメタデータにはウェブページの内容に関連するキーワードが含まれ、検索エンジンがページをインデックス化するのに役立ちます。

```html
<meta name="keywords" content="キーワード1, キーワード2, キーワード3" />
```

## Open Graphメタデータ
このメタデータは、ソーシャルメディアプラットフォームで共有された際のウェブページの表示方法を強化し、タイトル、説明、プレビュー画像などの情報を提供します。  

```html
<meta property="og:title" content="ここにタイトル" />
<meta property="og:description" content="ここに説明" />
<meta property="og:image" content="画像のURL" />
```

## ファビコンメタデータ
このメタデータは、ブラウザのアドレスバーまたはタブに表示されるファビコン（小さなアイコン）をウェブページにリンクします。  
```html
<link rel="icon" href="ファビコンへのパス.ico" />
```

# メタデータの追加
Next.jsには、アプリケーションのメタデータを定義するためのMetadata APIがあります。  
アプリケーションにメタデータを追加する方法は2つあります：  

- **設定ベース**: `layout.js`または`page.js`ファイルで静的な`metadata`オブジェクトまたは動的な`generateMetadata`関数をエクスポートします。
- **ファイルベース**: Next.jsには、メタデータ目的で特別に使用される一連の特殊ファイルがあります：
    - `favicon.ico`、`apple-icon.jpg`、`icon.jpg`: ファビコンとアイコンに使用
    - `opengraph-image.jpg`と`twitter-image.jpg`: ソーシャルメディア画像に使用
    - `robots.txt`: 検索エンジンのクローリングに関する指示を提供
    - `sitemap.xml`: ウェブサイトの構造に関する情報を提供

これらのファイルを静的メタデータに使用するか、プロジェクト内でプログラム的に生成することができます。  
これらの両方のオプションを使用して、Next.jsは自動的にページに関連する`<head>`要素を生成します。  

## ファビコンとOpen Graph画像
`/public`フォルダに`favicon.ico`と`opengraph-image.jpg`という2つの画像があることに気づくでしょう。   
これらの画像を`/app`フォルダのルートに移動してください。  

これを行うと、Next.jsは自動的にこれらのファイルをファビコンとOG画像として識別し使用します。  
開発ツールでアプリケーションの`<head>`要素を確認することで、これを検証できます。  

### 知っておくと良いこと
[`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response)コンストラクタを使用して動的なOG画像を作成することもできます。  

### ページタイトルと説明
任意の`layout.js`または`page.js`ファイルから[`metadata` object](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields)をインクルードして、タイトルや説明などの追加のページ情報を追加することもできます。  
`layout.js`のメタデータは、それを使用するすべてのページに継承されます。  

ルートレイアウトで、以下のフィールドを持つ新しい`metadata`オブジェクトを作成します：  

**/app/layout.tsx**
```typescript
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
 
export default function RootLayout() {
  // ...
}
```

Next.jsは自動的にタイトルとメタデータをアプリケーションに追加します。  

特定のページにカスタムタイトルを追加したい場合はどうすればよいでしょうか？  
これは、ページ自体に`metadata`オブジェクトを追加することで実現できます。  
ネストされたページのメタデータは親のメタデータを上書きします。  

例えば、`/dashboard/invoices`ページで、ページタイトルを更新できます：  

**/app/dashboard/invoices/page.tsx**
```typescript
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};
```

これは機能しますが、すべてのページでアプリケーションのタイトルを繰り返しています。  
会社名などが変更された場合、すべてのページで更新する必要があります。  

代わりに、`metadata`オブジェクトの`title.template`フィールドを使用して、ページタイトルのテンプレートを定義できます。  
このテンプレートには、ページタイトルと、含めたい他の情報を含めることができます。  

ルートレイアウトで、`metadata`オブジェクトを更新してテンプレートを含めます：  

**/app/layout.tsx**
```typescript
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
```

テンプレートの`%s`は、特定のページタイトルに置き換えられます。  

これで、`/dashboard/invoices`ページでページタイトルを追加できます：  

**/app/dashboard/invoices/page.tsx**
```typescript
export const metadata: Metadata = {
  title: 'Invoices',
};
```

`/dashboard/invoices`ページに移動し、`<head>`要素を確認してください。  
ページタイトルが`Invoices | Acme Dashboard`になっているはずです。  

# 練習：メタデータの追加
メタデータについて学んだので、他のページにタイトルを追加する練習をしましょう：  

1. `/login`ページ
2. `/dashboard/`ページ
3. `/dashboard/customers`ページ
4. `/dashboard/invoices/create`ページ
5. `/dashboard/invoices/[id]/edit`ページ

Next.jsのMetadata APIは強力で柔軟性があり、アプリケーションのメタデータを完全に制御できます。  
ここでは基本的なメタデータの追加方法を示しましたが、`keywords`、`robots`、`canonical`など、複数のフィールドを追加することができます。  
ドキュメントを自由に探索し、アプリケーションに追加したいメタデータを追加してください。  

# 次のステップ
おめでとうございます！  
Next.jsダッシュボードコースを完了しました。  
このコースでは、Next.jsの主要機能とウェブアプリケーション構築のベストプラクティスについて学びました。  

しかし、これは始まりに過ぎません。  
Next.jsには他にも多くの機能があります。  
小さな副プロジェクト、次のスタートアップのアイデア、あるいはチームと大規模なアプリケーションを構築するのに役立つように設計されています。  

Next.jsをさらに探求するためのリソースをいくつか紹介します：  

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Templates](https://vercel.com/templates/next.js):
    - [Admin Dashboard Template](https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs)
    - [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
    - [Blog Starter Kit](https://vercel.com/templates/next.js/blog-starter-kit)
    - [AI Chatbot](https://vercel.com/templates/next.js/nextjs-ai-chatbot)
    - [Image Gallery Starter](https://vercel.com/templates/next.js/image-gallery-starter)
- [Next.js Repository](https://github.com/vercel/next.js)
- [Vercel YouTube](https://www.youtube.com/@VercelHQ/videos)

