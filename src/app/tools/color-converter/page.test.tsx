import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ColorConverterPage from "./page"

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

describe("ColorConverterPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders correctly", () => {
        render(<ColorConverterPage />)
        expect(screen.getByText("Color Converter")).toBeDefined()
        expect(screen.getByLabelText("Pick a color")).toBeDefined()
    })

    it("updates formats when HEX is changed", () => {
        render(<ColorConverterPage />)
        const hexInput = screen.getByPlaceholderText("#000000")

        // Change HEX to Red
        fireEvent.change(hexInput, { target: { value: "#ff0000" } })

        // Check RGB inputs (using getAllByDisplayValue might be safer if DOM structure is complex, but inputs are controlled)
        // RGB
        const inputs = screen.getAllByRole("spinbutton")
        // Mapping of expected values is tricky with just 'spinbutton', let's find by finding local scope if possible, 
        // or just checking if values exist in the specific inputs.
        // But simple way: Check if inputs with value 255 and 0 exist correctly.

        // We can verify by finding the inputs specifically.
        // Since we didn't add labels mapped efficiently in test, let's just check if display updates.
        // Actually, we can check value updates directly on inputs if we can identify them.
        // But for unit test, assuming functional correctness of 'colord' is safe, we check if UI triggers state update.

        // Let's rely on checking if the value of specific RGB input matches.
        // We know structure: RGB section has 3 inputs.
        // Simplest: Check if RGB R input has 255.
        // We can access them by index if order is fixed.
        // Order: RGB (r, g, b), then HSL (h, s, l), then CMYK (c, m, y, k)

        expect((inputs[0] as HTMLInputElement).value).toBe("255") // R
        expect((inputs[1] as HTMLInputElement).value).toBe("0")   // G
        expect((inputs[2] as HTMLInputElement).value).toBe("0")   // B
    })

    it("updates formats when RGB is changed", () => {
        render(<ColorConverterPage />)
        const inputs = screen.getAllByRole("spinbutton")

        // Change G to 255 (making it Lime #00FF00) - RGB inputs are index 0, 1, 2
        fireEvent.change(inputs[1], { target: { value: "255" } })

        const hexInput = screen.getByPlaceholderText("#000000") as HTMLInputElement
        expect(hexInput.value.toLowerCase()).toBe("#3bfff6")
    })

    it("copies content to clipboard", () => {
        render(<ColorConverterPage />)
        const hexInput = screen.getByPlaceholderText("#000000")
        fireEvent.change(hexInput, { target: { value: "#ffffff" } }) // White

        const copyButtons = screen.getAllByTitle(/Copy/i)
        // First one is usually HEX copy
        fireEvent.click(copyButtons[0])

        expect(mockWriteText).toHaveBeenCalledWith("#ffffff")
    })
})
