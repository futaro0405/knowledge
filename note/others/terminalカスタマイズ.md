---
tags: PowerShell oh-my-posh
---

## oh-my-posh
### 1. PowerShellの権限設定を変更
oh-my-poshで利用するPowerShellスクリプトを実行できるように権限を変更する。

1.  windows tarminalを管理者で実行
2.  外部から入手したスクリプトを実行可能にする

```tarminal:windows tarminal
Set-ExcecutionPolicy RemoteSigned
```

### 2. oh-my-poshのインストール
oh-my-poshをインストールする。
途中、インストールの許可が何度か求められるので、許可して実行する。
```tarminal:windows tarminal
Install-Module oh-my-posh -Scope CurrentUser
```

### 3. テーマの確認
テーマの一覧を確認する。
設定時にテーマ名を指定するので、ここでデザインと名前を確認する。
もしくは、[公式サイトのテーマページ](https://ohmyposh.dev/docs/themes)で、デザインと名前を確認する。

```tarminal:windows tarminal
Get-PoshThemes
```

### 4. テーマの設定
テーマを設定する。
設定はPowerShellのプロファイルに保存する。
以下コマンドでプロファイルを新規作成。

```tarminal:windows tarminal
notepad $PROFILE
```

プロファイルに以下のような設定を書き込んで保存する。
```
Import-Module oh-my-posh
Set-PoshPrompt Theme unicorn
```
#### 補足
「Set-PoshPrompt」コマンドを使ってテーマを設定すると、同様に自動的にプロファイルを作成できる。
```
Set-PoshPrompt
```

