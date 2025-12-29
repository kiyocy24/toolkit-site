"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check } from "lucide-react"

export default function GcdLcmCalculatorPage() {
    const [input, setInput] = useState("")
    const [gcdResult, setGcdResult] = useState<string | null>(null)
    const [lcmResult, setLcmResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [gcdCopied, setGcdCopied] = useState(false)
    const [lcmCopied, setLcmCopied] = useState(false)

    const calculateGCD = (a: bigint, b: bigint): bigint => {
        if (b === 0n) return a
        return calculateGCD(b, a % b)
    }

    const calculateLCM = (a: bigint, b: bigint): bigint => {
        if (a === 0n || b === 0n) return 0n
        const gcd = calculateGCD(a, b)
        return (a * b) / gcd
    }

    const calculate = () => {
        setError(null)
        setGcdResult(null)
        setLcmResult(null)

        if (!input.trim()) {
            return
        }

        try {
            // Split by comma or space
            const rawNumbers = input.split(/[\s,]+/).filter(s => s.trim() !== "")

            if (rawNumbers.length < 2) {
                setError("Please enter at least two numbers.")
                return
            }

            const numbers: bigint[] = []

            for (const raw of rawNumbers) {
                if (!/^-?\d+$/.test(raw)) {
                    setError(`Invalid input: "${raw}" is not a valid integer.`)
                    return
                }
                const n = BigInt(raw)
                if (n < 0n) {
                    setError("Please enter positive integers.")
                    return
                }
                numbers.push(n)
            }

            let currentGCD = numbers[0]
            let currentLCM = numbers[0]

            for (let i = 1; i < numbers.length; i++) {
                currentGCD = calculateGCD(currentGCD, numbers[i])
                currentLCM = calculateLCM(currentLCM, numbers[i])
            }

            setGcdResult(currentGCD.toString())
            setLcmResult(currentLCM.toString())

        } catch (e) {
            setError("An unexpected error occurred during calculation.")
        }
    }

    const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>GCD/LCM Calculator</CardTitle>
                    <CardDescription>
                        Enter two or more non-negative integers to calculate their Greatest Common Divisor (GCD) and Least Common Multiple (LCM).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="numbers">Numbers</Label>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                inputMode="numeric"
                                id="numbers"
                                placeholder="e.g. 12, 18 or 8 12 16"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        calculate()
                                    }
                                }}
                            />
                            <Button onClick={calculate}>Calculate</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Separate numbers with commas or spaces.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {(gcdResult || lcmResult) && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {gcdResult && (
                                <div className="p-4 rounded-md bg-muted relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-medium text-muted-foreground">GCD (Greatest Common Divisor)</p>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(gcdResult, setGcdCopied)} aria-label={gcdCopied ? "GCD copied" : "Copy GCD"}>
                                            {gcdCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight break-all">{gcdResult}</p>
                                </div>
                            )}

                            {lcmResult && (
                                <div className="p-4 rounded-md bg-muted relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-medium text-muted-foreground">LCM (Least Common Multiple)</p>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(lcmResult, setLcmCopied)} aria-label={lcmCopied ? "LCM copied" : "Copy LCM"}>
                                            {lcmCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight break-all">{lcmResult}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
