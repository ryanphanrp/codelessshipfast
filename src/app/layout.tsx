import { AppSidebar } from "@/components/app-sidebar"
import { DesignSystemProvider } from "@/components/provider/design-system"
import { SidebarTrigger } from "@/components/ui/sidebar"
import siteConfig from "@/config/site"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"
import "./globals.css"
const fontCode = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] })
const fontSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const fontMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn(fontSans.variable, fontMono.variable, fontCode.variable, "antialiased")}>
				<DesignSystemProvider>
					<AppSidebar />
					<main className="w-full">
						<SidebarTrigger />
						{children}
					</main>
				</DesignSystemProvider>
			</body>
		</html>
	)
}
