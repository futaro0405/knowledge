# TypeScriptでVueを使用する
TypeScriptのような型システムを使うと、コードを書く際に型チェックが行われるため、よくあるエラーを早期に検出できます。
これにより、実際にアプリケーションが動くときに起こるエラーの数が減り、大規模なアプリケーションでも安心してコードをリファクタリング（構造を整理・改善すること）ができるようになります。

さらに、TypeScriptを使用すると、IDE（統合開発環境）での自動補完機能が強化されるため、開発がより効率的になります。
自動補完機能とは、例えば、コードを書くときに関数名や変数名の候補が自動で表示される機能のことです。
これにより、開発者は正確なコードを素早く書けるようになります。

Vueは、TypeScriptで書かれているため、TypeScriptとの互換性が高いです。
また、Vueのすべての公式パッケージには型定義が含まれており、これらを利用してすぐにTypeScriptを使った開発を始めることができます。

## プロジェクトのセットアップ
`create-vue`は、Viteを使用したTypeScript対応のVueプロジェクトをセットアップするための公式ツールです。

### 概要
Viteベースのセットアップでは、開発サーバーとそのバンドラーはコードの変換（トランスパイル）のみ行い、型チェックは行いません。
これにより、Viteの開発サーバーはTypeScriptを使用していても非常に高速に動作します。

開発中は、すぐに型エラーのフィードバックを得るために、優れたIDEのセットアップを使用することを推奨します。

シングルファイルコンポーネント（SFC）を使用する場合、コマンドラインでの型チェックと型宣言の生成にはvue-tscを使用します。
vue-tscはTypeScriptのコマンドラインツールであるtscのラッパーで、TypeScriptファイルに加えてVue SFCをサポートします。
Viteの開発サーバーと並行して、vue-tscをウォッチモードで実行するか、別のスレッドでチェックを行うvite-plugin-checkerなどのViteプラグインを使用できます。

Vue CLIもTypeScriptをサポートしていますが、現在は推奨されていません。
以下の注意を参照してください。
### `tsconfig.json`の構成
create-vueを使ってセットアップしたプロジェクトには、@vue/tsconfigパッケージで抽象化された構成済みのtsconfig.jsonが含まれています。
プロジェクト内では、Project Referencesを使って異なる環境で実行されるコードに対して正しい型を保証しています。

tsconfig.jsonを手動で構成する場合、いくつかの重要なオプションがあります。

ViteはTypeScriptのトランスパイルにesbuildを使用しており、単一ファイルのトランスパイル制限に従うため、compilerOptions.isolatedModulesをtrueに設定してください。
compilerOptions.verbatimModuleSyntaxも有用なオプションで、@vue/tsconfigで使用されています。

Options APIを使用する場合は、コンポーネントオプション内のthisの型チェックを行うために、compilerOptions.strictをtrueに設定するか、少なくともcompilerOptions.noImplicitThisをtrueに設定してください。そうでないと、thisは常にany型として扱われます。

たとえば、create-vueプロジェクトでデフォルトで設定される@/*エイリアスのようなresolverエイリアスをビルドツールで設定した場合、TypeScript用の設定としてcompilerOptions.pathsにもエイリアスを設定する必要があります。

VueでTSXを使用する場合は、compilerOptions.jsxを"preserve"に設定し、compilerOptions.jsxImportSourceを"vue"に設定してください。

**参照:**

- Official TypeScript compiler options docs
- esbuild TypeScript compilation caveats

**Vue CLIとts-loaderに関する注意** Vue CLIなどのwebpackベースのセットアップでは、モジュールの変換パイプラインの一部でts-loaderを使って型チェックを行うことが一般的です。しかし、これは理想的な方法ではありません。これは以下のような問題を引き起こします：

- ts-loaderは変換後のコードしか型チェックできず、IDEやvue-tscで見られるエラーとは一致しません。
- 型チェックは遅くなる可能性があり、アプリケーション全体のビルド速度に影響します。
- すでにIDEで型チェックを行っている場合、別のプロセスで実行することが推奨されます。

現在、Vue CLIを使ってVue 3 + TypeScriptを使用している場合、Viteへの移行を強く推奨します。型チェックのためにvue-tscに切り替えることができます。