
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CronExpressionGeneratorPage from './page'

// Mock cronstrue to avoid dependency on actual library logic in unit tests
// and to ensure we are testing our component's integration with it.
vi.mock('cronstrue', () => ({
    default: {
        toString: (cron: string) => {
            if (cron === "* * * * *") return "Every minute"
            if (cron === "*/5 * * * *") return "Every 5 minutes"
            throw new Error("Error: " + cron)
        }
    }
}))

// We need to mock clipboard
vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue({
    writeText: vi.fn(),
} as any)

describe('CronExpressionGeneratorPage', () => {
    it('renders the component correctly', () => {
        render(<CronExpressionGeneratorPage />)
        expect(screen.getByText('Cron Generator')).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'Explain' })).toBeInTheDocument()
    })

    it('generates cron expression based on inputs', async () => {
        const user = userEvent.setup()
        render(<CronExpressionGeneratorPage />)

        // Default should be * * * * *
        expect(screen.getByText('* * * * *')).toBeInTheDocument()
        expect(screen.getByText('Human readable: Every minute')).toBeInTheDocument()

        // Change minute input
        // All inputs have placeholder *. Let's assume the first one is minute.
        // Better: Use inputs[0]
        const inputs = screen.getAllByRole('textbox')
        const minute = inputs[0]

        await user.clear(minute)
        await user.type(minute, '*\/5')

        expect(await screen.findByText('*\/5 * * * *')).toBeInTheDocument()
        expect(await screen.findByText('Human readable: Every 5 minutes')).toBeInTheDocument()
    })

    it('explains cron expression in explain tab', async () => {
        const user = userEvent.setup()
        render(<CronExpressionGeneratorPage />)

        // Switch to Explain tab
        const explainTab = screen.getByRole('tab', { name: /explain/i })
        await user.click(explainTab)

        // Wait for tab content
        await waitFor(() => {
            expect(screen.getByText('Paste a cron expression to understand what it does.')).toBeInTheDocument()
        })

        const input = screen.getByPlaceholderText('e.g. */5 * * * *')
        await user.clear(input)
        await user.type(input, '*/5 * * * *')
        // Trigger effect by blurring or waiting? Input onChange fires immediately in React.

        expect(await screen.findByText('Every 5 minutes')).toBeInTheDocument()
    })

    it('handles invalid cron expression', async () => {
        const user = userEvent.setup()
        render(<CronExpressionGeneratorPage />)

        // Switch to Explain tab
        const explainTab = screen.getByRole('tab', { name: /explain/i })
        await user.click(explainTab)

        // Wait for tab content
        await waitFor(() => {
            expect(screen.getByText('Paste a cron expression to understand what it does.')).toBeInTheDocument()
        })

        const input = screen.getByPlaceholderText('e.g. */5 * * * *')
        await user.clear(input)
        await user.type(input, 'invalid')

        expect(await screen.findByText('Invalid cron expression')).toBeInTheDocument()
    })
})
