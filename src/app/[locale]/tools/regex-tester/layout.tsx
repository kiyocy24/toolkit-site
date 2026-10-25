import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("regex-tester")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
