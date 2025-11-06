import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/hexta-ui"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
	icon: LucideIcon
	title: string
	description: string
	className?: string
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
	return (
		<Card
			className={cn(
				"group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50",
				className
			)}>
			{/* Gradient overlay on hover */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<CardHeader>
				<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
					<Icon className="h-6 w-6" />
				</div>
				<CardTitle className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-base leading-relaxed">{description}</CardDescription>
			</CardContent>
		</Card>
	)
}
