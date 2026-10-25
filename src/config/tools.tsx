import {
    FileJson,
    Binary,
    Fingerprint,
    Database,
    Regex,
    FileDiff,
    Calculator,
    LineChart,
    Hash,
    Palette,
    QrCode,
    Ruler,
    Shield,
    Lock,
    Calendar,
    Link2,
    FileText,
    Type,
    CaseUpper,
} from "lucide-react"
import type { Messages } from "next-intl"

export type ToolCategory = "Core" | "Utility" | "Security" | "Math" | "Database" | "Development" | "Date"

// ツール名・説明文は messages/*.json の `Tools.<id>` に定義する
export type ToolId = keyof Messages["Tools"]

export interface Tool {
    id: ToolId
    href: string
    icon: React.ElementType
    category: ToolCategory
}

export const tools: Tool[] = [
    {
        id: "json-formatter",
        href: "/tools/json-formatter",
        icon: FileJson,
        category: "Core",
    },
    {
        id: "base64-converter",
        href: "/tools/base64-converter",
        icon: Binary,
        category: "Utility",
    },
    {
        id: "uuid-generator",
        href: "/tools/uuid-generator",
        icon: Fingerprint,
        category: "Utility",
    },
    {
        id: "sql-formatter",
        href: "/tools/sql-formatter",
        icon: Database,
        category: "Database",
    },
    {
        id: "regex-tester",
        href: "/tools/regex-tester",
        icon: Regex,
        category: "Development",
    },
    {
        id: "diff-viewer",
        href: "/tools/diff-viewer",
        icon: FileDiff,
        category: "Utility",
    },
    {
        id: "prime-factorization",
        href: "/tools/prime-factorization",
        icon: Calculator,
        category: "Math",
    },
    {
        id: "collatz-conjecture",
        href: "/tools/collatz-conjecture",
        icon: LineChart,
        category: "Math",
    },
    {
        id: "hash-generator",
        href: "/tools/hash-generator",
        icon: Hash,
        category: "Security",
    },
    {
        id: "color-converter",
        href: "/tools/color-converter",
        icon: Palette,
        category: "Utility",
    },
    {
        id: "password-generator",
        href: "/tools/password-generator",
        icon: Lock,
        category: "Security",
    },
    {
        id: "qr-code-generator",
        href: "/tools/qr-code-generator",
        icon: QrCode,
        category: "Utility",
    },
    {
        id: "jwt-debugger",
        href: "/tools/jwt-debugger",
        icon: Shield,
        category: "Development",
    },
    {
        id: "css-unit-converter",
        href: "/tools/css-unit-converter",
        icon: Ruler,
        category: "Utility",
    },
    {
        id: "markdown-previewer",
        href: "/tools/markdown-previewer",
        icon: FileText,
        category: "Utility",
    },
    {
        id: "unix-timestamp-converter",
        href: "/tools/unix-timestamp-converter",
        icon: Calendar,
        category: "Date",
    },
    {
        id: "url-encoder-decoder",
        href: "/tools/url-encoder-decoder",
        icon: Link2,
        category: "Utility",
    },
    {
        id: "cron-expression-generator",
        href: "/tools/cron-expression-generator",
        icon: Calendar,
        category: "Utility",
    },
    {
        id: "lorem-ipsum-generator",
        href: "/tools/lorem-ipsum-generator",
        icon: Type,
        category: "Development",
    },
    {
        id: "string-case-converter",
        href: "/tools/string-case-converter",
        icon: CaseUpper,
        category: "Utility",
    },
    {
        id: "chmod-calculator",
        href: "/tools/chmod-calculator",
        icon: Lock,
        category: "Development",
    },
    {
        id: "url-parser",
        href: "/tools/url-parser",
        icon: Link2,
        category: "Development",
    },
    {
        id: "number-base-converter",
        href: "/tools/number-base-converter",
        icon: Binary,
        category: "Math",
    },
    {
        id: "gcd-lcm-calculator",
        href: "/tools/gcd-lcm-calculator",
        icon: Calculator,
        category: "Math",
    },
]

export const categories: ToolCategory[] = ["Core", "Utility", "Development", "Security", "Database", "Math", "Date"];

export const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
        acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
}, {} as Record<ToolCategory, Tool[]>);
