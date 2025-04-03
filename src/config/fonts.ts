import { Fira_Code, Geist, Homemade_Apple, JetBrains_Mono, Work_Sans } from "next/font/google"

const fontBase = Work_Sans({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-base"
})

const fontHandwriting = Homemade_Apple({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-handwriting"
})

const fontMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: "500",
	variable: "--font-mono"
})

const fontCode = Fira_Code({
	subsets: ["latin"],
	weight: "500",
	variable: "--font-code"
})

const fontSans = Geist({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-sans"
})

const applicationFonts = [
	fontBase.className,
	fontHandwriting.variable,
	fontMono.variable,
	fontCode.variable
]

export { applicationFonts, fontBase, fontCode, fontHandwriting, fontMono, fontSans }
