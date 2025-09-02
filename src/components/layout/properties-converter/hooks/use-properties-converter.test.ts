import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { usePropertiesConverter } from "./use-properties-converter"

describe("usePropertiesConverter", () => {
	it("should initialize with default state", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		expect(result.current.mode).toBe("yaml-to-env")
		expect(result.current.input).toBe("")
		expect(result.current.output).toBe("")
		expect(result.current.error).toBe(null)
		expect(result.current.isConverting).toBe(false)
	})

	it("should update input", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		act(() => {
			result.current.setInput("test input")
		})

		expect(result.current.input).toBe("test input")
	})

	it("should update mode", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		act(() => {
			result.current.setMode("properties-to-yaml")
		})

		expect(result.current.mode).toBe("properties-to-yaml")
	})

	it("should clear input", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		act(() => {
			result.current.setInput("test input")
			result.current.setMode("yaml-to-properties")
		})

		act(() => {
			result.current.clearInput()
		})

		expect(result.current.input).toBe("")
		expect(result.current.output).toBe("")
		expect(result.current.error).toBe(null)
	})

	it("should clear output", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		// Simulate having some output
		act(() => {
			result.current.setInput("test")
		})

		act(() => {
			result.current.clearOutput()
		})

		expect(result.current.output).toBe("")
		expect(result.current.error).toBe(null)
	})

	it("should handle empty input during conversion", () => {
		const { result } = renderHook(() => usePropertiesConverter())

		act(() => {
			result.current.manualConvert()
		})

		// Should not crash with empty input
		expect(result.current.input).toBe("")
	})
})
