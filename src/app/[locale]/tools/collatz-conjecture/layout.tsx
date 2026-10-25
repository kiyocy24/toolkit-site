import { createToolMetadata } from "@/lib/tool-metadata"

export const generateMetadata = createToolMetadata("collatz-conjecture")

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
