"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Copy, Hash } from "lucide-react"
import { useTranslations } from "next-intl"
import { computeHash } from "@/lib/hash-utils"

export default function HashGeneratorPage() {
    const t = useTranslations("Tools.hash-generator")
    const [input, setInput] = useState("")
    const [hashes, setHashes] = useState({
        MD5: "",
        "SHA-1": "",
        "SHA-256": "",
        "SHA-512": "",
    })
    const [upperCase, setUpperCase] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            const generateHashes = async () => {
                if (!input) {
                    setHashes({
                        MD5: "",
                        "SHA-1": "",
                        "SHA-256": "",
                        "SHA-512": "",
                    })
                    return
                }

                try {
                    const md5 = await computeHash(input, "MD5")
                    const sha1 = await computeHash(input, "SHA-1")
                    const sha256 = await computeHash(input, "SHA-256")
                    const sha512 = await computeHash(input, "SHA-512")

                    setHashes({
                        MD5: md5,
                        "SHA-1": sha1,
                        "SHA-256": sha256,
                        "SHA-512": sha512,
                    })
                } catch (error) {
                    console.error("Failed to generate hashes:", error)
                }
            }
            generateHashes()
        }, 300)

        return () => clearTimeout(timer)
    }, [input])

    const formatHash = (hash: string) => {
        return upperCase ? hash.toUpperCase() : hash
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("Failed to copy to clipboard:", err)
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-6 w-6" />
                                {t("title")}
                            </CardTitle>
                            <CardDescription>
                                {t("cardDescription")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="input">{t("inputText")}</Label>
                        <Textarea
                            id="input"
                            placeholder={t("inputPlaceholder")}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[100px] font-mono"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="uppercase"
                            checked={upperCase}
                            onCheckedChange={setUpperCase}
                        />
                        <Label htmlFor="uppercase">{t("uppercaseOutput")}</Label>
                    </div>

                    <div className="grid gap-4">
                        {Object.entries(hashes).map(([algo, hash]) => (
                            <div key={algo} className="grid gap-2">
                                <Label>{algo}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={formatHash(hash)}
                                        className="font-mono text-sm"
                                        placeholder={t("outputPlaceholder", { algo })}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(formatHash(hash))}
                                        title={t("copy")}
                                        disabled={!hash}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
