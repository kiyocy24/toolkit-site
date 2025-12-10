import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DiffViewerPage from './page'

describe('DiffViewerPage', () => {
    it('renders the component correctly', () => {
        render(<DiffViewerPage />)
        expect(screen.getByText('Diff Viewer')).toBeInTheDocument()
        expect(screen.getByLabelText(/original text/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/modified text/i)).toBeInTheDocument()
    })

    it('compares texts and shows differences', () => {
        render(<DiffViewerPage />)

        const originalInput = screen.getByLabelText(/original text/i)
        const modifiedInput = screen.getByLabelText(/modified text/i)

        fireEvent.change(originalInput, { target: { value: 'foo' } })
        fireEvent.change(modifiedInput, { target: { value: 'bar' } })

        fireEvent.click(screen.getByRole('button', { name: /compare/i }))

        expect(screen.getByText('Differences')).toBeInTheDocument()
        // We expect 'foo' to be removed and 'bar' to be added
        // Note: 'foo' exists in input and diff view, so we check for existence generally or scoped
        const diffSection = screen.getByText('Differences').parentElement!
        // We can check if specific diff spans exist
        // But for simplicity, just checking getAllByText is enough to prove it's rendered SOMEWHERE (and we know input has it, but diff view should also have it)
        // Better: check that we have MORE instances of 'foo' now?
        // Actually, the specific spans have output styles.
        // Let's just check getAllByText returns > 1 or contains one in the result area.

        const differencesContainer = screen.getByText('Differences').nextElementSibling
        expect(differencesContainer).toHaveTextContent('foo')
        expect(differencesContainer).toHaveTextContent('bar')
    })

    it('clears all fields', () => {
        render(<DiffViewerPage />)

        const originalInput = screen.getByLabelText(/original text/i)
        fireEvent.change(originalInput, { target: { value: 'foo' } })

        fireEvent.click(screen.getByRole('button', { name: /clear/i }))

        expect(originalInput).toHaveValue('')
        expect(screen.queryByText('Differences')).not.toBeInTheDocument()
    })
})
