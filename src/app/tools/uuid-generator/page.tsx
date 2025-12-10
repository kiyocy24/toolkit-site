"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RefreshCw } from "lucide-react"

export default function UuidGeneratorPage() {
    const [count, setCount] = useState(1)
    const [uuids, setUuids] = useState<string[]>([])

    const generateUuids = () => {
        const newUuids = Array.from({ length: count }, () => crypto.randomUUID())
        setUuids(newUuids)
    }

    const copyAll = () => {
        if (uuids.length > 0) {
            navigator.clipboard.writeText(uuids.join("\n"))
        }
    }

    const copyOne = (uuid: string) => {
        navigator.clipboard.writeText(uuid)
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>UUID Generator</CardTitle>
                    <CardDescription>
                        Generate random v4 UUIDs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-end gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="count">Count (1-50)</Label>
                            <Input
                                id="count"
                                type="number"
                                min={1}
                                max={50}
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-24"
                            />
                        </div>
                        <Button onClick={generateUuids}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate
                        </Button>
                    </div>

                    {uuids.length > 0 && (
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Generated UUIDs</Label>
                                <Button variant="outline" size="sm" onClick={copyAll} className="h-8 px-2 lg:px-3">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy All
                                </Button>
                            </div>
                            <div className="grid gap-2">
                                {uuids.map((uuid, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Input readOnly value={uuid} className="font-mono text-sm" />
                                        <Button variant="ghost" size="icon" onClick={() => copyOne(uuid)} title="Copy">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
