import * as React from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { NextIntlClientProvider, type Locale } from "next-intl"
import en from "../../messages/en.json"
import ja from "../../messages/ja.json"

const messagesByLocale = { en, ja }

interface IntlRenderOptions extends RenderOptions {
    locale?: Locale
}

// next-intl の Provider でラップして描画する（デフォルトは英語）
function renderWithIntl(
    ui: React.ReactElement,
    { locale = "en", ...options }: IntlRenderOptions = {},
) {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
            {children}
        </NextIntlClientProvider>
    )
    return render(ui, { wrapper: Wrapper, ...options })
}

export * from "@testing-library/react"
export { renderWithIntl as render }
