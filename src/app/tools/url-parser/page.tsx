"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Plus, Trash2, Check, RefreshCw, Link as LinkIcon } from "lucide-react"

interface QueryParam {
    id: string
    key: string
    value: string
}

export default function UrlParser() {
    const [urlInput, setUrlInput] = useState("")
    const [protocol, setProtocol] = useState("https:")
    const [host, setHost] = useState("")
    const [port, setPort] = useState("")
    const [pathname, setPathname] = useState("/")
    const [hash, setHash] = useState("")
    const [queryParams, setQueryParams] = useState<QueryParam[]>([])
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // Generate unique ID for params
    const generateId = () => Math.random().toString(36).substr(2, 9)

    // Parse URL string into components
    const parseUrl = useCallback((input: string) => {
        try {
            // Add protocol if missing for parsing attempts
            let toParse = input
            if (!input.match(/^https?:\/\//)) {
                // Don't auto-add yet to avoid jumping cursor, but maybe for parsing logic we treat it carefully
                // Actually standard URL constructor requires protocol.
                // If user types "example.com", we might fail. 
                // Let's just try parsing.
            }

            const url = new URL(toParse)
            setProtocol(url.protocol)
            setHost(url.hostname)
            setPort(url.port)
            setPathname(url.pathname)
            setHash(url.hash)

            const params: QueryParam[] = []
            url.searchParams.forEach((value, key) => {
                params.push({ id: generateId(), key, value })
            })
            setQueryParams(params)
            setError(null)
        } catch (e) {
            // Only set error if input is not empty (empty is just reset)
            if (input.trim()) {
                setError("Invalid URL")
            } else {
                setError(null)
                // Reset fields
                setProtocol("https:")
                setHost("")
                setPort("")
                setPathname("/")
                setHash("")
                setQueryParams([])
            }
        }
    }, [])

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setUrlInput(val)
        // Auto-parse on change
        parseUrl(val)
    }

    // Reconstruct URL from components
    const reconstructUrl = useCallback(() => {
        try {
            // We need at least a host to build a URL usually
            if (!host) return

            const url = new URL("https://example.com") // dummy base
            url.protocol = protocol
            url.hostname = host
            url.port = port
            url.pathname = pathname
            url.hash = hash

            // Clear existing params and add from state
            // Note: URL object clears search if you set search to empty string, but we use searchParams
            // We need to rebuild search string manually or clear and add
            const searchFn = new URLSearchParams()
            queryParams.forEach(p => {
                if (p.key) searchFn.append(p.key, p.value)
            })
            url.search = searchFn.toString()

            const builtUrl = url.toString()
            setUrlInput(builtUrl)
            setError(null)
        } catch (e) {
            console.error("Failed to reconstruct URL", e)
        }
    }, [protocol, host, port, pathname, hash, queryParams])

    // Effect to trigger reconstruction when components change
    // We need to be careful not to create infinite loop with parsed input
    // The "Single Source of Truth" problem.
    // APPROACH: 
    // - Input handling updates Input State -> Triggers parsing -> Updates Components (if valid)
    // - Component handling updates Component State -> Triggers reconstruction -> Updates Input State
    // - This creates loop.
    // FIX: Separate 'User Action' from 'Derived State'.

    // Instead of complex effects, let's make specific handlers.

    const updateComponent = (setter: (val: string) => void, val: string) => {
        setter(val)
        // We need to trigger reconstruction immediately with the new value
        // But state is async. 
        // Better: Make reconstructUrl accepted overrides or just use a completely different approach.
        // Let's use a "rebuild" function that reads current state (captured in closure or ref? No, passed in).
        // Actually, simplest is: Components inputs call a handler that updates Input URL directly.
    }

    // Revised Architectue:
    // 1. URL Input is the Source of Truth.
    // 2. Components are derived from parsing URL Input.
    // 3. EDITING a component -> Constructs new URL -> Updates URL Input.

    const handleComponentChange = (
        field: 'protocol' | 'host' | 'port' | 'pathname' | 'hash',
        value: string
    ) => {
        // Construct temporary URL from current input, modify specific field, update input
        try {
            let currentUrlStr = urlInput
            if (!currentUrlStr) currentUrlStr = "https://example.com"
            // if input is invalid, we might default to empty base

            let url: URL;
            try {
                url = new URL(currentUrlStr)
            } catch {
                url = new URL("https://example.com")
            }

            if (field === 'protocol') url.protocol = value
            if (field === 'host') url.hostname = value
            if (field === 'port') url.port = value
            if (field === 'pathname') url.pathname = value
            if (field === 'hash') url.hash = value

            const newUrl = url.toString()
            setUrlInput(newUrl)
            // Parsing will happen automatically because we update input? 
            // Or we should update local component state?
            // If we update input, we re-parse.
            parseUrl(newUrl)
        } catch (e) {
            console.error(e)
        }
    }

    const addQueryParam = () => {
        const newParams = [...queryParams, { id: generateId(), key: "", value: "" }]
        setQueryParams(newParams)
        updateUrlFromParams(newParams)
    }

    const removeQueryParam = (id: string) => {
        const newParams = queryParams.filter(p => p.id !== id)
        setQueryParams(newParams)
        updateUrlFromParams(newParams)
    }

    const updateQueryParam = (id: string, field: 'key' | 'value', value: string) => {
        const newParams = queryParams.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        )
        setQueryParams(newParams)
        updateUrlFromParams(newParams)
    }

    const updateUrlFromParams = (params: QueryParam[]) => {
        try {
            let url: URL;
            try {
                url = new URL(urlInput)
            } catch {
                url = new URL("https://example.com")
            }

            const searchFn = new URLSearchParams()
            params.forEach(p => {
                if (p.key) searchFn.append(p.key, p.value)
            })
            url.search = searchFn.toString()

            const newUrl = url.toString()
            setUrlInput(newUrl)
            // parseUrl(newUrl) // actually parseUrl resets params from URL, so we might lose focus or state if we are not careful?
            // If we parseUrl, `queryParams` state gets overwritten by what comes from URL.
            // Since we just built URL from `params`, it should match.
            // BUT, if we are editing a key, we don't want to lose focus.
            // Let's just update the URL input and let the "User editing URL Input" logic handle parsing?
            // No, because we want immediate feedback in the URL box.

            // To avoid flickers/loops, we can manually set the other states if needed, but `parseUrl` is essentially "sync state to URL".
            // Let's rely on parseUrl being called when we update `urlInput` IF we treated `urlInput` as source.
            // BUT `parseUrl` overwrites `queryParams`. React reconciler should handle it if values match.
            // However, regenerating IDs would kill focus. 
            // FIX: Parsing should preserve IDs if keys/values match? Too complex.
            // Better: When editing params, DON'T re-parse URL immediately into components, just update URL string.
            // Use a flag? or just don't call parseUrl here?
            // But if we don't parseUrl, protocol/host/etc might be stale if we edit those?
            // Wait, we are only editing params here.
            // So protocol/host/etc are fine.
            // We only need to avoid `parseUrl` overwriting `queryParams` with NEW IDs.

            // Refined Logic associated with `useEffect`:
            // 2 Sources of Truth + Syncing is hard.
            // Let's stick to "URL Input is King".
            // When editing params components:
            // 1. Build new URL.
            // 2. setUrlInput(newUrl).
            // 3. DO NOT call parseUrl. rely on `useEffect` listening to `urlInput`?
            //    If we use useEffect, we still hit the "new IDs" problem.
        } catch (e) {
            console.error(e)
        }
    }

    // To solve Focus issues:
    // We shouldn't regenerate IDs on every parse.
    // If we can map existing params to new parsed params, we keep IDs.
    // Or simpler: Only parsing explicitly (e.g. on URL Input blur or debounced) updates the list.
    // Real-time is better.
    // Let's rely on the fact that if we update `urlInput` via params editor, we know the params are up to date.
    // so we can SKIP parsing parameters from URL back to state in that specific flow.
    // But `parseUrl` does everything.

    // New Strategy:
    // Split `parseUrl` into `parseComponents` and `parseQueryParams`.
    // When editing Components -> update URL -> parseQueryParams (if path changed? no) -> parseComponents (no need, we just set it).
    // Actually, `new URL()` handles normalization.

    // Let's try to not overengineer first.
    // If we accept that editing URL text inputs might lose focus in Params list if we re-generate IDs, 
    // we just need to NOT re-generate IDs for "same" params.

    // Or... we just don't sync back from URL to Params list WHILE editing params.
    // We update URL string, but don't re-parse params list.
    // `parseUrl` should be called:
    // 1. On URL Input Change (User types in big box).
    // 2. NEVER when editing components/params (we manually update local state and URL box).

    // This seems robust.

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(urlInput)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-6 w-6" />
                        URL Parser
                    </CardTitle>
                    <CardDescription>
                        Parse, edit, and reconstruct URLs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Main Input */}
                    <div className="space-y-2">
                        <Label htmlFor="url-input">URL String</Label>
                        <div className="flex gap-2">
                            <Textarea
                                id="url-input"
                                placeholder="https://example.com/path?query=1"
                                value={urlInput}
                                onChange={handleUrlInputChange} // Only this triggers full re-parse
                                className="font-mono min-h-[80px]"
                            />
                            <Button size="icon" variant="outline" className="h-auto" onClick={copyToClipboard} title="Copy URL">
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    {/* Components Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Protocol</Label>
                            <Input
                                value={protocol}
                                onChange={(e) => handleComponentChange('protocol', e.target.value)}
                                placeholder="https:"
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label>Host</Label>
                            <Input
                                value={host}
                                onChange={(e) => handleComponentChange('host', e.target.value)}
                                placeholder="example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input
                                value={port}
                                onChange={(e) => handleComponentChange('port', e.target.value)}
                                placeholder="443"
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-3">
                            <Label>Path</Label>
                            <Input
                                value={pathname}
                                onChange={(e) => handleComponentChange('pathname', e.target.value)}
                                placeholder="/"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Hash</Label>
                            <Input
                                value={hash}
                                onChange={(e) => handleComponentChange('hash', e.target.value)}
                                placeholder="#section"
                            />
                        </div>
                    </div>

                    {/* Query Params Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Query Parameters</Label>
                            <Button size="sm" variant="outline" onClick={addQueryParam}>
                                <Plus className="h-4 w-4 mr-1" /> Add Param
                            </Button>
                        </div>

                        {queryParams.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No query parameters.</p>
                        ) : (
                            <div className="space-y-2">
                                {queryParams.map((param) => (
                                    <div key={param.id} className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Key"
                                            value={param.key}
                                            onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                        <span className="text-muted-foreground">=</span>
                                        <Input
                                            placeholder="Value"
                                            value={param.value}
                                            onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeQueryParam(param.id)}
                                            aria-label="Remove parameter"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
