import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'
import { categories, toolsByCategory, tools } from '@/config/tools'

describe('Home', () => {
    it('renders a section for each category that has tools', () => {
        render(<Home />)

        const populated = categories.filter((c) => (toolsByCategory[c] ?? []).length > 0)
        for (const category of populated) {
            expect(screen.getByRole('heading', { level: 3, name: category })).toBeInTheDocument()
        }
    })

    it('lists each tool under its own category', () => {
        render(<Home />)

        for (const category of categories) {
            const categoryTools = toolsByCategory[category] ?? []
            if (categoryTools.length === 0) continue

            const section = screen.getByRole('region', { name: category })
            const links = within(section).getAllByRole('link')
            expect(links.map((link) => link.getAttribute('href'))).toEqual(
                categoryTools.map((tool) => tool.href),
            )
        }
    })

    it('renders every tool exactly once', () => {
        render(<Home />)

        const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
        for (const tool of tools) {
            expect(hrefs.filter((href) => href === tool.href)).toHaveLength(1)
        }
    })
})
