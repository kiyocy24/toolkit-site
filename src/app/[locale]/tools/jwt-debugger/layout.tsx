import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("jwt-debugger")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
