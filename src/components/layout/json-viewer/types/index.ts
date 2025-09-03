import type { JsonViewerMode } from "@/types"

export interface JsonNode {
	key: string
	value: any
	type: "object" | "array" | "string" | "number" | "boolean" | "null"
	children?: JsonNode[]
	expanded?: boolean
	path: string
	depth: number
}

export interface ValidationError {
	line: number
	column: number
	message: string
	severity: "error" | "warning"
}

export interface JsonValidationResult {
	isValid: boolean
	parsed?: any
	errors: ValidationError[]
}

export interface JsonViewerState {
	mode: JsonViewerMode
	input: string
	output: string
	error: string | null
	isProcessing: boolean
	validationResult?: JsonValidationResult
	treeData?: JsonNode[]
}

export interface JsonViewerProps {
	mode: JsonViewerMode
	input: string
	output: string
	error: string | null
	isProcessing: boolean
	validationResult?: JsonValidationResult
	treeData?: JsonNode[]
	examples: ExampleItem[]
	onInputChange: (input: string) => void
	onModeChange: (mode: JsonViewerMode) => void
	onClearInput: () => void
	onClearOutput: () => void
	onProcess: () => void
	onToggleNode?: (path: string) => void
}

export interface ExampleItem {
	label: string
	content: string
}
