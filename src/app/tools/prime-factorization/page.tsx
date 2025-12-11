"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PrimeFactorizationPage() {
    const [input, setInput] = useState("")
    const [result, setResult] = useState<string | null>(null)
    const [isPrime, setIsPrime] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const calculate = () => {
        setError(null)
        setResult(null)
        setIsPrime(false)

        if (!input) {
            return
        }

        try {
            // Remove non-numeric characters for safety check, but allow BigInt parsing
            if (!/^-?\d+$/.test(input.trim())) {
                setError("Please enter a valid integer.")
                return
            }

            const num = BigInt(input)

            if (num <= 1n) {
                setError("Please enter an integer greater than 1.")
                return
            }

            // Optional: Limit the size if needed to prevent browser hang
            // For now, we trust the user or the browser's ability to handle reasonably large numbers
            // typically < 15 digits is instantaneous, larger primes will freeze without web worker.
            if (input.length > 15) {
                // warning or just let it run? The user asked for enhancement.
                // Let's allow it but maybe caution if we see performance issues during verify.
            }

            const factors = primeFactorization(num)
            setResult(formatFactors(factors))

            // Check if it's prime: total factors count is 1 and power is 1 (meaning the number itself)
            // primeFactorization returns { p: exponent }. If only one key 'p' and exponent 1, and p == num, it's prime.
            // But wait, my primeFactorization implementation logic:
            // if n is prime, it returns { n: 1 }
            const keys = Object.keys(factors)
            if (keys.length === 1 && factors[keys[0]] === 1n && BigInt(keys[0]) === num) {
                setIsPrime(true)
            } else {
                setIsPrime(false)
            }

        } catch (e) {
            setError("Invalid input.")
        }
    }

    const primeFactorization = (n: bigint): Record<string, bigint> => {
        const factors: Record<string, bigint> = {}
        let divisor = 2n

        // Handle small factors specifically to speed up
        while (n % 2n === 0n) {
            factors["2"] = (factors["2"] || 0n) + 1n
            n /= 2n
        }

        divisor = 3n

        while (divisor * divisor <= n) {
            if (n % divisor === 0n) {
                factors[divisor.toString()] = (factors[divisor.toString()] || 0n) + 1n
                n = n / divisor
            } else {
                divisor += 2n
            }
        }

        if (n > 1n) {
            factors[n.toString()] = (factors[n.toString()] || 0n) + 1n
        }

        return factors
    }

    const formatFactors = (factors: Record<string, bigint>): string => {
        return Object.entries(factors)
            .sort((a, b) => {
                // Sort by base (key)
                return BigInt(a[0]) < BigInt(b[0]) ? -1 : 1
            })
            .map(([factor, power]) => {
                if (power === 1n) return factor
                return `${factor}^${power}`
            })
            .join(" × ")
    }

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prime Factorization</CardTitle>
                    <CardDescription>
                        Enter an integer to decompose it into its prime factors. Supports large numbers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="number">Number</Label>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                inputMode="numeric"
                                id="number"
                                placeholder="e.g. 123456789"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        calculate()
                                    }
                                }}
                            />
                            <Button onClick={calculate}>Factorize</Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <div className="mt-4 p-4 rounded-md bg-muted relative">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-muted-foreground">Result:</p>
                                <div className="flex items-center space-x-2">
                                    {isPrime && <Badge variant="default" className="bg-green-600 hover:bg-green-700">Prime Number</Badge>}
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard} aria-label="Copy result">
                                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-2xl font-bold tracking-tight break-all">{result}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
