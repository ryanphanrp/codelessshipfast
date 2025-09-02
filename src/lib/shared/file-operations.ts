/**
 * Shared file operation utilities
 */

/**
 * Download text content as a file
 */
export function downloadAsFile(
	content: string,
	filename: string,
	mimeType: string = "text/plain"
): void {
	const blob = new Blob([content], { type: mimeType })
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}

/**
 * Download JSON content as a file
 */
export function downloadJson(data: unknown, filename: string): void {
	const jsonString = JSON.stringify(data, null, 2)
	downloadAsFile(jsonString, filename, "application/json")
}

/**
 * Download Protocol Buffer definition
 */
export function downloadProtoFile(
	protoContent: string,
	filename: string = "converted.proto"
): void {
	downloadAsFile(protoContent, filename, "text/plain")
}

/**
 * Read file as text using FileReader API
 */
export function readFileAsText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const result = e.target?.result
			if (typeof result === "string") {
				resolve(result)
			} else {
				reject(new Error("Failed to read file as text"))
			}
		}
		reader.onerror = () => reject(new Error("File reading error"))
		reader.readAsText(file)
	})
}

/**
 * Create a file input element programmatically
 */
export function createFileInput(accept: string = "*", multiple: boolean = false): HTMLInputElement {
	const input = document.createElement("input")
	input.type = "file"
	input.accept = accept
	input.multiple = multiple
	return input
}

/**
 * Trigger file selection dialog
 */
export function selectFile(
	accept: string = "*",
	multiple: boolean = false
): Promise<FileList | null> {
	return new Promise((resolve) => {
		const input = createFileInput(accept, multiple)
		input.onchange = (e) => {
			const target = e.target as HTMLInputElement
			resolve(target.files)
			// Clean up
			document.body.removeChild(input)
		}
		input.oncancel = () => {
			resolve(null)
			document.body.removeChild(input)
		}
		document.body.appendChild(input)
		input.click()
	})
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
	const lastDotIndex = filename.lastIndexOf(".")
	return lastDotIndex !== -1 ? filename.slice(lastDotIndex + 1).toLowerCase() : ""
}

/**
 * Validate file type by extension
 */
export function validateFileType(filename: string, allowedExtensions: string[]): boolean {
	const extension = getFileExtension(filename)
	return allowedExtensions.includes(extension)
}
