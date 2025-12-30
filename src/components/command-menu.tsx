"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

export function CommandMenu({ ...props }: DialogProps) {
    const router = useRouter()

    const runCommand = React.useCallback((command: () => void) => {
        props.onOpenChange?.(false)
        command()
    }, [props.onOpenChange])

    return (
        <CommandDialog open={props.open} onOpenChange={props.onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {categories.map((category) => {
                    const categoryTools = tools.filter(tool => tool.category === category)
                    if (categoryTools.length === 0) return null

                    return (
                        <CommandGroup key={category} heading={category}>
                            {categoryTools.map((tool) => (
                                <CommandItem
                                    key={tool.href}
                                    value={tool.title}
                                    onSelect={() => {
                                        runCommand(() => router.push(tool.href))
                                    }}
                                >
                                    {tool.icon && <tool.icon className="mr-2 h-4 w-4" />}
                                    {tool.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
    )
}
