import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
});
