import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import CollatzConjecturePage from "./page"

describe("CollatzConjecturePage", () => {
    it("renders correctly", () => {
        render(<CollatzConjecturePage />)
        expect(screen.getByText("Collatz Conjecture")).toBeDefined()
        expect(screen.getByLabelText("Starting Number")).toBeDefined()
    })

    it("calculates correct sequence for input 6", () => {
        render(<CollatzConjecturePage />)
        const input = screen.getByLabelText("Starting Number")
        fireEvent.change(input, { target: { value: "6" } })
        fireEvent.click(screen.getByText("Calculate"))

        // Sequence for 6: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1 (8 steps)
        // Table should have 9 rows including implicit initial state 0 (step 0..8)
        expect(screen.getByText("Steps")).toBeDefined()
        const stepCounts = screen.getAllByText("8")
        expect(stepCounts.length).toBeGreaterThanOrEqual(1) // Total steps or value

        // Check for presence of some values in the table
        expect(screen.getAllByText("6")).toBeDefined() // Initial
        expect(screen.getAllByText("3")).toBeDefined()
        expect(screen.getAllByText("10")).toBeDefined()
        expect(screen.getAllByText("1")).toBeDefined()
    })

    it("displays error for invalid input", () => {
        render(<CollatzConjecturePage />)
        const input = screen.getByLabelText("Starting Number")
        fireEvent.change(input, { target: { value: "-5" } })
        fireEvent.click(screen.getByText("Calculate"))

        expect(screen.getByText("Please enter a valid positive integer.")).toBeDefined()
    })

    it("displays error for zero input", () => {
        render(<CollatzConjecturePage />)
        const input = screen.getByLabelText("Starting Number")
        fireEvent.change(input, { target: { value: "0" } })
        fireEvent.click(screen.getByText("Calculate"))

        expect(screen.getByText("Please enter an integer greater than 0.")).toBeDefined()
    })

    it("displays max value correctly", () => {
        render(<CollatzConjecturePage />)
        const input = screen.getByLabelText("Starting Number")
        // Sequence for 3: 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1
        // Max value is 16
        fireEvent.change(input, { target: { value: "3" } })
        fireEvent.click(screen.getByText("Calculate"))

        expect(screen.getByText("Max Value")).toBeDefined()
        // 16 appears in the Max Value card AND in the sequence table.
        const maxValues = screen.getAllByText("16")
        expect(maxValues.length).toBeGreaterThanOrEqual(2)
    })
})
