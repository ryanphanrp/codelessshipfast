import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JsonViewerMode } from "@/types"

interface JsonViewerTabsProps {
	mode: JsonViewerMode
	onModeChange: (mode: string) => void
	children: React.ReactNode
}

export function JsonViewerTabs({ mode, onModeChange, children }: JsonViewerTabsProps) {
	const handleValueChange = (value: string) => {
		onModeChange(value as JsonViewerMode)
	}

	return (
		<Tabs value={mode} onValueChange={handleValueChange} className="w-full">
			<TabsList className="grid w-full grid-cols-4">
				<TabsTrigger value="pretty-print" className="text-xs">
					Pretty Print
				</TabsTrigger>
				<TabsTrigger value="minify" className="text-xs">
					Minify
				</TabsTrigger>
				<TabsTrigger value="tree-view" className="text-xs">
					Tree View
				</TabsTrigger>
				<TabsTrigger value="validate" className="text-xs">
					Validate
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
