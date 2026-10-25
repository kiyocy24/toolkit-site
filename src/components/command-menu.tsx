"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { DialogProps } from "@radix-ui/react-dialog"
import { CircleIcon, FileIcon, LaptopIcon, MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils"
// import { useTheme } from "next-themes" // Theme switching is not requested yet, keeping simple
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { tools, categories } from "@/config/tools"
import { useRouter } from "@/i18n/navigation"

export function CommandMenu({ ...props }: DialogProps) {
    const t = useTranslations("CommandMenu")
    const tTools = useTranslations("Tools")
    const tCategories = useTranslations("Categories")
    const router = useRouter()

    const runCommand = React.useCallback((command: () => void) => {
        props.onOpenChange?.(false)
        command()
    }, [props.onOpenChange])

    return (
        <CommandDialog open={props.open} onOpenChange={props.onOpenChange}>
            <CommandInput placeholder={t("placeholder")} />
            <CommandList>
                <CommandEmpty>{t("empty")}</CommandEmpty>
                {categories.map((category) => {
                    const categoryTools = tools.filter(tool => tool.category === category)
                    if (categoryTools.length === 0) return null

                    return (
                        <CommandGroup key={category} heading={tCategories(category)}>
                            {categoryTools.map((tool) => {
                                const title = tTools(`${tool.id}.title`)
                                return (
                                    <CommandItem
                                        key={tool.href}
                                        value={title}
                                        onSelect={() => {
                                            runCommand(() => router.push(tool.href))
                                        }}
                                    >
                                        {tool.icon && <tool.icon className="mr-2 h-4 w-4" />}
                                        {title}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
    )
}
