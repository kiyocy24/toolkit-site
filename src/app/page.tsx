import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";

export default function Home() {
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
              Follow along on GitHub
            </Link>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Essential Tools for Modern Engineers
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A curated collection of developer tools to boost your productivity.
              From formatters to generators, everything you need in one place.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/tools">Explore Tools</Link>
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
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              This project is an experiment to see how we can build a modern toolkit app with Next.js 15 and shadcn/ui.
            </p>
          </div>
          <div className="mx-auto grid gap-4 grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Link href="/tools/json-formatter">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>JSON Formatter</CardTitle>
                  <CardDescription>
                    Format and validate your JSON data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Core</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/base64-converter">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Base64 Converter</CardTitle>
                  <CardDescription>
                    Encode and decode Base64 strings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/uuid-generator">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>UUID Generator</CardTitle>
                  <CardDescription>
                    Generate random UUIDs v4.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/sql-formatter">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>SQL Formatter</CardTitle>
                  <CardDescription>
                    Beautify your SQL queries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Database</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/regex-tester">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Regex Tester</CardTitle>
                  <CardDescription>
                    Test your regular expressions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Code</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/diff-viewer">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Diff Viewer</CardTitle>
                  <CardDescription>
                    Compare two text contents.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/url-encoder-decoder">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>URL Encoder/Decoder</CardTitle>
                  <CardDescription>
                    Encode and decode URL strings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/unix-timestamp-converter">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Unix Timestamp Converter</CardTitle>
                  <CardDescription>
                    Convert timestamps to dates and vice versa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Date</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/prime-factorization">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Prime Factorization</CardTitle>
                  <CardDescription>
                    Decompose integers into prime factors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Math</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/collatz-conjecture">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>Collatz Conjecture</CardTitle>
                  <CardDescription>
                    Visualize the 3n + 1 sequence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Math</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/qr-code-generator">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>QR Code Generator</CardTitle>
                  <CardDescription>
                    Generate QR codes for URLs or text.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/jwt-debugger">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>JWT Debugger</CardTitle>
                  <CardDescription>
                    Decode, encode, and sign JSON Web Tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Development</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tools/css-unit-converter">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>CSS Unit Converter</CardTitle>
                  <CardDescription>
                    Convert between px, rem, and em units.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Utility</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section >
      </main >

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/kiyocy24"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              kiyocy24
            </a>
            .
            The source code is available on{" "}
            <a
              href="https://github.com/kiyocy24/toolkit-site"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div >
  );
}
