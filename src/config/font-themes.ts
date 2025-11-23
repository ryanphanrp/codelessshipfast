export interface FontTheme {
	id: string
	name: string
	fonts: {
		sans: string
		serif: string
		mono: string
	}
}

export const fontThemes: FontTheme[] = [
	{
		id: "geist-sans",
		name: "Geist Sans",
		fonts: {
			sans: "Geist Sans, ui-sans-serif, sans-serif",
			serif: "Playfair Display, serif",
			mono: "Fira Code, ui-monospace, monospace"
		}
	},
	{
		id: "geist-mono",
		name: "Geist Mono",
		fonts: {
			sans: "Geist Mono, ui-monospace, monospace",
			serif: "Playfair Display, serif",
			mono: "Fira Code, ui-monospace, monospace"
		}
	},
	{
		id: "inter",
		name: "Inter",
		fonts: {
			sans: "Inter, ui-sans-serif, sans-serif",
			serif: "Playfair Display, serif",
			mono: "Fira Code, ui-monospace, monospace"
		}
	},
	{
		id: "roboto",
		name: "Roboto",
		fonts: {
			sans: "Roboto, ui-sans-serif, sans-serif",
			serif: "Playfair Display, serif",
			mono: "Fira Code, ui-monospace, monospace"
		}
	},
	{
		id: "system",
		name: "System",
		fonts: {
			sans: "system-ui, -apple-system, sans-serif",
			serif: "Georgia, serif",
			mono: "ui-monospace, monospace"
		}
	}
]

export const defaultFontTheme = "geist-sans"
