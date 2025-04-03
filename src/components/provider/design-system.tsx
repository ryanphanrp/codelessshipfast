import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProviderProps } from "next-themes"
import { AppSidebar } from "../app-sidebar"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { ThemeProvider } from "./theme"

type DesignSystemProviderProperties = ThemeProviderProps

export const DesignSystemProvider = ({
	children,
	...properties
}: DesignSystemProviderProperties) => (
	<ThemeProvider attribute="class" enableSystem disableTransitionOnChange {...properties}>
		<Toaster richColors position="top-right" />
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarTrigger />
				{children}
			</SidebarProvider>
		</TooltipProvider>
	</ThemeProvider>
)
