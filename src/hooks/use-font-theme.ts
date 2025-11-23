"use client"

import { fontThemes, defaultFontTheme } from "@/config/font-themes"
import { useEffect, useState } from "react"

const FONT_THEME_KEY = "font-theme"

export function useFontTheme() {
	const [fontTheme, setFontThemeState] = useState(defaultFontTheme)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const stored = localStorage.getItem(FONT_THEME_KEY)
		if (stored && fontThemes.some((theme) => theme.id === stored)) {
			setFontThemeState(stored)
		}
	}, [])

	useEffect(() => {
		if (!mounted) return

		const theme = fontThemes.find((t) => t.id === fontTheme)
		if (!theme) return

		const root = document.documentElement

		// Apply font families
		root.style.setProperty("--font-sans", theme.fonts.sans)
		root.style.setProperty("--font-serif", theme.fonts.serif)
		root.style.setProperty("--font-mono", theme.fonts.mono)

		localStorage.setItem(FONT_THEME_KEY, fontTheme)
	}, [fontTheme, mounted])

	const setFontTheme = (themeId: string) => {
		if (fontThemes.some((theme) => theme.id === themeId)) {
			setFontThemeState(themeId)
		}
	}

	return {
		fontTheme,
		setFontTheme,
		fontThemes,
		mounted
	}
}
