"use client"

import { useState } from "react"
import { Binary, Copy, RotateCcw, AlertCircle, Settings2 } from "lucide-react"

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
    custom: string
}

const INITIAL_STATE: BaseState = {
    binary: "",
    octal: "",
    decimal: "",
    hex: "",
    custom: "",
}

type BaseType = keyof BaseState;

const STANDARD_BASES: { key: BaseType; name: string; base: number; placeholder: string }[] = [
    { key: "decimal", name: "Decimal (10)", base: 10, placeholder: "Enter decimal number..." },
    { key: "hex", name: "Hexadecimal (16)", base: 16, placeholder: "Enter hex number..." },
    { key: "binary", name: "Binary (2)", base: 2, placeholder: "Enter binary number..." },
    { key: "octal", name: "Octal (8)", base: 8, placeholder: "Enter octal number..." },
]

export default function NumberBaseConverterPage() {
    const [values, setValues] = useState<BaseState>(INITIAL_STATE)
    const [error, setError] = useState<string | null>(null)
    const [customBaseInput, setCustomBaseInput] = useState<string>("32")

    // Derived valid base
    const customBase = parseInt(customBaseInput)
    const isCustomBaseValid = !isNaN(customBase) && customBase >= 2 && customBase <= 36

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
            custom: isCustomBaseValid ? decimalValue.toString(customBase).toUpperCase() : "",
        })
    }

    const getBaseKey = (base: number): BaseType => {
        const found = STANDARD_BASES.find(b => b.base === base);
        if (found) return found.key;
        if (isCustomBaseValid && base === customBase) return 'custom';
        return 'decimal';
    }

    const handleChange = (value: string, base: number) => {
        // Allow empty
        if (value === "") {
            setValues(INITIAL_STATE)
            setError(null)
            return
        }

        // Regex for validation
        const patterns: Record<number, RegExp> = {
            2: /^\s*[0-1]*\s*$/,
            8: /^\s*[0-7]*\s*$/,
            10: /^\s*\d*\s*$/,
            16: /^\s*[0-9a-fA-F]*\s*$/
        }

        // Dynamic regex for other bases
        let regex = patterns[base]
        if (!regex) {
            if (base <= 10) {
                regex = new RegExp(`^\\s*[0-${base - 1}]*\\s*$`)
            } else {
                const maxChar = String.fromCharCode('A'.charCodeAt(0) + base - 11)
                const maxCharLower = String.fromCharCode('a'.charCodeAt(0) + base - 11)
                regex = new RegExp(`^\\s*[0-9a-${maxCharLower}A-${maxChar}]*\\s*$`)
            }
        }

        if (!regex.test(value)) {
            // Ignore invalid keystrokes
            return
        }

        updateValues(value, base)
    }

    const handleCustomBaseChange = (newBase: string) => {
        // Filter out non-numeric characters
        const filteredBase = newBase.replace(/\D/g, '')
        setCustomBaseInput(filteredBase)

        if (filteredBase === "") {
            setValues(prev => ({ ...prev, custom: "" }))
            return
        }

        const base = parseInt(filteredBase, 10)
        // If invalid base, we just update the input state but not the values calculation yet 
        // (unless we want to clear custom value)

        if (isNaN(base) || base < 2 || base > 36) {
            // Invalid base, clear custom value to avoid confusion
            setValues(prev => ({ ...prev, custom: "" }))
            return
        }

        // Check if we have a current value to convert
        if (values.decimal) {
            const decimalValue = parseInt(values.decimal, 10)
            if (!isNaN(decimalValue)) {
                setValues(prev => ({
                    ...prev,
                    custom: decimalValue.toString(base).toUpperCase()
                }))
            }
        }
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
                        Convert numbers between Binary (2), Octal (8), Decimal (10), Hexadecimal (16), and arbitrary bases (2-36).
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
                        {STANDARD_BASES.map((config) => (
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

                        {/* Custom Base Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="custom-base-input" className="flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" />
                                    Custom Base
                                </Label>
                                <Input
                                    id="custom-base-input"
                                    type="text"
                                    inputMode="numeric"
                                    className="w-20 h-8 text-right"
                                    value={customBaseInput}
                                    onChange={(e) => handleCustomBaseChange(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id="custom-value-input"
                                    value={values.custom}
                                    onChange={(e) => handleChange(e.target.value, customBase)}
                                    placeholder={isCustomBaseValid ? `Enter base ${customBase} number...` : "Enter number..."}
                                    disabled={!isCustomBaseValid}
                                    aria-label={`Enter base ${customBase} number`}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(values.custom)}
                                    disabled={!values.custom}
                                    title={isCustomBaseValid ? `Copy Base ${customBase}` : "Copy"}
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
