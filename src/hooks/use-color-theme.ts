"use client"

import { colorThemes, defaultColorTheme } from "@/config/color-themes"
import { useEffect, useState } from "react"

const COLOR_THEME_KEY = "color-theme"

export function useColorTheme() {
	const [colorTheme, setColorThemeState] = useState(defaultColorTheme)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const stored = localStorage.getItem(COLOR_THEME_KEY)
		if (stored && colorThemes.some((theme) => theme.id === stored)) {
			setColorThemeState(stored)
		}
	}, [])

	useEffect(() => {
		if (!mounted) return

		const theme = colorThemes.find((t) => t.id === colorTheme)
		if (!theme) return

		const root = document.documentElement

		// Apply light mode colors
		root.style.setProperty("--primary", theme.colors.light.primary)
		root.style.setProperty("--ring", theme.colors.light.ring)
		root.style.setProperty("--chart-1", theme.colors.light.chart1)
		root.style.setProperty("--chart-2", theme.colors.light.chart2)
		root.style.setProperty("--sidebar-primary", theme.colors.light.sidebarPrimary)
		root.style.setProperty("--sidebar-ring", theme.colors.light.sidebarRing)

		localStorage.setItem(COLOR_THEME_KEY, colorTheme)
	}, [colorTheme, mounted])

	const setColorTheme = (themeId: string) => {
		if (colorThemes.some((theme) => theme.id === themeId)) {
			setColorThemeState(themeId)
		}
	}

	return {
		colorTheme,
		setColorTheme,
		colorThemes,
		mounted
	}
}
