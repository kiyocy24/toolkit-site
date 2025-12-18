"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"

export default function StringCaseConverter() {
    const [input, setInput] = useState("")
    const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({})

    const convertToCases = (text: string) => {
        if (!text) return []

        // Normalize text: split by space, underscore, dash, or camelCase boundaries
        const words = text
            .replace(/([a-z])([A-Z])/g, "$1 $2") // separate camelCase
            .replace(/[-_.]/g, " ") // replace delimiters with space
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 0)

        if (words.length === 0) return []

        const camel = words
            .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
            .join("")

        const pascal = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("")

        const snake = words.join("_")

        const kebab = words.join("-")

        const constant = words.map((w) => w.toUpperCase()).join("_")

        const dot = words.join(".")

        const path = words.join("/")

        const sentence = words
            .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
            .join(" ")

        const title = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")

        const lower = words.join(" ")

        const upper = words.map(w => w.toUpperCase()).join(" ")

        return [
            { name: "camelCase", value: camel },
            { name: "PascalCase", value: pascal },
            { name: "snake_case", value: snake },
            { name: "kebab-case", value: kebab },
            { name: "CONSTANT_CASE", value: constant },
            { name: "dot.case", value: dot },
            { name: "path/case", value: path },
            { name: "Sentence case", value: sentence },
            { name: "Title Case", value: title },
            { name: "lower case", value: lower },
            { name: "UPPER CASE", value: upper },
        ]
    }

    const cases = convertToCases(input)

    const copyToClipboard = async (text: string, name: string) => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            setCopiedMap((prev) => ({ ...prev, [name]: true }))
            setTimeout(() => {
                setCopiedMap((prev) => ({ ...prev, [name]: false }))
            }, 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>String Case Converter</CardTitle>
                    <CardDescription>
                        Convert text between various naming conventions and formats.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="input-text">Input Text</Label>
                        <Textarea
                            id="input-text"
                            placeholder="Type or paste text here (e.g. hello world, camelCaseVariable)..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[100px] font-mono"
                        />
                    </div>
                </CardContent>
            </Card>

            {cases.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cases.map((c) => (
                        <Card key={c.name} className="overflow-hidden">
                            <CardHeader className="py-3 bg-muted/50">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {c.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3 flex items-center justify-between gap-2">
                                <code className="text-sm font-mono break-all line-clamp-2">
                                    {c.value}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                    onClick={() => copyToClipboard(c.value, c.name)}
                                    title={`Copy ${c.name}`}
                                >
                                    {copiedMap[c.name] ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Copy {c.name}</span>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
