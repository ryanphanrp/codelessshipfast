import { useCallback, useState } from "react"
import type { JsonNode } from "../types"
import { jsonToTree, prettyPrintJson, toggleTreeNode } from "../utils/json-utils"

type JsonViewerMode = "pretty-print" | "tree-view"

export function useJsonViewer() {
	const [mode, setMode] = useState<JsonViewerMode>("pretty-print")
	const [input, setInput] = useState("")
	const [output, setOutput] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [treeData, setTreeData] = useState<JsonNode[] | undefined>()

	const clearInput = useCallback(() => {
		setInput("")
		setOutput("")
		setError(null)
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

			switch (mode) {
				case "pretty-print":
					result = prettyPrintJson(input)
					break

				case "tree-view":
					treeResult = jsonToTree(input)
					result = "Tree view generated successfully"
					break

				default:
					throw new Error(`Unknown mode: ${mode}`)
			}

			setOutput(result)
			setTreeData(treeResult)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Processing failed"
			setError(errorMessage)
			setOutput("")
			setTreeData(undefined)
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

	return {
		mode,
		input,
		output,
		error,
		isProcessing,
		treeData,
		setInput,
		setMode,
		clearInput,
		processJson,
		toggleNode
	}
}
