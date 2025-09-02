import {
	downloadAsFile,
	downloadJson,
	downloadProtoFile,
	getFileExtension,
	handleError,
	readFileAsText,
	selectFile,
	validateFileType
} from "@/lib/shared"
import { useCallback, useState } from "react"

interface FileOperationState {
	loading: boolean
	error: string | null
	fileName?: string
	fileSize?: number
}

interface FileDownloadOptions {
	filename?: string
	mimeType?: string
}

interface FileSelectOptions {
	accept?: string
	multiple?: boolean
	allowedExtensions?: string[]
}

/**
 * Hook for file operations (download, upload, validation)
 */
export function useFileOperations() {
	const [state, setState] = useState<FileOperationState>({
		loading: false,
		error: null
	})

	const updateState = useCallback((updates: Partial<FileOperationState>) => {
		setState((prev) => ({ ...prev, ...updates }))
	}, [])

	const downloadText = useCallback(
		(content: string, options: FileDownloadOptions = {}) => {
			try {
				const { filename = "download.txt", mimeType = "text/plain" } = options
				downloadAsFile(content, filename, mimeType)
				updateState({ error: null })
			} catch (error) {
				const errorMessage = "Failed to download file"
				updateState({ error: errorMessage })
				handleError(error, { operation: "download-text", filename: options.filename })
			}
		},
		[updateState]
	)

	const downloadJSON = useCallback(
		(data: unknown, filename: string = "data.json") => {
			try {
				downloadJson(data, filename)
				updateState({ error: null })
			} catch (error) {
				const errorMessage = "Failed to download JSON file"
				updateState({ error: errorMessage })
				handleError(error, { operation: "download-json", filename })
			}
		},
		[updateState]
	)

	const downloadProto = useCallback(
		(content: string, filename: string = "converted.proto") => {
			try {
				downloadProtoFile(content, filename)
				updateState({ error: null })
			} catch (error) {
				const errorMessage = "Failed to download Proto file"
				updateState({ error: errorMessage })
				handleError(error, { operation: "download-proto", filename })
			}
		},
		[updateState]
	)

	const selectFileForUpload = useCallback(
		async (options: FileSelectOptions = {}) => {
			const { accept, multiple = false, allowedExtensions } = options

			updateState({ loading: true, error: null })

			try {
				const fileList = await selectFile(accept, multiple)
				if (!fileList || fileList.length === 0) {
					updateState({ loading: false })
					return null
				}

				const file = fileList[0]

				// Validate file type if extensions are specified
				if (allowedExtensions && !validateFileType(file.name, allowedExtensions)) {
					const errorMessage = `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`
					updateState({ loading: false, error: errorMessage })
					return null
				}

				updateState({
					loading: false,
					fileName: file.name,
					fileSize: file.size
				})

				return file
			} catch (error) {
				const errorMessage = "Failed to select file"
				updateState({ loading: false, error: errorMessage })
				handleError(error, { operation: "file-select", ...options })
				return null
			}
		},
		[updateState]
	)

	const readFileContent = useCallback(
		async (file: File) => {
			updateState({ loading: true, error: null })

			try {
				const content = await readFileAsText(file)
				updateState({
					loading: false,
					fileName: file.name,
					fileSize: file.size
				})
				return content
			} catch (error) {
				const errorMessage = "Failed to read file content"
				updateState({ loading: false, error: errorMessage })
				handleError(error, {
					operation: "file-read",
					filename: file.name,
					fileSize: file.size
				})
				return null
			}
		},
		[updateState]
	)

	const getFileInfo = useCallback((file: File) => {
		return {
			name: file.name,
			size: file.size,
			type: file.type,
			extension: getFileExtension(file.name),
			lastModified: file.lastModified
		}
	}, [])

	const reset = useCallback(() => {
		setState({
			loading: false,
			error: null
		})
	}, [])

	return {
		...state,
		downloadText,
		downloadJSON,
		downloadProto,
		selectFileForUpload,
		readFileContent,
		getFileInfo,
		reset
	}
}
