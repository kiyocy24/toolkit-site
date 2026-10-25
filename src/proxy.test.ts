// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import proxy from './proxy'

function request(path: string, headers: Record<string, string> = {}) {
    return proxy(new NextRequest(new URL(path, 'http://localhost'), { headers }))
}

describe('proxy (locale detection)', () => {
    it('redirects to the Japanese page when the browser prefers Japanese', async () => {
        const res = await request('/tools/json-formatter', { 'accept-language': 'ja,en;q=0.8' })
        expect(res.status).toBe(307)
        expect(res.headers.get('location')).toBe('http://localhost/ja/tools/json-formatter')
    })

    it('redirects to the English page when the browser prefers English', async () => {
        const res = await request('/', { 'accept-language': 'en-US,en;q=0.9' })
        expect(res.headers.get('location')).toBe('http://localhost/en')
    })

    it('falls back to the default locale (English) for unsupported languages', async () => {
        const res = await request('/tools', { 'accept-language': 'fr' })
        expect(res.headers.get('location')).toBe('http://localhost/en/tools')
    })

    it('prefers the locale saved in the cookie over Accept-Language', async () => {
        const res = await request('/tools', { 'accept-language': 'en', cookie: 'NEXT_LOCALE=ja' })
        expect(res.headers.get('location')).toBe('http://localhost/ja/tools')
    })

    it('does not redirect locale-prefixed paths', async () => {
        const res = await request('/ja/tools', { 'accept-language': 'en' })
        expect(res.headers.get('location')).toBeNull()
    })
})
