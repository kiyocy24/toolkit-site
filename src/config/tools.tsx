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
} from "lucide-react"

export type ToolCategory = "Core" | "Utility" | "Security" | "Math" | "Database" | "Development" | "Date"

export interface Tool {
    title: string
    href: string
    icon: React.ElementType
    description: string
    category: ToolCategory
}

export const tools: Tool[] = [
    {
        title: "JSON Formatter",
        href: "/tools/json-formatter",
        icon: FileJson,
        description: "Format and validate your JSON data.",
        category: "Core",
    },
    {
        title: "Base64 Converter",
        href: "/tools/base64-converter",
        icon: Binary,
        description: "Encode and decode Base64 strings.",
        category: "Utility",
    },
    {
        title: "UUID Generator",
        href: "/tools/uuid-generator",
        icon: Fingerprint,
        description: "Generate random UUIDs v4.",
        category: "Utility",
    },
    {
        title: "SQL Formatter",
        href: "/tools/sql-formatter",
        icon: Database,
        description: "Beautify your SQL queries.",
        category: "Database",
    },
    {
        title: "Regex Tester",
        href: "/tools/regex-tester",
        icon: Regex,
        description: "Test your regular expressions.",
        category: "Development",
    },
    {
        title: "Diff Viewer",
        href: "/tools/diff-viewer",
        icon: FileDiff,
        description: "Compare two text contents.",
        category: "Utility",
    },
    {
        title: "Prime Factorization",
        href: "/tools/prime-factorization",
        icon: Calculator,
        description: "Decompose integers into prime factors.",
        category: "Math",
    },
    {
        title: "Collatz Conjecture",
        href: "/tools/collatz-conjecture",
        icon: LineChart,
        description: "Visualize the 3n + 1 sequence.",
        category: "Math",
    },
    {
        title: "Hash Generator",
        href: "/tools/hash-generator",
        icon: Hash,
        description: "Compute text hashes (MD5, SHA).",
        category: "Security",
    },
    {
        title: "Color Converter",
        href: "/tools/color-converter",
        icon: Palette,
        description: "Convert color formats (HEX, RGB, HSL).",
        category: "Utility",
    },
    {
        title: "Password Generator",
        href: "/tools/password-generator",
        icon: Lock,
        description: "Generate secure random passwords.",
        category: "Security",
    },
    {
        title: "QR Code Generator",
        href: "/tools/qr-code-generator",
        icon: QrCode,
        description: "Generate QR codes for URLs or text.",
        category: "Utility",
    },
    {
        title: "JWT Debugger",
        href: "/tools/jwt-debugger",
        icon: Shield,
        description: "Decode, encode, and sign JSON Web Tokens.",
        category: "Development",
    },
    {
        title: "CSS Unit Converter",
        href: "/tools/css-unit-converter",
        icon: Ruler,
        description: "Convert between px, rem, and em units.",
        category: "Utility",
    },
    {
        title: "Markdown Previewer",
        href: "/tools/markdown-previewer",
        icon: FileText,
        description: "Preview markdown text with GFM support.",
        category: "Utility",
    },
    {
        title: "Unix Timestamp Converter",
        href: "/tools/unix-timestamp-converter",
        icon: Calendar,
        description: "Convert timestamps to dates and vice versa.",
        category: "Date",
    },
    {
        title: "URL Encoder/Decoder",
        href: "/tools/url-encoder-decoder",
        icon: Link2,
        description: "Encode and decode URL strings.",
        category: "Utility",
    },
    {
        title: "Cron Expression Generator",
        href: "/tools/cron-expression-generator",
        icon: Calendar,
        description: "Generate and explain cron expressions.",
        category: "Utility",
    },
    {
        title: "Lorem Ipsum Generator",
        href: "/tools/lorem-ipsum-generator",
        icon: Type,
        description: "Generate dummy text (Lorem Ipsum, Japanese).",
        category: "Development",
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
