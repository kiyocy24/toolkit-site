"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Trash2 } from "lucide-react"

export default function Base64ConverterPage() {
    const t = useTranslations("Tools.base64-converter")
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [mode, setMode] = useState<"encode" | "decode">("encode")
    const [error, setError] = useState<string | null>(null)

    const handleConvert = (currentInput: string, currentMode: "encode" | "decode") => {
        setError(null)
        if (!currentInput) {
            setOutput("")
            return
        }

        try {
            if (currentMode === "encode") {
                setOutput(btoa(currentInput))
            } else {
                setOutput(atob(currentInput))
            }
        } catch (e) {
            setError(currentMode === "encode" ? t("errors.invalidEncode") : t("errors.invalidDecode"))
            setOutput("")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value
        setInput(newVal)
        handleConvert(newVal, mode)
    }

    const handleModeChange = (newMode: string) => {
        const m = newMode as "encode" | "decode"
        setMode(m)
        setInput("")
        setOutput("")
        setError(null)
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
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <Tabs defaultValue="encode" onValueChange={handleModeChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="encode">{t("tabs.encode")}</TabsTrigger>
                            <TabsTrigger value="decode">{t("tabs.decode")}</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="input-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t("input")}
                            </label>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("clear")}
                            </Button>
                        </div>
                        <Textarea
                            id="input-text"
                            placeholder={mode === "encode" ? t("placeholders.encode") : t("placeholders.decode")}
                            className="min-h-[150px] font-mono text-sm"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="output-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t("output")}
                            </label>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 px-2 lg:px-3">
                                <Copy className="mr-2 h-4 w-4" />
                                {t("copy")}
                            </Button>
                        </div>
                        <Textarea
                            id="output-text"
                            readOnly
                            className="min-h-[150px] bg-muted font-mono text-sm"
                            value={output}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
