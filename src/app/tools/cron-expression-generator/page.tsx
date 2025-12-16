"use client"

import { useState, useEffect } from "react"
import cronstrue from "cronstrue"
import { Copy, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CronExpressionGeneratorPage() {
    // Generator State
    const [minute, setMinute] = useState("*")
    const [hour, setHour] = useState("*")
    const [dayOfMonth, setDayOfMonth] = useState("*")
    const [month, setMonth] = useState("*")
    const [dayOfWeek, setDayOfWeek] = useState("*")
    const [generatedCron, setGeneratedCron] = useState("* * * * *")

    // Explainer State
    const [cronInput, setCronInput] = useState("* * * * *")
    const [explanation, setExplanation] = useState("")
    const [error, setError] = useState("")

    // Update generated cron when inputs change
    useEffect(() => {
        setGeneratedCron(`${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`)
    }, [minute, hour, dayOfMonth, month, dayOfWeek])

    // Update explanation when cronInput changes
    useEffect(() => {
        try {
            const desc = cronstrue.toString(cronInput)
            setExplanation(desc)
            setError("")
        } catch (err) {
            setExplanation("")
            // Only show error if input is not empty
            if (cronInput.trim() !== "") {
                setError("Invalid cron expression")
            }
        }
    }, [cronInput])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="container mx-auto max-w-2xl py-6">
            <Tabs defaultValue="generate" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                    <TabsTrigger value="explain">Explain</TabsTrigger>
                </TabsList>

                <TabsContent value="generate">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cron Generator</CardTitle>
                            <CardDescription>
                                Build a cron expression by setting the fields below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="space-y-2">
                                    <Label>Minute</Label>
                                    <Input value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="*" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hour</Label>
                                    <Input value={hour} onChange={(e) => setHour(e.target.value)} placeholder="*" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Day (Month)</Label>
                                    <Input value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} placeholder="*" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Month</Label>
                                    <Input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="*" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Day (Week)</Label>
                                    <Input value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} placeholder="*" />
                                </div>
                            </div>

                            <div className="p-4 bg-muted rounded-md flex items-center justify-between">
                                <code className="text-lg font-mono">{generatedCron}</code>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedCron)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>Human readable: {tryExplain(generatedCron)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="explain">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cron Explainer</CardTitle>
                            <CardDescription>
                                Paste a cron expression to understand what it does.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cron Expression</Label>
                                <Input
                                    value={cronInput}
                                    onChange={(e) => setCronInput(e.target.value)}
                                    placeholder="e.g. */5 * * * *"
                                    className="font-mono"
                                />
                            </div>

                            {error ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="p-4 bg-muted rounded-md border text-center">
                                    <p className="text-lg font-medium">{explanation}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function tryExplain(cron: string): string {
    try {
        return cronstrue.toString(cron)
    } catch {
        return "Invalid expression"
    }
}
