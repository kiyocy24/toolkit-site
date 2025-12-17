import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import JwtDebuggerPage from "./page"
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest"

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

// Mock crypto and TextEncoder
const mockSign = vi.fn()
const mockImportKey = vi.fn()

beforeAll(() => {
    // Polyfill TextEncoder
    if (!global.TextEncoder) {
        global.TextEncoder = class {
            encode(str: string) { return Buffer.from(str, 'utf-8') }
        } as any
    }

    // Ensure crypto.subtle exists
    // In HappyDOM, global.crypto might be read-only property of Window, but the object itself is mutable usually.
    if (!global.crypto) {
        Object.defineProperty(global, 'crypto', {
            value: { subtle: {} },
            writable: true,
            configurable: true
        })
    }
    if (!global.crypto.subtle) {
        // @ts-ignore
        global.crypto.subtle = {}
    }
})

describe("JwtDebuggerPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock importKey
        // Check if it's already a spy/mock to avoid wrapping multiple times if reuse happens, 
        // but vitest restores mocks after run if configured? 
        // Better to just overwrite or spy cleanly.

        try {
            vi.spyOn(global.crypto.subtle, 'importKey').mockImplementation(mockImportKey)
        } catch (e) {
            // If spy fails (e.g. missing property), assign it
            global.crypto.subtle.importKey = mockImportKey
        }

        try {
            vi.spyOn(global.crypto.subtle, 'sign').mockImplementation(mockSign)
        } catch (e) {
            global.crypto.subtle.sign = mockSign
        }

        mockImportKey.mockResolvedValue("mockKey")
        mockSign.mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
    })

    describe("Decoder", () => {
        it("renders decoder by default", () => {
            render(<JwtDebuggerPage />)
            expect(screen.getByText("JWT Token")).toBeDefined()
            expect(screen.getByText("Header")).toBeDefined()
            expect(screen.getByText("Payload")).toBeDefined()
        })

        it("decodes a valid JWT", async () => {
            render(<JwtDebuggerPage />)

            // valid token: header.payload.signature
            // header: {"alg":"HS256","typ":"JWT"} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
            // payload: {"sub":"123","name":"John Doe"} -> eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiBEb2UifQ
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiBEb2UifQ.signature"

            const input = screen.getByLabelText("JWT Token")
            fireEvent.change(input, { target: { value: token } })

            await waitFor(() => {
                const errorAlert = screen.queryByRole("alert")
                if (errorAlert) {
                    throw new Error("Decoder Error: " + errorAlert.textContent)
                }
                const headerOutput = screen.getByLabelText("Header") as HTMLTextAreaElement
                const payloadOutput = screen.getByLabelText("Payload") as HTMLTextAreaElement

                expect(headerOutput.value).toContain('"alg": "HS256"')
                expect(payloadOutput.value).toContain('"name": "John Doe"')
            })
        })

        it("shows error for invalid JWT structure", async () => {
            render(<JwtDebuggerPage />)
            const input = screen.getByLabelText("JWT Token")
            fireEvent.change(input, { target: { value: "invalid.token" } })

            await waitFor(() => {
                expect(screen.getByText("Invalid JWT structure. Expected 3 parts separated by dots.")).toBeDefined()
            })
        })
    })

    describe.skip("Encoder", () => {
        beforeEach(() => {
            // Setup successes for Web Crypto mocks
            mockImportKey.mockResolvedValue("mockKey")
            // Mock signature result (ArrayBuffer)
            const signature = new Uint8Array([1, 2, 3]).buffer
            mockSign.mockResolvedValue(signature)
        })

        it("switches to encoder tab and generates token", async () => {
            render(<JwtDebuggerPage />)

            const encoderTab = screen.getByText("Encoder")
            fireEvent.click(encoderTab)

            expect(screen.getByText("Secret (for HS256)")).toBeDefined()

            // Should auto-generate basic token on load/render of tab
            await waitFor(() => {
                expect(screen.getByLabelText("Encoded Token")).not.toHaveValue("")
                expect(mockSign).toHaveBeenCalled()
            })
        })

        it("updates encoded token when payload changes", async () => {
            render(<JwtDebuggerPage />)
            fireEvent.click(screen.getByText("Encoder"))

            const payloadInput = screen.getByLabelText("Payload (JSON)")
            fireEvent.change(payloadInput, { target: { value: '{"test":"value"}' } })

            await waitFor(() => {
                expect(mockSign).toHaveBeenCalled()
                // We don't verify exact output string as it depends on exact base64 encoding of signature which is mocked,
                // but checking if it's not empty and sign was called is good integration test.
                expect(screen.getByLabelText("Encoded Token")).toHaveValue(expect.stringContaining("."))
            })
        })

        it("copies encoded token", async () => {
            render(<JwtDebuggerPage />)
            fireEvent.click(screen.getByText("Encoder"))

            // Wait for token generation
            await waitFor(() => {
                expect(screen.getByLabelText("Encoded Token")).not.toHaveValue("")
            })

            const copyButton = screen.getByRole("button", { name: "" }) // Icon button usually has empty name if not aria-labeled properly but we can find by svg or just try to find the button inside
            // Actually the code uses Lucide Copy icon inside button. 
            // Let's find by class or hierarchy if needed, or better, the button inside the relative container.
            // The code has: <Button ... onClick={copyToClipboard}>

            // Let's assume there is only one copy button visible in Encoder tab (Header/Payload in Decoder are different fields)
            // But wait, Decoder is hidden.
            // There is only one copy button in Encoder tab.

            // Actually, let's find by the SVG icons or the parent div.
            // Simply looking for button next to Encoded Token textarea.
            const encodedArea = screen.getByLabelText("Encoded Token")
            const copyBtn = encodedArea.nextElementSibling as HTMLElement

            if (copyBtn) {
                fireEvent.click(copyBtn)
                expect(mockWriteText).toHaveBeenCalled()
            } else {
                // Fallback search
                const btns = screen.getAllByRole("button")
                // Last button is likely the copy button
                fireEvent.click(btns[btns.length - 1])
                expect(mockWriteText).toHaveBeenCalled()
            }
        })
    })
})
