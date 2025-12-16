"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RefreshCw } from "lucide-react"
import { generateLoremIpsum, LoremIpsumType, LoremIpsumUnit } from "@/lib/lorem-ipsum"

export default function LoremIpsumGeneratorPage() {
    const [count, setCount] = useState(3)
    const [unit, setUnit] = useState<LoremIpsumUnit>("paragraphs")
    const [type, setType] = useState<LoremIpsumType>("english")
    const [generatedText, setGeneratedText] = useState("")

    useEffect(() => {
        setGeneratedText(generateLoremIpsum(count, type, unit))
    }, [])

    const handleGenerate = () => {
        const text = generateLoremIpsum(count, type, unit)
        setGeneratedText(text)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedText)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Lorem Ipsum Generator</CardTitle>
                    <CardDescription>
                        Generate dummy text for your layouts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="count">Count</Label>
                            <Input
                                id="count"
                                type="number"
                                min={1}
                                max={100}
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select value={unit} onValueChange={(v) => setUnit(v as LoremIpsumUnit)}>
                                <SelectTrigger id="unit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                                    <SelectItem value="sentences">Sentences</SelectItem>
                                    <SelectItem value="words">Words</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={(v) => setType(v as LoremIpsumType)}>
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English (Lorem Ipsum)</SelectItem>
                                    <SelectItem value="japanese">Japanese</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleGenerate} className="w-full md:w-auto">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate
                    </Button>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="output">Generated Text</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                disabled={!generatedText}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <Textarea
                            id="output"
                            readOnly
                            value={generatedText}
                            className="min-h-[200px]"
                            placeholder="Generated text will appear here..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
