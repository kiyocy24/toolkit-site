import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import PrimeFactorizationPage from "./page"

describe("PrimeFactorizationPage", () => {
    it("renders correctly", () => {
        render(<PrimeFactorizationPage />)
        expect(screen.getByText("Prime Factorization")).toBeDefined()
        expect(screen.getByLabelText("Number")).toBeDefined()
    })

    it("calculates prime factors correctly for 12", () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "12" } })
        fireEvent.click(screen.getByText("Factorize"))

        expect(screen.getByText("2^2 × 3")).toBeDefined()
    })

    it("calculates prime factors correctly for a prime number", () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "13" } })
        fireEvent.click(screen.getByText("Factorize"))

        expect(screen.getByText("13")).toBeDefined()
    })

    it("calculates prime factors correctly for 100", () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "100" } })
        fireEvent.click(screen.getByText("Factorize"))

        expect(screen.getByText("2^2 × 5^2")).toBeDefined()
    })

    it("shows error for invalid input", () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "-5" } })
        fireEvent.click(screen.getByText("Factorize"))

        expect(screen.getByText("Please enter an integer greater than 1.")).toBeDefined()
    })

    it("shows error for non-integer input", () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "12.5" } })
        fireEvent.click(screen.getByText("Factorize"))

        expect(screen.getByText("Please enter a valid integer.")).toBeDefined()
    })
})
