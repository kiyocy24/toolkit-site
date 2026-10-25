import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("string-case-converter")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
