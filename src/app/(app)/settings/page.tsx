"use client"

import { Button } from "@/components/hexta-ui"
import { useTheme } from "next-themes"

export default function Page() {
	const { setTheme } = useTheme()
	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="font-bold text-3xl tracking-tight">Settings</h1>
					<p className="text-muted-foreground">
						Manage your account preferences and application settings.
					</p>
				</div>
				<div className="space-y-6">
					<div className="space-y-2">
						<h3 className="font-medium text-lg">Appearance</h3>
						<p className="text-muted-foreground text-sm">
							Customize the appearance of the app. Automatically switch between day and night
							themes.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<button
							onClick={() => setTheme("light")}
							className="group flex flex-col space-y-3  border-2 border-muted p-4 hover:border-accent">
							<div className="space-y-2  bg-slate-100 p-2">
								<div className="space-y-2  bg-white p-2 shadow-sm">
									<div className="h-2 w-[80px]  bg-slate-200" />
									<div className="h-2 w-[100px]  bg-slate-200" />
								</div>
								<div className="flex items-center space-x-2  bg-white p-2 shadow-sm">
									<div className="h-4 w-4  bg-slate-200" />
									<div className="h-2 w-[100px]  bg-slate-200" />
								</div>
							</div>
							<span className="font-medium text-sm">Light</span>
						</button>

						<button
							onClick={() => setTheme("dark")}
							className="group flex flex-col space-y-3  border-2 border-muted p-4 hover:border-accent">
							<div className="space-y-2  bg-slate-950 p-2">
								<div className="space-y-2  bg-slate-800 p-2 shadow-sm">
									<div className="h-2 w-[80px]  bg-slate-400" />
									<div className="h-2 w-[100px]  bg-slate-400" />
								</div>
								<div className="flex items-center space-x-2  bg-slate-800 p-2 shadow-sm">
									<div className="h-4 w-4  bg-slate-400" />
									<div className="h-2 w-[100px]  bg-slate-400" />
								</div>
							</div>
							<span className="font-medium text-sm">Dark</span>
						</button>

						<button
							onClick={() => setTheme("system")}
							className="group flex flex-col space-y-3  border-2 border-muted p-4 hover:border-accent">
							<div className="space-y-2  bg-gradient-to-r from-slate-100 to-slate-950 p-2">
								<div className="space-y-2  bg-slate-300 p-2 shadow-sm">
									<div className="h-2 w-[80px]  bg-slate-400" />
									<div className="h-2 w-[100px]  bg-slate-400" />
								</div>
								<div className="flex items-center space-x-2  bg-slate-300 p-2 shadow-sm">
									<div className="h-4 w-4  bg-slate-400" />
									<div className="h-2 w-[100px]  bg-slate-400" />
								</div>
							</div>
							<span className="font-medium text-sm">System</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
