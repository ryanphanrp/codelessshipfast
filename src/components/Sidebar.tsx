import SidebarItems from "./SidebarItems"

const Sidebar = () => {
	return (
		<aside className="hidden h-screen min-w-52 border-border border-r bg-muted p-4 pt-8 shadow-inner md:block">
			<div className="flex h-full flex-col justify-between">
				<div className="space-y-4">
					<h3 className="ml-4 font-semibold text-lg">Logo</h3>
					<SidebarItems />
				</div>
			</div>
		</aside>
	)
}

export default Sidebar
