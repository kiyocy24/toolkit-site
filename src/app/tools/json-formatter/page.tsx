"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Trash2 } from "lucide-react"


const getErrorDetails = (e: unknown, input: string) => {
    if (e instanceof SyntaxError) {
        const message = e.message

        // V8/Chrome: "Unexpected token } in JSON at position 10"
        // Or: "Unexpected end of JSON input"
        let match = message.match(/at position (\d+)/)

        if (match) {
            const position = parseInt(match[1], 10)
            const lines = input.substring(0, position).split("\n")
            const line = lines.length
            const column = lines[lines.length - 1].length + 1

            return `Syntax Error: ${message} (Line ${line}, Column ${column})`
        }

        // Firefox: "JSON.parse: unexpected character at line 1 column 2 of the JSON data"
        match = message.match(/at line (\d+) column (\d+)/)
        if (match) {
            return `Syntax Error: ${message} (Line ${match[1]}, Column ${match[2]})`
        }

        return `Syntax Error: ${message}`
    }
    return "Invalid JSON"
}

export default function JsonFormatterPage() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [error, setError] = useState<string | null>(null)

    const formatJson = () => {
        try {
            if (!input.trim()) {
                setOutput("")
                setError(null)
                return
            }
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed, null, 2))
            setError(null)
        } catch (e) {
            setError(getErrorDetails(e, input))
            setOutput("")
        }
    }

    const minifyJson = () => {
        try {
            if (!input.trim()) {
                setOutput("")
                setError(null)
                return
            }
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed))
            setError(null)
        } catch (e) {
            setError(getErrorDetails(e, input))
            setOutput("")
        }
    }

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output)
        }
    }

    const clearAll = () => {
        setInput("")
        setOutput("")
        setError(null)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>JSON Formatter</CardTitle>
                    <CardDescription>
                        Format and validate your JSON data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Input JSON
                            </label>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Paste your JSON here..."
                            className="min-h-[200px] font-mono text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button onClick={formatJson}>Format</Button>
                        <Button variant="secondary" onClick={minifyJson}>Minify</Button>
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {output && (
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Output
                                </label>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 px-2 lg:px-3">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                            <div className="overflow-hidden rounded-md border text-sm">
                                <SyntaxHighlighter
                                    language="json"
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, borderRadius: 0 }}
                                >
                                    {output}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

