import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MarkdownPreviewerPage from './page'

// Mock react-markdown and remark-gfm
vi.mock('react-markdown', () => {
    return {
        default: ({ children }: { children: string }) => <div data-testid="markdown-preview">{children}</div>,
    }
})

vi.mock('remark-gfm', () => ({
    default: () => 'remark-gfm-mock'
}))

describe('MarkdownPreviewerPage', () => {
    it('renders the component correctly', () => {
        render(<MarkdownPreviewerPage />)
        expect(screen.getByText('Editor')).toBeInTheDocument()
        expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    it('updates preview when typing', () => {
        render(<MarkdownPreviewerPage />)
        const textarea = screen.getByPlaceholderText('Type your markdown here...')
        const preview = screen.getByTestId('markdown-preview')

        fireEvent.change(textarea, { target: { value: '# New Title' } })
        expect(preview).toHaveTextContent('# New Title')
    })

    it('clears content when clear button is clicked', () => {
        render(<MarkdownPreviewerPage />)
        const textarea = screen.getByPlaceholderText('Type your markdown here...')
        const clearButton = screen.getByRole('button', { name: /clear/i })

        fireEvent.click(clearButton)
        expect(textarea).toHaveValue('')
    })
})
