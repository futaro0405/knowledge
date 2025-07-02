### 1. **worktreeの作成**

```bash
# 新しいブランチで作成
git worktree add ../worktrees/feature-x -b feature/new-feature

# 既存のブランチで作成
git worktree add ../worktrees/bugfix-y bugfix/existing-bug
```

### 2. **worktreeに移動して作業**

```bash
# worktreeディレクトリに移動
cd ../worktrees/feature-x

# 通常通り開発作業
# ファイルの編集、追加、削除など
```

### 3. **変更をコミット**

```bash
# 変更を確認
git status

# ステージング＆コミット
git add .
git commit -m "機能Xを実装"
```

### 4. **メインリポジトリと行き来**

```bash
# メインリポジトリに戻る
cd ../../your-project

# 必要に応じてworktreeに戻る
cd ../worktrees/feature-x
```

### 5. **変更をマージ（必要な場合）**

```bash
# メインリポジトリで
git checkout main
git merge feature/new-feature
```

### 6. **worktreeの削除**

```bash
# メインリポジトリから実行
git worktree remove ../worktrees/feature-x

# ブランチも削除する場合
git branch -d feature/new-feature
```

## 便利なコマンド

### worktreeの管理

```bash
# worktree一覧を表示
git worktree list

# 不要なworktree情報をクリーンアップ
git worktree prune
```

### 一般的な使用例

```bash
# 本番環境のバグ修正用
git worktree add ../worktrees/hotfix main

# 機能開発用
git worktree add ../worktrees/feature develop -b feature/awesome

# コードレビュー用
git worktree add ../worktrees/review origin/pr/123
```

## 注意点

- **worktreeは同じブランチを複数作成できません**
- **削除前に未コミットの変更がないか確認**
- **worktreeでの変更は即座にメインリポジトリと共有される**
- **リモートへのプッシュは任意**

## 典型的なユースケース

1. **並行開発**: メイン機能を開発しながら、別worktreeで緊急バグ修正
2. **ビルド保持**: ビルド済みのメインブランチを保持しつつ、別ブランチで開発
3. **レビュー**: PRのレビュー用に一時的なworktreeを作成
4. **実験**: 破壊的な変更を別worktreeで安全に試す