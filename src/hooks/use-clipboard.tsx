import { useCallback, useState } from "react"

export interface ClipboardState {
	success: boolean
	error: string | null
}

const isClipboardAvailable =
	typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined"

/**
 * `useClipboard` provides functionality to copy to and paste from the clipboard.
 * It returns a state indicating the success or failure of clipboard operations, and functions to perform copy and paste.
 *
 * @return - An object containing `copyToClipboard` and `pasteFromClipboard` functions, and `state` with success and error information.
 */

function useClipboard() {
	const [state, setState] = useState<ClipboardState>({
		success: false,
		error: null
	})

	const copyToClipboard = useCallback(async (text: string) => {
		if (!isClipboardAvailable) {
			setState({ success: false, error: "Clipboard is not available" })
			return
		}

		if (!text.trim()) {
			setState({
				success: false,
				error: "Cannot copy empty or whitespace text"
			})
			return
		}

		// Input sanitization - remove potentially dangerous content
		const sanitizedText = text
			.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
			.replace(/javascript:/gi, "") // Remove javascript: URLs
			.trim()

		if (!sanitizedText) {
			setState({
				success: false,
				error: "Text contained only invalid characters"
			})
			return
		}

		try {
			await navigator.clipboard.writeText(sanitizedText)
			setState({ success: true, error: null })
		} catch (error) {
			setState({ success: false, error: "Failed to copy" })
		}
	}, [])

	const pasteFromClipboard = useCallback(async () => {
		if (!isClipboardAvailable) {
			setState({ success: false, error: "Clipboard is not available" })
			return ""
		}

		try {
			const text = await navigator.clipboard.readText()
			if (!text.trim()) {
				return ""
			}

			// Input sanitization for pasted content
			const sanitizedText = text
				.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
				.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
				.replace(/javascript:/gi, "") // Remove javascript: URLs
				.trim()

			if (!sanitizedText) {
				setState({
					success: false,
					error: "Clipboard content contained only invalid characters"
				})
				return ""
			}

			setState({ success: true, error: null })
			return sanitizedText
		} catch (error) {
			setState({ success: false, error: "Failed to paste" })
			return ""
		}
	}, [])

	return { copyToClipboard, pasteFromClipboard, state }
}

export { useClipboard }
