"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export default function CssUnitConverterPage() {
    const [rootSize, setRootSize] = useState<number>(16)
    const [px, setPx] = useState<string>("16")
    const [rem, setRem] = useState<string>("1")
    const [em, setEm] = useState<string>("1")

    const handleRootChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value)
        // Allow updating the value to state to handle typing "1..."
        // If it's NaN (empty string), we might want to handle it or default to something, 
        // but for now let's just update if valid or empty string (but type is number input)

        setRootSize(isNaN(val) ? 0 : val)

        if (!isNaN(val) && val > 0) {
            const currentPx = parseFloat(px)
            if (!isNaN(currentPx)) {
                setRem((currentPx / val).toString())
                setEm((currentPx / val).toString())
            }
        } else {
            // Clear outputs if root size is invalid
            setRem("")
            setEm("")
        }
    }

    // We need a separate state for input values to allow typing decimals comfortably
    // But for simplicity in this MVP, we will drive everything from the changed input

    const updateFromPx = (val: string) => {
        setPx(val)
        const num = parseFloat(val)
        if (!isNaN(num) && rootSize > 0) {
            setRem((num / rootSize).toString())
            setEm((num / rootSize).toString())
        } else {
            setRem("")
            setEm("")
        }
    }

    const updateFromRem = (val: string) => {
        setRem(val)
        const num = parseFloat(val)
        if (!isNaN(num)) {
            setPx((num * rootSize).toString())
            setEm(val) // 1rem = 1em typically in this context context free
        } else {
            setPx("")
            setEm("")
        }
    }

    const updateFromEm = (val: string) => {
        setEm(val)
        const num = parseFloat(val)
        if (!isNaN(num)) {
            setPx((num * rootSize).toString())
            setRem(val)
        } else {
            setPx("")
            setRem("")
        }
    }


    const copyToClipboard = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn("Clipboard not supported")
            return
        }
        try {
            await navigator.clipboard.writeText(text)
        } catch (error) {
            console.error("Failed to copy", error)
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>CSS Unit Converter</CardTitle>
                    <CardDescription>
                        Convert between px, rem, and em units.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="root-size">Root Font Size (px)</Label>
                        <Input
                            type="number"
                            id="root-size"
                            min="1"
                            value={rootSize}
                            onChange={handleRootChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="px-input">Pixels (px)</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    id="px-input"
                                    value={px}
                                    onChange={(e) => updateFromPx(e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(px)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="rem-input">REM</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    id="rem-input"
                                    value={rem}
                                    onChange={(e) => updateFromRem(e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(rem)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="em-input">EM</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    id="em-input"
                                    value={em}
                                    onChange={(e) => updateFromEm(e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(em)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">*Assuming parent font-size is equal to root font-size (1em = 1rem)</p>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </div >
    )
}
