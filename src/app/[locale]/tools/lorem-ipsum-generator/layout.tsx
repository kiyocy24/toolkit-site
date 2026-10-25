import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("lorem-ipsum-generator")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
