import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("url-encoder-decoder")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
