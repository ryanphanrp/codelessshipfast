"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useFontTheme } from "@/hooks/use-font-theme"
import { Button } from "@/components/hexta-ui"

interface FontThemeSwitcherProps {
	className?: string
	compact?: boolean
}

const fontDisplayMap: Record<string, { label: string; style: React.CSSProperties }> = {
	"geist-sans": {
		label: "Aa",
		style: { fontFamily: "Geist Sans, ui-sans-serif, sans-serif" }
	},
	"geist-mono": {
		label: "Aa",
		style: { fontFamily: "Geist Mono, ui-monospace, monospace" }
	},
	inter: {
		label: "Aa",
		style: { fontFamily: "Inter, ui-sans-serif, sans-serif" }
	},
	roboto: {
		label: "Aa",
		style: { fontFamily: "Roboto, ui-sans-serif, sans-serif" }
	},
	system: {
		label: "Aa",
		style: { fontFamily: "system-ui, -apple-system, sans-serif" }
	}
}

export function FontThemeSwitcher({ className, compact = false }: FontThemeSwitcherProps) {
	const { fontTheme, setFontTheme, fontThemes, mounted } = useFontTheme()

	if (!mounted) {
		return (
			<div
				className={cn(
					"flex items-center gap-2",
					compact ? "flex-col" : "flex-wrap justify-center",
					className
				)}
			>
				{fontThemes.map((theme) => (
					<div
						key={theme.id}
						className="h-9 w-12  border border-border bg-muted animate-pulse"
					/>
				))}
			</div>
		)
	}

	return (
		<div
			className={cn(
				"flex items-center gap-2",
				compact ? "flex-col" : "flex-wrap justify-center",
				className
			)}
		>
			{fontThemes.map((theme) => {
				const display = fontDisplayMap[theme.id] || { label: "Aa", style: {} }
				return (
					<Button
						key={theme.id}
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setFontTheme(theme.id)}
						className={cn(
							"relative h-9 w-12 cursor-pointer px-2 py-1 text-base font-medium transition-all duration-200",
							fontTheme === theme.id
								? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
								: "border-border hover:border-primary/50 hover:bg-primary/10"
						)}
						style={display.style}
						title={theme.name}
						aria-label={`Switch to ${theme.name} font`}
					>
						{display.label}
						{fontTheme === theme.id && (
							<Check className="absolute -top-1 -right-1 h-3 w-3 text-primary-foreground bg-primary  p-0.5" />
						)}
					</Button>
				)
			})}
		</div>
	)
}
