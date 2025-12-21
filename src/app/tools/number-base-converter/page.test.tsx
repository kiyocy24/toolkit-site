
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import NumberBaseConverterPage from './page'

describe('NumberBaseConverterPage', () => {
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn(),
        },
        configurable: true,
        writable: true,
    });

    it('renders all inputs', () => {
        render(<NumberBaseConverterPage />)
        expect(screen.getByLabelText(/Decimal/)).toBeDefined()
        expect(screen.getByLabelText(/Binary/)).toBeDefined()
        expect(screen.getByLabelText(/Octal/)).toBeDefined()
        expect(screen.getByLabelText(/Hexadecimal/)).toBeDefined()
    })

    it('updates all fields when Decimal is changed', () => {
        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })

        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '1010')
        expect(screen.getByLabelText(/Octal/)).toHaveProperty('value', '12')
        expect(screen.getByLabelText(/Hexadecimal/)).toHaveProperty('value', 'A')
    })

    it('updates all fields when Binary is changed', () => {
        render(<NumberBaseConverterPage />)
        const binaryInput = screen.getByLabelText(/Binary/)
        fireEvent.change(binaryInput, { target: { value: '1010' } })

        expect(screen.getByLabelText(/Decimal/)).toHaveProperty('value', '10')
        expect(screen.getByLabelText(/Octal/)).toHaveProperty('value', '12')
        expect(screen.getByLabelText(/Hexadecimal/)).toHaveProperty('value', 'A')
    })

    it('updates all fields when Octal is changed', () => {
        render(<NumberBaseConverterPage />)
        const octalInput = screen.getByLabelText(/Octal/)
        fireEvent.change(octalInput, { target: { value: '12' } })

        expect(screen.getByLabelText(/Decimal/)).toHaveProperty('value', '10')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '1010')
        expect(screen.getByLabelText(/Hexadecimal/)).toHaveProperty('value', 'A')
    })

    it('updates all fields when Hex is changed', () => {
        render(<NumberBaseConverterPage />)
        const hexInput = screen.getByLabelText(/Hexadecimal/)
        fireEvent.change(hexInput, { target: { value: 'F' } })

        expect(screen.getByLabelText(/Decimal/)).toHaveProperty('value', '15')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '1111')
        expect(screen.getByLabelText(/Octal/)).toHaveProperty('value', '17')
    })

    it('ignores invalid input for Binary', () => {
        render(<NumberBaseConverterPage />)
        const binaryInput = screen.getByLabelText(/Binary/)
        fireEvent.change(binaryInput, { target: { value: '1' } })
        fireEvent.change(binaryInput, { target: { value: '12' } })
        expect(binaryInput).toHaveProperty('value', '1')
    })

    it('ignores invalid input for Decimal', () => {
        render(<NumberBaseConverterPage />)
        const input = screen.getByLabelText(/Decimal/)
        fireEvent.change(input, { target: { value: '1' } })
        fireEvent.change(input, { target: { value: '1a' } })
        expect(input).toHaveProperty('value', '1')
    })

    it('ignores invalid input for Octal', () => {
        render(<NumberBaseConverterPage />)
        const input = screen.getByLabelText(/Octal/)
        fireEvent.change(input, { target: { value: '7' } })
        fireEvent.change(input, { target: { value: '78' } })
        expect(input).toHaveProperty('value', '7')
    })

    it('ignores invalid input for Hexadecimal', () => {
        render(<NumberBaseConverterPage />)
        const input = screen.getByLabelText(/Hexadecimal/)
        fireEvent.change(input, { target: { value: 'A' } })
        fireEvent.change(input, { target: { value: 'AG' } })
        expect(input).toHaveProperty('value', 'A')
    })

    it('clears all fields when input is empty', () => {
        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })
        fireEvent.change(decimalInput, { target: { value: '' } })
        expect(decimalInput).toHaveProperty('value', '')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '')
    })

    it('resets all fields when Reset button is clicked', () => {
        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })

        const resetButton = screen.getByRole('button', { name: /Reset/i })
        fireEvent.click(resetButton)

        expect(decimalInput).toHaveProperty('value', '')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '')
    })

    it('copies value to clipboard', async () => {
        render(<NumberBaseConverterPage />)

        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })

        const decimalCopyButton = screen.getByTitle('Copy Decimal (10)')

        fireEvent.click(decimalCopyButton)

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('10')
    })

    it('handles copy error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        const writeTextMock = vi.fn().mockRejectedValue(new Error('Copy failed'))
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: writeTextMock,
            },
            configurable: true,
            writable: true,
        });

        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })

        const decimalCopyButton = screen.getByTitle('Copy Decimal (10)')
        fireEvent.click(decimalCopyButton)

        // Wait for async error logging
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error))
        consoleSpy.mockRestore()
    })

    it('clears fields when input is just whitespace', () => {
        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })
        fireEvent.change(decimalInput, { target: { value: '   ' } })
        expect(decimalInput).toHaveProperty('value', '')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '')
    })

    it('handles parsing errors gracefully', () => {
        // Spy on parseInt to return NaN to trigger the error block
        const parseIntSpy = vi.spyOn(window, 'parseInt').mockReturnValue(NaN)

        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)

        // Input valid number, but parseInt will fail
        fireEvent.change(decimalInput, { target: { value: '10' } })

        expect(screen.getByText('Invalid number')).toBeDefined()

        parseIntSpy.mockRestore()
    })
})
