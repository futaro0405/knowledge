# はじめに
Next.jsのドキュメントへようこそ！

# Next.jsとは？
Next.jsは、フルスタックのウェブアプリケーションを構築するためのReactフレームワークです。
ユーザーインターフェースの構築にはReactコンポーネントを使用し、追加機能や最適化にはNext.jsを使用します。

内部的に、Next.jsはReactに必要なバンドル、コンパイルなどのツール類を抽象化し、自動的に設定します。
これにより、設定に時間を費やすことなく、アプリケーションの構築に集中できます。

個人開発者であれ、大規模なチームの一員であれ、Next.jsはインタラクティブで動的、そして高速なReactアプリケーションの構築を支援します。

# 主な機能
Next.jsの主な機能には以下が含まれます：

| 機能                                                                                         | 説明                                                                                                                   |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [Routing](https://nextjs.org/docs/app/building-your-application/routing)                   | サーバーコンポーネントを基盤とするファイルシステムベースのルーター。レイアウト、ネストされたルーティング、ローディング状態、エラー処理などをサポート。                                          |
| [レンダリング](https://nextjs.org/docs/app/building-your-application/rendering)                  | クライアントサイドとサーバーサイドのレンダリング（クライアントおよびサーバーコンポーネント使用）。Next.jsによるサーバー上での静的および動的レンダリングでさらに最適化。EdgeおよびNode.jsランタイムでのストリーミング。 |
| [データフェッチング](https://nextjs.org/docs/app/building-your-application/data-fetching)           | サーバーコンポーネントでのasync/awaitを使用した簡素化されたデータフェッチング。リクエストのメモ化、データのキャッシュと再検証のための拡張fetchAPI。                                  |
| [スタイリング](https://nextjs.org/docs/app/building-your-application/styling)                    | CSSモジュール、Tailwind CSS、CSS-in-JSなど、好みのスタイリング手法をサポート。                                                                  |
| [最適化](https://nextjs.org/docs/app/building-your-application/optimizing)                    | アプリケーションのCore Web Vitalsとユーザーエクスペリエンスを改善するための画像、フォント、スクリプトの最適化。                                                      |
| [TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript) | 改善されたTypeScriptサポート。より良い型チェックと効率的なコンパイル、カスタムTypeScriptプラグインと型チェッカー。                                                  |

# このドキュメントの使い方
画面左側にドキュメントのナビゲーションバーがあります。
ドキュメントのページは基本から応用まで順序立てて構成されているので、アプリケーション構築時にステップバイステップで従うことができます。
ただし、任意の順序で読んだり、自分のユースケースに合ったページだけを参照したりすることも可能です。

画面右側には目次があり、ページ内のセクション間を簡単に移動できます。
特定のページをすぐに見つけたい場合は、上部の検索バーか検索ショートカット（Ctrl+KまたはCmd+K）を使用してください。

始めるには、[インストールガイド](https://nextjs.org/docs/getting-started/installation)をご覧ください。

# Appルーターとページルーター
Next.jsには2つの異なるルーターがあります：
AppルーターとPagesルーターです。
Appルーターは新しいルーターで、サーバーコンポーネントやストリーミングなどReactの最新機能を使用できます。
Pagesルーターは元のNext.jsルーターで、サーバーレンダリングされたReactアプリケーションの構築を可能にし、古いNext.jsアプリケーション向けにサポートが継続されています。

サイドバー上部にあるドロップダウンメニューで、AppルーターとPagesルーターの機能を切り替えることができます。
各ディレクトリに固有の機能があるため、どちらのタブが選択されているかを把握することが重要です。

ページ上部のパンくずリストも、AppルーターのドキュメントとPagesルーターのドキュメントのどちらを表示しているかを示します。

# 前提知識
このドキュメントは初心者にも分かりやすいよう設計されていますが、Next.jsの機能に焦点を当てるために、基本的な前提知識を設定する必要があります。
新しい概念を紹介する際は、関連するドキュメントへのリンクを必ず提供します。

ドキュメントを最大限に活用するには、HTML、CSS、Reactの基本的な理解があることをお勧めします。
Reactのスキルを磨く必要がある場合は、[React基礎コース](https://nextjs.org/learn/react-foundations)をご覧ください。
これにより基本が紹介されます。
その後、[ダッシュボードアプリケーションを構築すること](https://nextjs.org/learn/dashboard-app)でNext.jsについてさらに学ぶことができます。

# アクセシビリティ
ドキュメントを読む際にスクリーンリーダーを使用する場合、最適なアクセシビリティを得るには、FirefoxとNVDA、またはSafariとVoiceOverの使用をお勧めします。
