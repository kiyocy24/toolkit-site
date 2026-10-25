import { render, screen, fireEvent } from "@/test/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import LoremIpsumGeneratorPage from "./page"
import * as loremIpsum from "@/lib/lorem-ipsum"

vi.mock("@/lib/lorem-ipsum", () => ({
    generateLoremIpsum: vi.fn(),
}))

// Mock clipboard
const mockWriteText = vi.fn()
Object.defineProperty(navigator, "clipboard", {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
})

describe("LoremIpsumGeneratorPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(loremIpsum.generateLoremIpsum).mockReturnValue("Lorem ipsum dolor sit amet.")
    })

    it("renders the component correctly", () => {
        render(<LoremIpsumGeneratorPage />)
        expect(screen.getByText("Lorem Ipsum Generator")).toBeInTheDocument()
        expect(screen.getByText("Generate dummy text for your layouts.")).toBeInTheDocument()
        expect(screen.getByLabelText("Count")).toHaveValue(3)
        expect(screen.getByText("Unit")).toBeInTheDocument()
        expect(screen.getByText("Language")).toBeInTheDocument()
        expect(screen.getByText("Paragraphs")).toBeInTheDocument()
        expect(screen.getByText("English")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Generated text will appear here...")).toBeInTheDocument()
    })

    it("generates text on load with default options", () => {
        render(<LoremIpsumGeneratorPage />)
        expect(loremIpsum.generateLoremIpsum).toHaveBeenCalledWith(3, "english", "paragraphs")
        expect(screen.getByLabelText("Generated Text")).toHaveValue("Lorem ipsum dolor sit amet.")
    })

    it("regenerates text with the selected count", () => {
        render(<LoremIpsumGeneratorPage />)
        vi.mocked(loremIpsum.generateLoremIpsum).mockReturnValue("Five words of lorem ipsum.")

        fireEvent.change(screen.getByLabelText("Count"), { target: { value: "5" } })
        fireEvent.click(screen.getByRole("button", { name: "Generate" }))

        expect(loremIpsum.generateLoremIpsum).toHaveBeenLastCalledWith(5, "english", "paragraphs")
        expect(screen.getByLabelText("Generated Text")).toHaveValue("Five words of lorem ipsum.")
    })

    it("copies generated text to the clipboard", () => {
        render(<LoremIpsumGeneratorPage />)
        fireEvent.click(screen.getByRole("button", { name: "Copy" }))
        expect(mockWriteText).toHaveBeenCalledWith("Lorem ipsum dolor sit amet.")
    })
})

describe("LoremIpsumGeneratorPage (ja)", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(loremIpsum.generateLoremIpsum).mockReturnValue("吾輩は猫である。")
    })

    it("renders Japanese translations", () => {
        render(<LoremIpsumGeneratorPage />, { locale: "ja" })
        expect(screen.getByText("Lorem Ipsum Generator")).toBeInTheDocument()
        expect(screen.getByText("レイアウト確認用のダミーテキストを生成します。")).toBeInTheDocument()
        expect(screen.getByLabelText("生成数")).toBeInTheDocument()
        expect(screen.getByText("単位")).toBeInTheDocument()
        expect(screen.getByText("言語")).toBeInTheDocument()
        expect(screen.getByText("段落")).toBeInTheDocument()
        expect(screen.getByText("英語")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "生成" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "コピー" })).toBeInTheDocument()
        expect(screen.getByLabelText("生成されたテキスト")).toHaveValue("吾輩は猫である。")
    })
})
