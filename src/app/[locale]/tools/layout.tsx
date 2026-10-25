"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Search } from "lucide-react"

import { useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toolsByCategory, categories } from "@/config/tools"

interface ToolsLayoutProps {
    children: React.ReactNode
}

export default function ToolsLayout({ children }: ToolsLayoutProps) {
    const t = useTranslations("ToolsLayout")
    const tTools = useTranslations("Tools")
    const tCategories = useTranslations("Categories")
    const pathname = usePathname()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTools = useMemo(() => categories.reduce((acc, category) => {
        const categoryTools = toolsByCategory[category] || []
        // 表示中の言語のツール名・説明文で検索する
        const filtered = categoryTools.filter(tool =>
            tTools(`${tool.id}.title`).toLowerCase().includes(searchQuery.toLowerCase()) ||
            tTools(`${tool.id}.description`).toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filtered.length > 0) {
            acc[category] = filtered
        }
        return acc
    }, {} as Record<string, typeof toolsByCategory[keyof typeof toolsByCategory]>), [searchQuery, tTools])

    const hasResults = Object.keys(filteredTools).length > 0

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    return (
        <div className="container mx-auto flex flex-col gap-6 py-8 md:py-10">
            <div className="flex w-full flex-col items-start gap-4">
                {/* Back to Home button removed as it is redundant with global header */}
                <div className="grid w-full gap-2">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t("description")}
                    </p>
                </div>
            </div>
            <Separator />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:mx-0 lg:w-1/5 lg:pr-8">
                    {/* Mobile Navigation (Select) */}
                    <div className="px-4 lg:hidden flex flex-col gap-4">
                        <ToolsSearchInput
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t("searchPlaceholder")}
                        />
                        <Select
                            value={pathname}
                            onValueChange={(value) => router.push(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("selectPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {hasResults ? (
                                    categories.map((category) => {
                                        const categoryTools = filteredTools[category];
                                        if (!categoryTools) return null;

                                        return (
                                            <SelectGroup key={category}>
                                                <SelectLabel>{tCategories(category)}</SelectLabel>
                                                {categoryTools.map((tool) => (
                                                    <SelectItem key={tool.href} value={tool.href}>
                                                        <div className="flex items-center">
                                                            <tool.icon className="mr-2 h-4 w-4" />
                                                            {tTools(`${tool.id}.title`)}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        );
                                    })
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        {t("noTools")}
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop Navigation (Sidebar) */}
                    <nav className="hidden lg:flex lg:flex-col lg:space-y-6">
                        <ToolsSearchInput
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t("searchPlaceholder")}
                        />
                        {hasResults ? (
                            categories.map((category) => {
                                const categoryTools = filteredTools[category];
                                if (!categoryTools) return null;

                                return (
                                    <div key={category} className="flex flex-col space-y-1">
                                        <h4 className="font-medium text-sm text-muted-foreground mb-2 px-4 lg:px-0">
                                            {tCategories(category)}
                                        </h4>
                                        {categoryTools.map((tool) => (
                                            <Button
                                                key={tool.href}
                                                variant={pathname === tool.href ? "secondary" : "ghost"}
                                                asChild
                                                className="w-full justify-start h-auto whitespace-normal text-left"
                                            >
                                                <Link href={tool.href}>
                                                    <tool.icon className="mr-2 h-4 w-4 shrink-0" />
                                                    {tTools(`${tool.id}.title`)}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                {t("noToolsMatching", { query: searchQuery })}
                            </div>
                        )}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">{children}</div>
            </div>
        </div>
    )
}

interface SearchInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    className?: string
}

function ToolsSearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-8"
            />
        </div>
    )
}
