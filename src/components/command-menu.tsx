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

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    // Sync external open state if controlled, but here we prefer self-controlled with prop override capability if needed
    // Actually, SiteHeader will control it. So we should accept open/onOpenChange.
    // The provided props generally include open/onOpenChange if passed. 
    // But wait, the keyboard listener is here. 
    // If SiteHeader controls it, SiteHeader should probably have the open state.
    // OR this component handles the global listener and internal state, and just exposes a way to open it?
    // Usually, it's better if this component acts as a controlled component OR a self-managed one attached to the document.
    // But we want the trigger in the header to open it.

    // Let's make it controlled by the parent for the trigger, BUT also listen to keys.
    // Actually, standard pattern:
    // Component has internal state for the dialog.
    // Key listener toggles internal state.
    // BUT we need header button to open it.
    // So header needs access to setOpen.
    // So State should be in Header OR Context.
    // For simplicity, let's put State in Header (as per plan) and this component mainly renders the Dialog.

    // Wait, if I put the listener in Here, but checking `open` from props... 
    // I cannot update props.
    // So `setOpen` must be passed.

    // Let's follow the plan: "Accept open and onOpenChange props to be controlled by the parent (SiteHeader)."

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
