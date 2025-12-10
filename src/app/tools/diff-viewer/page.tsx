"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { diffLines, diffChars, Change } from "diff"
import { Trash2 } from "lucide-react"

export default function DiffViewerPage() {
    const [oldText, setOldText] = useState("")
    const [newText, setNewText] = useState("")
    const [diffs, setDiffs] = useState<Change[]>([])

    const handleDiff = () => {
        const lineChanges = diffLines(oldText, newText)
        const finalChanges: Change[] = []

        for (let i = 0; i < lineChanges.length; i++) {
            const part = lineChanges[i]

            // If we have a removal followed immediately by an addition
            if (part.removed && i + 1 < lineChanges.length && lineChanges[i + 1].added) {
                const nextPart = lineChanges[i + 1]

                // Split by newline to check line counts
                // We handle trailing newlines carefully to avoid empty strings if we just simple split
                const cleanPartValue = part.value.endsWith('\n') ? part.value.slice(0, -1) : part.value
                const cleanNextPartValue = nextPart.value.endsWith('\n') ? nextPart.value.slice(0, -1) : nextPart.value

                const partLines = cleanPartValue.split('\n')
                const nextPartLines = cleanNextPartValue.split('\n')

                if (partLines.length === nextPartLines.length) {
                    // Line counts match, so we diff line by line
                    for (let k = 0; k < partLines.length; k++) {
                        const charChanges = diffChars(partLines[k], nextPartLines[k])
                        finalChanges.push(...charChanges)

                        // Add newline if this is not the last line
                        if (k < partLines.length - 1) {
                            finalChanges.push({ value: "\n", count: 1, removed: false, added: false })
                        }
                    }

                    // Handle the final trailing newline logic
                    const partHasTrailing = part.value.endsWith('\n')
                    const nextPartHasTrailing = nextPart.value.endsWith('\n')

                    if (partHasTrailing && nextPartHasTrailing) {
                        finalChanges.push({ value: "\n", count: 1, removed: false, added: false })
                    } else if (partHasTrailing) {
                        finalChanges.push({ value: "\n", count: 1, removed: true, added: false })
                    } else if (nextPartHasTrailing) {
                        finalChanges.push({ value: "\n", count: 1, removed: false, added: true })
                    }

                    i++ // Skip nextPart
                } else {
                    // Line counts differ, fallback to full block diffChars
                    const charChanges = diffChars(part.value, nextPart.value)
                    finalChanges.push(...charChanges)
                    i++
                }
            } else {
                finalChanges.push(part)
            }
        }
        setDiffs(finalChanges)
    }

    const clearAll = () => {
        setOldText("")
        setNewText("")
        setDiffs([])
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Diff Viewer</CardTitle>
                    <CardDescription>
                        Compare two text contents to see the differences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-end justify-end">
                        <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Original Text</Label>
                            <Textarea
                                placeholder="Paste original text..."
                                className="min-h-[200px] font-mono text-sm"
                                value={oldText}
                                onChange={(e) => setOldText(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Modified Text</Label>
                            <Textarea
                                placeholder="Paste modified text..."
                                className="min-h-[200px] font-mono text-sm"
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button onClick={handleDiff} className="w-full md:w-auto">Compare</Button>

                    {diffs.length > 0 && (
                        <div className="grid gap-2">
                            <Label>Differences</Label>
                            <div className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm font-mono whitespace-pre-wrap">
                                {diffs.map((part, index) => {
                                    const style = part.added
                                        ? { backgroundColor: "rgba(34, 197, 94, 0.2)" } // green
                                        : part.removed
                                            ? { backgroundColor: "rgba(239, 68, 68, 0.2)" } // red
                                            : {};
                                    return (
                                        <span key={index} style={style}>
                                            {part.value}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
