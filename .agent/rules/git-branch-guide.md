---
trigger: always_on
---

# Git ブランチ運用ルール

コードベースに変更を加える場合（バグ修正、機能追加、リファクタリングなど）、必ず新しいブランチを作成して切り替えてください。**`main` や `master` ブランチに直接コミットしてはいけません。**

## ブランチの命名規則

フォーマット: `type/short-description-in-english`

### 1. タイプ (Types)
- `feat/`: 新機能や大きな追加。
- `fix/`: バグ修正。
- `refactor/`: 振る舞いを変えないコードの改善。
- `chore/`: メンテナンス作業（設定ファイルの更新、依存関係の更新など）。
- `docs/`: ドキュメントのみの変更。

### 2. スタイル
- **ケバブケース (Kebab-case)**: 単語をハイフンで区切る（例: `feat/add-login-button`）。
- **英語 (English)**: ブランチ名は常に英語を使用してください。
- **簡潔に**: 短く、かつ内容が分かるようにしてください。

## ワークフロー

1.  **現状確認**: コードを書く前に `git branch --show-current` を実行し、現在のブランチを確認してください。
2.  **最新のmainから作成**:
    新しい作業を始める場合は、**必ず最新の `main` ブランチから**新しいブランチを作成してください。
    ```bash
    git checkout main
    git pull origin main
    git checkout -b <new-branch-name>
    ```
3.  **既存ブランチでの作業**:
    既に適切な作業ブランチにいる場合は、そのまま作業を続けてください。
4.  **検証**: 編集を始める前に、正しいブランチにいることを確認してください (`git status`)。

## 例
- ✅ `feat/user-authentication`
- ✅ `fix/navbar-responsive-layout`
- ✅ `refactor/optimize-image-loading`
- ❌ `add_login` (`feat/` プレフィックスとケバブケースを使用してください)
- ❌ `修正/ログイン` (英語を使用してください)