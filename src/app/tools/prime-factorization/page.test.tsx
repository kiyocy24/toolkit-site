import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import PrimeFactorizationPage from "./page"

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
    },
    writable: true,
});

describe("PrimeFactorizationPage", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("renders correctly", () => {
        render(<PrimeFactorizationPage />)
        expect(screen.getByText("Prime Factorization")).toBeDefined()
        expect(screen.getByLabelText("Number")).toBeDefined()
    })

    it("calculates prime factors correctly for 12", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "12" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("2^2 × 3")).toBeDefined()
        })
    })

    it("calculates prime factors correctly for a prime number and shows badge", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "13" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("13")).toBeDefined()
            expect(screen.getByText("Prime Number")).toBeDefined()
        })
    })

    it("calculates prime factors correctly for 100", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "100" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("2^2 × 5^2")).toBeDefined()
        })
    })

    it("calculates large numbers (safe integer range)", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        // 9007199254740992 = 2^53
        fireEvent.change(input, { target: { value: "9007199254740992" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("2^53")).toBeDefined()
        })
    })

    it("calculates large numbers (BigInt range)", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        // 2^64 = 18446744073709551616
        fireEvent.change(input, { target: { value: "18446744073709551616" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("2^64")).toBeDefined()
        })
    })

    it("shows error for invalid input", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "-5" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("Please enter an integer greater than 1.")).toBeDefined()
        })
    })

    it("shows error for non-integer input", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "12.5" } })
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("Please enter a valid integer.")).toBeDefined()
        })
    })

    it("shows error for input larger than 20 digits", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "123456789012345678901" } }) // 21 digits
        fireEvent.click(screen.getByText("Factorize"))

        await waitFor(() => {
            expect(screen.getByText("Input is too large. Please enter an integer with 20 digits or fewer.")).toBeDefined()
        })
    })

    it("shows processing warning for input larger than 15 digits", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        // 16 digits: 1000000000000000
        fireEvent.change(input, { target: { value: "1000000000000000" } })
        fireEvent.click(screen.getByText("Factorize"))

        // Warning should appear immediately
        expect(screen.getByText("Calculating... Large numbers may take some time.")).toBeDefined()

        // Then result should eventually appear
        await waitFor(() => {
            expect(screen.getByText("2^15 × 5^15")).toBeDefined()
        })
    })

    it("copies result to clipboard", async () => {
        render(<PrimeFactorizationPage />)
        const input = screen.getByLabelText("Number")
        fireEvent.change(input, { target: { value: "7" } })
        fireEvent.click(screen.getByText("Factorize"))

        const copyButton = await waitFor(() => screen.getByRole("button", { name: "Copy result" }))
        fireEvent.click(copyButton)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("7")
        expect(await screen.findByRole("button", { name: "Result copied" })).toBeDefined()
    })
})

