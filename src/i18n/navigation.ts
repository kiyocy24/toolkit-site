import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// ロケールを考慮した Next.js のナビゲーション API のラッパー
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing)
