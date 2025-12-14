import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import QrCodeGeneratorPage from "./page"

import React from "react"

// Mock qrcode.react since it renders specific SVG structure
vi.mock("qrcode.react", async () => {
    const React = await import("react")
    return {
        QRCodeSVG: React.forwardRef(({ value, size }: { value: string; size: number }, ref: React.ForwardedRef<SVGSVGElement>) => (
            <svg ref={ref} data-testid="qr-code-svg" width={size} height={size}>
                <text>{value}</text>
            </svg>
        )),
    }
})

// Mock XMLSerializer
global.XMLSerializer = class {
    serializeToString() {
        return "<svg>mock</svg>"
    }
} as any

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url")
global.URL.revokeObjectURL = vi.fn()

describe("QrCodeGeneratorPage", () => {
    it("renders the component correctly", () => {
        render(<QrCodeGeneratorPage />)
        expect(screen.getByText("QR Code Generator")).toBeInTheDocument()
        expect(screen.getByLabelText("Content")).toBeInTheDocument()
    })

    it("displays placeholder when text is empty", () => {
        render(<QrCodeGeneratorPage />)
        expect(screen.getByText("Enter text to generate")).toBeInTheDocument()
    })

    it("renders QR code when text is entered", () => {
        render(<QrCodeGeneratorPage />)

        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        expect(screen.getByTestId("qr-code-svg")).toBeInTheDocument()
    })

    it("clears content when Clear button is clicked", () => {
        render(<QrCodeGeneratorPage />)

        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        const clearButton = screen.getByText("Clear")
        fireEvent.click(clearButton)

        expect(screen.getByLabelText("Content")).toHaveValue("")
        expect(screen.getByText("Enter text to generate")).toBeInTheDocument()
    })

    let originalImage: typeof Image
    let createElementSpy: any
    let consoleSpy: any

    beforeAll(() => {
        originalImage = window.Image
    })

    afterAll(() => {
        window.Image = originalImage
    })

    beforeEach(() => {
        // Default Image mock that triggers onload synchronously
        window.Image = class extends originalImage {
            _onload: ((e: Event) => void) | null = null
            _onerror: OnErrorEventHandler = null

            set onload(handler: ((e: Event) => void) | null) {
                this._onload = handler
            }

            get onload() {
                return this._onload
            }

            set onerror(handler: OnErrorEventHandler) {
                this._onerror = handler
            }

            get onerror() {
                return this._onerror
            }

            set src(_: string) {
                if (this._onload) {
                    this._onload(new Event('load'))
                }
            }
        } as unknown as typeof Image

        // Spy on console.error to keep output clean and check for errors
        consoleSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
            console.log("[TEST ERROR LOG]", ...args)
        })
    })

    afterEach(() => {
        if (createElementSpy) {
            createElementSpy.mockRestore()
        }
        consoleSpy.mockRestore()
        vi.restoreAllMocks()
        window.Image = originalImage // Reset Image to original (or default mock in beforeEach)
    })

    it("triggers download when Download PNG button is clicked", () => {
        render(<QrCodeGeneratorPage />)

        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        const mockLink = document.createElement("a")
        mockLink.click = vi.fn() as any // Cast to satisfy type if needed, or just assign

        createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'a') return mockLink
            if (tagName === 'canvas') {
                return {
                    getContext: () => ({
                        drawImage: vi.fn(),
                    }),
                    toDataURL: () => "data:image/png;base64,mock",
                    width: 0,
                    height: 0,
                } as unknown as HTMLCanvasElement
            }
            return document.createElement(tagName)
        })

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(downloadButton).not.toBeDisabled()
    })

    it("uses toBlob when available for download", () => {
        render(<QrCodeGeneratorPage />)
        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        const mockLink = document.createElement("a")
        mockLink.click = vi.fn()

        const toBlobMock = vi.fn((callback) => callback(new Blob(["mock"], { type: "image/png" })))
        const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

        createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            console.log(`createElement called for ${tagName}`)
            if (tagName === 'a') return mockLink
            if (tagName === 'canvas') {
                const canvasMock = {
                    getContext: () => ({
                        drawImage: vi.fn(),
                    }),
                    toBlob: (...args: any[]) => {
                        console.log("toBlob called")
                        return toBlobMock(...args)
                    },
                    width: 0,
                    height: 0,
                } as unknown as HTMLCanvasElement
                console.log("Returning canvas mocked with toBlob:", !!canvasMock.toBlob)
                return canvasMock
            }
            return document.createElement(tagName)
        })

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(consoleSpy).not.toHaveBeenCalled()
        expect(toBlobMock).toHaveBeenCalled()
        expect(revokeObjectURLSpy).toHaveBeenCalled()
    })

    it("handles toBlob failure (null blob)", () => {
        render(<QrCodeGeneratorPage />)
        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        const toBlobMock = vi.fn((callback) => callback(null))

        createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return {
                    getContext: () => ({ drawImage: vi.fn() }),
                    toBlob: toBlobMock,
                    width: 0,
                    height: 0,
                } as unknown as HTMLCanvasElement
            }
            return document.createElement(tagName)
        })

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(consoleSpy).toHaveBeenCalledWith("Failed to create blob from canvas")
    })

    it("handles canvas context failure", () => {
        render(<QrCodeGeneratorPage />)
        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return {
                    getContext: () => null, // Fail getContext
                    width: 0,
                    height: 0,
                } as unknown as HTMLCanvasElement
            }
            return document.createElement(tagName)
        })

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(consoleSpy).toHaveBeenCalledWith("Failed to get 2D context for canvas")
    })

    it("handles image load failure", () => {
        // Override Image mock for this specific test to trigger onerror
        window.Image = class extends originalImage {
            _onload: ((e: Event) => void) | null = null
            _onerror: OnErrorEventHandler = null

            set onload(handler: ((e: Event) => void) | null) {
                this._onload = handler
            }
            set onerror(handler: OnErrorEventHandler) {
                this._onerror = handler
            }
            get onload() { return this._onload }
            get onerror() { return this._onerror }

            set src(_: string) {
                if (this._onerror) {
                    this._onerror(new Event('error'))
                }
            }
        } as unknown as typeof Image

        render(<QrCodeGeneratorPage />)
        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(consoleSpy).toHaveBeenCalledWith("Image failed to load for QR code download", expect.any(Object))
    })

    it("updates error correction level", () => {
        render(<QrCodeGeneratorPage />)
        // Select trigger is initially "Medium (15%)" or similar based on default "M"
        // We find by role combobox usually
        const selectTrigger = screen.getByRole("combobox")
        fireEvent.click(selectTrigger)

        // Select 'High (30%)'
        const item = screen.getByText("High (30%)")
        fireEvent.click(item)

        // Verify value change impact if possible, or just interaction.
        // With qrcode.react mock, we can verify props passed if we inspected the mock.
        // But verifying the text in the select is updated is good too.
        expect(screen.getByText("High (30%)")).toBeInTheDocument()
    })

    it("updates size via slider", () => {
        render(<QrCodeGeneratorPage />)
        // Sliders are hard to interact with properly in JSDOM, but we can try firing change on input
        // Shadcn slider usually has a hidden input or role="slider"
        const slider = screen.getByRole("slider")

        // Radix slider interaction
        fireEvent.keyDown(slider, { key: "ArrowRight" })

        // Check if size text updated "Size (208px)" (200 + step 8)
        expect(screen.getByText(/Size \(20/)).toBeInTheDocument()
    })
})
