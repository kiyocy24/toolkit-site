import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import GcdLcmCalculatorPage from "./page";

describe("GCD/LCM Calculator", () => {
    it("renders correctly", () => {
        render(<GcdLcmCalculatorPage />);
        expect(screen.getByText("GCD/LCM Calculator")).toBeInTheDocument();
        expect(screen.getByLabelText("Numbers")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Calculate" })).toBeInTheDocument();
    });

    it("calculates GCD and LCM for two numbers correctly", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await userEvent.type(input, "12, 18");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("6")).toBeInTheDocument(); // GCD
            expect(screen.getByText("36")).toBeInTheDocument(); // LCM
        });
    });

    it("calculates GCD and LCM for multiple numbers space separated", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await userEvent.type(input, "8 12 16");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("4")).toBeInTheDocument(); // GCD
            expect(screen.getByText("48")).toBeInTheDocument(); // LCM
        });
    });

    it("handles single number input with error", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await userEvent.type(input, "123");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Please enter at least two numbers.")).toBeInTheDocument();
        });
    });

    it("handles invalid non-numeric input", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await userEvent.type(input, "12, abc");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Invalid input: "abc" is not a valid integer.')).toBeInTheDocument();
        });
    });

    it("handles negative numbers with error", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await userEvent.type(input, "12, -5");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Please enter positive integers.")).toBeInTheDocument();
        });
    });

    it("triggers calculation on Enter key", async () => {
        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");

        await userEvent.type(input, "12, 18{enter}");

        await waitFor(() => {
            expect(screen.getByText("6")).toBeInTheDocument();
        });
    });

    it("copies result to clipboard", async () => {
        const user = userEvent.setup();
        const writeTextMock = vi.fn().mockImplementation(() => Promise.resolve());

        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: writeTextMock,
            },
            writable: true,
        });

        render(<GcdLcmCalculatorPage />);
        const input = screen.getByLabelText("Numbers");
        const button = screen.getByRole("button", { name: "Calculate" });

        await user.type(input, "12, 18");
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText("6")).toBeInTheDocument();
        });

        // Find copy buttons - there should be two (one for GCD, one for LCM)
        const copyButtons = screen.getAllByRole("button", { name: /Copy/i });
        expect(copyButtons).toHaveLength(2);

        await user.click(copyButtons[0]);

        expect(writeTextMock).toHaveBeenCalledWith("6");

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /GCD copied/i })).toBeInTheDocument();
        });
    });
});
