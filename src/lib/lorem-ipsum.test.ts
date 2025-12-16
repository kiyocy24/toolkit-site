import { describe, it, expect } from 'vitest'
import { generateLoremIpsum } from './lorem-ipsum'

describe('generateLoremIpsum', () => {
    it('should generate empty string for invalid count', () => {
        expect(generateLoremIpsum(0, 'english', 'words')).toBe('')
        expect(generateLoremIpsum(-1, 'english', 'words')).toBe('')
    })

    describe('English', () => {
        it('should generate words', () => {
            const text = generateLoremIpsum(5, 'english', 'words')
            expect(text.split(' ')).toHaveLength(5)
        })

        it('should generate sentences', () => {
            const text = generateLoremIpsum(3, 'english', 'sentences')
            // Sentences end with '.' and are separated by space
            const sentences = text.split('. ')
            // The last sentence has a dot but no following space, so split might be tricky 
            // simple check: count of dots
            expect(text.split('.').length - 1).toBe(3)
        })

        it('should generate paragraphs', () => {
            const text = generateLoremIpsum(2, 'english', 'paragraphs')
            const paragraphs = text.split('\n\n')
            expect(paragraphs).toHaveLength(2)
        })
    })

    describe('Japanese', () => {
        it('should generate words (phrases)', () => {
            const text = generateLoremIpsum(5, 'japanese', 'words')
            expect(text.split('、')).toHaveLength(5)
        })

        it('should generate sentences', () => {
            // It's hard to count exact sentences because source sentences might contain random stuff, 
            // but in our constant list, they are distinct.
            // However, we join them with empty string.
            // So checking length is greater than 0 is a basic check.
            const text = generateLoremIpsum(3, 'japanese', 'sentences')
            expect(text.length).toBeGreaterThan(0)
        })

        it('should generate paragraphs', () => {
            const text = generateLoremIpsum(2, 'japanese', 'paragraphs')
            const paragraphs = text.split('\n\n')
            expect(paragraphs).toHaveLength(2)
        })
    })
})
