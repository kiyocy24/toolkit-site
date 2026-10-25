"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { format } from "sql-formatter"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SqlFormatterPage() {
    const t = useTranslations("Tools.sql-formatter")
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [dialect, setDialect] = useState("sql")
    const [error, setError] = useState<string | null>(null)

    const handleFormat = () => {
        try {
            if (!input.trim()) {
                setOutput("")
                setError(null)
                return
            }
            const formatted = format(input, { language: dialect as any, keywordCase: 'upper' })
            setOutput(formatted)
            setError(null)
        } catch (e) {
            setError(t("errors.formatFailed"))
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
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label htmlFor="sql-input" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t("inputSql")}
                                </label>
                                <Select value={dialect} onValueChange={setDialect}>
                                    <SelectTrigger className="w-[180px] h-8">
                                        <SelectValue placeholder={t("dialect")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sql">{t("standardSql")}</SelectItem>
                                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                        <SelectItem value="mysql">MySQL</SelectItem>
                                        <SelectItem value="bigquery">BigQuery</SelectItem>
                                        <SelectItem value="transactsql">Transact-SQL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("clear")}
                            </Button>
                        </div>
                        <Textarea
                            id="sql-input"
                            placeholder="SELECT * FROM table..."
                            className="min-h-[200px] font-mono text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button onClick={handleFormat}>{t("formatSql")}</Button>
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
                                    {t("output")}
                                </label>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 px-2 lg:px-3">
                                    <Copy className="mr-2 h-4 w-4" />
                                    {t("copy")}
                                </Button>
                            </div>
                            <div className="overflow-hidden rounded-md border text-sm">
                                <SyntaxHighlighter
                                    language="sql"
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
