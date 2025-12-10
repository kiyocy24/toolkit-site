"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    ArrowLeft,
    FileJson,
    Binary,
    Fingerprint,
    Database,
    Regex,
    FileDiff
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
]

export default function ToolsLayout({ children }: ToolsLayoutProps) {
    const pathname = usePathname()

    return (
        <div className="container mx-auto flex flex-col gap-6 py-8 md:py-10">
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
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-4 lg:pb-0 px-4 lg:px-0">
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
