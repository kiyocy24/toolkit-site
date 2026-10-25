import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './src/test/setup.ts',
        server: {
            deps: {
                // next-intl は ESM のみのため、Vitest で変換対象に含める
                inline: ['next-intl'],
            },
        },
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'lcov'],
        },
    },
})
