import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useAsyncOperation } from "./use-async-operation"

describe("useAsyncOperation", () => {
	it("should handle successful async operation", async () => {
		const mockOperation = vi.fn().mockResolvedValue("success")
		const onSuccess = vi.fn()

		const { result } = renderHook(() => useAsyncOperation())

		await act(async () => {
			await result.current.execute(mockOperation, { onSuccess })
		})

		expect(result.current.loading).toBe(false)
		expect(result.current.data).toBe("success")
		expect(result.current.error).toBe(null)
		expect(onSuccess).toHaveBeenCalledWith("success")
	})

	it("should handle failed async operation", async () => {
		const mockOperation = vi.fn().mockRejectedValue(new Error("Operation failed"))
		const onError = vi.fn()

		const { result } = renderHook(() => useAsyncOperation())

		await act(async () => {
			await result.current.execute(mockOperation, { onError })
		})

		expect(result.current.loading).toBe(false)
		expect(result.current.data).toBe(null)
		expect(result.current.error).toBe("Operation failed")
		expect(onError).toHaveBeenCalled()
	})

	it("should reset state", () => {
		const { result } = renderHook(() => useAsyncOperation())

		// Simulate some state changes
		result.current.execute(vi.fn().mockResolvedValue("test"))

		result.current.reset()

		expect(result.current.data).toBe(null)
		expect(result.current.loading).toBe(false)
		expect(result.current.error).toBe(null)
	})

	it("should clear error", () => {
		const { result } = renderHook(() => useAsyncOperation())

		// Set an error state
		result.current.execute(vi.fn().mockRejectedValue(new Error("Test error")))

		result.current.clearError()

		expect(result.current.error).toBe(null)
	})

	it("should handle operation with custom context", async () => {
		const mockOperation = vi.fn().mockResolvedValue("success")
		const context = { userId: "123", action: "test" }

		const { result } = renderHook(() => useAsyncOperation())

		await act(async () => {
			await result.current.execute(mockOperation, { context })
		})

		expect(mockOperation).toHaveBeenCalled()
		expect(result.current.data).toBe("success")
	})
})
