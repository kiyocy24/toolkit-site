import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toolsByCategory, categories } from "@/config/tools";

export default function Home() {
  const t = useTranslations("Home");
  const tTools = useTranslations("Tools");
  const tCategories = useTranslations("Categories");

  return (
    <div className="flex flex-col">
      {/* Header is now in RootLayout */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Link
              href="https://github.com/kiyocy24/toolkit-site"
              className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
              target="_blank"
            >
              {t("followOnGithub")}
            </Link>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight [word-break:auto-phrase]">
              {t("heroTitle")}
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance [word-break:auto-phrase]">
              {t("heroDescription")}
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <LocaleLink href="/tools">{t("exploreTools")}</LocaleLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/kiyocy24/toolkit-site" target="_blank">
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Features Section */}
        <section id="features" className="container mx-auto space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              {t("featuresTitle")}
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {t("featuresDescription")}
            </p>
          </div>
          <div className="mx-auto space-y-10 md:max-w-[64rem]">
            {categories.map((category) => {
              const categoryTools = toolsByCategory[category];
              if (!categoryTools || categoryTools.length === 0) return null;

              return (
                <section key={category} aria-labelledby={`category-${category}`} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 id={`category-${category}`} className="text-2xl font-semibold tracking-tight">
                      {tCategories(category)}
                    </h3>
                    <Badge variant="secondary">{categoryTools.length}</Badge>
                  </div>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {categoryTools.map((tool) => (
                      <LocaleLink key={tool.href} href={tool.href}>
                        <Card className="h-full hover:bg-muted/50 transition-colors">
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <tool.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                              <CardTitle>{tTools(`${tool.id}.title`)}</CardTitle>
                            </div>
                            <CardDescription>
                              {tTools(`${tool.id}.description`)}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </LocaleLink>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section >
      </main >

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t.rich("footer", {
              author: (chunks) => (
                <a
                  href="https://github.com/kiyocy24"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  {chunks}
                </a>
              ),
              github: (chunks) => (
                <a
                  href="https://github.com/kiyocy24/toolkit-site"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </footer>
    </div >
  );
}
