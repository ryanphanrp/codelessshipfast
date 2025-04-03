import { DesignSystemProvider } from "@/components/provider/design-system"
import { applicationFonts } from "@/config/fonts"
import siteConfig from "@/config/site"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" }
	]
}

export const metadata: Metadata = {
	title: siteConfig.title,
	applicationName: siteConfig.applicationName,
	description: siteConfig.description,
	authors: [{ name: siteConfig.fullName }]
}

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<body className={cn(...applicationFonts, "antialiased")}>
				<DesignSystemProvider>{children}</DesignSystemProvider>
			</body>
		</html>
	)
}
