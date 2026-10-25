import { describe, it, expect } from 'vitest'
import en from '../../messages/en.json'
import ja from '../../messages/ja.json'
import { tools } from '@/config/tools'

// ネストしたメッセージオブジェクトのキーを `a.b.c` 形式で列挙する
function collectKeys(messages: object, prefix = ''): string[] {
    return Object.entries(messages).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key
        return typeof value === 'object' && value !== null ? collectKeys(value, path) : [path]
    })
}

describe('messages', () => {
    it('has the same keys in every locale', () => {
        expect(collectKeys(ja).sort()).toEqual(collectKeys(en).sort())
    })

    it('has no empty translations', () => {
        for (const messages of [en, ja]) {
            for (const key of collectKeys(messages)) {
                const value = key.split('.').reduce<unknown>((obj, k) => (obj as Record<string, unknown>)[k], messages)
                expect(value, key).not.toBe('')
            }
        }
    })

    it('defines a title and description for every tool', () => {
        for (const tool of tools) {
            expect(en.Tools[tool.id].title).toBeTruthy()
            expect(en.Tools[tool.id].description).toBeTruthy()
            expect(ja.Tools[tool.id].title).toBeTruthy()
            expect(ja.Tools[tool.id].description).toBeTruthy()
        }
    })
})
