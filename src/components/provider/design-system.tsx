import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProviderProps } from "next-themes"
import { SidebarProvider } from "../ui/sidebar"
import { ThemeProvider } from "./theme"

type DesignSystemProviderProperties = ThemeProviderProps

export const DesignSystemProvider = ({
	children,
	...properties
}: DesignSystemProviderProperties) => (
	<ThemeProvider attribute="class" enableSystem disableTransitionOnChange {...properties}>
		<Toaster richColors position="top-right" />
		<TooltipProvider>
			<SidebarProvider>{children}</SidebarProvider>
		</TooltipProvider>
	</ThemeProvider>
)
