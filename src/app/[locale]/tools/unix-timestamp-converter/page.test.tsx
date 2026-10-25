import { render, screen, fireEvent, act } from "@/test/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import UnixTimestampConverterPage from "./page";

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
    },
    writable: true,
});

// Mock ResizeObserver for shadcn select
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock ScrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("UnixTimestampConverterPage", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders correctly", () => {
        const now = 1700000000000;
        vi.useFakeTimers();
        vi.setSystemTime(now);

        render(<UnixTimestampConverterPage />);

        expect(screen.getByText("Unix Timestamp Converter")).toBeDefined();
        // Default Timezone
        expect(screen.getByText("UTC (Coordinated Universal Time)")).toBeDefined();
        expect(screen.queryByText("Milliseconds (Seconds)")).toBeNull(); // Should be removed or not present
    });

    it("updates timestamp every second", () => {
        vi.useFakeTimers();
        vi.setSystemTime(1700000000000);
        render(<UnixTimestampConverterPage />);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText("1700000001")).toBeDefined();
    });

    it("converts seconds to date", async () => {
        render(<UnixTimestampConverterPage />);

        const input = screen.getByPlaceholderText("1700000000");
        const convertBtn = screen.getByRole("button", { name: "Convert" });

        fireEvent.change(input, { target: { value: "1700000000" } });
        fireEvent.click(convertBtn);

        // Check for Table headers or content
        expect(screen.getByText("Unix Timestamp")).toBeDefined();
        expect(screen.getByText("Date (UTC)")).toBeDefined();
        expect(screen.getByText("ISO 8601")).toBeDefined();

        // Content check
        // We check for ISO string segment to be locale-independent
        expect(screen.getByText(/2023-11-14T22:13:20/)).toBeDefined();
        expect(screen.getByText("ISO 8601")).toBeDefined();
    });

    it("converts date string to timestamp", async () => {
        render(<UnixTimestampConverterPage />);

        // Switch input type
        const dateType = screen.getByLabelText("Date String");
        fireEvent.click(dateType);

        const input = screen.getByPlaceholderText("2024-01-01T00:00:00Z");
        const convertBtn = screen.getByRole("button", { name: "Convert" });

        fireEvent.change(input, { target: { value: "2023-11-14T22:13:20Z" } });
        fireEvent.click(convertBtn);

        // 1700000000
        expect(screen.getByText("1700000000")).toBeDefined();
    });
});

describe("UnixTimestampConverterPage (ja)", () => {
    it("renders Japanese translations", () => {
        render(<UnixTimestampConverterPage />, { locale: "ja" });

        expect(screen.getByText("Unix Timestamp Converter")).toBeDefined();
        expect(screen.getByText("UTC（協定世界時）")).toBeDefined();
        expect(screen.getByText("入力形式")).toBeDefined();
        expect(screen.getByLabelText("日時文字列")).toBeDefined();
        expect(screen.getByRole("button", { name: "変換" })).toBeDefined();
    });

    it("shows Japanese result labels and error message", () => {
        render(<UnixTimestampConverterPage />, { locale: "ja" });

        const input = screen.getByPlaceholderText("1700000000");
        const convertBtn = screen.getByRole("button", { name: "変換" });

        fireEvent.change(input, { target: { value: "1700000000" } });
        fireEvent.click(convertBtn);
        expect(screen.getByText("変換結果")).toBeDefined();
        expect(screen.getByText("日時（UTC）")).toBeDefined();
        expect(screen.getByText("相対時間")).toBeDefined();

        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.click(convertBtn);
        expect(screen.getByText("入力が無効です。形式を確認してください。")).toBeDefined();
    });
});
