import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import StringCaseConverter from "./page"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

describe("StringCaseConverter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders correctly", () => {
        render(<StringCaseConverter />)
        expect(screen.getByText("String Case Converter")).toBeDefined()
        expect(screen.getByLabelText("Input Text")).toBeDefined()
    })

    it("converts input to multiple cases", () => {
        render(<StringCaseConverter />)
        const input = screen.getByLabelText("Input Text")

        fireEvent.change(input, { target: { value: "Hello_World" } })

        expect(screen.getByText("helloWorld")).toBeDefined() // camel
        expect(screen.getByText("HelloWorld")).toBeDefined() // pascal
        expect(screen.getByText("hello_world")).toBeDefined() // snake
        expect(screen.getByText("hello-world")).toBeDefined() // kebab
        expect(screen.getByText("HELLO_WORLD")).toBeDefined() // constant
        expect(screen.getByText("hello.world")).toBeDefined() // dot
        expect(screen.getByText("hello/world")).toBeDefined() // path
        expect(screen.getByText("Hello world")).toBeDefined() // sentence
        expect(screen.getByText("Hello World")).toBeDefined() // title
        expect(screen.getByText("hello world")).toBeDefined() // lower
        expect(screen.getByText("HELLO WORLD")).toBeDefined() // upper
    })

    it("handles camelCase input", () => {
        render(<StringCaseConverter />)
        const input = screen.getByLabelText("Input Text")

        fireEvent.change(input, { target: { value: "camelCaseValues" } })

        expect(screen.getByText("camel_case_values")).toBeDefined() // snake
        expect(screen.getByText("CamelCaseValues")).toBeDefined() // pascal
    })

    it("handles empty input", () => {
        render(<StringCaseConverter />)
        const input = screen.getByLabelText("Input Text")

        // Change to something then empty
        fireEvent.change(input, { target: { value: "test" } })
        fireEvent.change(input, { target: { value: "" } })

        // Cards should disappear
        expect(screen.queryByText("camelCase")).toBeNull()
    })

    it("copies to clipboard", async () => {
        render(<StringCaseConverter />)
        const input = screen.getByLabelText("Input Text")

        fireEvent.change(input, { target: { value: "copy-me" } })

        // Find copy button for camelCase (first card usually)
        // We can find by title
        const copyBtn = screen.getByTitle("Copy camelCase")
        fireEvent.click(copyBtn)

        expect(mockWriteText).toHaveBeenCalledWith("copyMe")
    })
})
