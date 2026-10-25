import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("sql-formatter")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
