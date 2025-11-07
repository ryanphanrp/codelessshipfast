"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/hexta-ui/card"
import { Keyboard } from "lucide-react"

interface ShortcutGroup {
	title: string
	shortcuts: Array<{
		key: string
		action: string
	}>
}

interface KeyboardShortcutsProps {
	groups?: ShortcutGroup[]
}

const defaultShortcuts: ShortcutGroup[] = [
	{
		title: "Navigation",
		shortcuts: [
			{ key: "⌘K", action: "Quick search" },
			{ key: "⌘/", action: "Show shortcuts" },
			{ key: "Esc", action: "Close modal/dialog" }
		]
	},
	{
		title: "Editing",
		shortcuts: [
			{ key: "Ctrl+V", action: "Paste input" },
			{ key: "Ctrl+C", action: "Copy output" },
			{ key: "Ctrl+Z", action: "Undo" },
			{ key: "Ctrl+Shift+Z", action: "Redo" }
		]
	}
]

export function KeyboardShortcuts({ groups = defaultShortcuts }: KeyboardShortcutsProps) {
	return (
		<Card className="border-l-2 border-l-purple-500/30">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<div className="flex size-8 items-center justify-center  border border-purple-500/20 bg-purple-500/5">
						<Keyboard className="size-4 text-purple-600" />
					</div>
					Keyboard Shortcuts
				</CardTitle>
				<CardDescription>Speed up your workflow</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{groups.map((group, groupIndex) => (
						<div key={groupIndex} className="space-y-3">
							<h4 className="font-medium text-muted-foreground text-sm">{group.title}</h4>
							<div className="space-y-2">
								{group.shortcuts.map((shortcut, index) => (
									<div
										key={index}
										className="flex items-center justify-between  border border-border/50 p-3 transition-colors hover:bg-accent/50">
										<span className="text-sm">{shortcut.action}</span>
										<kbd className=" border border-border bg-muted px-3 py-1.5 font-mono text-sm">
											{shortcut.key}
										</kbd>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

// Compact inline version for headers
export function KeyboardHint({ keys, action }: { keys: string; action?: string }) {
	return (
		<div className="flex items-center gap-2 text-muted-foreground text-sm">
			<kbd className=" border border-border bg-muted px-2 py-1 font-mono text-xs">{keys}</kbd>
			{action && <span>{action}</span>}
		</div>
	)
}
