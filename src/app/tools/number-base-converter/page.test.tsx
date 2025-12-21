
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NumberBaseConverterPage from './page'

describe('NumberBaseConverterPage', () => {
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
        // First set a valid value
        fireEvent.change(binaryInput, { target: { value: '1' } })
        expect(binaryInput).toHaveProperty('value', '1')

        // Try to append invalid char '2'
        fireEvent.change(binaryInput, { target: { value: '12' } })
        // Should remain '1' because handleChange blocks invalid input
        expect(binaryInput).toHaveProperty('value', '1')
    })

    it('clears all fields when input is empty', () => {
        render(<NumberBaseConverterPage />)
        const decimalInput = screen.getByLabelText(/Decimal/)
        fireEvent.change(decimalInput, { target: { value: '10' } })
        expect(decimalInput).toHaveProperty('value', '10')

        fireEvent.change(decimalInput, { target: { value: '' } })
        expect(decimalInput).toHaveProperty('value', '')
        expect(screen.getByLabelText(/Binary/)).toHaveProperty('value', '')
    })
})
