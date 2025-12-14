import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import QrCodeGeneratorPage from "./page"

// Mock qrcode.react since it renders specific SVG structure
vi.mock("qrcode.react", () => ({
    QRCodeSVG: ({ value, size }: { value: string; size: number }) => (
        <svg data-testid="qr-code-svg" width={size} height={size}>
            <text>{value}</text>
        </svg>
    ),
}))

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
})
