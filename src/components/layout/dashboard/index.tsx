"use client"

import { Badge } from "@/components/hexta-ui/badge"
import { Button } from "@/components/hexta-ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/hexta-ui/card"
import { Code2, Rabbit, ScrollText, Settings2, Zap, ArrowRight, Keyboard } from "lucide-react"
import Link from "next/link"

const quickActions = [
	{
		title: "JSON Viewer",
		description: "Format and validate JSON instantly",
		href: "/features/json-viewer",
		icon: Code2,
		iconBg: "border-cyan-500/20 bg-cyan-500/5 group-hover:bg-cyan-500/10",
		iconColor: "text-cyan-600",
		shortcut: "⌘J"
	},
	{
		title: "SQL Placeholder",
		description: "Format SQL with placeholders",
		href: "/features/sql-placeholder",
		icon: ScrollText,
		iconBg: "border-blue-500/20 bg-blue-500/5 group-hover:bg-blue-500/10",
		iconColor: "text-blue-600",
		shortcut: "⌘S"
	},
	{
		title: "Record to Protobuf",
		description: "Convert records to protobuf format",
		href: "/features/record-protobuf",
		icon: Rabbit,
		iconBg: "border-purple-500/20 bg-purple-500/5 group-hover:bg-purple-500/10",
		iconColor: "text-purple-600",
		shortcut: "⌘R"
	},
	{
		title: "Properties Converter",
		description: "Convert between property formats",
		href: "/features/properties-converter",
		icon: Settings2,
		iconBg: "border-orange-500/20 bg-orange-500/5 group-hover:bg-orange-500/10",
		iconColor: "text-orange-600",
		shortcut: "⌘P"
	}
]

const recentTools = [
	{ name: "JSON Viewer", time: "2 min ago", status: "success" },
	{ name: "SQL Formatter", time: "15 min ago", status: "success" },
	{ name: "Protobuf Converter", time: "1 hour ago", status: "error" }
]

const keyboardShortcuts = [
	{ key: "⌘K", action: "Quick search" },
	{ key: "⌘/", action: "Show shortcuts" },
	{ key: "Ctrl+V", action: "Paste input" },
	{ key: "Ctrl+C", action: "Copy output" }
]

const Dashboard = () => {
	return (
		<div className="container mx-auto max-w-7xl space-y-8 p-6">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
					<Badge variant="secondary" className="border border-primary/20">
						<Zap className="mr-1 size-3" />
						v1.0.0
					</Badge>
				</div>
				<p className="text-muted-foreground text-lg">
					Quick access to your developer utilities
				</p>
			</div>

			{/* Quick Actions Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{quickActions.map((action) => (
					<Link key={action.href} href={action.href}>
						<Card className="group h-full  border border-l-4 border-l-primary transition-all hover:border-primary/50">
							<CardHeader className="space-y-3 pb-4">
								<div className="flex items-start justify-between">
									<div
										className={`flex size-12 items-center justify-center  border transition-colors ${action.iconBg}`}>
										<action.icon className={`size-6 ${action.iconColor}`} />
									</div>
									<kbd className=" border border-border bg-muted px-2 py-1 font-mono text-xs">
										{action.shortcut}
									</kbd>
								</div>
								<div className="space-y-1">
									<CardTitle className="flex items-center gap-2 font-semibold text-base">
										{action.title}
										<ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
									</CardTitle>
									<CardDescription className="text-sm">
										{action.description}
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>

			{/* Content Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Recent Activity */}
				<Card className=" border border-l-2 border-l-primary/30">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl">
							<div className="flex size-8 items-center justify-center  border border-primary/20 bg-primary/5">
								<Zap className="size-4 text-primary" />
							</div>
							Recent Activity
						</CardTitle>
						<CardDescription>
							Your latest tool usage
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentTools.map((tool, index) => (
								<div
									key={index}
									className="flex items-center justify-between  border border-border/50 p-3 transition-colors hover:bg-accent/50">
									<div className="flex items-center gap-3">
										<div
											className={`size-2  ${
												tool.status === "success"
													? "bg-green-500"
													: "bg-red-500"
											}`}
										/>
										<div>
											<p className="font-medium text-sm">{tool.name}</p>
											<p className="text-muted-foreground text-xs">{tool.time}</p>
										</div>
									</div>
									<Badge
										variant={tool.status === "success" ? "secondary" : "destructive"}
										className="font-mono text-xs">
										{tool.status}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Keyboard Shortcuts */}
				<Card className=" border border-l-2 border-l-purple-500/30">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl">
							<div className="flex size-8 items-center justify-center  border border-purple-500/20 bg-purple-500/5">
								<Keyboard className="size-4 text-purple-600" />
							</div>
							Keyboard Shortcuts
						</CardTitle>
						<CardDescription>
							Speed up your workflow
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{keyboardShortcuts.map((shortcut, index) => (
								<div
									key={index}
									className="flex items-center justify-between  border border-border/50 p-3">
									<span className="text-muted-foreground text-sm">
										{shortcut.action}
									</span>
									<kbd className=" border border-border bg-muted px-3 py-1.5 font-mono text-sm">
										{shortcut.key}
									</kbd>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Tips */}
			<Card className=" border border-l-2 border-l-cyan-500/30 bg-gradient-to-br from-background to-accent/20">
				<CardHeader>
					<CardTitle className="text-xl">💡 Pro Tips</CardTitle>
					<CardDescription>
						Get the most out of your developer tools
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<h4 className="font-medium text-sm">Clipboard Integration</h4>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Use <kbd className=" border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl+V</kbd> to paste directly into any tool. Results are automatically copied to clipboard.
							</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium text-sm">Dark Mode</h4>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Toggle between light and dark themes using the sidebar. Preferences are saved automatically.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Dashboard
