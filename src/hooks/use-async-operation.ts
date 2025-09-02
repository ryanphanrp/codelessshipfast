import { handleError } from "@/lib/shared"
import type { LogLevel } from "@/types"
import { useCallback, useState } from "react"

interface AsyncOperationState<T> {
	data: T | null
	loading: boolean
	error: string | null
}

interface AsyncOperationOptions {
	onSuccess?: (data: any) => void
	onError?: (error: unknown) => void
	logLevel?: LogLevel
	context?: Record<string, unknown>
}

/**
 * Generic hook for handling async operations with loading states and error handling
 */
export function useAsyncOperation<T = any>() {
	const [state, setState] = useState<AsyncOperationState<T>>({
		data: null,
		loading: false,
		error: null
	})

	const execute = useCallback(
		async (operation: () => Promise<T>, options: AsyncOperationOptions = {}): Promise<T | null> => {
			const { onSuccess, onError, logLevel = "error", context } = options

			setState((prev) => ({ ...prev, loading: true, error: null }))

			try {
				const result = await operation()
				setState((prev) => ({ ...prev, data: result, loading: false }))

				if (onSuccess) {
					onSuccess(result)
				}

				return result
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Operation failed"
				setState((prev) => ({ ...prev, error: errorMessage, loading: false }))

				handleError(error, { operation: "async-operation", ...context })

				if (onError) {
					onError(error)
				}

				return null
			}
		},
		[]
	)

	const reset = useCallback(() => {
		setState({ data: null, loading: false, error: null })
	}, [])

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }))
	}, [])

	return {
		...state,
		execute,
		reset,
		clearError
	}
}
