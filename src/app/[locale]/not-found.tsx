import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default function NotFoundPage() {
    const t = useTranslations("NotFound")

    return (
        <div className="container mx-auto flex flex-col items-center gap-4 py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
            <Button asChild>
                <Link href="/">{t("backToHome")}</Link>
            </Button>
        </div>
    )
}
