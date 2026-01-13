import { useCallback, useState, useEffect } from "react"

interface UseFileDropProps {
    onFileDrop: (content: string) => void
}

export function useFileDrop({ onFileDrop }: UseFileDropProps) {
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
                reader.readAsText(file)
            }
        },
        [onFileDrop]
    )

    return {
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    }
}
