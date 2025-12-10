# AGENTS.md

このファイルは、AIコーディングエージェント（Gemini 3 Pro等）がこのプロジェクトにおいて自律的にタスクを遂行するための「コンテキストとルールの定義書」です。
AIエージェントは、コードの変更、ファイルの作成、リファクタリングを行う際、**必ずこのファイルの指示に従ってください。**

## 1. プロジェクト概要
このプロジェクトは、**Next.js (App Router)** と **shadcn/ui** を使用したモダンなウェブアプリケーションサイトです。
優れたデザインとパフォーマンスを両立させることを目的としています。

## 2. 技術スタック & 環境
AIエージェントは以下の技術スタックを厳守し、それ以外の代替技術（npm, yarn, pure CSSなど）を提案・使用しないでください。

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (`.ts`, `.tsx`)
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **Styling:** Tailwind CSS v4
- **Package Manager:** pnpm
- **Deployment:** Vercel (想定)

## 3. 開発ルールとコマンド
すべてのコマンド実行は **pnpm** を使用してください。

- **依存関係のインストール:** `pnpm install`
- **開発サーバー起動:** `pnpm dev`
- **ビルド:** `pnpm build`
- **コンポーネント追加:** `pnpm dlx shadcn@latest add [component-name]`
- **Lint/Format:** プロジェクト設定に従う（Prettier/ESLint推奨）

## 4. ディレクトリ構造 (Next.js App Router)
AIエージェントは以下のディレクトリ構造を維持・尊重してください。

- `src/app`: アプリケーションのルーティングとページ定義。
  - `page.tsx`: ページコンテンツ。
  - `layout.tsx`: レイアウト定義。
  - `loading.tsx`, `error.tsx`, `not-found.tsx`: 各種状態のUI。
- `src/components`: Reactコンポーネント。
  - `src/components/ui`: shadcn/ui の基本コンポーネント（AIが直接編集することは極力避け、CLIで追加・更新を行う）。
  - `src/components/[feature]`: 機能ごとのコンポーネント（例: `math`, `dashboard`）。
- `src/lib`: ユーティリティ関数（`utils.ts` 等）。
- `public`: 静的アセット。

## 5. コーディング規約

### 5.1 Next.js / React
- **Server Components Default:** 原則として **Server Components** をデフォルトとして使用してください。
  - データフェッチはServer Components内で行う。
  - インタラクティブな機能（`useState`, `useEffect`, イベントハンドラなど）が必要な場合のみ、ファイルの先頭に `'use client'` を記述して Client Component とする。
  - Client Component は可能な限りリーフ（末端）に配置し、Server Component のメリットを最大化する。
- **Strict Mode:** TypeScriptの厳格な型チェックを遵守すること。`any` は禁止。

### 5.2 Tailwind CSS & shadcn/ui
- **Styling:** スタイリングは Tailwind CSS のユーティリティクラスを使用する。
- **shadcn/ui Customization:**
  - コンポーネントのスタイルを上書きする場合は、`className` プロパティと `cn()` ユーティリティを使用して拡張する。
  - `components/ui` 内のファイルは、バグ修正やプロジェクト全体のデザインシステム変更が必要な場合を除き、原則として直接変更しない（アップグレード容易性のため）。
- **Colors:** ハードコードされた色コード（Hex/RGB）は避け、Tailwindの設定（`bg-background`, `text-primary` 等）や CSS変数を使用する。

### 5.3 画像とリンク
- **Images:** `next/image` コンポーネントを使用し、最適化を行う。
- **Links:** 内部リンクには `next/link` を使用する。

## 6. AIエージェントへの具体的な指示 (Behavior Instructions)

1.  **コンポーネントの追加:**
    新しいUI要素が必要な場合は、まず `shadcn/ui` に該当するコンポーネントがないか確認し、あれば `pnpm dlx shadcn@latest add` コマンドを使用してプロジェクトに追加すること。

2.  **回答のトーン:**
    コード生成時のコメントやコミットメッセージは日本語で記述してください。

3.  **App Routerのベストプラクティス:**
    `Check if Next.js App Router best practices are followed.` という視点を常に持ち、古い `pages/` ディレクトリのパターンを混入させないこと。
