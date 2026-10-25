"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Trash2, ArrowRightLeft } from "lucide-react"

export default function UrlEncoderDecoderPage() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [error, setError] = useState<string | null>(null)

    const encodeUrl = () => {
        try {
            if (!input) {
                setOutput("")
                setError(null)
                return
            }
            const encoded = encodeURIComponent(input)
            setOutput(encoded)
            setError(null)
        } catch (e) {
            setError("Error encoding URL")
            setOutput("")
        }
    }

    const decodeUrl = () => {
        try {
            if (!input) {
                setOutput("")
                setError(null)
                return
            }
            // decodeURIComponent fails if the sequence is malformed
            const decoded = decodeURIComponent(input)
            setOutput(decoded)
            setError(null)
        } catch (e) {
            setError("Error decoding URL: Invalid URI component")
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
                    <CardTitle>URL Encoder / Decoder</CardTitle>
                    <CardDescription>
                        Encode text to URL-safe format or decode URL-encoded strings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Input Text
                            </label>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Enter text to encode or decode..."
                            className="min-h-[150px] font-mono text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button onClick={encodeUrl}>
                            Encode
                        </Button>
                        <Button variant="secondary" onClick={decodeUrl}>
                            Decode
                        </Button>
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
                                    Result
                                </label>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 px-2 lg:px-3">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                            <Textarea
                                readOnly
                                className="min-h-[150px] font-mono text-sm bg-muted"
                                value={output}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
