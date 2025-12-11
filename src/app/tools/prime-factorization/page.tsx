"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function PrimeFactorizationPage() {
    const [input, setInput] = useState("")
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const calculate = () => {
        setError(null)
        setResult(null)

        if (!input) {
            return
        }

        const num = Number(input)

        if (isNaN(num) || !Number.isInteger(num)) {
            setError("Please enter a valid integer.")
            return
        }

        if (num <= 1) {
            setError("Please enter an integer greater than 1.")
            return
        }

        if (num > Number.MAX_SAFE_INTEGER) {
            setError("Number is too large for safe calculation in the browser.")
            return
        }

        const factors = primeFactorization(num)
        setResult(formatFactors(factors))
    }

    const primeFactorization = (n: number): Record<number, number> => {
        const factors: Record<number, number> = {}
        let divisor = 2

        while (n >= 2) {
            if (n % divisor === 0) {
                factors[divisor] = (factors[divisor] || 0) + 1
                n = n / divisor
            } else {
                divisor++
                // Optimization: if divisor^2 > n, then n is prime
                if (divisor * divisor > n && n > 1) {
                    factors[n] = (factors[n] || 0) + 1
                    break
                }
            }
        }
        return factors
    }

    const formatFactors = (factors: Record<number, number>): string => {
        return Object.entries(factors)
            .map(([factor, power]) => {
                if (power === 1) return factor
                return `${factor}^${power}`
            })
            .join(" × ")
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prime Factorization</CardTitle>
                    <CardDescription>
                        Enter an integer to decompose it into its prime factors.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="number">Number</Label>
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                id="number"
                                placeholder="e.g. 12"
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
                        <div className="mt-4 p-4 rounded-md bg-muted">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Result:</p>
                            <p className="text-2xl font-bold tracking-tight">{result}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
