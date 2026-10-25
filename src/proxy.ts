import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

// Accept-Language / Cookie からロケールを判定し、ロケール付きの URL にリダイレクトする
export default createMiddleware(routing)

export const config = {
    // 以下を除くすべてのパスにマッチさせる
    // - `/api`, `/trpc`, `/_next`, `/_vercel` で始まるもの
    // - ドットを含むもの（`favicon.ico` などの静的ファイル）
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
