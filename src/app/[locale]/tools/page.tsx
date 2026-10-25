import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toolsByCategory, categories } from "@/config/tools";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("ToolsIndex");
    return { title: t("title"), description: t("description") };
}

export default function ToolsPage() {
    const t = useTranslations("ToolsIndex");
    const tTools = useTranslations("Tools");
    const tCategories = useTranslations("Categories");

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                <p className="text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            {categories.map((category) => {
                const categoryTools = toolsByCategory[category];
                if (!categoryTools || categoryTools.length === 0) return null;

                return (
                    <section key={category} className="space-y-4">
                        <h3 className="text-2xl font-semibold tracking-tight">{tCategories(category)}</h3>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryTools.map((tool) => (
                                <Link key={tool.href} href={tool.href}>
                                    <Card className="h-full hover:bg-muted/50 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <tool.icon className="h-5 w-5 text-muted-foreground" />
                                                <CardTitle className="text-lg">{tTools(`${tool.id}.title`)}</CardTitle>
                                            </div>
                                            <CardDescription>{tTools(`${tool.id}.description`)}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Badge variant="secondary">{tCategories(tool.category)}</Badge>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
