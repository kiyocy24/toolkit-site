"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState("")
    const [flags, setFlags] = useState("gm")
    const [text, setText] = useState("")

    const getHighlightedText = () => {
        if (!pattern || !text) return text

        try {
            const regex = new RegExp(pattern, flags)
            let lastIndex = 0
            const elements = []
            let match

            // If global flag is not set, we only find the first match
            if (!flags.includes("g")) {
                const m = regex.exec(text)
                if (m) {
                    elements.push(text.slice(0, m.index))
                    elements.push(
                        <span key={0} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm">
                            {m[0]}
                        </span>
                    )
                    elements.push(text.slice(m.index + m[0].length))
                    return elements
                }
                return text
            }

            // Identify all matches
            // Note: matchAll is newer, looping exec is safer for older envs but matchAll is standard in modern node
            const matches = Array.from(text.matchAll(regex))

            if (matches.length === 0) return text

            matches.forEach((m, i) => {
                // Push text before match
                if (m.index !== undefined) {
                    elements.push(text.slice(lastIndex, m.index))
                    elements.push(
                        <span key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm">
                            {m[0]}
                        </span>
                    )
                    lastIndex = m.index + m[0].length
                }
            })
            // Push remaining text
            elements.push(text.slice(lastIndex))

            return elements
        } catch (e) {
            return text
        }
    }

    const errorMessage = useMemo(() => {
        try {
            new RegExp(pattern, flags)
            return null
        } catch (e) {
            return (e as Error).message
        }
    }, [pattern, flags])

    const clearAll = () => {
        setPattern("")
        setText("")
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Regex Tester</CardTitle>
                    <CardDescription>
                        Test your regular expressions with real-time highlighting.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_100px]">
                        <div className="grid gap-2">
                            <Label htmlFor="pattern">Regex Pattern</Label>
                            <Input
                                id="pattern"
                                placeholder="e.g. [a-z0-9]+"
                                className="font-mono text-sm"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="flags">Flags</Label>
                            <Input
                                id="flags"
                                placeholder="g, i, m..."
                                className="font-mono text-sm"
                                value={flags}
                                onChange={(e) => setFlags(e.target.value)}
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            Error: {errorMessage}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Test String</Label>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Paste your text here..."
                            className="min-h-[150px] font-mono text-sm"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Match Result</Label>
                        <div className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm whitespace-pre-wrap font-mono break-all">
                            {getHighlightedText()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
