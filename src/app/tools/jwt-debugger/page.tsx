"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check, Shield } from "lucide-react"

export default function JwtDebuggerPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>JWT Debugger</CardTitle>
                    <CardDescription>
                        Decode and Encode JSON Web Tokens (JWT).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="decoder" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="decoder">Decoder</TabsTrigger>
                            <TabsTrigger value="encoder">Encoder</TabsTrigger>
                        </TabsList>
                        <TabsContent value="decoder">
                            <JwtDecoder />
                        </TabsContent>
                        <TabsContent value="encoder">
                            <JwtEncoder />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

function JwtDecoder() {
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
        <div className="grid gap-6 mt-6">
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
        </div>
    )
}

function JwtEncoder() {
    const [header, setHeader] = useState(`{
  "alg": "HS256",
  "typ": "JWT"
}`)
    const [payload, setPayload] = useState(`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`)
    const [secret, setSecret] = useState("your-256-bit-secret")
    const [encodedToken, setEncodedToken] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const base64UrlEncode = (str: string) => {
        return btoa(str)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
    }

    const utf8ToUint8Array = (str: string) => {
        return new TextEncoder().encode(str)
    }

    const signToken = useCallback(async () => {
        setError(null)
        try {
            // Validate JSON
            const headerObj = JSON.parse(header)
            const payloadObj = JSON.parse(payload)

            const encodedHeader = base64UrlEncode(JSON.stringify(headerObj))
            const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj))

            const unsignedToken = `${encodedHeader}.${encodedPayload}`

            if (headerObj.alg === "none") {
                setEncodedToken(`${unsignedToken}.`)
                return
            }

            if (headerObj.alg !== "HS256") {
                throw new Error("Only HS256 (and none) algorithm is currently supported in this client-side demo.")
            }

            if (!secret) {
                setEncodedToken("")
                setError("Please provide a secret for HS256 signing.")
                return
            }

            const keyData = utf8ToUint8Array(secret)
            const key = await window.crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            )

            const signature = await window.crypto.subtle.sign(
                "HMAC",
                key,
                utf8ToUint8Array(unsignedToken)
            )

            // Convert array buffer to base64url
            const signatureArray = Array.from(new Uint8Array(signature))
            const signatureBase64 = btoa(String.fromCharCode.apply(null, signatureArray))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "")

            setEncodedToken(`${unsignedToken}.${signatureBase64}`)

        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Failed to encode token")
            setEncodedToken("")
        }
    }, [header, payload, secret])

    // Auto-update when inputs change
    useEffect(() => {
        const timer = setTimeout(() => {
            signToken()
        }, 500)
        return () => clearTimeout(timer)
    }, [signToken])

    const copyToClipboard = async () => {
        if (!encodedToken || !navigator.clipboard) return
        try {
            await navigator.clipboard.writeText(encodedToken)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    return (
        <div className="grid gap-6 mt-6">
            <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Note</AlertTitle>
                <AlertDescription>
                    Signing is performed entirely in your browser using the Web Crypto API.
                    Your secret key is never sent to any server.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="header-input">Header (JSON)</Label>
                    <Textarea
                        id="header-input"
                        className="min-h-[150px] font-mono text-xs"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                    />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="payload-input">Payload (JSON)</Label>
                    <Textarea
                        id="payload-input"
                        className="min-h-[150px] font-mono text-xs"
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid w-full gap-1.5">
                <Label htmlFor="secret-input">Secret (for HS256)</Label>
                <Input
                    id="secret-input"
                    type="text"
                    placeholder="your-256-bit-secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid w-full gap-1.5">
                <Label htmlFor="encoded-output">Encoded Token</Label>
                <div className="relative">
                    <Textarea
                        id="encoded-output"
                        readOnly
                        className="min-h-[100px] font-mono text-xs bg-muted pr-10 break-words"
                        value={encodedToken}
                        placeholder="JWT will appear here..."
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={copyToClipboard}
                        disabled={!encodedToken}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
