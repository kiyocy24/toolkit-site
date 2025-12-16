"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Search } from "lucide-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
    const pathname = usePathname()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTools = useMemo(() => categories.reduce((acc, category) => {
        const categoryTools = toolsByCategory[category] || []
        const filtered = categoryTools.filter(tool =>
            tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filtered.length > 0) {
            acc[category] = filtered
        }
        return acc
    }, {} as Record<string, typeof toolsByCategory[keyof typeof toolsByCategory]>), [searchQuery])

    const hasResults = Object.keys(filteredTools).length > 0

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

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
                    <div className="px-4 lg:hidden flex flex-col gap-4">
                        <ToolsSearchInput
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Select
                            value={pathname}
                            onValueChange={(value) => router.push(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tool" />
                            </SelectTrigger>
                            <SelectContent>
                                {hasResults ? (
                                    categories.map((category) => {
                                        const categoryTools = filteredTools[category];
                                        if (!categoryTools) return null;

                                        return (
                                            <SelectGroup key={category}>
                                                <SelectLabel>{category}</SelectLabel>
                                                {categoryTools.map((tool) => (
                                                    <SelectItem key={tool.href} value={tool.href}>
                                                        <div className="flex items-center">
                                                            <tool.icon className="mr-2 h-4 w-4" />
                                                            {tool.title}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        );
                                    })
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        No tools found
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
                        />
                        {hasResults ? (
                            categories.map((category) => {
                                const categoryTools = filteredTools[category];
                                if (!categoryTools) return null;

                                return (
                                    <div key={category} className="flex flex-col space-y-1">
                                        <h4 className="font-medium text-sm text-muted-foreground mb-2 px-4 lg:px-0">
                                            {category}
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
                                                    {tool.title}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No tools found matching "{searchQuery}"
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
    className?: string
}

function ToolsSearchInput({ value, onChange, className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search tools..."
                value={value}
                onChange={onChange}
                className="pl-8"
            />
        </div>
    )
}
