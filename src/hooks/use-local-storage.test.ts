import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useLocalStorage } from './use-local-storage'

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear()
        vi.clearAllMocks()
    })

    it('should return initial value', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
        expect(result.current[0]).toBe('initial')
    })

    it('should update value', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        act(() => {
            result.current[1]('new-value')
        })

        expect(result.current[0]).toBe('new-value')
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
    })

    it('should use functional update', () => {
        const { result } = renderHook(() => useLocalStorage('count', 1))

        act(() => {
            result.current[1]((prev) => prev + 1)
        })

        expect(result.current[0]).toBe(2)
        expect(window.localStorage.getItem('count')).toBe(JSON.stringify(2))
    })

    it('should initialize from local storage', async () => {
        window.localStorage.setItem('stored-key', JSON.stringify('stored-value'))
        const { result } = renderHook(() => useLocalStorage('stored-key', 'initial'))

        // Updates after effect
        await waitFor(() => {
            expect(result.current[0]).toBe('stored-value')
        })
    })

    it('should sync from local storage on mount', async () => {
        window.localStorage.setItem('sync-key', JSON.stringify('synced'))
        const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'))

        await waitFor(() => {
            expect(result.current[0]).toBe('synced')
        })
    })

    it('should handle localStorage read error gracefully', () => {
        const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
            throw new Error('Read error')
        })
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

        const { result } = renderHook(() => useLocalStorage('error-read-key', 'initial'))

        expect(result.current[0]).toBe('initial')
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error reading'), expect.any(Error))

        getItemSpy.mockRestore()
        consoleSpy.mockRestore()
    })

    it('should handle localStorage write error gracefully', () => {
        const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
            throw new Error('Write error')
        })
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

        const { result } = renderHook(() => useLocalStorage('error-write-key', 'initial'))

        act(() => {
            result.current[1]('new-value')
        })

        // State should still update in React
        expect(result.current[0]).toBe('new-value')
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error setting'), expect.any(Error))

        setItemSpy.mockRestore()
        consoleSpy.mockRestore()
    })
})
