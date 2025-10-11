import type { JsonViewerMode } from "@/types"
import { useCallback, useEffect, useState } from "react"
import type { JsonNode, JsonValidationResult } from "../types"
import {
	jsonToTree,
	minifyJson,
	prettyPrintJson,
	toggleTreeNode,
	validateJson
} from "../utils/json-utils"

export function useJsonViewer() {
	const [mode, setMode] = useState<JsonViewerMode>("pretty-print")
	const [input, setInput] = useState("")
	const [output, setOutput] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [validationResult, setValidationResult] = useState<JsonValidationResult | undefined>()
	const [treeData, setTreeData] = useState<JsonNode[] | undefined>()

	const clearInput = useCallback(() => {
		setInput("")
		setOutput("")
		setError(null)
		setValidationResult(undefined)
		setTreeData(undefined)
	}, [])

	const clearOutput = useCallback(() => {
		setOutput("")
		setError(null)
		setValidationResult(undefined)
		setTreeData(undefined)
	}, [])

	const processJson = useCallback(async () => {
		if (!input.trim()) {
			setError("Input cannot be empty")
			return
		}

		setIsProcessing(true)
		setError(null)

		try {
			let result = ""
			let treeResult: JsonNode[] | undefined
			let validation: JsonValidationResult | undefined

			switch (mode) {
				case "pretty-print":
					result = prettyPrintJson(input)
					break

				case "minify":
					result = minifyJson(input)
					break

				case "tree-view":
					treeResult = jsonToTree(input)
					result = "Tree view generated successfully"
					break

				case "validate":
					validation = validateJson(input)
					result = validation.isValid
						? "JSON is valid"
						: `JSON is invalid: ${validation.errors[0]?.message || "Unknown error"}`
					break

				default:
					throw new Error(`Unknown mode: ${mode}`)
			}

			setOutput(result)
			setTreeData(treeResult)
			setValidationResult(validation)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Processing failed"
			setError(errorMessage)
			setOutput("")
			setTreeData(undefined)
			setValidationResult(undefined)
		} finally {
			setIsProcessing(false)
		}
	}, [input, mode])

	const toggleNode = useCallback(
		(path: string) => {
			if (treeData) {
				setTreeData(toggleTreeNode(treeData, path))
			}
		},
		[treeData]
	)

	// Auto-process for validation mode (real-time feedback)
	useEffect(() => {
		if (mode === "validate" && input.trim()) {
			const timeoutId = setTimeout(() => {
				processJson()
			}, 500) // Debounce for 500ms

			return () => clearTimeout(timeoutId)
		}
	}, [input, mode, processJson])

	return {
		mode,
		input,
		output,
		error,
		isProcessing,
		validationResult,
		treeData,
		setInput,
		setMode,
		clearInput,
		clearOutput,
		processJson,
		toggleNode
	}
}
