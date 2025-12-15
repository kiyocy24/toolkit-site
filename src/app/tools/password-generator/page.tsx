"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw } from "lucide-react"

export default function PasswordGeneratorPage() {
    const [length, setLength] = useState([16])
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(true)
    const [password, setPassword] = useState("")

    const generatePassword = () => {
        let charset = ""
        if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
        if (includeNumbers) charset += "0123456789"
        if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

        if (charset === "") {
            setPassword("")
            return
        }

        let newPassword = ""
        for (let i = 0; i < length[0]; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        setPassword(newPassword)
    }

    // Generate on initial load
    useEffect(() => {
        generatePassword()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password)
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Password Generator</CardTitle>
                    <CardDescription>
                        Generate secure random passwords with customizable options.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="generated-password">Generated Password</Label>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!password}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                id="generated-password"
                                value={password}
                                readOnly
                                className="font-mono text-lg"
                            />
                            <Button onClick={generatePassword}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Length: {length}</Label>
                            </div>
                            <Slider
                                value={length}
                                onValueChange={setLength}
                                min={4}
                                max={64}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                                <Switch
                                    id="uppercase"
                                    checked={includeUppercase}
                                    onCheckedChange={setIncludeUppercase}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                                <Switch
                                    id="lowercase"
                                    checked={includeLowercase}
                                    onCheckedChange={setIncludeLowercase}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="numbers">Numbers (0-9)</Label>
                                <Switch
                                    id="numbers"
                                    checked={includeNumbers}
                                    onCheckedChange={setIncludeNumbers}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="symbols">Symbols (!@#$%)</Label>
                                <Switch
                                    id="symbols"
                                    checked={includeSymbols}
                                    onCheckedChange={setIncludeSymbols}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
