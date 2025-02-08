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
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home
	},
	{
		title: "Features",
		url: "/features",
		icon: Inbox
	},
	{
		title: "Calendar",
		url: "#",
		icon: Calendar
	},
	{
		title: "Search",
		url: "#",
		icon: Search
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings
	}
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<h1 className="my-8 font-bold text-2xl">CodelessShipFast</h1>
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
