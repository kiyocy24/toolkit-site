import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Base64ConverterPage from './page'

describe('Base64ConverterPage', () => {
    it('renders the component correctly', () => {
        render(<Base64ConverterPage />)
        expect(screen.getByText('Base64 Converter')).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: /input/i })).toBeInTheDocument()
    })

    it('encodes text correctly', async () => {
        const user = userEvent.setup()
        render(<Base64ConverterPage />)
        const input = screen.getByLabelText('Input')
        await user.type(input, 'hello')

        // "hello" in Base64 is "aGVsbG8="
        expect(screen.getByLabelText('Output')).toHaveValue('aGVsbG8=')
    })

    it('decodes base64 correctly', async () => {
        const user = userEvent.setup()
        render(<Base64ConverterPage />)

        // Switch to Decode tab
        await user.click(screen.getByRole('tab', { name: /decode/i }))

        const input = screen.getByLabelText('Input')
        await user.type(input, 'aGVsbG8=')

        expect(screen.getByLabelText('Output')).toHaveValue('hello')
    })

    it('shows error for invalid base64 input in decode mode', async () => {
        const user = userEvent.setup()
        render(<Base64ConverterPage />)

        // Switch to Decode tab
        await user.click(screen.getByRole('tab', { name: /decode/i }))

        const input = screen.getByLabelText('Input')
        await user.type(input, '!!!')

        expect(screen.getByText(/invalid input/i)).toBeInTheDocument()
    })

    it('clears input and output', async () => {
        const user = userEvent.setup()
        render(<Base64ConverterPage />)
        const input = screen.getByLabelText('Input')
        await user.type(input, 'hello')
        expect(input).toHaveValue('hello')

        await user.click(screen.getByRole('button', { name: /clear/i }))
        expect(input).toHaveValue('')
        expect(screen.getByLabelText('Output')).toHaveValue('')
    })
})

describe('Base64ConverterPage (ja)', () => {
    it('renders Japanese translations', () => {
        render(<Base64ConverterPage />, { locale: 'ja' })
        expect(screen.getByText('Base64 変換')).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'エンコード' })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'デコード' })).toBeInTheDocument()
        expect(screen.getByLabelText('入力')).toHaveAttribute('placeholder', 'エンコードするテキストを入力...')
        expect(screen.getByLabelText('出力')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'クリア' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'コピー' })).toBeInTheDocument()
    })

    it('shows a Japanese error for invalid base64 input', async () => {
        const user = userEvent.setup()
        render(<Base64ConverterPage />, { locale: 'ja' })

        await user.click(screen.getByRole('tab', { name: 'デコード' }))
        expect(screen.getByLabelText('入力')).toHaveAttribute('placeholder', 'デコードする Base64 文字列を貼り付け...')
        await user.type(screen.getByLabelText('入力'), '!!!')

        expect(screen.getByText('デコードできない入力です')).toBeInTheDocument()
    })
})
