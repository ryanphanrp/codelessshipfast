export interface ColorTheme {
	id: string
	name: string
	colors: {
		light: {
			primary: string
			ring: string
			chart1: string
			chart2: string
			sidebarPrimary: string
			sidebarRing: string
		}
	}
}

export const colorThemes: ColorTheme[] = [
	{
		id: "orange",
		name: "Orange",
		colors: {
			light: {
				primary: "oklch(0.6460 0.2220 41.1160)",
				ring: "oklch(0.6460 0.2220 41.1160)",
				chart1: "oklch(0.6460 0.2220 41.1160)",
				chart2: "oklch(0.8370 0.1280 66.2900)",
				sidebarPrimary: "oklch(0.6460 0.2220 41.1160)",
				sidebarRing: "oklch(0.6460 0.2220 41.1160)"
			}
		}
	},
	{
		id: "blue",
		name: "Blue",
		colors: {
			light: {
				primary: "oklch(0.5200 0.1050 223.1280)",
				ring: "oklch(0.5200 0.1050 223.1280)",
				chart1: "oklch(0.5200 0.1050 223.1280)",
				chart2: "oklch(0.7150 0.1430 215.2210)",
				sidebarPrimary: "oklch(0.5200 0.1050 223.1280)",
				sidebarRing: "oklch(0.5200 0.1050 223.1280)"
			}
		}
	},
	{
		id: "green",
		name: "Green",
		colors: {
			light: {
				primary: "oklch(0.6200 0.1800 145.0000)",
				ring: "oklch(0.6200 0.1800 145.0000)",
				chart1: "oklch(0.6200 0.1800 145.0000)",
				chart2: "oklch(0.7500 0.1300 155.0000)",
				sidebarPrimary: "oklch(0.6200 0.1800 145.0000)",
				sidebarRing: "oklch(0.6200 0.1800 145.0000)"
			}
		}
	},
	{
		id: "purple",
		name: "Purple",
		colors: {
			light: {
				primary: "oklch(0.6000 0.1900 290.0000)",
				ring: "oklch(0.6000 0.1900 290.0000)",
				chart1: "oklch(0.6000 0.1900 290.0000)",
				chart2: "oklch(0.7200 0.1500 305.0000)",
				sidebarPrimary: "oklch(0.6000 0.1900 290.0000)",
				sidebarRing: "oklch(0.6000 0.1900 290.0000)"
			}
		}
	},
	{
		id: "pink",
		name: "Pink",
		colors: {
			light: {
				primary: "oklch(0.6500 0.2000 350.0000)",
				ring: "oklch(0.6500 0.2000 350.0000)",
				chart1: "oklch(0.6500 0.2000 350.0000)",
				chart2: "oklch(0.7800 0.1400 360.0000)",
				sidebarPrimary: "oklch(0.6500 0.2000 350.0000)",
				sidebarRing: "oklch(0.6500 0.2000 350.0000)"
			}
		}
	}
]

export const defaultColorTheme = "orange"
