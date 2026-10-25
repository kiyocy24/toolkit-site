import { render, screen, fireEvent } from "@/test/test-utils"
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

describe("ChmodCalculator (ja)", () => {
    it("renders Japanese translations", () => {
        render(<ChmodCalculator />, { locale: "ja" })
        expect(screen.getByText("Chmod 計算機")).toBeInTheDocument()
        expect(screen.getByText("所有者")).toBeInTheDocument()
        expect(screen.getAllByLabelText("書き込み (2)")).toHaveLength(3)
        expect(screen.getByLabelText("8 進数表記（例: 755）")).toHaveValue("755")
        expect(screen.getByLabelText("シンボリック表記")).toHaveValue("-rwxr-xr-x")
        expect(screen.getByTitle("コマンドをコピー")).toBeInTheDocument()
        expect(screen.getByText("仕組み")).toBeInTheDocument()
        expect(screen.getByText("読み取り (r) = 4")).toBeInTheDocument()
    })

    it("applies a preset with a Japanese label", () => {
        render(<ChmodCalculator />, { locale: "ja" })
        fireEvent.click(screen.getByRole("button", { name: "644（ファイル読み取り）" }))
        expect(screen.getByLabelText("シンボリック表記")).toHaveValue("-rw-r--r--")
    })
})
