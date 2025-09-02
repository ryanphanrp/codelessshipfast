import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConversionMode } from "@/types"

interface ConversionTabsProps {
	mode: ConversionMode
	onModeChange: (mode: string) => void
	children: React.ReactNode
}

export function ConversionTabs({ mode, onModeChange, children }: ConversionTabsProps) {
	const handleValueChange = (value: string) => {
		if (value === "yaml-properties") {
			onModeChange("yaml-to-properties")
		} else {
			onModeChange(value)
		}
	}

	const tabValue =
		mode === "yaml-to-properties" || mode === "properties-to-yaml" ? "yaml-properties" : mode

	return (
		<Tabs value={tabValue} onValueChange={handleValueChange} className="w-full">
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="yaml-to-env">YAML/Properties → ENV</TabsTrigger>
				<TabsTrigger value="spring-to-env">Spring/@Value/Keys → ENV</TabsTrigger>
				<TabsTrigger value="yaml-properties">YAML ↔ Properties</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
