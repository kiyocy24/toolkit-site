import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("markdown-previewer")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
