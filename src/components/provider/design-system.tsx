import { Toaster, TooltipProvider, SidebarProvider, SidebarTrigger } from "@/components/hexta-ui"
import { ThemeProviderProps } from "next-themes"
import { AppSidebar } from "../layout/sidebar/app-sidebar"
import { ThemeProvider } from "./theme"

type DesignSystemProviderProperties = ThemeProviderProps

export const DesignSystemProvider = ({
	children,
	...properties
}: DesignSystemProviderProperties) => (
	<ThemeProvider
		defaultTheme="light"
		attribute="class"
		enableSystem={false}
		disableTransitionOnChange
		{...properties}>
		<Toaster richColors position="top-right" />
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarTrigger />
				<main className="w-[80%] mx-auto">
					{children}
				</main>
			</SidebarProvider>
		</TooltipProvider>
	</ThemeProvider>
)
