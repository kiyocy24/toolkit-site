"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check, Shield } from "lucide-react"
import { signJwt, type JwtSignErrorCode } from "@/lib/jwt-crypto"

type JwtErrorKey =
    | "errors.invalidStructure"
    | "errors.illegalBase64Url"
    | "errors.decodeFailed"
    | "errors.unsupportedAlg"
    | "errors.secretRequired"

// 翻訳キーで表すエラーと、ネイティブのエラーメッセージ（JSON.parse など）をそのまま表示するエラー
type JwtError = { key: JwtErrorKey } | { message: string }

const SIGN_ERROR_KEYS: Record<JwtSignErrorCode, JwtErrorKey> = {
    UNSUPPORTED_ALG: "errors.unsupportedAlg",
    SECRET_REQUIRED: "errors.secretRequired",
}

class JwtDecodeError extends Error {
    readonly key: JwtErrorKey

    constructor(key: JwtErrorKey) {
        super(key)
        this.key = key
    }
}

function useJwtErrorText() {
    const t = useTranslations("Tools.jwt-debugger")
    return (error: JwtError) => ("key" in error ? t(error.key) : error.message)
}

export default function JwtDebuggerPage() {
    const t = useTranslations("Tools.jwt-debugger")
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="decoder" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="decoder">{t("tabs.decoder")}</TabsTrigger>
                            <TabsTrigger value="encoder">{t("tabs.encoder")}</TabsTrigger>
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
const formatTimestamp = (ts: number, locale: string) => {
    const date = new Date(ts * 1000)
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
    })
}

export function JwtDecoder() {
    const t = useTranslations("Tools.jwt-debugger")
    const locale = useLocale()
    const errorText = useJwtErrorText()
    const [token, setToken] = useLocalStorage("jwt-decoder-token", "")
    const [header, setHeader] = useState("")
    const [payload, setPayload] = useState("")
    const [error, setError] = useState<JwtError | null>(null)

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
                throw new JwtDecodeError("errors.illegalBase64Url")
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

    useEffect(() => {
        setError(null)
        if (!token.trim()) {
            setHeader("")
            setPayload("")
            return
        }

        try {
            const parts = token.split(".")
            if (parts.length !== 3) {
                throw new JwtDecodeError("errors.invalidStructure")
            }

            const headerStr = decodeBase64Url(parts[0])
            const payloadStr = decodeBase64Url(parts[1])

            const headerJson = JSON.parse(headerStr)
            const payloadJson = JSON.parse(payloadStr)

            setHeader(JSON.stringify(headerJson, null, 2))
            
            let payloadFormatted = JSON.stringify(payloadJson, null, 2)
            payloadFormatted = payloadFormatted.replace(
                /"(exp|iat|nbf|auth_time|updated_at)":\s*(\d+)(,?)/g,
                (match, key, val, comma) => {
                    const dateStr = formatTimestamp(parseInt(val, 10), locale)
                    return `"${key}": ${val}${comma} // ${dateStr}`
                }
            )
            setPayload(payloadFormatted)
        } catch (err) {
            if (err instanceof JwtDecodeError) {
                setError({ key: err.key })
            } else if (err instanceof Error) {
                setError({ message: err.message })
            } else {
                setError({ key: "errors.decodeFailed" })
            }
            setHeader("")
            setPayload("")
        }
    }, [token, locale])

    const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setToken(e.target.value)
    }

    return (
        <div className="grid gap-6 mt-6">
            <div className="grid w-full gap-1.5">
                <Label htmlFor="jwt-input">{t("decoder.tokenLabel")}</Label>
                <Textarea
                    id="jwt-input"
                    placeholder={t("decoder.tokenPlaceholder")}
                    className="min-h-[100px] font-mono text-xs"
                    value={token}
                    onChange={handleTokenChange}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("error")}</AlertTitle>
                    <AlertDescription>{errorText(error)}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="header-output">{t("decoder.header")}</Label>
                    <Textarea
                        id="header-output"
                        readOnly
                        className="min-h-[200px] font-mono text-xs bg-muted"
                        value={header}
                        placeholder={t("decoder.headerPlaceholder")}
                    />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="payload-output">{t("decoder.payload")}</Label>
                    <Textarea
                        id="payload-output"
                        readOnly
                        className="min-h-[200px] font-mono text-xs bg-muted"
                        value={payload}
                        placeholder={t("decoder.payloadPlaceholder")}
                    />
                </div>
            </div>
        </div>
    )
}


export function JwtEncoder() {
    const t = useTranslations("Tools.jwt-debugger")
    const errorText = useJwtErrorText()
    const [header, setHeader] = useLocalStorage("jwt-encoder-header", `{
  "alg": "HS256",
  "typ": "JWT"
}`)
    const [payload, setPayload] = useLocalStorage("jwt-encoder-payload", `{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`)
    const [secret, setSecret] = useLocalStorage("jwt-encoder-secret", "your-256-bit-secret")
    const [encodedToken, setEncodedToken] = useState("")
    const [error, setError] = useState<JwtError | null>(null)
    const [copied, setCopied] = useState(false)

    const signToken = useCallback(async () => {
        try {
            const headerObj = JSON.parse(header)
            const payloadObj = JSON.parse(payload)

            setError(null)
            const token = await signJwt(headerObj, payloadObj, secret)
            setEncodedToken(token)
        } catch (e) {
            const code = (e as { code?: JwtSignErrorCode }).code
            setError(code && code in SIGN_ERROR_KEYS ? { key: SIGN_ERROR_KEYS[code] } : { message: (e as Error).message })
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
                <AlertTitle>{t("encoder.securityTitle")}</AlertTitle>
                <AlertDescription>
                    {t("encoder.securityDescription")}
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="header-input">{t("encoder.headerLabel")}</Label>
                    <Textarea
                        id="header-input"
                        className="min-h-[150px] font-mono text-xs"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                    />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="payload-input">{t("encoder.payloadLabel")}</Label>
                    <Textarea
                        id="payload-input"
                        className="min-h-[150px] font-mono text-xs"
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid w-full gap-1.5">
                <Label htmlFor="secret-input">{t("encoder.secretLabel")}</Label>
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
                    <AlertTitle>{t("error")}</AlertTitle>
                    <AlertDescription>{errorText(error)}</AlertDescription>
                </Alert>
            )}

            <div className="grid w-full gap-1.5">
                <Label htmlFor="encoded-output">{t("encoder.encodedToken")}</Label>
                <div className="relative">
                    <Textarea
                        id="encoded-output"
                        readOnly
                        className="min-h-[100px] font-mono text-xs bg-muted pr-10 break-words"
                        value={encodedToken}
                        placeholder={t("encoder.encodedPlaceholder")}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={copyToClipboard}
                        disabled={!encodedToken}
                        aria-label={t("encoder.copyEncodedToken")}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
