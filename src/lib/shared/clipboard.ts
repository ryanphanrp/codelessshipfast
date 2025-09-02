/**
 * Shared clipboard utilities
 */

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; error?: string }> {
	try {
		await navigator.clipboard.writeText(text)
		return { success: true }
	} catch (error) {
		// Fallback for older browsers or when clipboard API is not available
		try {
			const textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand("copy")
			document.body.removeChild(textArea)
			return { success: true }
		} catch (fallbackError) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to copy to clipboard"
			}
		}
	}
}

/**
 * Read text from clipboard
 */
export async function pasteFromClipboard(): Promise<{
	success: boolean
	text?: string
	error?: string
}> {
	try {
		const text = await navigator.clipboard.readText()
		return { success: true, text }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to read from clipboard"
		}
	}
}

/**
 * Check if clipboard API is supported
 */
export function isClipboardSupported(): boolean {
	return typeof navigator !== "undefined" && "clipboard" in navigator
}

/**
 * Create a debounced copy function to prevent rapid successive calls
 */
export function createDebouncedCopy(delay: number = 1000) {
	let timeoutId: NodeJS.Timeout | null = null

	return async (text: string): Promise<{ success: boolean; error?: string }> => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		return new Promise((resolve) => {
			timeoutId = setTimeout(async () => {
				const result = await copyToClipboard(text)
				resolve(result)
			}, delay)
		})
	}
}
