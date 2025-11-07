import { Badge } from "@/components/hexta-ui/badge"
import { Button } from "@/components/hexta-ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/hexta-ui/card"
import { Code2, Palette, Zap, Shield, Rocket, Users } from "lucide-react"
import Link from "next/link"

function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-16 text-center lg:py-24">
				<div className="mx-auto max-w-4xl space-y-8">
					<Badge variant="secondary" className="mx-auto border border-primary/20">
						✨ Built with Next.js 15 & React 19
					</Badge>

					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
						Developer Tools
						<span className="block text-primary">Built for Speed</span>
					</h1>

					<p className="mx-auto max-w-2xl text-balance text-muted-foreground text-lg leading-relaxed sm:text-xl">
						Stop configuring, start building. A minimal suite of developer utilities with zero friction—JSON formatting, SQL tooling, and protobuf conversion at your fingertips.
					</p>

					<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button asChild size="lg" className="gap-2">
							<Link href="/dashboard">
								Get Started
								<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
									<span className="text-xs">⌘</span>K
								</kbd>
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/features">Browse Tools</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-16 lg:py-24">
				<div className="mb-16 text-center">
					<h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
						Everything you need to build faster
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground text-lg">
						Purpose-built tools for modern development workflows
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<Card className="group relative border-l-4 border-l-primary transition-colors hover:border-primary/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 transition-colors group-hover:bg-primary/10">
								<Code2 className="size-7 text-primary" />
							</div>
							<CardTitle className="mb-2 font-semibold">JSON Viewer</CardTitle>
							<CardDescription className="leading-relaxed">
								Format, validate, and explore JSON with syntax highlighting. Includes tree view, diff, JSONPath queries, and schema generation.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Ctrl+V</kbd>
								<span>to paste</span>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative border-l-4 border-l-cyan-500 transition-colors hover:border-cyan-500/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/5 transition-colors group-hover:bg-cyan-500/10">
								<Palette className="size-7 text-cyan-600" />
							</div>
							<CardTitle className="mb-2 font-semibold">Modern UI</CardTitle>
							<CardDescription className="leading-relaxed">
								Clean, minimal design system with OKLCH colors, zero animations, and sharp corners for a distraction-free developer experience.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<div className="flex items-center gap-1">
									<div className="size-3 rounded-full border-2 border-primary" />
									<span className="font-mono">Cyan 700</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative border-l-4 border-l-yellow-500 transition-colors hover:border-yellow-500/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/5 transition-colors group-hover:bg-yellow-500/10">
								<Zap className="size-7 text-yellow-600" />
							</div>
							<CardTitle className="mb-2 font-semibold">Lightning Fast</CardTitle>
							<CardDescription className="leading-relaxed">
								Built on Next.js 15 with Turbopack. Instant hot reloads, optimized bundles, and blazing performance in development and production.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-mono text-green-700 dark:text-green-400">
									&lt;100ms
								</span>
								<span>response time</span>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative border-l-4 border-l-blue-500 transition-colors hover:border-blue-500/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/5 transition-colors group-hover:bg-blue-500/10">
								<Shield className="size-7 text-blue-600" />
							</div>
							<CardTitle className="mb-2 font-semibold">Type Safe</CardTitle>
							<CardDescription className="leading-relaxed">
								Full TypeScript strict mode with comprehensive type definitions. Catch errors at compile time, not runtime.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">strict: true</code>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative border-l-4 border-l-purple-500 transition-colors hover:border-purple-500/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors group-hover:bg-purple-500/10">
								<Rocket className="size-7 text-purple-600" />
							</div>
							<CardTitle className="mb-2 font-semibold">Production Ready</CardTitle>
							<CardDescription className="leading-relaxed">
								Battle-tested components with Vitest coverage, comprehensive error handling, and production-grade patterns.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<span className="rounded border border-border bg-muted px-2 py-0.5 font-mono">v1.0.0</span>
							</div>
						</CardContent>
					</Card>

					<Card className="group relative border-l-4 border-l-orange-500 transition-colors hover:border-orange-500/50">
						<CardContent className="pt-6">
							<div className="mb-4 flex size-14 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/5 transition-colors group-hover:bg-orange-500/10">
								<Users className="size-7 text-orange-600" />
							</div>
							<CardTitle className="mb-2 font-semibold">Developer First</CardTitle>
							<CardDescription className="leading-relaxed">
								Keyboard shortcuts, clipboard integration, and instant feedback loops. Built by developers, for developers.
							</CardDescription>
							<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
								<kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">⌘K</kbd>
								<span>Quick actions</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</>
	)
}

export default HomePage
