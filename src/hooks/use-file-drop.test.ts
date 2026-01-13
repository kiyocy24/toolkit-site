import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useFileDrop } from "./use-file-drop"

describe("useFileDrop", () => {
    it("should initialize with isDragging as false", () => {
        const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }))
        expect(result.current.isDragging).toBe(false)
    })

    it("should set isDragging to true on dragOver", () => {
        const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }))
        const e = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
        } as unknown as React.DragEvent

        act(() => {
            result.current.handleDragOver(e)
        })

        expect(result.current.isDragging).toBe(true)
        expect(e.preventDefault).toHaveBeenCalled()
        expect(e.stopPropagation).toHaveBeenCalled()
    })

    it("should set isDragging to false on dragLeave", () => {
        const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }))

        act(() => {
            result.current.handleDragOver({ preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as React.DragEvent)
        })
        expect(result.current.isDragging).toBe(true)

        // Simulate leaving to an element outside the container (null relatedTarget)
        act(() => {
            const e = {
                preventDefault: vi.fn(),
                stopPropagation: vi.fn(),
                currentTarget: { contains: () => false },
                relatedTarget: null
            } as unknown as React.DragEvent
            result.current.handleDragLeave(e)
        })
        expect(result.current.isDragging).toBe(false)
    })

    it("should NOT set isDragging to false on dragLeave to child", () => {
        const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }))

        act(() => {
            result.current.handleDragOver({ preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as React.DragEvent)
        })
        expect(result.current.isDragging).toBe(true)

        // Simulate leaving to a child element
        act(() => {
            const e = {
                preventDefault: vi.fn(),
                stopPropagation: vi.fn(),
                currentTarget: { contains: () => true },
                relatedTarget: {}
            } as unknown as React.DragEvent
            result.current.handleDragLeave(e)
        })
        expect(result.current.isDragging).toBe(true)
    })

    it("should process dropped file and call onFileDrop", async () => {
        const onFileDrop = vi.fn()
        const { result } = renderHook(() => useFileDrop({ onFileDrop }))

        const file = new File(["test content"], "test.txt", { type: "text/plain" })
        const e = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer: {
                files: [file],
            },
        } as unknown as React.DragEvent

        const originalFileReader = global.FileReader
        try {
            await new Promise<void>((resolve) => {
                class MockFileReader {
                    onload: ((e: ProgressEvent<FileReader>) => any) | null = null
                    readAsText() {
                        setTimeout(() => {
                            this.onload?.({ target: { result: "test content" } } as unknown as ProgressEvent<FileReader>)
                            resolve()
                        }, 0)
                    }
                }
                global.FileReader = MockFileReader as any

                act(() => {
                    result.current.handleDrop(e)
                })
            })

            expect(result.current.isDragging).toBe(false)
            expect(onFileDrop).toHaveBeenCalledWith("test content")
        } finally {
            global.FileReader = originalFileReader
        }
    })

    it("should call onError when file reading fails", async () => {
        const onFileDrop = vi.fn()
        const onError = vi.fn()
        const { result } = renderHook(() => useFileDrop({ onFileDrop, onError }))

        const file = new File(["test content"], "test.txt", { type: "text/plain" })
        const e = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer: {
                files: [file],
            },
        } as unknown as React.DragEvent

        const originalFileReader = global.FileReader
        try {
            await new Promise<void>((resolve) => {
                class MockFileReader {
                    onerror: (() => any) | null = null
                    readAsText() {
                        setTimeout(() => {
                            this.onerror?.()
                            resolve()
                        }, 0)
                    }
                }
                global.FileReader = MockFileReader as any

                act(() => {
                    result.current.handleDrop(e)
                })
            })

            expect(onError).toHaveBeenCalledWith("Failed to read file.")
        } finally {
            global.FileReader = originalFileReader
        }
    })
})
