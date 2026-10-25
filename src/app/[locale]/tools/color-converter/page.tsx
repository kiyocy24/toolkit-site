"use client"

import { useState } from "react"
import { colord, extend, Colord } from "colord"
import cmykPlugin from "colord/plugins/cmyk"
import { Copy, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


extend([cmykPlugin])

interface ColorState {
    hex: string
    rgb: { r: number; g: number; b: number }
    hsl: { h: number; s: number; l: number }
    cmyk: { c: number; m: number; y: number; k: number }
}

export default function ColorConverterPage() {
    // Initialize with default blue color to avoid effect
    const defaultColor = colord("#3b82f6")
    const [color, setColor] = useState<ColorState>({
        hex: defaultColor.toHex(),
        rgb: defaultColor.toRgb(),
        hsl: defaultColor.toHsl(),
        cmyk: defaultColor.toCmyk(),
    })

    // Update all formats from a colord object
    const updateColor = (c: Colord) => {
        setColor({
            hex: c.toHex(),
            rgb: c.toRgb(),
            hsl: c.toHsl(),
            cmyk: c.toCmyk(),
        })
    }



    const handleHexChange = (value: string) => {
        const c = colord(value)
        if (c.isValid()) {
            updateColor(c)
        } else {
            // Just update hex state to allow typing
            setColor(prev => ({ ...prev, hex: value }))
        }
    }

    const handleRgbChange = (key: 'r' | 'g' | 'b', value: string) => {
        const val = parseInt(value) || 0;
        const newRgb = { ...color.rgb, [key]: val };
        const c = colord(newRgb);
        if (c.isValid()) updateColor(c);
    }

    const handleCmykChange = (key: 'c' | 'm' | 'y' | 'k', value: string) => {
        const val = parseInt(value) || 0;
        const newCmyk = { ...color.cmyk, [key]: val };
        const c = colord(newCmyk);
        if (c.isValid()) updateColor(c);
    }

    const handleHslChange = (key: 'h' | 's' | 'l', value: string) => {
        const val = parseInt(value) || 0;
        const newHsl = { ...color.hsl, [key]: val };
        const c = colord(newHsl);
        if (c.isValid()) updateColor(c);
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-6 w-6" />
                        Color Converter
                    </CardTitle>
                    <CardDescription>
                        Convert between HEX, RGB, HSL, and CMYK formats.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {/* Color Preview & Picker */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div
                            className="h-24 w-full rounded-md border shadow-sm sm:w-24"
                            style={{ backgroundColor: colord(color.hex).isValid() ? color.hex : '#000' }}
                        />
                        <div className="grid w-full gap-2">
                            <Label htmlFor="color-picker">Pick a color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="color-picker"
                                    type="color"
                                    value={colord(color.hex).isValid() ? color.hex : "#000000"}
                                    onChange={(e) => updateColor(colord(e.target.value))}
                                    className="h-10 w-20 p-1 cursor-pointer"
                                />
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        value={color.hex}
                                        onChange={(e) => handleHexChange(e.target.value)}
                                        placeholder="#000000"
                                        className="font-mono uppercase"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(color.hex)}
                                        title="Copy HEX"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* RGB Input */}
                        <div className="grid gap-2 p-4 border rounded-lg">
                            <Label>RGB</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['r', 'g', 'b'] as const).map((key) => (
                                    <div key={key}>
                                        <Label className="text-xs text-muted-foreground uppercase">{key}</Label>
                                        <Input
                                            type="number"
                                            value={color.rgb[key]}
                                            onChange={(e) => handleRgbChange(key, e.target.value)}
                                            min={0}
                                            max={255}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
                                >
                                    <Copy className="h-3 w-3 mr-1" /> Copy RGB
                                </Button>
                            </div>
                        </div>

                        {/* HSL Input */}
                        <div className="grid gap-2 p-4 border rounded-lg">
                            <Label>HSL</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['h', 's', 'l'] as const).map((key) => (
                                    <div key={key}>
                                        <Label className="text-xs text-muted-foreground uppercase">{key}</Label>
                                        <Input
                                            type="number"
                                            value={color.hsl[key]}
                                            onChange={(e) => handleHslChange(key, e.target.value)}
                                            min={0}
                                            max={key === 'h' ? 360 : 100}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
                                >
                                    <Copy className="h-3 w-3 mr-1" /> Copy HSL
                                </Button>
                            </div>
                        </div>

                        {/* CMYK Input */}
                        <div className="grid gap-2 p-4 border rounded-lg">
                            <Label>CMYK</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['c', 'm', 'y', 'k'] as const).map((key) => (
                                    <div key={key}>
                                        <Label className="text-xs text-muted-foreground uppercase">{key}</Label>
                                        <Input
                                            type="number"
                                            value={color.cmyk[key]}
                                            onChange={(e) => handleCmykChange(key, e.target.value)}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(`cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`)}
                                >
                                    <Copy className="h-3 w-3 mr-1" /> Copy CMYK
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
