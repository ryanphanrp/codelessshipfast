import { clipboardLogger } from "@/lib/logger"
import { copyToClipboard, isClipboardSupported, pasteFromClipboard } from "@/lib/shared"
import type { ClipboardResult, ClipboardState } from "@/types"
import { useCallback, useState } from "react"

interface ClipboardOperationsOptions {
	onSuccess?: (text?: string) => void
	onError?: (error: string | null) => void
	debounceMs?: number
}

/**
 * Enhanced clipboard operations hook with better error handling and features
 */
export function useClipboardOperations(options: ClipboardOperationsOptions = {}) {
	const { onSuccess, onError, debounceMs = 1000 } = options

	const [state, setState] = useState<ClipboardState>({
		success: false,
		error: null
	})

	const [lastOperation, setLastOperation] = useState<string>("")

	const supported = isClipboardSupported()

	const updateState = useCallback((newState: Partial<ClipboardState>) => {
		setState((prev) => ({ ...prev, ...newState }))
	}, [])

	const handleCopy = useCallback(
		async (text: string): Promise<boolean> => {
			if (!text.trim()) {
				const error = "Cannot copy empty text"
				updateState({ success: false, error })
				onError?.(error)
				clipboardLogger.warn("Attempted to copy empty text")
				return false
			}

			if (!supported) {
				const error = "Clipboard API not supported"
				updateState({ success: false, error })
				onError?.(error)
				clipboardLogger.warn("Clipboard API not supported")
				return false
			}

			// Prevent rapid successive calls
			const now = Date.now()
			if (lastOperation === "copy" && now - Date.now() < debounceMs) {
				return state.success
			}

			setLastOperation("copy")

			try {
				const result = await copyToClipboard(text)
				updateState({
					success: result.success,
					error: result.error || null
				})

				if (result.success) {
					onSuccess?.(text)
					clipboardLogger.info("Text copied to clipboard", { length: text.length })
				} else {
					onError?.(result.error || "Copy failed")
					clipboardLogger.error("Failed to copy to clipboard", result.error)
				}

				return result.success
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Copy operation failed"
				updateState({ success: false, error: errorMessage })
				onError?.(errorMessage)
				clipboardLogger.error("Copy operation failed", error)
				return false
			}
		},
		[supported, lastOperation, debounceMs, state.success, updateState, onSuccess, onError]
	)

	const handlePaste = useCallback(async (): Promise<ClipboardResult> => {
		if (!supported) {
			const result: ClipboardResult = {
				success: false,
				error: "Clipboard API not supported"
			}
			updateState({ success: false, error: result.error })
			onError?.(result.error || null)
			clipboardLogger.warn("Clipboard API not supported")
			return result
		}

		// Prevent rapid successive calls
		const now = Date.now()
		if (lastOperation === "paste" && now - Date.now() < debounceMs) {
			return { success: state.success, text: undefined, error: state.error }
		}

		setLastOperation("paste")

		try {
			const result = await pasteFromClipboard()
			updateState({
				success: result.success,
				error: result.error || null
			})

			if (result.success) {
				onSuccess?.(result.text)
				clipboardLogger.info("Text pasted from clipboard", {
					length: result.text?.length || 0
				})
			} else {
				onError?.(result.error || "Paste failed")
				clipboardLogger.error("Failed to paste from clipboard", result.error)
			}

			return result
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Paste operation failed"
			const result: ClipboardResult = {
				success: false,
				error: errorMessage
			}
			updateState({ success: false, error: errorMessage })
			onError?.(errorMessage)
			clipboardLogger.error("Paste operation failed", error)
			return result
		}
	}, [supported, lastOperation, debounceMs, updateState, onSuccess, onError])

	const reset = useCallback(() => {
		setState({ success: false, error: null })
		setLastOperation("")
	}, [])

	return {
		...state,
		supported,
		copy: handleCopy,
		paste: handlePaste,
		reset
	}
}
