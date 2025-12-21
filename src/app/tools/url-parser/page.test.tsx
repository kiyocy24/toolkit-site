import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import UrlParser from "./page"

describe("UrlParser", () => {
    it("renders correctly", () => {
        render(<UrlParser />)
        expect(screen.getByText("URL Parser")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("https://example.com/path?query=1")).toBeInTheDocument()
    })

    it("parses a valid URL correctly", () => {
        render(<UrlParser />)
        const input = screen.getByPlaceholderText("https://example.com/path?query=1")
        fireEvent.change(input, { target: { value: "https://test.com:8080/foo?bar=baz#hash" } })

        expect(screen.getByDisplayValue("https:")).toBeInTheDocument() // Protocol
        expect(screen.getByDisplayValue("test.com")).toBeInTheDocument()
        expect(screen.getByDisplayValue("8080")).toBeInTheDocument()
        expect(screen.getByDisplayValue("/foo")).toBeInTheDocument()
        expect(screen.getByDisplayValue("#hash")).toBeInTheDocument()

        // Params
        expect(screen.getByDisplayValue("bar")).toBeInTheDocument()
        expect(screen.getByDisplayValue("baz")).toBeInTheDocument()
    })

    it("updates URL when component changes", () => {
        render(<UrlParser />)
        // Set initial
        const input = screen.getByPlaceholderText("https://example.com/path?query=1")
        fireEvent.change(input, { target: { value: "https://example.com" } })

        // Check initial parsed
        expect(screen.getByDisplayValue("example.com")).toBeInTheDocument()

        // Change Host
        const hostInput = screen.getByDisplayValue("example.com")
        fireEvent.change(hostInput, { target: { value: "new-host.com" } })

        // Check main input updated
        expect(input).toHaveValue("https://new-host.com/")
    })

    it("adds and removes query params", () => {
        render(<UrlParser />)
        const input = screen.getByPlaceholderText("https://example.com/path?query=1")
        fireEvent.change(input, { target: { value: "https://example.com" } })

        // Add Param
        fireEvent.click(screen.getByText("Add Param"))

        const keys = screen.getAllByPlaceholderText("Key")
        const values = screen.getAllByPlaceholderText("Value")

        fireEvent.change(keys[0], { target: { value: "foo" } })
        fireEvent.change(values[0], { target: { value: "123" } })

        expect(input).toHaveValue("https://example.com/?foo=123")

        // Remove Param
        const trash = screen.getByLabelText("Remove parameter")
        fireEvent.click(trash)

        expect(input).toHaveValue("https://example.com/")
    })
})
