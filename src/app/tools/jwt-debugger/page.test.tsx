import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import JwtDebuggerPage, { JwtDecoder, JwtEncoder } from "./page"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import * as jwtCrypto from "@/lib/jwt-crypto"

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

// Mock the crypto helper module
vi.mock("@/lib/jwt-crypto", () => ({
    signJwt: vi.fn()
}))

describe("JwtDebuggerPage", () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vi.mocked(jwtCrypto.signJwt).mockReset().mockResolvedValue("header.payload.signature")
    })

    describe("Decoder", () => {
        it("is using mocked module", () => {
            console.log("IMPORTED MODULE:", jwtCrypto)
            console.log("signJwt mock status:", vi.isMockFunction(jwtCrypto.signJwt))
            expect(vi.isMockFunction(jwtCrypto.signJwt)).toBe(true)
        })

        it("signs token directly", async () => {
            const token = await jwtCrypto.signJwt({}, {}, "secret")
            console.log("DIRECT SIGN RESULT:", token)
            expect(token).toBe("header.payload.signature")
        })

        it("renders decoder by default", () => {
            render(<JwtDebuggerPage />)
            expect(screen.getByText("JWT Token")).toBeDefined()
            expect(screen.getByText("Header")).toBeDefined()
            expect(screen.getByText("Payload")).toBeDefined()
        })

        it("decodes a valid JWT", async () => {
            render(<JwtDebuggerPage />)

            // valid token
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

        it("clears outputs when token is empty", async () => {
            render(<JwtDebuggerPage />)
            const input = screen.getByLabelText("JWT Token")
            fireEvent.change(input, { target: { value: "some.value.here" } })
            fireEvent.change(input, { target: { value: "" } })

            await waitFor(() => {
                expect(screen.getByLabelText("Header")).toHaveValue("")
                expect(screen.getByLabelText("Payload")).toHaveValue("")
            })
        })

        it("handles decoding errors gracefully", async () => {
            render(<JwtDebuggerPage />)
            const input = screen.getByLabelText("JWT Token")
            fireEvent.change(input, { target: { value: "ey.ey.sig" } })
            await waitFor(() => {
                const error = screen.queryByRole("alert")
                expect(error).toBeDefined()
            })
        })

        it("handles base64 padding cases", async () => {
            render(<JwtDebuggerPage />)
            const input = screen.getByLabelText("JWT Token")

            const header = "eyJhIjoxfQ" // {"a":1}
            const payload = "e30" // {} 

            fireEvent.change(input, { target: { value: `${header}.${payload}.sig` } })

            await waitFor(() => {
                const headerVal = (screen.getByLabelText("Header") as HTMLTextAreaElement).value
                const payloadVal = (screen.getByLabelText("Payload") as HTMLTextAreaElement).value
                expect(headerVal).toContain('"a": 1')
                expect(payloadVal).toContain("{}")
            })
        })
    })




    describe("Encoder", () => {
        it("generates token", async () => {
            render(<JwtEncoder />)

            expect(screen.getByText("Secret (for HS256)")).toBeDefined()

            await waitFor(() => {
                const tokenVal = (screen.getByLabelText("Encoded Token") as HTMLTextAreaElement).value
                const alert = screen.queryAllByRole("alert").find(a => a.textContent?.includes("Error"))
                if (alert) throw new Error("Alert: " + alert.textContent)
                if (!tokenVal) throw new Error("Waiting...")

                expect(tokenVal).toContain("header.payload.signature")
                expect(jwtCrypto.signJwt).toHaveBeenCalled()
            }, { timeout: 3000 })
        })
    })

    it("updates encoded token when payload changes", async () => {
        render(<JwtEncoder />)

        // Initial generation
        // Wait for initial generation
        await waitFor(() => {
            const tokenVal = (screen.getByLabelText("Encoded Token") as HTMLTextAreaElement).value
            if (!tokenVal) throw new Error("Waiting for initial token...")
        }, { timeout: 3000 })

        const payloadInput = screen.getByLabelText("Payload (JSON)")
        fireEvent.change(payloadInput, { target: { value: '{"test":"value"}' } })

        await waitFor(() => {
            const tokenVal = (screen.getByLabelText("Encoded Token") as HTMLTextAreaElement).value
            expect(jwtCrypto.signJwt).toHaveBeenCalled()
            expect(tokenVal).toContain("header.payload.signature")
        }, { timeout: 3000 })
    })

    it("updates encoded token when header changes", async () => {
        render(<JwtEncoder />)

        // Wait for initial generation
        await waitFor(() => {
            const tokenVal = (screen.getByLabelText("Encoded Token") as HTMLTextAreaElement).value
            if (!tokenVal) throw new Error("Waiting for initial token...")
        }, { timeout: 3000 })

        const headerInput = screen.getByLabelText("Header (JSON)")
        fireEvent.change(headerInput, { target: { value: '{"typ":"JWT"}' } })

        await waitFor(() => {
            const tokenVal = (screen.getByLabelText("Encoded Token") as HTMLTextAreaElement).value
            expect(jwtCrypto.signJwt).toHaveBeenCalled()
        }, { timeout: 3000 })
    })

    it("copies encoded token", async () => {
        render(<JwtEncoder />)

        const copyButton = screen.getByRole("button", { name: /Copy encoded token/i })

        await waitFor(() => {
            expect(screen.getByLabelText("Encoded Token")).not.toHaveValue("")
            expect(copyButton).toBeEnabled()
        }, { timeout: 3000 })

        fireEvent.click(copyButton)

        await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalled()
        })
    })

    it("handles copy failure", async () => {
        render(<JwtEncoder />)

        mockWriteText.mockRejectedValueOnce(new Error("Copy failed"))
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })

        await waitFor(() => {
            const copyButton = screen.getByRole("button", { name: /Copy encoded token/i })
            expect(copyButton).toBeEnabled()
            fireEvent.click(copyButton)
        }, { timeout: 3000 })

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Failed to copy", expect.any(Error))
        })
        consoleSpy.mockRestore()
    })

    it("handles signing errors", async () => {
        render(<JwtEncoder />)

        // Wait for secret input to be available
        const secretInput = await screen.findByLabelText("Secret (for HS256)")

        vi.mocked(jwtCrypto.signJwt).mockRejectedValue(new Error("Signing failed"))

        // Trigger update
        fireEvent.change(secretInput, { target: { value: "new-secret" } })

        await waitFor(() => {
            expect(screen.getByText("Signing failed")).toBeDefined()
        }, { timeout: 3000 })
    })
})

