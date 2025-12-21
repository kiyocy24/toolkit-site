
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import LoremIpsumGeneratorPage from './page'

describe('LoremIpsumGeneratorPage', () => {
    it('renders all inputs', () => {
        render(<LoremIpsumGeneratorPage />)
        expect(screen.getByLabelText(/Count/)).toBeDefined()
        expect(screen.getByLabelText(/Unit/)).toBeDefined()
        expect(screen.getByLabelText(/Language/)).toBeDefined()
        expect(screen.getByRole('button', { name: /Generate/ })).toBeDefined()
    })

    it('generates text on mount', () => {
        render(<LoremIpsumGeneratorPage />)
        const textarea = screen.getByPlaceholderText(/Generated text will appear here.../) as HTMLTextAreaElement
        expect(textarea.value).toBeTruthy()
    })

    it('generates text when button is clicked', () => {
        render(<LoremIpsumGeneratorPage />)
        const button = screen.getByRole('button', { name: /Generate/ })
        const textarea = screen.getByPlaceholderText(/Generated text will appear here.../) as HTMLTextAreaElement
        const initialText = textarea.value

        // Change count to ensure text changes
        const countInput = screen.getByLabelText(/Count/)
        fireEvent.change(countInput, { target: { value: '5' } })

        fireEvent.click(button)
        expect(textarea.value).not.toBe(initialText) // This might fail if initial random text = new random text, but unlikely with count change
    })

    it('updates count state', () => {
        render(<LoremIpsumGeneratorPage />)
        const countInput = screen.getByLabelText(/Count/) as HTMLInputElement
        fireEvent.change(countInput, { target: { value: '10' } })
        expect(countInput.value).toBe('10')
    })
})
