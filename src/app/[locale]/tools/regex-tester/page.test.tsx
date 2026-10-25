import { render, screen, fireEvent } from '@/test/test-utils'
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

describe('RegexTesterPage (ja)', () => {
    it('renders Japanese translations', () => {
        render(<RegexTesterPage />, { locale: 'ja' })
        expect(screen.getByText('正規表現テスター')).toBeInTheDocument()
        expect(screen.getByLabelText('正規表現パターン')).toHaveAttribute('placeholder', '例: [a-z0-9]+')
        expect(screen.getByLabelText('フラグ')).toBeInTheDocument()
        expect(screen.getByText('テスト文字列')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('テキストを貼り付けてください...')).toBeInTheDocument()
        expect(screen.getByText('マッチ結果')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'クリア' })).toBeInTheDocument()
    })

    it('shows a Japanese error prefix for invalid regex', () => {
        render(<RegexTesterPage />, { locale: 'ja' })
        fireEvent.change(screen.getByLabelText('正規表現パターン'), { target: { value: '(test' } })
        expect(screen.getByText(/^エラー: /)).toBeInTheDocument()
    })
})
