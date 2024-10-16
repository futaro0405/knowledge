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

typescript

Copy

`export default function Page() {   return <h1>Hello, Next.js!</h1> }`

`pages`ディレクトリ（オプション） Appルーターの代わりにPagesルーターを使用する場合、プロジェクトのルートに`pages/`ディレクトリを作成できます。

`pages`フォルダ内に`index.tsx`ファイルを追加します。これがホームページ（`/`）になります：

typescript

Copy

`export default function Page() {   return <h1>Hello, Next.js!</h1> }`

次に、`pages/_app.tsx`を追加してグローバルレイアウトを定義します：

typescript

Copy

`import type { AppProps } from 'next/app' export default function App({ Component, pageProps }: AppProps) {   return <Component {...pageProps} /> }`

最後に、`pages/_document.tsx`を追加してサーバーからの初期レスポンスを制御します：

typescript

Copy

`import { Html, Head, Main, NextScript } from 'next/document' export default function Document() {   return (    <Html>      <Head />      <body>        <Main />        <NextScript />      </body>    </Html>  ) }`

`public`フォルダ（オプション） 画像やフォントなどの静的アセットを保存するために`public`フォルダを作成します。`public`ディレクトリ内のファイルはベースURL（`/`）から参照できます。