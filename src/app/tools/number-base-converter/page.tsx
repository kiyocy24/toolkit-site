"use client"

import { useState } from "react"
import { Binary, Copy, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BaseState {
    binary: string
    octal: string
    decimal: string
    hex: string
}

const INITIAL_STATE: BaseState = {
    binary: "",
    octal: "",
    decimal: "",
    hex: "",
}

export default function NumberBaseConverterPage() {
    const [values, setValues] = useState<BaseState>(INITIAL_STATE)
    const [error, setError] = useState<string | null>(null)

    const updateValues = (value: string, fromBase: number) => {
        setError(null)
        if (!value) {
            setValues(INITIAL_STATE)
            return
        }

        try {
            // Remove spaces for processing, but keep them for display if needed? 
            // For now, let's just parse the raw string.
            // Actually, parseInt allows spaces, but it's safer to trim.
            const cleanValue = value.trim()

            // Validate based on base
            let isValid = false
            if (fromBase === 2) isValid = /^[0-1]+$/.test(cleanValue)
            else if (fromBase === 8) isValid = /^[0-7]+$/.test(cleanValue)
            else if (fromBase === 10) isValid = /^\d+$/.test(cleanValue)
            else if (fromBase === 16) isValid = /^[0-9A-Fa-f]+$/.test(cleanValue)

            if (!isValid) {
                // If invalid char is typed, we can just ignore it or show error.
                // Better UX: update only the field being typed to show the invalid char, but don't update others?
                // Or just don't update if invalid. 
                // Let's try to parse integer.
                // If the user types "2" in binary, we can't parse it as binary.
                // So let's update the specific field state but show error.

                // Simplest approach: Update the specific field, try to convert. If fail, clear others or keep previous.
                // Let's stick to the plan: "Validate input (e.g., allow only 0-1 for binary)."
                // If invalid, we will update the state of that field but NOT others, and maybe show error.

                // Let's implement strict validation where we don't convert if invalid
                setValues(prev => ({ ...prev, [getBaseKey(fromBase)]: value }))
                return
            }

            const decimalValue = parseInt(cleanValue, fromBase)

            if (isNaN(decimalValue)) {
                setValues(prev => ({ ...prev, [getBaseKey(fromBase)]: value }))
                return
            }

            setValues({
                binary: decimalValue.toString(2),
                octal: decimalValue.toString(8),
                decimal: decimalValue.toString(10),
                hex: decimalValue.toString(16).toUpperCase(),
            })

        } catch (e) {
            console.error(e)
            setError("Invalid input")
        }
    }

    const getBaseKey = (base: number): keyof BaseState => {
        switch (base) {
            case 2: return 'binary'
            case 8: return 'octal'
            case 10: return 'decimal'
            case 16: return 'hex'
            default: return 'decimal'
        }
    }

    const handleChange = (value: string, base: number) => {
        // Allow empty
        if (value === "") {
            setValues(INITIAL_STATE)
            return
        }

        // Check valid chars for the base before updating anything to suppress invalid input
        let regex: RegExp
        switch (base) {
            case 2: regex = /^[0-1]*$/; break;
            case 8: regex = /^[0-7]*$/; break;
            case 10: regex = /^\d*$/; break;
            case 16: regex = /^[0-9a-fA-F]*$/; break;
            default: regex = /.*/;
        }

        if (!regex.test(value)) {
            // Ignore invalid input (prevent typing)
            return
        }

        updateValues(value, base)
    }

    const copyToClipboard = async (text: string) => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const reset = () => {
        setValues(INITIAL_STATE)
        setError(null)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Binary className="h-6 w-6" />
                        Number Base Converter
                    </CardTitle>
                    <CardDescription>
                        Convert numbers between Binary (2), Octal (8), Decimal (10), and Hexadecimal (16).
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={reset}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Decimal */}
                        <div className="space-y-2">
                            <Label htmlFor="decimal">Decimal (10)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="decimal"
                                    value={values.decimal}
                                    onChange={(e) => handleChange(e.target.value, 10)}
                                    placeholder="Enter decimal number..."
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(values.decimal)}
                                    disabled={!values.decimal}
                                    title="Copy Decimal"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Hexadecimal */}
                        <div className="space-y-2">
                            <Label htmlFor="hex">Hexadecimal (16)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="hex"
                                    value={values.hex}
                                    onChange={(e) => handleChange(e.target.value, 16)}
                                    placeholder="Enter hex number..."
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(values.hex)}
                                    disabled={!values.hex}
                                    title="Copy Hex"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Binary */}
                        <div className="space-y-2">
                            <Label htmlFor="binary">Binary (2)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="binary"
                                    value={values.binary}
                                    onChange={(e) => handleChange(e.target.value, 2)}
                                    placeholder="Enter binary number..."
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(values.binary)}
                                    disabled={!values.binary}
                                    title="Copy Binary"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Octal */}
                        <div className="space-y-2">
                            <Label htmlFor="octal">Octal (8)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="octal"
                                    value={values.octal}
                                    onChange={(e) => handleChange(e.target.value, 8)}
                                    placeholder="Enter octal number..."
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(values.octal)}
                                    disabled={!values.octal}
                                    title="Copy Octal"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
