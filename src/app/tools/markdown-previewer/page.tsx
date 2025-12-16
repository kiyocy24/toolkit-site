"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Trash2 } from "lucide-react"

export default function MarkdownPreviewerPage() {
    const [markdown, setMarkdown] = useState<string>("# Hello Markdown\n\nWrite your markdown here...")

    const clearAll = () => {
        setMarkdown("")
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)] min-h-[500px]">
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Editor</CardTitle>
                        <CardDescription>
                            Write your markdown here.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 lg:px-3">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <Textarea
                        placeholder="Type your markdown here..."
                        className="h-full resize-none border-0 focus-visible:ring-0 p-6 font-mono rounded-b-xl rounded-t-none"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full overflow-hidden">
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                        Real-time preview of your markdown.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-muted/30 p-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdown}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
