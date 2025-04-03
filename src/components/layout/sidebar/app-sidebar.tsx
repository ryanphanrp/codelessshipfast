"use client"

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Home, Rabbit, ScrollText } from "lucide-react"
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
			className="z-0 block border-r border-r-primary bg-white">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="py-10">
						<BrandLogo />
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link
											className={cn(
												"flex items-center gap-2",
												isActive(item.url) && "bg-muted font-bold text-cyan-700"
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
		</Sidebar>
	)
}
