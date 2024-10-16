# システム要件

- Node.js 18.17以降
- macOS、Windows（WSLを含む）、Linuxがサポートされています

# 自動インストール
新しいNext.jsアプリの開始には`create-next-app`の使用をお勧めします。
これにより全てが自動的にセットアップされます。
プロジェクトを作成するには、以下を実行してください:

```terminal
npx create-next-app@latest
```

インストール時に、次のプロンプトが表示されます:

```terminal
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*
```

プロンプトの後、`create-next-app`がプロジェクト名のフォルダを作成し、必要な依存関係をインストールします。

Next.jsが初めての方は、アプリケーションの可能なファイルとフォルダの概要について、[プロジェクト構造](https://nextjs.org/docs/getting-started/project-structure)のドキュメントをご覧ください。

> 知っておくと良いこと:
> Next.jsは現在、[TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)、[ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)、[Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)の設定がデフォルトで含まれています。
> オプションで、プロジェクトのルートに[`src` directory](https://nextjs.org/docs/app/building-your-application/configuring/src-directory)を使用して、アプリケーションのコードを設定ファイルと分離できます。

# 手動インストール
Next.jsアプリを手動で作成するには、必要なパッケージをインストールします：

```terminal
npm install next@latest react@latest react-dom@latest
```

`package.json`ファイルを開き、以下の`scripts`を追加します：

```package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

これらのスクリプトはアプリケーション開発の異なる段階を指します：

- [`next dev`](https://nextjs.org/docs/app/api-reference/cli/next#next-dev-options): 開発モードでNext.jsを起動
- [`next build`](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options): 本番用にアプリケーションをビルド
- [`next start`](https://nextjs.org/docs/app/api-reference/cli/next#next-start-options): Next.js本番サーバーを起動
- [`next lint`](https://nextjs.org/docs/app/api-reference/cli/next#next-lint-options): Next.jsの組み込みESLint設定を適用

## ディレクトリの作成
Next.jsはファイルシステムルーティングを使用し、ファイル構造によってアプリケーションのルートが決定されます。

### `app`ディレクトリ
新しいアプリケーションには[App Router](https://nextjs.org/docs/app)の使用を推奨します。
このルーターではReactの最新機能が使用でき、コミュニティのフィードバックに基づいた[Pages Router](https://nextjs.org/docs/pages)の進化版です。

`app/`フォルダを作成し、`layout.tsx`と`page.tsx`ファイルを追加します。
これらはユーザーがアプリケーションのルート（`/`）にアクセスした時にレンダリングされます。

![[Pasted image 20241016203800.png]]

`app/layout.tsx`に [root layout](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required)を作成し、必要な`<html>`と`<body>`タグを含めます：

**app/layout.tsx**
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

最後に、`app/page.tsx`にホームページを作成し、初期コンテンツを追加します：

**app/page.tsx**
```typescript
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

> 補足
> `layout.tsx`の作成を忘れた場合、`next dev`で開発サーバーを実行する際にNext.jsが自動的にこのファイルを作成します。

[Appルーターの使用](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)についての詳細はドキュメントを参照してください。

### `pages`ディレクトリ（オプション）
Appルーターの代わりにPagesルーターを使用したい場合、プロジェクトのルートに`pages/`ディレクトリを作成できます。

`pages`フォルダ内に`index.tsx`ファイルを追加します。
これがホームページ（`/`）になります：

```typescript
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

次に、`pages/`内に`_app.tsx`ファイルを追加してグローバルレイアウトを定義します。
[カスタムAppファイル](https://nextjs.org/docs/pages/building-your-application/routing/custom-app)の詳細については、ドキュメントを参照してください。

**pages/_app.tsx**
```typescript
import type { AppProps } from 'next/app'
 
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

最後に、`pages/`内に`_document.tsx`ファイルを追加して、サーバーからの初期レスポンスを制御します。
[カスタムDocumentファイル](https://nextjs.org/docs/pages/building-your-application/routing/custom-document)の詳細については、ドキュメントを参照してください。

**pages/_document.tsx**
```typescript
import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

[Pagesルーターの使用](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)についての詳細はドキュメントを参照してください。

> 補足
> 同じプロジェクトで両方のルーターを使用できますが、`app`内のルートが`pages`より優先されます。
> 混乱を避けるため、新しいプロジェクトでは1つのルーターのみを使用することをお勧めします。

### `public`フォルダ（オプション）
画像やフォントなどの静的アセットを保存するために`public`フォルダを作成します。`public`ディレクトリ内のファイルは、ベースURL（`/`）からコード内で参照できます。