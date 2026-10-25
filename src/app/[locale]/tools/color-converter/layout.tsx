import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("color-converter")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
