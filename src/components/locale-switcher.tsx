"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLocale, useTranslations, type Locale } from "next-intl"

import { usePathname, useRouter } from "@/i18n/navigation"
import { localeNames, routing } from "@/i18n/routing"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function LocaleSwitcher() {
    const t = useTranslations("LocaleSwitcher")
    const locale = useLocale()
    const router = useRouter()
    // ロケールを除いたパス名（例: `/ja/tools/json-formatter` -> `/tools/json-formatter`）
    const pathname = usePathname()
    const [isPending, startTransition] = React.useTransition()

    const onValueChange = (nextLocale: string) => {
        startTransition(() => {
            // 現在のページを保ったままロケールのみ切り替える
            router.replace(pathname, { locale: nextLocale as Locale })
        })
    }

    return (
        <Select value={locale} onValueChange={onValueChange} disabled={isPending}>
            <SelectTrigger size="sm" aria-label={t("label")} className="h-9">
                <Languages className="h-4 w-4" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {routing.locales.map((cur) => (
                    <SelectItem key={cur} value={cur} lang={cur}>
                        {localeNames[cur]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
