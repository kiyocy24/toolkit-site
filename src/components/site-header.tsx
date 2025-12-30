"use client"

import * as React from "react"
import Link from "next/link"
import { Github } from "lucide-react"

import { cn } from "@/lib/utils"
import { CommandMenu } from "@/components/command-menu"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return
                }

                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center">
                <MobileNav />
                <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Link href="/" className="font-bold pointer-events-auto">Toolkit</Link>
                </div>
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block">Toolkit</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/docs"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Docs
                        </Link>
                        <Link
                            href="/tools"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Tools
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <Button
                            variant="outline"
                            className={cn(
                                "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                            )}
                            onClick={() => setOpen(true)}
                        >
                            <span className="hidden lg:inline-flex">Search documentation...</span>
                            <span className="inline-flex lg:hidden">Search...</span>
                            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                        <CommandMenu open={open} onOpenChange={setOpen} />
                    </div>
                    <nav className="flex items-center">
                        <Link
                            href="https://github.com/kiyocy24/toolkit-site"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
