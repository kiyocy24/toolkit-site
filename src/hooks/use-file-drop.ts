import { useCallback, useState } from "react"

interface UseFileDropProps {
    onFileDrop: (content: string) => void
    onError?: (message: string) => void
}

export function useFileDrop({ onFileDrop, onError }: UseFileDropProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const files = e.dataTransfer.files
            if (files && files.length > 0) {
                const file = files[0]
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target?.result && typeof event.target.result === "string") {
                        onFileDrop(event.target.result)
                    }
                }
                reader.onerror = () => {
                    onError?.("Failed to read file.")
                }
                reader.readAsText(file)
            }
        },
        [onFileDrop, onError]
    )

    return {
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    }
}
