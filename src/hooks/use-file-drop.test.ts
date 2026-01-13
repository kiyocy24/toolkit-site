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

        act(() => {
            result.current.handleDragLeave({ preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as React.DragEvent)
        })
        expect(result.current.isDragging).toBe(false)
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

        // Mock FileReader
        const originalFileReader = global.FileReader

        // Use a Promise to wait for FileReader to be called
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

        global.FileReader = originalFileReader
    })
})
