"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function JwtDecoderPage() {
    const [token, setToken] = useState("")
    const [header, setHeader] = useState("")
    const [payload, setPayload] = useState("")
    const [error, setError] = useState<string | null>(null)

    const decodeBase64Url = (str: string) => {
        let output = str.replace(/-/g, "+").replace(/_/g, "/")
        switch (output.length % 4) {
            case 0:
                break
            case 2:
                output += "=="
                break
            case 3:
                output += "="
                break
            default:
                throw new Error("Illegal base64url string!")
        }

        try {
            return decodeURIComponent(
                atob(output)
                    .split("")
                    .map((c) => {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    })
                    .join("")
            )
        } catch {
            return atob(output)
        }
    }

    const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setToken(val)
        setError(null)

        if (!val.trim()) {
            setHeader("")
            setPayload("")
            return
        }

        try {
            const parts = val.split(".")
            if (parts.length !== 3) {
                throw new Error("Invalid JWT structure. Expected 3 parts separated by dots.")
            }

            const headerStr = decodeBase64Url(parts[0])
            const payloadStr = decodeBase64Url(parts[1])

            const headerJson = JSON.parse(headerStr)
            const payloadJson = JSON.parse(payloadStr)

            setHeader(JSON.stringify(headerJson, null, 2))
            setPayload(JSON.stringify(payloadJson, null, 2))
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Failed to decode JWT")
            setHeader("")
            setPayload("")
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>JWT Decoder</CardTitle>
                    <CardDescription>
                        Decode JSON Web Tokens (JWT) to view their Header and Payload.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="jwt-input">JWT Token</Label>
                        <Textarea
                            id="jwt-input"
                            placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                            className="min-h-[100px] font-mono text-xs"
                            value={token}
                            onChange={handleTokenChange}
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="header-output">Header</Label>
                            <Textarea
                                id="header-output"
                                readOnly
                                className="min-h-[200px] font-mono text-xs bg-muted"
                                value={header}
                                placeholder="Header JSON will appear here..."
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="payload-output">Payload</Label>
                            <Textarea
                                id="payload-output"
                                readOnly
                                className="min-h-[200px] font-mono text-xs bg-muted"
                                value={payload}
                                placeholder="Payload JSON will appear here..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
