import { Button } from "@/components/hexta-ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/hexta-ui"
import type { ExampleItem } from "@/types"
import { ChevronDown } from "lucide-react"
import { memo, useCallback } from "react"

interface ExampleLoaderProps {
	examples: readonly ExampleItem[]
	onLoadExample: (content: string) => void
}

export const ExampleLoader = memo(function ExampleLoader({
	examples,
	onLoadExample
}: ExampleLoaderProps) {
	const handleLoadExample = useCallback(
		(content: string) => {
			onLoadExample(content)
		},
		[onLoadExample]
	)
	if (examples.length === 1) {
		return (
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleLoadExample(examples[0].content)}
				className="gap-2">
				Load Example
			</Button>
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					Load Example
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{examples.map((example, index) => (
					<DropdownMenuItem key={index} onClick={() => handleLoadExample(example.content)}>
						{example.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
})
