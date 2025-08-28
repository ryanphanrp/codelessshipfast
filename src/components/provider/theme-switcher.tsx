"use client"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Icons } from "../icons"
import { useEffect, useState } from "react"

interface ThemeSwitcherProps {
	className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
	const { setTheme, theme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className="flex items-center gap-2">
				<Icons.sun className="h-4 w-4 text-muted-foreground" />
				<Switch disabled className="data-[state=checked]:bg-primary" />
				<Icons.moon className="h-4 w-4 text-muted-foreground" />
			</div>
		)
	}

	const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark")

	const handleToggle = () => {
		setTheme(isDark ? "light" : "dark")
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Icons.sun className={cn(
				"h-4 w-4 transition-colors",
				!isDark ? "text-yellow-500" : "text-muted-foreground"
			)} />
			<Switch
				checked={isDark}
				onCheckedChange={handleToggle}
				className="data-[state=checked]:bg-primary"
				aria-label="Toggle theme"
			/>
			<Icons.moon className={cn(
				"h-4 w-4 transition-colors",
				isDark ? "text-blue-500" : "text-muted-foreground"
			)} />
		</div>
	)
}

// Compact version for collapsed sidebar - just the switch
export const ThemeSwitcherCompact = () => {
	const { setTheme, theme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return <Switch disabled className="data-[state=checked]:bg-primary" />
	}

	const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark")

	const handleToggle = () => {
		setTheme(isDark ? "light" : "dark")
	}

	return (
		<Switch
			checked={isDark}
			onCheckedChange={handleToggle}
			className="data-[state=checked]:bg-primary"
			aria-label="Toggle theme"
		/>
	)
}
