import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HashGeneratorPage from "./page"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock crypto.subtle and TextEncoder
const mockDigest = vi.fn()
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            digest: mockDigest,
        },
        randomUUID: () => "test-uuid"
    },
})

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

describe("HashGeneratorPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Setup default mock implementation for digest/TextEncoder if needed
    })

    it("renders correctly", () => {
        render(<HashGeneratorPage />)
        expect(screen.getByText("Hash Generator")).toBeDefined()
        expect(screen.getByLabelText("Input Text")).toBeDefined()
    })

    // Note: Testing exact hash generation might be tricky with mocked crypto.subtle.
    // For unit testing the page, we primarily want to check if the input triggers the hash logic
    // and if the output fields are updated.
    // The actual hash logic is in `hash-utils.ts` (which we should also test, or trust if we tested separately).
    // For integration testing here, we can mock `hash-utils` or mock `crypto.subtle` to return known buffers.

    it("updates hashes when input changes", async () => {
        // Mock implementation of crypto.subtle.digest for specific inputs
        mockDigest.mockImplementation(async (algo, data) => {
            // Return a dummy buffer (e.g., 1 byte)
            return new Uint8Array([0xab]).buffer
        })

        render(<HashGeneratorPage />)

        const input = screen.getByLabelText("Input Text")
        fireEvent.change(input, { target: { value: "test" } })

        await waitFor(() => {
            // Check if MD5 field is populated (MD5 is custom, so it should work normally)
            // MD5("test") = 098f6bcd4621d373cade4e832627b4f6
            expect(screen.getByDisplayValue("098f6bcd4621d373cade4e832627b4f6")).toBeDefined()

            // Check if others are populated (mocked to 'ab')
            // 'ab' (0xab)
            const shaInputs = screen.getAllByDisplayValue("ab")
            expect(shaInputs.length).toBeGreaterThan(0)
        })
    })

    it("toggles uppercase", async () => {
        render(<HashGeneratorPage />)

        const input = screen.getByLabelText("Input Text")
        fireEvent.change(input, { target: { value: "test" } })

        const toggle = screen.getByLabelText("Uppercase Output")
        fireEvent.click(toggle)

        await waitFor(() => {
            // MD5 uppercase
            expect(screen.getByDisplayValue("098F6BCD4621D373CADE4E832627B4F6")).toBeDefined()
        })
    })

    it("copies to clipboard", async () => {
        render(<HashGeneratorPage />)

        const input = screen.getByLabelText("Input Text")
        fireEvent.change(input, { target: { value: "test" } })

        await waitFor(() => {
            expect(screen.getByDisplayValue("098f6bcd4621d373cade4e832627b4f6")).toBeDefined()
        })

        // Find copy button for MD5 (first one usually, or find by title)
        const copyButtons = screen.getAllByTitle("Copy")
        fireEvent.click(copyButtons[0])

        expect(mockWriteText).toHaveBeenCalledWith("098f6bcd4621d373cade4e832627b4f6")
    })
})
