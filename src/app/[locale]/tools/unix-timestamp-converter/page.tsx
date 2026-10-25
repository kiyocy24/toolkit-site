"use client"

import { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw } from "lucide-react"

const TIMEZONES = [
    { value: "UTC", labelKey: "timezones.utc" },
    { value: "Asia/Tokyo", labelKey: "timezones.tokyo" },
    { value: "America/New_York", labelKey: "timezones.newYork" },
    { value: "America/Los_Angeles", labelKey: "timezones.losAngeles" },
    { value: "Europe/London", labelKey: "timezones.london" },
    { value: "Europe/Paris", labelKey: "timezones.paris" },
    { value: "Asia/Shanghai", labelKey: "timezones.shanghai" },
    { value: "Australia/Sydney", labelKey: "timezones.sydney" },
] as const

const getRelativeTime = (timestamp: number, locale: string) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diff) < 60) return rtf.format(-diff, 'second');
    if (Math.abs(diff) < 3600) return rtf.format(-Math.floor(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour');
    if (Math.abs(diff) < 2592000) return rtf.format(-Math.floor(diff / 86400), 'day'); // 30 days
    if (Math.abs(diff) < 31536000) return rtf.format(-Math.floor(diff / 2592000), 'month');
    return rtf.format(-Math.floor(diff / 31536000), 'year');
}

export default function UnixTimestampConverterPage() {
    const t = useTranslations("Tools.unix-timestamp-converter")
    const locale = useLocale()
    const [currentTimestamp, setCurrentTimestamp] = useState<number>(Math.floor(Date.now() / 1000))
    const [isPaused, setIsPaused] = useState(false)

    const [inputValue, setInputValue] = useState("")
    const [inputType, setInputType] = useState<"seconds" | "date">("seconds")
    const [selectedTimezone, setSelectedTimezone] = useState("UTC")

    const [result, setResult] = useState<{
        timestamp: number;
        formattedDate: string;
        isoString: string;
        relativeTime: string;
        offset: string;
    } | null>(null)

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(() => {
            setCurrentTimestamp(Math.floor(Date.now() / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [isPaused])

    useEffect(() => {
        if (!result) return

        const intervalId = setInterval(() => {
            setResult((prev) => prev && { ...prev, relativeTime: getRelativeTime(prev.timestamp, locale) })
        }, 60000) // Update every minute

        return () => clearInterval(intervalId)
    }, [result, locale])

    const handleConvert = () => {
        setError(null)
        setResult(null)

        if (!inputValue.trim()) return

        try {
            let date: Date

            if (inputType === "date") {
                date = new Date(inputValue)
                if (isNaN(date.getTime())) {
                    throw new Error("Invalid date format")
                }
            } else {
                const timestamp = parseInt(inputValue, 10)
                if (isNaN(timestamp)) {
                    throw new Error("Invalid timestamp")
                }
                date = new Date(timestamp * 1000)
            }

            const seconds = Math.floor(date.getTime() / 1000)

            // Format date with selected timezone and get offset
            // Intl.DateTimeFormat with timeZoneName: 'longOffset' or 'shortOffset' gives us offset
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: selectedTimezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "longOffset",
                hour12: false
            })

            const parts = formatter.formatToParts(date)
            const offsetPart = parts.find(p => p.type === "timeZoneName")
            const offset = offsetPart ? offsetPart.value.replace("GMT", "") : ""

            // Re-format for display without the offset in the string if we want it separate, 
            // but users often like "YYYY/MM/DD HH:mm:ss (+09:00)"
            const displayDate = formatter.format(date).replace("GMT", "") // Clean up slightly if needed

            setResult({
                timestamp: seconds,
                formattedDate: displayDate,
                isoString: date.toISOString(),
                relativeTime: getRelativeTime(seconds, locale),
                offset: offset
            })

        } catch (e) {
            setError(t("errors.invalidInput"))
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("title")}</CardTitle>
                    <CardDescription>
                        {t("cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">

                    {/* Current Time */}
                    <div className="flex flex-col gap-2 rounded-lg border p-4 bg-muted/50">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground">{t("currentTimestamp")}</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs">{t("seconds")}</Badge>
                                <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} title={isPaused ? t("resume") : t("pause")}>
                                    <RefreshCw className={`h-4 w-4 ${!isPaused ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>
                        <div className="text-3xl font-mono font-bold tracking-tight">
                            {currentTimestamp}
                        </div>
                    </div>

                    <Separator />

                    {/* Controls */}
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label>{t("inputType")}</Label>
                                <RadioGroup defaultValue="seconds" value={inputType} onValueChange={(v) => setInputType(v as "seconds" | "date")} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="seconds" id="r1" />
                                        <Label htmlFor="r1">{t("seconds")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="date" id="r2" />
                                        <Label htmlFor="r2">{t("dateString")}</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid gap-3">
                                <Label>{t("targetTimezone")}</Label>
                                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("selectTimezone")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIMEZONES.map((tz) => (
                                            <SelectItem key={tz.value} value={tz.value}>
                                                {t(tz.labelKey)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label>{t("inputValue")}</Label>
                                {inputType === "date" && (
                                    <span className="text-xs text-muted-foreground">
                                        {t("dateExamples", { examples: "2024-01-01T12:00:00Z, 2024/01/01 12:00" })}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder={inputType === "date" ? "2024-01-01T00:00:00Z" : "1700000000"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="font-mono"
                                    onKeyDown={(e) => { if (e.key === "Enter") handleConvert() }}
                                />
                                <Button onClick={handleConvert}>{t("convert")}</Button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="rounded-lg border shadow-sm mt-2 overflow-hidden">
                                <div className="bg-muted/50 px-4 py-2 border-b">
                                    <h3 className="font-semibold text-sm">{t("conversionResult")}</h3>
                                </div>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium w-[160px]">{t("unixTimestamp")}</TableCell>
                                            <TableCell className="font-mono">
                                                <div className="flex items-center gap-2">
                                                    {result.timestamp}
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(result.timestamp.toString())}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">{t("dateInTimezone", { timezone: selectedTimezone })}</TableCell>
                                            <TableCell className="font-mono">
                                                <span className="font-semibold">{result.formattedDate}</span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">ISO 8601</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {result.isoString}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">{t("relative")}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{result.relativeTime}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
