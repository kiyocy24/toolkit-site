import { render, screen, fireEvent } from "@/test/test-utils";
import { describe, it, expect, vi } from "vitest";
import UrlEncoderDecoderPage from "./page";

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
    },
    writable: true,
});

describe("UrlEncoderDecoderPage", () => {
    it("renders correctly", () => {
        render(<UrlEncoderDecoderPage />);
        expect(screen.getByText("URL Encoder / Decoder")).toBeDefined();
        expect(screen.getByPlaceholderText("Enter text to encode or decode...")).toBeDefined();
        expect(screen.getByRole("button", { name: "Encode" })).toBeDefined();
        expect(screen.getByRole("button", { name: "Decode" })).toBeDefined();
    });

    it("encodes text correctly", () => {
        render(<UrlEncoderDecoderPage />);
        const input = screen.getByPlaceholderText("Enter text to encode or decode...");

        fireEvent.change(input, { target: { value: "hello world" } });
        fireEvent.click(screen.getByRole("button", { name: "Encode" }));

        const output = screen.getByDisplayValue("hello%20world");
        expect(output).toBeDefined();
    });

    it("decodes text correctly", () => {
        render(<UrlEncoderDecoderPage />);
        const input = screen.getByPlaceholderText("Enter text to encode or decode...");

        fireEvent.change(input, { target: { value: "hello%20world" } });
        fireEvent.click(screen.getByRole("button", { name: "Decode" }));

        const output = screen.getByDisplayValue("hello world");
        expect(output).toBeDefined();
    });

    it("handles empty input gracefully", () => {
        render(<UrlEncoderDecoderPage />);

        fireEvent.click(screen.getByRole("button", { name: "Encode" }));

        // Should not show error or output
        expect(screen.queryByText("Error encoding URL")).toBeNull();
    });

    it("shows error for invalid decode input", () => {
        render(<UrlEncoderDecoderPage />);
        const input = screen.getByPlaceholderText("Enter text to encode or decode...");

        // Invalid URI encoding
        fireEvent.change(input, { target: { value: "%" } });
        fireEvent.click(screen.getByRole("button", { name: "Decode" }));

        expect(screen.getByText("Error decoding URL: Invalid URI component")).toBeDefined();
    });

    it("clears input and output", () => {
        render(<UrlEncoderDecoderPage />);
        const input = screen.getByPlaceholderText("Enter text to encode or decode...");

        fireEvent.change(input, { target: { value: "test" } });
        fireEvent.click(screen.getByRole("button", { name: "Encode" }));

        fireEvent.click(screen.getByRole("button", { name: "Clear" }));

        expect((input as HTMLTextAreaElement).value).toBe("");
        expect(screen.queryByDisplayValue("test")).toBeNull();
    });
});

describe("UrlEncoderDecoderPage (ja)", () => {
    it("renders Japanese translations", () => {
        render(<UrlEncoderDecoderPage />, { locale: "ja" });
        expect(screen.getByText("URL エンコード/デコード")).toBeDefined();
        expect(screen.getByText("入力テキスト")).toBeDefined();
        expect(screen.getByPlaceholderText("エンコードまたはデコードするテキストを入力...")).toBeDefined();
        expect(screen.getByRole("button", { name: "エンコード" })).toBeDefined();
        expect(screen.getByRole("button", { name: "デコード" })).toBeDefined();
        expect(screen.getByRole("button", { name: "クリア" })).toBeDefined();
    });

    it("shows a Japanese error message for invalid input", () => {
        render(<UrlEncoderDecoderPage />, { locale: "ja" });
        const input = screen.getByPlaceholderText("エンコードまたはデコードするテキストを入力...");
        fireEvent.change(input, { target: { value: "%" } });
        fireEvent.click(screen.getByRole("button", { name: "デコード" }));
        expect(screen.getByText("URL のデコードに失敗しました: 無効な URI コンポーネントです")).toBeDefined();
    });
});
