"use client"

import { ThemeSwitcher, ThemeSwitcherCompact } from "@/components/provider/theme-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { navigationLogger } from "@/lib/logger"
import { cn } from "@/lib/utils"
import { Home, Rabbit, ScrollText, Settings2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import BrandLogo from "../brand/logo"
const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home
	},
	{
		title: "SQL Placeholder",
		url: "/features/sql-placeholder",
		icon: ScrollText
	},
	{
		title: "Record to Protobuf",
		url: "/features/record-protobuf",
		icon: Rabbit
	},
	{
		title: "Properties Converter",
		url: "/features/properties-converter",
		icon: Settings2
	}
]

export function AppSidebar() {
	const pathname = usePathname()
	const { state } = useSidebar()
	const isCollapsed = state === "collapsed"

	const isActive = (url: string) => {
		navigationLogger.debug("Checking navigation state", {
			pathname,
			url,
			isActive: pathname === url
		})
		return pathname === url
	}

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			className="z-0 block border-sidebar-border border-r bg-sidebar-background">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className={cn("py-10", isCollapsed && "flex justify-center p-2")}>
						{isCollapsed ? (
							<Image src="/pepe.svg" alt="logo" width={32} height={32} className="mx-auto" />
						) : (
							<BrandLogo />
						)}
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-4">
						<SidebarMenu>
							{items.map((item) => {
								if (isCollapsed) {
									return (
										<SidebarMenuItem key={item.title}>
											<Tooltip>
												<TooltipTrigger asChild>
													<SidebarMenuButton asChild>
														<Link
															className={cn(
																"flex items-center gap-2",
																isActive(item.url) && "bg-accent font-bold text-accent-foreground"
															)}
															href={item.url}>
															<item.icon />
															<span className="sr-only">{item.title}</span>
														</Link>
													</SidebarMenuButton>
												</TooltipTrigger>
												<TooltipContent side="right">{item.title}</TooltipContent>
											</Tooltip>
										</SidebarMenuItem>
									)
								}
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link
												className={cn(
													"flex items-center gap-2",
													isActive(item.url) && "bg-accent font-bold text-accent-foreground"
												)}
												href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div
					className={cn(
						"flex items-center gap-2 px-2 py-3",
						isCollapsed ? "justify-center" : "flex-col"
					)}>
					{isCollapsed ? (
						// Show only the switch when collapsed
						<ThemeSwitcherCompact />
					) : (
						// Show full theme switcher when expanded
						<ThemeSwitcher className="justify-center" />
					)}
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
