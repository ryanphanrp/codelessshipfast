"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useColorTheme } from "@/hooks/use-color-theme"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/hexta-ui"

interface ColorThemeSwitcherProps {
	className?: string
	compact?: boolean
}

const themeColorMap: Record<string, string> = {
	orange: "bg-gradient-to-br from-orange-500 to-amber-600",
	blue: "bg-gradient-to-br from-blue-500 to-indigo-600",
	green: "bg-gradient-to-br from-green-500 to-emerald-600",
	purple: "bg-gradient-to-br from-purple-500 to-violet-600",
	pink: "bg-gradient-to-br from-pink-500 to-rose-600"
}

export function ColorThemeSwitcher({ className, compact = false }: ColorThemeSwitcherProps) {
	const { colorTheme, setColorTheme, colorThemes, mounted } = useColorTheme()

	if (!mounted) {
		return (
			<div className={cn("flex items-center gap-2", compact ? "flex-col" : "flex-wrap justify-center", className)}>
				{colorThemes.map((theme) => (
					<div
						key={theme.id}
						className="h-6 w-6  border-2 border-border bg-muted animate-pulse"
					/>
				))}
			</div>
		)
	}

	return (
		<div className={cn("flex items-center gap-2", compact ? "flex-col" : "flex-wrap justify-center", className)}>
			{colorThemes.map((theme) => (
				<Tooltip key={theme.id}>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={() => setColorTheme(theme.id)}
							className={cn(
								"relative h-6 w-6  border-2 transition-all duration-200 cursor-pointer hover:scale-110",
								themeColorMap[theme.id] || "bg-gray-500",
								colorTheme === theme.id
									? "border-foreground ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
									: "border-border hover:border-foreground/50"
							)}
							aria-label={`Switch to ${theme.name} theme`}
						>
							{colorTheme === theme.id && (
								<Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
							)}
						</button>
					</TooltipTrigger>
					<TooltipContent side={compact ? "right" : "top"}>
						{theme.name}
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	)
}
