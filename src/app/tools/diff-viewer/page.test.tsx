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
        expect(screen.getByText('Differences')).toBeInTheDocument()

        // Verify changes are highlighted in the diff view
        // The DiffViewer typically renders changes in a specific structure next to the "Differences" label

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
