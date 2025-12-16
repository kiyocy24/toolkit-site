import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toolsByCategory, categories } from "@/config/tools";

export default function ToolsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">All Tools</h2>
                <p className="text-muted-foreground">
                    Browse our collection of developer tools by category.
                </p>
            </div>

            {categories.map((category) => {
                const categoryTools = toolsByCategory[category];
                if (!categoryTools || categoryTools.length === 0) return null;

                return (
                    <section key={category} className="space-y-4">
                        <h3 className="text-2xl font-semibold tracking-tight">{category}</h3>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryTools.map((tool) => (
                                <Link key={tool.href} href={tool.href}>
                                    <Card className="h-full hover:bg-muted/50 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <tool.icon className="h-5 w-5 text-muted-foreground" />
                                                <CardTitle className="text-lg">{tool.title}</CardTitle>
                                            </div>
                                            <CardDescription>{tool.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Badge variant="secondary">{tool.category}</Badge>
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
