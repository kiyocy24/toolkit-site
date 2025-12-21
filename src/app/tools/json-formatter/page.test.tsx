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

    it('shows error for invalid JSON', () => {
        render(<JsonFormatterPage />)
        const input = screen.getByPlaceholderText(/paste your json here/i)

        fireEvent.change(input, { target: { value: '{invalid}' } })
        fireEvent.click(screen.getByRole('button', { name: /^format$/i }))

        expect(screen.getByText(/Syntax Error/)).toBeInTheDocument()
        expect(screen.queryByTestId('syntax-highlighter')).not.toBeInTheDocument()
    })
})
