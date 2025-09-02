import { handleError, hasContent } from "@/lib/shared"
import type { ConversionMode } from "@/types"
import { useCallback, useState } from "react"

interface ConversionState<TMode = string> {
	input: string
	output: string
	error: string | null
	isConverting: boolean
	mode: TMode
}

interface ConversionOptions<TMode = string> {
	defaultMode?: TMode
	validateInput?: (input: string) => boolean
	onSuccess?: (result: string) => void
	onError?: (error: unknown) => void
}

/**
 * Generic hook for handling conversion operations
 */
export function useConversion<TMode = string>(options: ConversionOptions<TMode> = {}) {
	const { defaultMode, validateInput, onSuccess, onError } = options

	// For string types, use empty string as default, otherwise require explicit defaultMode
	const getDefaultMode = (): TMode => {
		if (defaultMode !== undefined) {
			return defaultMode
		}
		// For string-like types, return empty string
		return "" as any as TMode
	}

	const [state, setState] = useState<ConversionState<TMode>>({
		input: "",
		output: "",
		error: null,
		isConverting: false,
		mode: getDefaultMode()
	})

	const setInput = useCallback((input: string) => {
		setState((prev) => ({ ...prev, input }))
	}, [])

	const setMode = useCallback((mode: TMode) => {
		setState((prev) => ({ ...prev, mode }))
	}, [])

	const clearInput = useCallback(() => {
		setState((prev) => ({ ...prev, input: "", output: "", error: null }))
	}, [])

	const clearOutput = useCallback(() => {
		setState((prev) => ({ ...prev, output: "", error: null }))
	}, [])

	const convert = useCallback(
		async (converter: (input: string, mode?: TMode) => Promise<string> | string, mode?: TMode) => {
			const currentMode = mode || state.mode

			// Validate input
			if (!hasContent(state.input)) {
				setState((prev) => ({ ...prev, error: "Input cannot be empty" }))
				return
			}

			if (validateInput && !validateInput(state.input)) {
				setState((prev) => ({ ...prev, error: "Input validation failed" }))
				return
			}

			setState((prev) => ({ ...prev, isConverting: true, error: null }))

			try {
				const result = await converter(state.input, currentMode)
				setState((prev) => ({
					...prev,
					output: result,
					isConverting: false
				}))

				if (onSuccess) {
					onSuccess(result)
				}
			} catch (error) {
				setState((prev) => ({
					...prev,
					output: "",
					error: error instanceof Error ? error.message : "Conversion failed",
					isConverting: false
				}))

				handleError(error, {
					conversion: "generic-conversion",
					mode: currentMode,
					inputLength: state.input.length
				})

				if (onError) {
					onError(error)
				}
			}
		},
		[state.input, state.mode, validateInput, onSuccess, onError]
	)

	return {
		...state,
		setInput,
		setMode,
		clearInput,
		clearOutput,
		convert
	}
}
