import { render, screen, fireEvent } from "@/test/test-utils"
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
        const stepsLabel = screen.getByText("Steps")
        expect(stepsLabel.nextElementSibling).toHaveTextContent("8") // Total steps

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

        const maxValLabel = screen.getByText("Max Value")
        expect(maxValLabel.nextElementSibling).toHaveTextContent("16")
    })
})

describe("CollatzConjecturePage (ja)", () => {
    it("renders Japanese translations", () => {
        render(<CollatzConjecturePage />, { locale: "ja" })
        expect(screen.getByText("Collatz Conjecture")).toBeDefined()
        expect(screen.getByLabelText("開始値")).toBeDefined()
        expect(screen.getByPlaceholderText("例: 27")).toBeDefined()
        expect(screen.getByRole("button", { name: "計算" })).toBeDefined()
    })

    it("shows Japanese result labels", () => {
        render(<CollatzConjecturePage />, { locale: "ja" })
        fireEvent.change(screen.getByLabelText("開始値"), { target: { value: "6" } })
        fireEvent.click(screen.getByRole("button", { name: "計算" }))

        expect(screen.getByText("ステップ数").nextElementSibling).toHaveTextContent("8")
        expect(screen.getByText("最大値")).toBeDefined()
        expect(screen.getByText("操作")).toBeDefined()
        expect(screen.getByText("初期値")).toBeDefined()
    })

    it("shows Japanese error messages", () => {
        render(<CollatzConjecturePage />, { locale: "ja" })
        const input = screen.getByLabelText("開始値")
        fireEvent.change(input, { target: { value: "-5" } })
        fireEvent.click(screen.getByRole("button", { name: "計算" }))
        expect(screen.getByText("エラー")).toBeDefined()
        expect(screen.getByText("有効な正の整数を入力してください。")).toBeDefined()

        fireEvent.change(input, { target: { value: "0" } })
        fireEvent.click(screen.getByRole("button", { name: "計算" }))
        expect(screen.getByText("0 より大きい整数を入力してください。")).toBeDefined()
    })
})
