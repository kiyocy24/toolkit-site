import { notFound } from "next/navigation"

// 未知のパスでも `[locale]/not-found.tsx` を表示するためのキャッチオールルート
export default function CatchAllPage() {
    notFound()
}
