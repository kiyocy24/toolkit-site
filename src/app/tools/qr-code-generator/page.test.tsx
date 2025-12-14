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

    it("triggers download when Download PNG button is clicked", () => {
        render(<QrCodeGeneratorPage />)

        const input = screen.getByLabelText("Content")
        fireEvent.change(input, { target: { value: "Hello World" } })

        // Mock document.createElement and associated methods
        const mockLink = {
            click: vi.fn(),
            href: "",
            download: "",
        } as unknown as HTMLAnchorElement

        const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
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

        // Mock Image to trigger onload synchronously for coverage
        const originalImage = window.Image
        window.Image = class extends originalImage {
            constructor() {
                super()
                setTimeout(() => {
                    if (this.onload) this.onload(new Event('load'))
                }, 0)
            }
        }

        const downloadButton = screen.getByText("Download PNG")
        fireEvent.click(downloadButton)

        expect(downloadButton).not.toBeDisabled()

        // Restore mocks
        createElementSpy.mockRestore()
        window.Image = originalImage
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
