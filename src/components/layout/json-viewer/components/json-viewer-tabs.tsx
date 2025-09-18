import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { JsonViewerMode } from "@/types"
import { 
	Code, 
	FileText, 
	TreePine, 
	CheckCircle, 
	FileCode2, 
	Search, 
	GitCompare, 
	BarChart3, 
	UnfoldHorizontal, 
	Network 
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
	category: 'transform' | 'analyze' | 'compare'
	badge?: string
}

const TAB_CONFIGS: TabConfig[] = [
	// Transform category
	{ value: 'pretty-print', label: 'Pretty', icon: Code, category: 'transform' },
	{ value: 'minify', label: 'Minify', icon: FileText, category: 'transform' },
	{ value: 'tree-view', label: 'Tree', icon: TreePine, category: 'transform' },
	{ value: 'flatten', label: 'Flatten', icon: UnfoldHorizontal, category: 'transform' },
	
	// Analyze category
	{ value: 'validate', label: 'Validate', icon: CheckCircle, category: 'analyze' },
	{ value: 'schema', label: 'Schema', icon: FileCode2, category: 'analyze', badge: 'New' },
	{ value: 'jsonpath', label: 'JSONPath', icon: Search, category: 'analyze', badge: 'New' },
	{ value: 'stats', label: 'Stats', icon: BarChart3, category: 'analyze', badge: 'New' },
	
	// Compare category
	{ value: 'diff', label: 'Diff', icon: GitCompare, category: 'compare', badge: 'New' },
	{ value: 'visualize', label: 'Visualize', icon: Network, category: 'compare', badge: 'New' }
]

const CATEGORY_COLORS = {
	transform: 'bg-blue-50 text-blue-700 border-blue-200',
	analyze: 'bg-green-50 text-green-700 border-green-200',
	compare: 'bg-purple-50 text-purple-700 border-purple-200'
}

export function JsonViewerTabs({ mode, onModeChange, children }: JsonViewerTabsProps) {
	const handleValueChange = (value: string) => {
		onModeChange(value as JsonViewerMode)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault()
			const currentIndex = TAB_CONFIGS.findIndex(tab => tab.value === mode)
			const nextIndex = event.key === 'ArrowLeft' 
				? Math.max(0, currentIndex - 1)
				: Math.min(TAB_CONFIGS.length - 1, currentIndex + 1)
			
			onModeChange(TAB_CONFIGS[nextIndex].value)
		}
	}

	return (
		<Tabs value={mode} onValueChange={handleValueChange} className="w-full">
			<div className="border-b bg-background">
				<ScrollArea className="w-full whitespace-nowrap">
					<TabsList className="inline-flex h-12 items-center justify-start rounded-none bg-transparent p-0">
						{TAB_CONFIGS.map((tab, index) => {
							const Icon = tab.icon
							const isActive = mode === tab.value
							const categoryColor = CATEGORY_COLORS[tab.category]
							
							return (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={`
										group relative flex h-12 items-center justify-center gap-2 
										rounded-none border-b-2 border-transparent bg-transparent 
										px-4 py-2 text-sm font-medium transition-all
										hover:bg-muted hover:text-foreground
										focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
										data-[state=active]:border-primary data-[state=active]:bg-background 
										data-[state=active]:text-foreground data-[state=active]:shadow-sm
										${index > 0 ? 'ml-1' : ''}
									`}
									onKeyDown={handleKeyDown}
									>
									{/* Category indicator */}
									<div className={`
										absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full opacity-0 
										transition-opacity group-data-[state=active]:opacity-100
										${tab.category === 'transform' ? 'bg-blue-500' : ''}
										${tab.category === 'analyze' ? 'bg-green-500' : ''}
										${tab.category === 'compare' ? 'bg-purple-500' : ''}
									`} />
									
									<Icon className="h-4 w-4" />
									<span className="hidden sm:inline">{tab.label}</span>
									
									{tab.badge && (
										<Badge 
											variant="secondary" 
											className="ml-1 h-5 px-1.5 text-xs"
										>
											{tab.badge}
										</Badge>
									)}
								</TabsTrigger>
							)
						})}
					</TabsList>
					<ScrollBar orientation="horizontal" className="invisible" />
				</ScrollArea>
			</div>
			{children}
		</Tabs>
	)
}
