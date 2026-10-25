import type { routing } from "@/i18n/routing"
import type messages from "../messages/en.json"

// next-intl の型定義を拡張し、ロケールと翻訳キーを型安全にする
declare module "next-intl" {
    interface AppConfig {
        Locale: (typeof routing.locales)[number]
        Messages: typeof messages
    }
}
