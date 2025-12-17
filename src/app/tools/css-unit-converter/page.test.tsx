import { render, screen, fireEvent } from "@testing-library/react"
import CssUnitConverterPage from "./page"
import { describe, it, expect } from "vitest"

describe("CssUnitConverterPage", () => {
    it("renders correctly", () => {
        render(<CssUnitConverterPage />)
        expect(screen.getByText("CSS Unit Converter")).toBeDefined()
        expect(screen.getByLabelText("Root Font Size (px)")).toBeDefined()
    })

    it("initializes with default values", () => {
        render(<CssUnitConverterPage />)
        expect(screen.getByLabelText("Root Font Size (px)")).toHaveValue(16)
        expect(screen.getByLabelText("Pixels (px)")).toHaveValue(16)
        expect(screen.getByLabelText("REM")).toHaveValue(1)
        expect(screen.getByLabelText("EM")).toHaveValue(1)
    })

    it("updates values when Pixels input changes", () => {
        render(<CssUnitConverterPage />)
        const pxInput = screen.getByLabelText("Pixels (px)")

        fireEvent.change(pxInput, { target: { value: "32" } })

        expect(screen.getByLabelText("REM")).toHaveValue(2) // 32 / 16 = 2
        expect(screen.getByLabelText("EM")).toHaveValue(2)
    })

    it("updates values when REM input changes", () => {
        render(<CssUnitConverterPage />)
        const remInput = screen.getByLabelText("REM")

        fireEvent.change(remInput, { target: { value: "2" } })

        expect(screen.getByLabelText("Pixels (px)")).toHaveValue(32) // 2 * 16 = 32
        expect(screen.getByLabelText("EM")).toHaveValue(2)
    })

    it("updates values when EM input changes", () => {
        render(<CssUnitConverterPage />)
        const emInput = screen.getByLabelText("EM")

        fireEvent.change(emInput, { target: { value: "0.5" } })

        expect(screen.getByLabelText("Pixels (px)")).toHaveValue(8) // 0.5 * 16 = 8
        expect(screen.getByLabelText("REM")).toHaveValue(0.5)
    })

    it("updates values when Root Font Size changes", () => {
        render(<CssUnitConverterPage />)
        const rootInput = screen.getByLabelText("Root Font Size (px)")

        // Change root from 16 to 10. 
        // Note: Current px is 16. So 16 / 10 = 1.6 rem.
        fireEvent.change(rootInput, { target: { value: "10" } })

        expect(screen.getByLabelText("Pixels (px)")).toHaveValue(16)
        expect(screen.getByLabelText("REM")).toHaveValue(1.6)
        expect(screen.getByLabelText("EM")).toHaveValue(1.6)
    })

    it("handles invalid inputs gracefully", () => {
        render(<CssUnitConverterPage />)
        const pxInput = screen.getByLabelText("Pixels (px)")

        fireEvent.change(pxInput, { target: { value: "" } })

        expect(screen.getByLabelText("REM")).toHaveValue(null)
        expect(screen.getByLabelText("EM")).toHaveValue(null)
    })
})
