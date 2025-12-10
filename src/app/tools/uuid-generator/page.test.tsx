import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import UuidGeneratorPage from './page'

// Mock crypto.randomUUID
beforeAll(() => {
    // Check if crypto exists, if not mock it (e.g. in older jsdom versions, but jsdom 20+ has it)
    // However, vitest/jsdom environment usually has it. But randomUUID might be missing in some node versions if not polyfilled.
    // Let's safe guard it.
    if (!global.crypto) {
        Object.defineProperty(global, 'crypto', {
            value: { randomUUID: () => '1234-5678' }
        });
    } else if (!global.crypto.randomUUID) {
        Object.defineProperty(global.crypto, 'randomUUID', {
            value: () => '1234-5678',
            writable: true
        });
    }
})

describe('UuidGeneratorPage', () => {
    beforeEach(() => {
        // Reset mock implementation if we change it per test
        vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000000')
    })

    it('renders the component correctly', () => {
        render(<UuidGeneratorPage />)
        expect(screen.getByText('UUID Generator')).toBeInTheDocument()
    })

    it('generates UUIDs on click', () => {
        render(<UuidGeneratorPage />)

        fireEvent.click(screen.getByRole('button', { name: /^generate$/i }))

        expect(screen.getByText('Generated UUIDs')).toBeInTheDocument()
        expect(screen.getByDisplayValue('00000000-0000-0000-0000-000000000000')).toBeInTheDocument()
    })

    it('respects count input', () => {
        render(<UuidGeneratorPage />)

        const countInput = screen.getByLabelText(/count/i)
        fireEvent.change(countInput, { target: { value: '2' } })

        fireEvent.click(screen.getByRole('button', { name: /^generate$/i }))

        const outputs = screen.getAllByDisplayValue('00000000-0000-0000-0000-000000000000')
        expect(outputs).toHaveLength(2)
    })
})
