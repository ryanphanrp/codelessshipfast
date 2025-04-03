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
import { Home, Inbox } from "lucide-react"
import BrandLogo from "./layout/brand/logo"

const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home
	},
	{
		title: "SQL Placeholder",
		url: "/features/sql-placeholder",
		icon: Inbox
	}
]

export function AppSidebar() {
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
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
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
