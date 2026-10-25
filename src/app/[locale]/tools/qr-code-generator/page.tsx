"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Trash2 } from "lucide-react"

export default function QrCodeGeneratorPage() {
    const t = useTranslations("Tools.qr-code-generator")
    const [text, setText] = useState("")
    const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
    const [size, setSize] = useState([200])
    const svgRef = useRef<SVGSVGElement>(null)

    const downloadPng = () => {
        if (!svgRef.current) return

        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            canvas.width = size[0]
            canvas.height = size[0]
            if (!ctx) {
                console.error("Failed to get 2D context for canvas")
                URL.revokeObjectURL(url)
                return
            }
            ctx.drawImage(img, 0, 0)
            // Use toBlob for better memory handling, with fallback for older browsers
            if (canvas.toBlob) {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error("Failed to create blob from canvas")
                        URL.revokeObjectURL(url)
                        return
                    }
                    const downloadUrl = URL.createObjectURL(blob)
                    const downloadLink = document.createElement("a")
                    downloadLink.href = downloadUrl
                    downloadLink.download = "qrcode.png"
                    document.body.appendChild(downloadLink)
                    downloadLink.click()
                    document.body.removeChild(downloadLink)
                    URL.revokeObjectURL(downloadUrl)
                    URL.revokeObjectURL(url)
                }, "image/png")
            } else {
                // Fallback to toDataURL for older browsers
                const dataUrl = canvas.toDataURL("image/png")
                const downloadLink = document.createElement("a")
                downloadLink.href = dataUrl
                downloadLink.download = "qrcode.png"
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
                URL.revokeObjectURL(url) // Still revoke the original SVG URL
            }
        }
        img.onerror = (e) => {
            console.error("Image failed to load for QR code download", e)
            URL.revokeObjectURL(url)
        }
        img.src = url
    }

    const clearContent = () => {
        setText("")
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
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="content">{t("content")}</Label>
                            <Input
                                id="content"
                                placeholder={t("contentPlaceholder")}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="error-level">{t("errorLevel")}</Label>
                            <Select
                                value={errorLevel}
                                onValueChange={(v) => {
                                    if (["L", "M", "Q", "H"].includes(v)) {
                                        setErrorLevel(v as "L" | "M" | "Q" | "H")
                                    }
                                }}
                            >
                                <SelectTrigger id="error-level">
                                    <SelectValue placeholder={t("selectLevel")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">{t("levels.low", { percent: 7 })}</SelectItem>
                                    <SelectItem value="M">{t("levels.medium", { percent: 15 })}</SelectItem>
                                    <SelectItem value="Q">{t("levels.quartile", { percent: 25 })}</SelectItem>
                                    <SelectItem value="H">{t("levels.high", { percent: 30 })}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label htmlFor="size">{t("size", { size: size[0] })}</Label>
                            </div>
                            <Slider
                                id="size"
                                min={128}
                                max={512}
                                step={8}
                                value={size}
                                onValueChange={setSize}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={clearContent}
                                disabled={!text}
                                className="w-full"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("clear")}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-muted/50 p-8">
                        <div className="rounded-lg bg-white p-4 shadow-sm max-w-full">
                            {text ? (
                                <QRCodeSVG
                                    ref={svgRef}
                                    value={text}
                                    size={size[0]}
                                    level={errorLevel}
                                    includeMargin={true}
                                    className="max-w-full h-auto"
                                />
                            ) : (
                                <div
                                    className="flex items-center justify-center bg-gray-100 text-muted-foreground max-w-full h-auto aspect-square"
                                    style={{ width: size[0] }}
                                >
                                    {t("emptyState")}
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={downloadPng}
                            disabled={!text}
                            className="w-full max-w-xs"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {t("downloadPng")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
