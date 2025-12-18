import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ChmodCalculator from "./page"

describe("ChmodCalculator", () => {
    it("renders correctly", () => {
        render(<ChmodCalculator />)
        expect(screen.getByText("Chmod Calculator")).toBeInTheDocument()
        expect(screen.getByLabelText("Octal Notation (e.g. 755)")).toHaveValue("755")
        expect(screen.getByLabelText("Symbolic Notation")).toHaveValue("-rwxr-xr-x")
    })

    it("updates octal when checkbox is clicked", () => {
        render(<ChmodCalculator />)
        // Initial 755 (Owner: rwx, Group: rx, Public: rx)
        // Click Owner Write (should toggle off -> 555)
        const ownerWrite = screen.getAllByLabelText("Write (2)")[0]
        fireEvent.click(ownerWrite)

        expect(screen.getByLabelText("Octal Notation (e.g. 755)")).toHaveValue("555")
        expect(screen.getByLabelText("Symbolic Notation")).toHaveValue("-r-xr-xr-x")
    })

    it("updates checkboxes when octal input changes", () => {
        render(<ChmodCalculator />)
        const octalInput = screen.getByLabelText("Octal Notation (e.g. 755)")
        fireEvent.change(octalInput, { target: { value: "777" } })

        expect(octalInput).toHaveValue("777")
        expect(screen.getByLabelText("Symbolic Notation")).toHaveValue("-rwxrwxrwx")

        // Check if all checkboxes are checked
        const checkboxes = screen.getAllByRole("checkbox")
        checkboxes.forEach(cb => expect(cb).toBeChecked())
    })

    it("handles preset clicks", () => {
        render(<ChmodCalculator />)
        const preset644 = screen.getByText("644 (File Read)")
        fireEvent.click(preset644)

        expect(screen.getByLabelText("Octal Notation (e.g. 755)")).toHaveValue("644")
        expect(screen.getByLabelText("Symbolic Notation")).toHaveValue("-rw-r--r--")
    })
})
