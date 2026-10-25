"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type Step = {
    step: number
    value: bigint
    // null marks the initial value row (label is translated at render time)
    operation: string | null
}

const MAX_STEPS = 10000

export default function CollatzConjecturePage() {
    const t = useTranslations("Tools.collatz-conjecture")
    const [input, setInput] = useState("")
    const [sequence, setSequence] = useState<Step[]>([])
    const [maxVal, setMaxVal] = useState<bigint | null>(null)
    const [error, setError] = useState<string | null>(null)

    const calculate = () => {
        setError(null)
        setSequence([])
        setMaxVal(null)

        try {
            if (!/^\d+$/.test(input.trim())) {
                setError(t("errors.invalidInteger"))
                return
            }

            let num = BigInt(input)

            if (num <= 0n) {
                setError(t("errors.notPositive"))
                return
            }

            // Safety limit to prevent browser freeze on extremely long sequences (though Collatz is conjectured to end)
            // But typical numbers are fine. JS/Browser might hang if too many renders.
            // Let's implement the loop.

            const steps: Step[] = []
            let current = num
            let stepCount = 0
            let currentMax = num

            steps.push({
                step: stepCount,
                value: current,
                operation: null
            })



            while (current !== 1n && stepCount < MAX_STEPS) {
                stepCount++
                let operation = ""
                if (current % 2n === 0n) {
                    current = current / 2n
                    operation = "n / 2"
                } else {
                    current = 3n * current + 1n
                    operation = "3n + 1"
                }

                if (current > currentMax) {
                    currentMax = current
                }

                steps.push({
                    step: stepCount,
                    value: current,
                    operation: operation
                })
            }

            if (current !== 1n) {
                setError(t("errors.tooManySteps", { maxSteps: String(MAX_STEPS) }))
                return
            }

            setSequence(steps)
            setMaxVal(currentMax)

        } catch (e) {
            setError(t("errors.invalidInput"))
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="number">{t("startingNumber")}</Label>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                inputMode="numeric"
                                id="number"
                                placeholder={t("placeholder")}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        calculate()
                                    }
                                }}
                            />
                            <Button onClick={calculate}>{t("calculate")}</Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t("error")}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {sequence.length > 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">{t("steps")}</p>
                                    <p className="text-2xl font-bold">{sequence.length - 1}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">{t("maxValue")}</p>
                                    <p className="text-2xl font-bold">{maxVal?.toString()}</p>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">{t("step")}</TableHead>
                                            <TableHead>{t("value")}</TableHead>
                                            <TableHead className="text-right">{t("operation")}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sequence.map((step) => (
                                            <TableRow key={step.step}>
                                                <TableCell className="font-medium">{step.step}</TableCell>
                                                <TableCell>{step.value.toString()}</TableCell>
                                                <TableCell className="text-right font-mono text-muted-foreground">{step.operation ?? t("initialValue")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
