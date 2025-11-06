import { Button } from "@/components/hexta-ui"
import { Copy, Trash2 } from "lucide-react"
import { memo, useCallback } from "react"

interface OutputActionsProps {
	hasOutput: boolean
	onCopy: () => void
	onClear: () => void
}

export const OutputActions = memo(function OutputActions({
	hasOutput,
	onCopy,
	onClear
}: OutputActionsProps) {
	const handleCopy = useCallback(() => {
		onCopy()
	}, [onCopy])

	const handleClear = useCallback(() => {
		onClear()
	}, [onClear])
	return (
		<div className="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={handleCopy}
				disabled={!hasOutput}
				className="gap-2">
				<Copy className="h-4 w-4" />
				Copy All
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={handleClear}
				disabled={!hasOutput}
				className="gap-2">
				<Trash2 className="h-4 w-4" />
				Clear
			</Button>
		</div>
	)
})
