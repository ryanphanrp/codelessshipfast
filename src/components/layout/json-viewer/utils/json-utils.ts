import type { JsonNode, JsonValidationResult, ValidationError } from "../types"

/**
 * Validates JSON string and returns detailed error information
 */
export function validateJson(jsonString: string): JsonValidationResult {
	try {
		const parsed = JSON.parse(jsonString)
		return {
			isValid: true,
			parsed,
			errors: []
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error"
		const errors: ValidationError[] = []

		// Try to extract line and column information from error message
		const lineMatch = errorMessage.match(/at line (\d+)/)
		const columnMatch = errorMessage.match(/column (\d+)/)

		errors.push({
			line: lineMatch ? parseInt(lineMatch[1]) : 1,
			column: columnMatch ? parseInt(columnMatch[1]) : 1,
			message: errorMessage,
			severity: "error"
		})

		return {
			isValid: false,
			errors
		}
	}
}

/**
 * Pretty prints JSON with proper indentation
 */
export function prettyPrintJson(jsonString: string): string {
	try {
		const parsed = JSON.parse(jsonString)
		return JSON.stringify(parsed, null, 2)
	} catch {
		throw new Error("Invalid JSON input")
	}
}

/**
 * Minifies JSON by removing whitespace
 */
export function minifyJson(jsonString: string): string {
	try {
		const parsed = JSON.parse(jsonString)
		return JSON.stringify(parsed)
	} catch {
		throw new Error("Invalid JSON input")
	}
}

/**
 * Converts JSON to a tree structure for hierarchical display
 */
export function jsonToTree(jsonString: string): JsonNode[] {
	try {
		const parsed = JSON.parse(jsonString)
		return [buildTreeNode("", parsed, "", 0)]
	} catch {
		throw new Error("Invalid JSON input")
	}
}

/**
 * Recursively builds tree nodes from JSON data
 */
function buildTreeNode(key: string, value: any, path: string, depth: number): JsonNode {
	const node: JsonNode = {
		key: key || "root",
		value,
		path,
		depth,
		expanded: depth < 2 // Auto-expand first two levels
	}

	if (value === null) {
		node.type = "null"
	} else if (typeof value === "boolean") {
		node.type = "boolean"
	} else if (typeof value === "number") {
		node.type = "number"
	} else if (typeof value === "string") {
		node.type = "string"
	} else if (Array.isArray(value)) {
		node.type = "array"
		node.children = value.map((item, index) => {
			const itemPath = path ? `${path}[${index}]` : `[${index}]`
			return buildTreeNode(index.toString(), item, itemPath, depth + 1)
		})
	} else if (typeof value === "object") {
		node.type = "object"
		node.children = Object.entries(value).map(([k, v]) => {
			const itemPath = path ? `${path}.${k}` : k
			return buildTreeNode(k, v, itemPath, depth + 1)
		})
	}

	return node
}

/**
 * Toggles expansion state of a tree node
 */
export function toggleTreeNode(nodes: JsonNode[], path: string): JsonNode[] {
	return nodes.map((node) => {
		if (node.path === path) {
			return { ...node, expanded: !node.expanded }
		}
		if (node.children) {
			return { ...node, children: toggleTreeNode(node.children, path) }
		}
		return node
	})
}

/**
 * Gets the type display string for a value
 */
export function getValueType(value: any): string {
	if (value === null) return "null"
	if (typeof value === "boolean") return "boolean"
	if (typeof value === "number") return "number"
	if (typeof value === "string") return "string"
	if (Array.isArray(value)) return `array[${value.length}]`
	if (typeof value === "object") return `object{${Object.keys(value).length}}`
	return "unknown"
}

/**
 * Gets a preview of the value for display in tree
 */
export function getValuePreview(value: any, maxLength = 50): string {
	const stringValue = JSON.stringify(value)
	if (stringValue.length <= maxLength) return stringValue
	return `${stringValue.substring(0, maxLength)}...`
}

/**
 * Checks if a node has children
 */
export function hasChildren(node: JsonNode): boolean {
	return !!(node.children && node.children.length > 0)
}
