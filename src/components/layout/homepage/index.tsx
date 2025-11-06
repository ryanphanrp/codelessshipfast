import { HeroSection } from "@hexta/hero-section"
import { FeatureCard } from "@hexta/feature-card"
import { Code2, Palette, Zap, Shield, Rocket, Users } from "lucide-react"

function HomePage() {
	return (
		<>
			{/* Hero Section */}
			<HeroSection
				badge="✨ Built with Next.js 15 & React 19"
				title="The complete platform for building the Web"
				description="Give your team the toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web experiences with modern tools and components."
				primaryCta={{
					text: "Get Started",
					href: "/dashboard"
				}}
				secondaryCta={{
					text: "View Features",
					href: "/features"
				}}
			/>

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
					<FeatureCard
						icon={Code2}
						title="JSON Viewer"
						description="Interactive JSON viewer and formatter with syntax highlighting, validation, and advanced features like flattening and schema generation."
					/>
					<FeatureCard
						icon={Palette}
						title="Modern UI"
						description="Beautiful, responsive components built with Shadcn UI and enhanced with HextaUI patterns for a stunning user experience."
					/>
					<FeatureCard
						icon={Zap}
						title="Lightning Fast"
						description="Built on Next.js 15 with Turbopack for instant updates and optimal performance in development and production."
					/>
					<FeatureCard
						icon={Shield}
						title="Type Safe"
						description="Full TypeScript support with strict mode enabled, ensuring type safety and better developer experience."
					/>
					<FeatureCard
						icon={Rocket}
						title="Production Ready"
						description="Battle-tested components with comprehensive testing, error handling, and best practices baked in."
					/>
					<FeatureCard
						icon={Users}
						title="Developer First"
						description="Intuitive APIs, clear documentation, and tools designed to enhance your development workflow."
					/>
				</div>
			</section>
		</>
	)
}

export default HomePage
