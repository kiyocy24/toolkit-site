import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("diff-viewer")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
