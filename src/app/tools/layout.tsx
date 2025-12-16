"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    ShieldCheck,
    Lock,
} from "lucide-react"

interface ToolsLayoutProps {
    children: React.ReactNode
}

const sidebarItems = [
    {
        title: "JSON Formatter",
        href: "/tools/json-formatter",
        icon: FileJson,
    },
    {
        title: "Base64 Converter",
        href: "/tools/base64-converter",
        icon: Binary,
    },
    {
        title: "UUID Generator",
        href: "/tools/uuid-generator",
        icon: Fingerprint,
    },
    {
        title: "SQL Formatter",
        href: "/tools/sql-formatter",
        icon: Database,
    },
    {
        title: "Regex Tester",
        href: "/tools/regex-tester",
        icon: Regex,
    },
    {
        title: "Diff Viewer",
        href: "/tools/diff-viewer",
        icon: FileDiff,
    },
    {
        title: "Prime Factorization",
        href: "/tools/prime-factorization",
        icon: Calculator,
    },
    {
        title: "Collatz Conjecture",
        href: "/tools/collatz-conjecture",
        icon: LineChart,
    },
    {
        title: "Hash Generator",
        href: "/tools/hash-generator",
        icon: Hash,
    },
    {
        title: "Color Converter",
        href: "/tools/color-converter",
        icon: Palette,
    },
    {
        title: "Password Generator",
        href: "/tools/password-generator",
        icon: Lock,
    },
    {
        title: "QR Code Generator",
        href: "/tools/qr-code-generator",
        icon: QrCode,
    },

    {
        title: "JWT Debugger",
        href: "/tools/jwt-debugger",
        icon: Shield,
    },
    {
        title: "CSS Unit Converter",
        href: "/tools/css-unit-converter",
        icon: Ruler,
    },
    {
        title: "Markdown Previewer",
        href: "/tools/markdown-previewer",
        icon: FileDiff,
    },
]

export default function ToolsLayout({ children }: ToolsLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <div className="container mx-auto flex flex-col gap-6 py-8 md:py-10 px-6 md:px-8">
            <div className="flex w-full flex-col items-start gap-4">
                {/* Back to Home button removed as it is redundant with global header */}
                <div className="grid w-full gap-2">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                        Developer Tools
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Simple and efficient tools for your daily development tasks.
                    </p>
                </div>
            </div>
            <Separator />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:mx-0 lg:w-1/5 lg:pr-8">
                    {/* Mobile Navigation (Select) */}
                    <div className="px-4 lg:hidden">
                        <Select
                            value={pathname}
                            onValueChange={(value) => router.push(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tool" />
                            </SelectTrigger>
                            <SelectContent>
                                {sidebarItems.map((item) => (
                                    <SelectItem key={item.href} value={item.href}>
                                        <div className="flex items-center">
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop Navigation (Sidebar) */}
                    <nav className="hidden lg:flex lg:flex-col lg:space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                asChild
                                className="justify-start shrink-0"
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">{children}</div>
            </div>
        </div>
    )
}
