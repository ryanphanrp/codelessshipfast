// Using CSS fallback fonts instead of Google Fonts to avoid network dependency
// This allows builds to succeed in restricted network environments

// CSS font class names for fallback fonts
const fontBase = {
	className: "font-sans",
	variable: "--font-base"
}

const fontHandwriting = {
	className: "font-serif",
	variable: "--font-handwriting"
}

const fontMono = {
	className: "font-mono",
	variable: "--font-mono"
}

const fontCode = {
	className: "font-mono",
	variable: "--font-code"
}

const fontSans = {
	className: "font-sans",
	variable: "--font-sans"
}

const applicationFonts = [
	fontBase.className,
	fontHandwriting.variable,
	fontMono.variable,
	fontCode.variable
]

export { applicationFonts, fontBase, fontCode, fontHandwriting, fontMono, fontSans }
