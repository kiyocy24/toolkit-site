import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RegexTesterPage from './page'

describe('RegexTesterPage', () => {
    it('renders the component correctly', () => {
        render(<RegexTesterPage />)
        expect(screen.getByText('Regex Tester')).toBeInTheDocument()
    })

    it('highlights matches correctly', () => {
        render(<RegexTesterPage />)

        const patternInput = screen.getByLabelText(/regex pattern/i)
        const textInput = screen.getByPlaceholderText(/paste your text here/i)

        fireEvent.change(patternInput, { target: { value: 'test' } })
        fireEvent.change(textInput, { target: { value: 'This is a test message' } })

        // The match "test" should be highlighted
        const matchResult = screen.getByText('test')
        // Check if it has the highlight class we expect (bg-yellow-200 or dark:bg-yellow-800)
        expect(matchResult).toHaveClass('bg-yellow-200')
    })

    it('shows error for invalid regex', () => {
        render(<RegexTesterPage />)

        const patternInput = screen.getByLabelText(/regex pattern/i)
        // Invalid regex (unclosed group)
        fireEvent.change(patternInput, { target: { value: '(test' } })

        expect(screen.getByText(/error:/i)).toBeInTheDocument()
    })

    it('clears all fields', () => {
        render(<RegexTesterPage />)
        const patternInput = screen.getByLabelText(/regex pattern/i)

        fireEvent.change(patternInput, { target: { value: 'test' } })
        fireEvent.click(screen.getByRole('button', { name: /clear/i }))

        expect(patternInput).toHaveValue('')
    })
})
