"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Plus, Trash2, Check, Link as LinkIcon } from "lucide-react"

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
    const generateId = () => crypto.randomUUID()

    // Parse URL string into components
    const parseUrl = useCallback((input: string) => {
        try {
            let toParse = input.trim()
            if (toParse && !/^[a-z][a-z0-9+.-]*:/.test(toParse)) {
                toParse = `https://${toParse}`
            }

            const url = new URL(toParse)
            setProtocol(url.protocol)
            setHost(url.hostname)
            setPort(url.port)
            setPathname(url.pathname)
            setHash(url.hash)

            const newParams: QueryParam[] = []
            const availableOldParams = [...queryParams]
            url.searchParams.forEach((value, key) => {
                const existingParamIndex = availableOldParams.findIndex(p => p.key === key && p.value === value)
                if (existingParamIndex !== -1) {
                    // Reuse existing param to maintain stable ID and avoid focus loss.
                    newParams.push(availableOldParams.splice(existingParamIndex, 1)[0])
                } else {
                    newParams.push({ id: generateId(), key, value })
                }
            })
            setQueryParams(newParams)
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
    }, [queryParams])

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setUrlInput(val)
        // Auto-parse on change to update all derived components
        parseUrl(val)
    }

    // Handles changes to individual URL components (protocol, host, etc.).
    // This constructs a new URL string and updates `urlInput`, which then triggers `parseUrl`.
    const handleComponentChange = (
        field: 'protocol' | 'host' | 'port' | 'pathname' | 'hash',
        value: string
    ) => {
        try {
            // Start with the current `urlInput` or a default if it's invalid/empty
            let currentUrlStr = urlInput.trim()
            let url: URL;

            try {
                url = new URL(currentUrlStr || "https://example.com")
            } catch {
                // Fallback to a valid base URL if currentUrlStr is completely unparseable
                url = new URL("https://example.com")
            }

            // Apply the specific component change
            if (field === 'protocol') url.protocol = value
            if (field === 'host') url.hostname = value
            if (field === 'port') url.port = value
            if (field === 'pathname') url.pathname = value
            if (field === 'hash') url.hash = value

            // Reconstruct the URL string and update the main input
            const newUrl = url.toString()
            setUrlInput(newUrl)
            // `parseUrl` will be called by `handleUrlInputChange` if we were to use it,
            // but since we directly set `urlInput`, we need to call `parseUrl` explicitly
            // to update the other component states.
            parseUrl(newUrl)
        } catch (e) {
            console.error("Failed to update URL component:", e)
            setError("Failed to update URL component.")
        }
    }

    // Handles adding a new query parameter.
    // This updates the `queryParams` state and then reconstructs the URL.
    const addQueryParam = () => {
        const newParams = [...queryParams, { id: generateId(), key: "", value: "" }]
        setQueryParams(newParams)
        updateUrlFromComponents(protocol, host, port, pathname, hash, newParams)
    }

    // Handles removing a query parameter.
    // This updates the `queryParams` state and then reconstructs the URL.
    const removeQueryParam = (id: string) => {
        const newParams = queryParams.filter(p => p.id !== id)
        setQueryParams(newParams)
        updateUrlFromComponents(protocol, host, port, pathname, hash, newParams)
    }

    // Handles updating an existing query parameter's key or value.
    // This updates the `queryParams` state and then reconstructs the URL.
    const updateQueryParam = (id: string, field: 'key' | 'value', value: string) => {
        const newParams = queryParams.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        )
        setQueryParams(newParams)
        updateUrlFromComponents(protocol, host, port, pathname, hash, newParams)
    }

    // Reconstructs the full URL string from all current component states.
    // This is called when individual components or query params are edited.
    const updateUrlFromComponents = useCallback((
        currentProtocol: string,
        currentHost: string,
        currentPort: string,
        currentPathname: string,
        currentHash: string,
        currentQueryParams: QueryParam[]
    ) => {
        try {
            // We need at least a host to build a URL usually
            if (!currentHost) {
                // If host is empty, we can't form a valid URL, so clear input and derived states
                setUrlInput("")
                setError(null)
                return
            }

            const url = new URL("https://example.com") // dummy base
            url.protocol = currentProtocol
            url.hostname = currentHost
            url.port = currentPort
            url.pathname = currentPathname
            url.hash = currentHash

            // Build search params from the current queryParams state
            const searchFn = new URLSearchParams()
            currentQueryParams.forEach(p => {
                if (p.key) searchFn.append(p.key, p.value)
            })
            url.search = searchFn.toString()

            const builtUrl = url.toString()
            setUrlInput(builtUrl)
            setError(null)
            // No need to call parseUrl here, as we just built the URL from the current states,
            // and the states are already up-to-date. Calling parseUrl would re-derive them
            // and potentially cause focus issues with query params if IDs were not stable.
        } catch (e) {
            console.error("Failed to reconstruct URL from components:", e)
            setError("Failed to reconstruct URL from components.")
        }
    }, []) // No dependencies needed as it takes all values as arguments

    // Effect to initialize parsing when the component mounts or urlInput changes externally (if it were a prop)
    // For this component, it's primarily driven by user input or component edits.
    // We don't need a useEffect here because `parseUrl` is called directly by `handleUrlInputChange`
    // and `handleComponentChange`.

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
