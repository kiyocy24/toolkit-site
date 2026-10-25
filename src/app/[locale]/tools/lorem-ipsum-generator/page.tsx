"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RefreshCw } from "lucide-react"
import { generateLoremIpsum, LoremIpsumLanguage, LoremIpsumUnit } from "@/lib/lorem-ipsum"

export default function LoremIpsumGeneratorPage() {
    const t = useTranslations("Tools.lorem-ipsum-generator")
    const [count, setCount] = useState(3)
    const [unit, setUnit] = useState<LoremIpsumUnit>("paragraphs")
    const [language, setLanguage] = useState<LoremIpsumLanguage>("english")
    const [generatedText, setGeneratedText] = useState("")

    useEffect(() => {
        setGeneratedText(generateLoremIpsum(count, language, unit))
    }, [])

    const handleGenerate = () => {
        const text = generateLoremIpsum(count, language, unit)
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
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="count">{t("count")}</Label>
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
                            <Label htmlFor="unit">{t("unit")}</Label>
                            <Select value={unit} onValueChange={(v) => setUnit(v as LoremIpsumUnit)}>
                                <SelectTrigger id="unit">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paragraphs">{t("units.paragraphs")}</SelectItem>
                                    <SelectItem value="sentences">{t("units.sentences")}</SelectItem>
                                    <SelectItem value="words">{t("units.words")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="language">{t("language")}</Label>
                            <Select value={language} onValueChange={(v) => setLanguage(v as LoremIpsumLanguage)}>
                                <SelectTrigger id="language">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">{t("languages.english")}</SelectItem>
                                    <SelectItem value="japanese">{t("languages.japanese")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleGenerate} className="w-full md:w-auto">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t("generate")}
                    </Button>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="output">{t("generatedText")}</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                disabled={!generatedText}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                {t("copy")}
                            </Button>
                        </div>
                        <Textarea
                            id="output"
                            readOnly
                            value={generatedText}
                            className="min-h-[200px]"
                            placeholder={t("outputPlaceholder")}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
