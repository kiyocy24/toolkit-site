import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
    locales: ["en", "ja"],
    defaultLocale: "en",
})

// 言語切り替え UI に表示する各ロケールの名称（どの言語で表示中でも自言語名で表示する）
export const localeNames: Record<(typeof routing.locales)[number], string> = {
    en: "English",
    ja: "日本語",
}
