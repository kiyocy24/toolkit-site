import { render, screen, fireEvent } from '@/test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocaleSwitcher } from './locale-switcher'

const replace = vi.fn()

vi.mock('next/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('next/navigation')>()),
    usePathname: () => '/en/tools/json-formatter',
    useRouter: () => ({ replace, push: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn() }),
}))

// Mock ResizeObserver / scrollIntoView for Radix Select
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
Element.prototype.scrollIntoView = vi.fn()

describe('LocaleSwitcher', () => {
    beforeEach(() => {
        replace.mockClear()
    })

    it('shows the current locale', () => {
        render(<LocaleSwitcher />)
        expect(screen.getByRole('combobox', { name: 'Change language' })).toHaveTextContent('English')
    })

    it('shows a translated label in Japanese', () => {
        render(<LocaleSwitcher />, { locale: 'ja' })
        expect(screen.getByRole('combobox', { name: '言語を切り替える' })).toHaveTextContent('日本語')
    })

    it('switches the locale while keeping the current page', () => {
        render(<LocaleSwitcher />)

        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
        fireEvent.click(screen.getByRole('option', { name: '日本語' }))

        expect(replace).toHaveBeenCalledWith('/ja/tools/json-formatter')
    })
})
