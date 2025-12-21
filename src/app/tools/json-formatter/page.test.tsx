import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import JsonFormatterPage from './page'

// Mock SyntaxHighlighter to avoid issues with Prism in jsdom and simplify testing
vi.mock('react-syntax-highlighter', () => {
    return {
        Prism: ({ children }: { children: string }) => <pre data-testid="syntax-highlighter">{children}</pre>,
    }
})

// Mock styles
vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
    vscDarkPlus: {},
}))

describe('JsonFormatterPage', () => {
    it('renders the component correctly', () => {
        render(<JsonFormatterPage />)
        expect(screen.getByText('JSON Formatter')).toBeInTheDocument()
    })

    it('formats valid JSON', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        fireEvent.change(input, { target: { value: '{"a":1}' } })
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        const output = screen.getByTestId('syntax-highlighter')
        expect(output).toHaveTextContent(/{\s+"a": 1\s+}/)
    })

    it('minifies valid JSON', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        fireEvent.change(input, { target: { value: '{\n  "a": 1\n}' } })
        fireEvent.click(screen.getByRole('button', { name: /^minify$/i }))

        const output = screen.getByTestId('syntax-highlighter')
        expect(output).toHaveTextContent('{"a":1}')
    })

    it('shows detailed error for V8/Chrome format', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        // Mock JSON.parse to throw V8 style error
        const originalJsonParse = JSON.parse
        JSON.parse = vi.fn().mockImplementation(() => {
            throw new SyntaxError("Unexpected token } in JSON at position 10")
        })

        fireEvent.change(input, { target: { value: '{"a": 1\n  }' } }) // input doesn't matter much as we mock parse
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        // Line 2 (since position 10 in "{"a": 1\n  }" is on second line likely, but let's trust the calc)
        // Actually, the calculation depends on the input string passed to getErrorDetails.
        // If we mock JSON.parse, we should make sure the input state matches what we expect for the position.
        // "{"a": 1\n  }" -> length is small.
        // valid input: `{"a": 1\n  }` -> 01234567 8 9 10
        // `\n` is pos 7 (if "{"a": 1\n..." )
        // Let's just use a simple string matching the position.
        // Input: "1234567890\n123"
        // Position 10 is the newline.

        // We asserted regex /Syntax Error.*Line.*Column/ previously.
        // Now let's be more specific or just ensure it contains line info.
        expect(screen.getByText(/Syntax Error:.*\(Line \d+, Column \d+\)/)).toBeInTheDocument()

        JSON.parse = originalJsonParse
    })

    it('shows detailed error for Firefox format', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        // Mock JSON.parse to throw Firefox style error
        const originalJsonParse = JSON.parse
        JSON.parse = vi.fn().mockImplementation(() => {
            throw new SyntaxError("JSON.parse: unexpected character at line 1 column 2 of the JSON data")
        })

        fireEvent.change(input, { target: { value: '{invalid}' } })
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        expect(screen.getByText(/Syntax Error:.*\(Line 1, Column 2\)/)).toBeInTheDocument()

        JSON.parse = originalJsonParse
    })

    it('shows generic Syntax Error if no position info', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        const originalJsonParse = JSON.parse
        JSON.parse = vi.fn().mockImplementation(() => {
            throw new SyntaxError("Just a syntax error")
        })

        fireEvent.change(input, { target: { value: '{invalid}' } })
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        expect(screen.getByText("Syntax Error: Just a syntax error")).toBeInTheDocument()

        JSON.parse = originalJsonParse
    })

    it('shows Invalid JSON for non-SyntaxError', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        const originalJsonParse = JSON.parse
        JSON.parse = vi.fn().mockImplementation(() => {
            throw new Error("Random Error")
        })

        fireEvent.change(input, { target: { value: '{invalid}' } })
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        expect(screen.getByText("Invalid JSON")).toBeInTheDocument()

        JSON.parse = originalJsonParse
    })
})
