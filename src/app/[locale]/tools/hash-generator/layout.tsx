import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("hash-generator")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
