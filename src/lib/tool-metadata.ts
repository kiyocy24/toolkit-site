import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import type { ToolId } from "@/config/tools"

// ツールページはクライアントコンポーネントで generateMetadata を export できないため、
// 各ツールの layout.tsx からこの関数でロケールごとのメタデータを生成する
export function createToolMetadata(id: ToolId) {
    return async function generateMetadata(): Promise<Metadata> {
        const t = await getTranslations("Tools")
        return {
            title: t(`${id}.title`),
            description: t(`${id}.description`),
        }
    }
}
