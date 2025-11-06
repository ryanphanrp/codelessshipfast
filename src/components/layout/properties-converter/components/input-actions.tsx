import { Button } from "@/components/hexta-ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/hexta-ui"
import type { ClipboardState } from "@/types"
import { ChevronDown, ClipboardPaste, Copy, Trash2 } from "lucide-react"
import { memo, useCallback } from "react"

interface InputActionsProps {
	hasInput: boolean
	clipboardState: ClipboardState
	onPaste: () => void
	onCopy: () => void
	onClear: () => void
}

export const InputActions = memo(function InputActions({
	hasInput,
	clipboardState,
	onPaste,
	onCopy,
	onClear
}: InputActionsProps) {
	const handlePaste = useCallback(() => {
		onPaste()
	}, [onPaste])

	const handleCopy = useCallback(() => {
		onCopy()
	}, [onCopy])

	const handleClear = useCallback(() => {
		onClear()
	}, [onClear])
	return (
		<div className="flex gap-2">
			<Button variant="outline" size="sm" onClick={handlePaste} className="gap-2">
				<ClipboardPaste className="h-4 w-4" />
				Paste
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={handleCopy}
				disabled={!hasInput}
				className="gap-2">
				<Copy className="h-4 w-4" />
				{clipboardState.success ? "Copied!" : "Copy"}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={handleClear}
				disabled={!hasInput}
				className="gap-2">
				<Trash2 className="h-4 w-4" />
				Clear
			</Button>
		</div>
	)
})
