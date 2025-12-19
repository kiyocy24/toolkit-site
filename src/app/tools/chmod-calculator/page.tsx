"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

type PermissionScope = "owner" | "group" | "public"
type PermissionType = "read" | "write" | "execute"

interface PermissionState {
    owner: { read: boolean; write: boolean; execute: boolean }
    group: { read: boolean; write: boolean; execute: boolean }
    public: { read: boolean; write: boolean; execute: boolean }
}

const initialPermissions: PermissionState = {
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    public: { read: true, write: false, execute: true },
}

// Map scope string to a localized label if needed, or just display title case
const scopeLabels: Record<PermissionScope, string> = {
    owner: "Owner",
    group: "Group",
    public: "Public",
}

const typeLabels: Record<PermissionType, string> = {
    read: "Read (4)",
    write: "Write (2)",
    execute: "Execute (1)",
}

// Presets
const presets = [
    { label: "777 (Everything)", value: "777" },
    { label: "755 (Web Server)", value: "755" },
    { label: "644 (File Read)", value: "644" },
    { label: "600 (Private)", value: "600" },
    { label: "400 (Read Only)", value: "400" },
]


const scopes: PermissionScope[] = ["owner", "group", "public"]
const types: PermissionType[] = ["read", "write", "execute"]

export default function ChmodCalculator() {
    const [permissions, setPermissions] = useState<PermissionState>(initialPermissions)
    const [octal, setOctal] = useState("755")
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

    // Calculate symbolic from permissions (derived state)
    const symbolic = useMemo(() => {
        let symbolicStr = "-"
        scopes.forEach(scope => {
            const p = permissions[scope]
            symbolicStr += p.read ? "r" : "-"
            symbolicStr += p.write ? "w" : "-"
            symbolicStr += p.execute ? "x" : "-"
        })
        return symbolicStr
    }, [permissions])

    // Sync permissions -> octal (only if valid)
    // To allow partial typing, we only auto-update octal if permissions change EXTERNALLY (e.g. checkbox)
    // logic: If we use useEffect, it overrides input.
    // Better: Derive octal from permissions? No, strictly deriving prevents partial input.
    // Compromise: Update octal when permissions change.
    useEffect(() => {
        let octalStr = ""
        scopes.forEach(scope => {
            let val = 0
            const p = permissions[scope]
            if (p.read) val += 4
            if (p.write) val += 2
            if (p.execute) val += 1
            octalStr += val
        })
        setOctal(octalStr)
    }, [permissions])

    // Handle copy feedback timeout
    useEffect(() => {
        if (copyFeedback) {
            const timeout = setTimeout(() => {
                setCopyFeedback(null)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [copyFeedback])

    const handleCheckboxChange = (scope: PermissionScope, type: PermissionType, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [scope]: {
                ...prev[scope],
                [type]: checked
            }
        }))
    }

    const handleOctalChange = (value: string) => {
        const cleanVal = value.replace(/[^0-7]/g, "").slice(0, 3)
        setOctal(cleanVal)

        if (cleanVal.length === 3) {
            const newPermissions = { ...initialPermissions }

            scopes.forEach((scope, index) => {
                const digit = parseInt(cleanVal[index], 10)
                newPermissions[scope] = {
                    read: (digit & 4) !== 0,
                    write: (digit & 2) !== 0,
                    execute: (digit & 1) !== 0,
                }
            })
            // This update will trigger useEffect above.
            // Since calculated octal will match cleanVal, it's safe (no cursor jump or change).
            setPermissions(newPermissions)
        }
    }

    const handlePresetClick = (val: string) => {
        // Just calling handleOctalChange handles both octal and permissions
        handleOctalChange(val)
    }

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopyFeedback(id)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Chmod Calculator</CardTitle>
                    <CardDescription>
                        Calculate Linux/Unix file permissions visually.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {scopes.map((scope) => (
                            <div key={scope} className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
                                    {scopeLabels[scope]}
                                </h3>
                                <div className="space-y-2">
                                    {types.map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${scope}-${type}`}
                                                checked={permissions[scope][type]}
                                                onCheckedChange={(c) => handleCheckboxChange(scope, type, c as boolean)}
                                            />
                                            <Label htmlFor={`${scope}-${type}`} className="cursor-pointer">
                                                {typeLabels[type]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Output Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="octal-input">Octal Notation (e.g. 755)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="octal-input"
                                    value={octal}
                                    onChange={(e) => handleOctalChange(e.target.value)}
                                    className="font-mono text-lg"
                                    maxLength={3}
                                />
                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(`chmod ${octal} filename`, "octal")} title="Copy command">
                                    {copyFeedback === "octal" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="symbolic-output">Symbolic Notation</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="symbolic-output"
                                    value={symbolic}
                                    readOnly
                                    className="font-mono text-lg bg-muted"
                                />
                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(symbolic, "symbolic")}>
                                    {copyFeedback === "symbolic" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="space-y-2">
                        <Label>Common Presets</Label>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.value}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handlePresetClick(preset.value)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">How it works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                        <strong>Read (r) = 4</strong>: Permission to read the file's content.
                    </p>
                    <p>
                        <strong>Write (w) = 2</strong>: Permission to modify or delete the file.
                    </p>
                    <p>
                        <strong>Execute (x) = 1</strong>: Permission to execute the file (if it's a script/program) or enter directory.
                    </p>
                    <p className="pt-2 border-t mt-2">
                        The octal number is the sum of these values for each scope (Owner, Group, Public).
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
