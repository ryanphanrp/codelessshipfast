import { Badge } from "@/components/hexta-ui"
import { ScrollArea, ScrollBar } from "@/components/hexta-ui"
import { Tabs, TabsList, TabsTrigger } from "@/components/hexta-ui"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/hexta-ui"
import type { JsonViewerMode } from "@/types"
import {
	BarChart3,
	CheckCircle,
	Code,
	FileCode2,
	FileText,
	GitCompare,
	Info,
	Network,
	Search,
	TreePine,
	UnfoldHorizontal
} from "lucide-react"

interface JsonViewerTabsProps {
	mode: JsonViewerMode
	onModeChange: (mode: string) => void
	children: React.ReactNode
}

interface TabConfig {
	value: JsonViewerMode
	label: string
	icon: React.ComponentType<{ className?: string }>
	category: "format" | "analyze" | "visualize"
	badge?: string
	description: string
}

const TAB_CONFIGS: TabConfig[] = [
	// Format category
	{
		value: "pretty-print",
		label: "Pretty",
		icon: Code,
		category: "format",
		description: "Format JSON with proper indentation and line breaks"
	},
	{
		value: "minify",
		label: "Minify",
		icon: FileText,
		category: "format",
		description: "Compress JSON by removing whitespace and formatting"
	},
	{
		value: "tree-view",
		label: "Tree",
		icon: TreePine,
		category: "format",
		description: "Interactive collapsible tree view of JSON structure"
	},
	{
		value: "flatten",
		label: "Flatten",
		icon: UnfoldHorizontal,
		category: "format",
		description: "Convert nested JSON to flat key-value pairs"
	},

	// Analyze category
	{
		value: "validate",
		label: "Validate",
		icon: CheckCircle,
		category: "analyze",
		description: "Real-time JSON validation with error highlighting"
	},
	{
		value: "schema",
		label: "Schema",
		icon: FileCode2,
		category: "analyze",
		badge: "New",
		description: "Generate JSON schema from sample data"
	},
	{
		value: "jsonpath",
		label: "JSONPath",
		icon: Search,
		category: "analyze",
		badge: "New",
		description: "Query JSON data using JSONPath expressions"
	},
	{
		value: "stats",
		label: "Stats",
		icon: BarChart3,
		category: "analyze",
		badge: "New",
		description: "Analyze JSON structure and generate statistics"
	},

	// Visualize category
	{
		value: "diff",
		label: "Diff",
		icon: GitCompare,
		category: "visualize",
		badge: "New",
		description: "Compare two JSON files and show differences"
	},
	{
		value: "visualize",
		label: "Visualize",
		icon: Network,
		category: "visualize",
		badge: "New",
		description: "Interactive graph visualization of JSON data"
	}
]

const CATEGORY_COLORS = {
	format: "bg-blue-50 text-blue-700 border-blue-200",
	analyze: "bg-green-50 text-green-700 border-green-200",
	visualize: "bg-purple-50 text-purple-700 border-purple-200"
}

const CATEGORY_INFO = {
	format: {
		name: "Format",
		description: "Structure and organize JSON data",
		color: "bg-blue-500"
	},
	analyze: {
		name: "Analyze",
		description: "Inspect and understand JSON structure",
		color: "bg-green-500"
	},
	visualize: {
		name: "Visualize",
		description: "Compare and visualize JSON data",
		color: "bg-purple-500"
	}
}

export function JsonViewerTabs({ mode, onModeChange, children }: JsonViewerTabsProps) {
	const handleValueChange = (value: string) => {
		onModeChange(value as JsonViewerMode)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			event.preventDefault()
			const currentIndex = TAB_CONFIGS.findIndex((tab) => tab.value === mode)
			const nextIndex =
				event.key === "ArrowLeft"
					? Math.max(0, currentIndex - 1)
					: Math.min(TAB_CONFIGS.length - 1, currentIndex + 1)

			onModeChange(TAB_CONFIGS[nextIndex].value)
		}
	}

	// Group tabs by category
	const groupedTabs = TAB_CONFIGS.reduce(
		(acc, tab) => {
			if (!acc[tab.category]) {
				acc[tab.category] = []
			}
			acc[tab.category].push(tab)
			return acc
		},
		{} as Record<string, TabConfig[]>
	)

	return (
		<TooltipProvider delayDuration={300}>
			<Tabs value={mode} onValueChange={handleValueChange} className="w-full">
				<div className="border-b bg-background">
					<ScrollArea className="w-full whitespace-nowrap">
						<div className="space-y-1 p-4">
							{Object.entries(groupedTabs).map(([category, tabs]) => {
								const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]

								return (
									<div key={category} className="space-y-2">
										{/* Category Header */}
										<div className="flex items-center gap-2 px-2">
											<div className={`h-1 w-12 rounded-full ${categoryInfo.color}`} />
											<div className="flex items-center gap-2">
												<h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
													{categoryInfo.name}
												</h3>
												<span className="text-muted-foreground text-xs">
													{categoryInfo.description}
												</span>
											</div>
										</div>

										{/* Category Tabs */}
										<TabsList className="inline-flex h-10 items-center justify-start rounded-none bg-transparent p-0">
											{tabs.map((tab, index) => {
												const Icon = tab.icon
												const isActive = mode === tab.value

												return (
													<Tooltip key={tab.value}>
														<TooltipTrigger asChild>
															<TabsTrigger
																value={tab.value}
																className={`group relative flex h-10 items-center justify-center gap-2 rounded-none border-transparent border-b-2 bg-transparent px-3 py-2 font-medium text-sm transition-all hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm${index > 0 ? "ml-1" : ""}
																`}
																onKeyDown={handleKeyDown}>
																{/* Category indicator */}
																<div
																	className={`-top-0.5 -translate-x-1/2 absolute left-1/2 h-0.5 w-6 rounded-full opacity-0 transition-opacity group-data-[state=active]:opacity-100${categoryInfo.color}
																`}
																/>

																<Icon className="h-4 w-4" />
																<span className="hidden sm:inline">{tab.label}</span>

																{tab.badge && (
																	<Badge
																		variant="secondary"
																		className="ml-1 h-4 px-1.5 text-[10px]">
																		{tab.badge}
																	</Badge>
																)}
															</TabsTrigger>
														</TooltipTrigger>
														<TooltipContent side="bottom" className="max-w-xs">
															<div className="space-y-1">
																<p className="font-medium">{tab.label}</p>
																<p className="text-muted-foreground text-xs">{tab.description}</p>
															</div>
														</TooltipContent>
													</Tooltip>
												)
											})}
										</TabsList>
									</div>
								)
							})}
						</div>
						<ScrollBar orientation="horizontal" className="invisible" />
					</ScrollArea>
				</div>
				{children}
			</Tabs>
		</TooltipProvider>
	)
}
