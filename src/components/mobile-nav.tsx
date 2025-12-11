"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { Monitor, FileText, Menu, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export function MobileNav() {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pl-6 pr-6 pt-10">
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>

                <div className="px-2 mb-8">
                    <MobileLink
                        href="/"
                        className="flex items-center"
                        onOpenChange={setOpen}
                    >
                        <span className="font-bold text-lg tracking-tight">Toolkit</span>
                    </MobileLink>
                </div>

                <div className="flex flex-col space-y-4 px-2">
                    <MobileLink href="/docs" onOpenChange={setOpen} className="text-muted-foreground hover:text-foreground transition-colors">
                        <div className="flex items-center gap-4 py-2">
                            <FileText className="h-5 w-5" />
                            <span className="text-base font-medium">Docs</span>
                        </div>
                    </MobileLink>
                    <MobileLink href="/tools" onOpenChange={setOpen} className="text-muted-foreground hover:text-foreground transition-colors">
                        <div className="flex items-center gap-4 py-2">
                            <Monitor className="h-5 w-5" />
                            <span className="text-base font-medium">Tools</span>
                        </div>
                    </MobileLink>
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    )
}
