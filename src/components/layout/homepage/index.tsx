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
					<Badge variant="secondary" className="mx-auto">
						✨ Built with Next.js 15 & React 19
					</Badge>

					<h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl">
						The complete platform for building the Web
					</h1>

					<p className="mx-auto max-w-2xl text-muted-foreground text-lg sm:text-xl">
						Give your team the toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web experiences with modern tools and components.
					</p>

					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button asChild size="lg">
							<Link href="/dashboard">Get Started</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/features">View Features</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-16 lg:py-24">
				<div className="mb-12 text-center">
					<h2 className="mb-4 font-bold text-3xl sm:text-4xl">
						Everything you need to build faster
					</h2>
					<p className="mx-auto max-w-2xl text-muted-foreground text-lg">
						Powerful tools and utilities designed for modern web development
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Code2 className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">JSON Viewer</CardTitle>
							<CardDescription>
								Interactive JSON viewer and formatter with syntax highlighting, validation, and advanced features like flattening and schema generation.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Palette className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">Modern UI</CardTitle>
							<CardDescription>
								Beautiful, responsive components built with real HextaUI design system featuring OKLCH colors and purple-tinted shadows.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Zap className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">Lightning Fast</CardTitle>
							<CardDescription>
								Built on Next.js 15 with Turbopack for instant updates and optimal performance in development and production.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Shield className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">Type Safe</CardTitle>
							<CardDescription>
								Full TypeScript support with strict mode enabled, ensuring type safety and better developer experience.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Rocket className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">Production Ready</CardTitle>
							<CardDescription>
								Battle-tested components with comprehensive testing, error handling, and best practices baked in.
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6">
							<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
								<Users className="size-6 text-primary" />
							</div>
							<CardTitle className="mb-2">Developer First</CardTitle>
							<CardDescription>
								Intuitive APIs, clear documentation, and tools designed to enhance your development workflow.
							</CardDescription>
						</CardContent>
					</Card>
				</div>
			</section>
		</>
	)
}

export default HomePage
