"use client"

import { ThemeSwitcher } from "@/components/provider/theme-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Home, Rabbit, ScrollText, Settings2 } from "lucide-react"
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
	const isActive = (url: string) => {
		console.log("pathname", pathname, "url", url)
		console.log("isActive", pathname === url)
		return pathname === url
	}

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			className="z-0 block border-sidebar-border border-r bg-sidebar-background">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="py-10">
						<BrandLogo />
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-4">
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											className={cn(
												"flex items-center gap-2",
												isActive(item.url) && "bg-zinc-100 font-bold text-zinc-900"
											)}
											href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex items-center justify-between px-2 py-2">
					<span className="font-medium text-sidebar-foreground/70 text-xs">Theme</span>
					<ThemeSwitcher />
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
