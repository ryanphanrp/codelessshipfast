import Link from "next/link"
import { AnimatedButton } from "./animated-button"
import { Badge } from "@/components/hexta-ui"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroSectionProps {
	badge?: string
	title: string
	description: string
	primaryCta: {
		text: string
		href: string
	}
	secondaryCta?: {
		text: string
		href: string
	}
}

export function HeroSection({
	badge,
	title,
	description,
	primaryCta,
	secondaryCta
}: HeroSectionProps) {
	return (
		<section className="relative overflow-hidden">
			{/* Background gradient effects */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
				<div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse delay-1000" />
			</div>

			<div className="container mx-auto px-4 py-24 lg:py-32">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					{badge && (
						<div className="mb-8 inline-flex animate-fade-in">
							<Badge
								variant="secondary"
								className="px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
								<Sparkles className="mr-2 h-4 w-4" />
								{badge}
							</Badge>
						</div>
					)}

					{/* Title with gradient */}
					<h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
						<span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
							{title}
						</span>
					</h1>

					{/* Description */}
					<p className="mx-auto mb-12 max-w-2xl text-muted-foreground text-lg sm:text-xl md:text-2xl leading-relaxed animate-fade-in-up delay-200">
						{description}
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up delay-300">
						<Link href={primaryCta.href}>
							<AnimatedButton variant="gradient" size="lg" className="group">
								{primaryCta.text}
								<ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
							</AnimatedButton>
						</Link>

						{secondaryCta && (
							<Link href={secondaryCta.href}>
								<AnimatedButton variant="outline" size="lg">
									{secondaryCta.text}
								</AnimatedButton>
							</Link>
						)}
					</div>

					{/* Social proof or stats (optional) */}
					<div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm animate-fade-in-up delay-500">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
							<span>Production Ready</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
							<span>TypeScript Support</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
							<span>Fully Customizable</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
