# Nextra 開発ガイド

このドキュメントは、本プロジェクトにおける Nextra (v3+) を使用した開発のコーディング標準とベストプラクティスをまとめたものです。ディレクトリ構造、ルーティング設定、コンポーネントの使用方法については、このガイドを参照してください。

## 1. ディレクトリ構造とファイルシステムルーティング (File System Routing)

Nextra の規約に従い、Pages Router を使用します。

- **`pages/`**: ルートのソースファイル (`.mdx`, `.md`) を配置します。
- **`pages/_meta.ts`**: サイト構造、サイドバーのナビゲーション階層、ページタイトルを定義します。**`.json` ではなく、必ず `.ts` (または `.js`) を使用してください。**

### `_meta.ts` の例
```typescript
// pages/_meta.ts
export default {
  "index": "Introduction", // Simple label rename
  "guide": "Guide",        // Maps to pages/guide folder or file
  "about": {
    "title": "About Us",
    "type": "page"         // 'page' type hides it from sidebar if needed or treats it special
  },
  "contact": {
    "title": "Contact ↗",
    "type": "page",
    "href": "https://example.com",
    "newWindow": true
  }
}
```

## 2. 組み込みコンポーネント (Built-in Components)

組み込みコンポーネントは必ず `nextra/components` パッケージからインポートしてください。古いインポート方法は使用しないでください。

### Callout (アラート表示)
重要な情報を強調するために使用します (info, warning, error, default)。

```tsx
import { Callout } from 'nextra/components'

<Callout type="info" emoji="ℹ️">
  This is an **info** callout. Valid types: `default`, `info`, `warning`, `error`.
</Callout>
```

### Steps (手順の可視化)
一連の手順を視覚化するために使用します。見出し (H2-H6) を内部にラップします。

```tsx
import { Steps } from 'nextra/components'

<Steps>
### Step 1: Install
Run the installation command.

### Step 2: Configure
Update your config file.
</Steps>
```

### Cards (リンクカード)
リンクや簡潔な情報のグリッドを表示するために使用します。

```tsx
import { Cards } from 'nextra/components'
import { IconName } from './icons'

<Cards>
  <Cards.Card
    icon={<IconName />}
    title="Getting Started"
    href="/docs/getting-started"
  />
  <Cards.Card
    title="API Reference"
    href="/docs/api"
  />
</Cards>
```

### Tabs (タブ切り替え)
代替コンテンツ (例: パッケージマネージャごとのコマンド) を表示するために使用します。

```tsx
import { Tabs } from 'nextra/components'

<Tabs items={['pnpm', 'npm', 'yarn']}>
  <Tabs.Tab>
    ```bash
    pnpm install nextra
    ```
  </Tabs.Tab>
  <Tabs.Tab>
    ```bash
    npm install nextra
    ```
  </Tabs.Tab>
  <Tabs.Tab>
    ```bash
    yarn add nextra
    ```
  </Tabs.Tab>
</Tabs>
```

## 3. 一般ルール
- コンポーネントを使用できるようにするため、標準の Markdown (`.md`) よりも **MDX** (`.mdx`) を優先してください。
- 新しいページを作成した際は、ナビゲーションに正しく表示されるよう、対応する `_meta.ts` に必ず登録してください。
