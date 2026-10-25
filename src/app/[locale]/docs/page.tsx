import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Docs")
    return { title: t("metaTitle") }
}

export default function DocsPage() {
    const t = useTranslations("Docs")

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-3xl space-y-8">
                <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
                <div className="space-y-4">
                    <p className="leading-7">
                        {t("paragraph1")}
                    </p>
                    <p className="leading-7">
                        {t("paragraph2")}
                    </p>
                    <p className="leading-7">
                        {t("paragraph3")}
                    </p>
                </div>
            </div>
        </div>
    )
}
