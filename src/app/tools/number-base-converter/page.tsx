"use client"

import { useState } from "react"
import { Binary, Copy, RotateCcw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

type BaseType = keyof BaseState;

const BASES: { key: BaseType; name: string; base: number; placeholder: string }[] = [
    { key: "decimal", name: "Decimal (10)", base: 10, placeholder: "Enter decimal number..." },
    { key: "hex", name: "Hexadecimal (16)", base: 16, placeholder: "Enter hex number..." },
    { key: "binary", name: "Binary (2)", base: 2, placeholder: "Enter binary number..." },
    { key: "octal", name: "Octal (8)", base: 8, placeholder: "Enter octal number..." },
]

export default function NumberBaseConverterPage() {
    const [values, setValues] = useState<BaseState>(INITIAL_STATE)
    const [error, setError] = useState<string | null>(null)

    const updateValues = (value: string, fromBase: number) => {
        setError(null)


        // Create clean value
        const cleanValue = value.trim()

        // Handle whitespace-only input which passes !value check but parseInt fails
        if (!cleanValue) {
            setValues(INITIAL_STATE)
            return
        }

        const decimalValue = parseInt(cleanValue, fromBase)

        if (isNaN(decimalValue)) {
            // Should not be reachable with regex validation, but safe guard
            setValues(prev => ({ ...prev, [getBaseKey(fromBase)]: value }))
            setError("Invalid number")
            return
        }

        setValues({
            binary: decimalValue.toString(2),
            octal: decimalValue.toString(8),
            decimal: decimalValue.toString(10),
            hex: decimalValue.toString(16).toUpperCase(),
        })
    }

    const getBaseKey = (base: number): BaseType => {
        const found = BASES.find(b => b.base === base);
        return found ? found.key : 'decimal';
    }

    const handleChange = (value: string, base: number) => {
        // Allow empty
        if (value === "") {
            setValues(INITIAL_STATE)
            setError(null)
            return
        }

        // Regex for validation
        // Regex for validation
        const patterns: Record<number, RegExp> = {
            2: /^\s*[0-1]*\s*$/,
            8: /^\s*[0-7]*\s*$/,
            10: /^\s*\d*\s*$/,
            16: /^\s*[0-9a-fA-F]*\s*$/
        }
        const regex = patterns[base] || /.*/

        if (!regex.test(value)) {
            // Ignore invalid keystrokes
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

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                        {BASES.map((config) => (
                            <div key={config.key} className="space-y-2">
                                <Label htmlFor={config.key}>{config.name}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id={config.key}
                                        value={values[config.key]}
                                        onChange={(e) => handleChange(e.target.value, config.base)}
                                        placeholder={config.placeholder}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(values[config.key])}
                                        disabled={!values[config.key]}
                                        title={`Copy ${config.name}`}
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
