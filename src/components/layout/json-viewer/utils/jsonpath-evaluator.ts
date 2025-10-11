import type { JsonPathResult } from "../types"

export function evaluateJsonPath(json: any, expression: string): JsonPathResult[] {
	try {
		const results = jsonPathQuery(json, expression)
		return results.map((result, index) => ({
			path: result.path,
			value: result.value,
			match: true
		}))
	} catch (error) {
		throw new Error(
			`Invalid JSONPath expression: ${error instanceof Error ? error.message : "Unknown error"}`
		)
	}
}

interface JsonPathQueryResult {
	path: string
	value: any
}

function jsonPathQuery(obj: any, path: string): JsonPathQueryResult[] {
	// Simple JSONPath implementation - supports basic operations
	// For production, consider using a library like jsonpath-plus

	const results: JsonPathQueryResult[] = []

	// Remove leading $ and split by dots and brackets
	const normalizedPath = path.replace(/^\$\.?/, "").replace(/\[(\d+)\]/g, ".$1")
	const parts = normalizedPath ? normalizedPath.split(".").filter((p) => p !== "") : []

	function traverse(current: any, currentPath: string, remainingParts: string[]): void {
		if (remainingParts.length === 0) {
			results.push({
				path: currentPath || "$",
				value: current
			})
			return
		}

		const [currentPart, ...restParts] = remainingParts

		// Handle wildcard
		if (currentPart === "*") {
			if (Array.isArray(current)) {
				current.forEach((item, index) => {
					traverse(item, `${currentPath}[${index}]`, restParts)
				})
			} else if (current && typeof current === "object") {
				Object.keys(current).forEach((key) => {
					traverse(current[key], `${currentPath}.${key}`, restParts)
				})
			}
			return
		}

		// Handle array index
		if (/^\d+$/.test(currentPart)) {
			const index = parseInt(currentPart, 10)
			if (Array.isArray(current) && index < current.length) {
				const newPath = currentPath ? `${currentPath}[${index}]` : `$[${index}]`
				traverse(current[index], newPath, restParts)
			}
			return
		}

		// Handle recursive descent (..)
		if (currentPart === "") {
			// This is a simplified recursive descent
			traverseRecursive(current, currentPath, restParts)
			return
		}

		// Handle regular property access
		if (current && typeof current === "object" && currentPart in current) {
			const newPath = currentPath ? `${currentPath}.${currentPart}` : `$.${currentPart}`
			traverse(current[currentPart], newPath, restParts)
		}
	}

	function traverseRecursive(current: any, currentPath: string, remainingParts: string[]): void {
		// Recursive descent - find all matching paths
		if (remainingParts.length === 0) return

		const [targetPart, ...restParts] = remainingParts

		function searchRecursively(obj: any, path: string): void {
			if (obj && typeof obj === "object") {
				// Check current level
				if (targetPart in obj) {
					const newPath = path ? `${path}.${targetPart}` : `$.${targetPart}`
					traverse(obj[targetPart], newPath, restParts)
				}

				// Recurse into children
				if (Array.isArray(obj)) {
					obj.forEach((item, index) => {
						searchRecursively(item, `${path}[${index}]`)
					})
				} else {
					Object.keys(obj).forEach((key) => {
						searchRecursively(obj[key], `${path}.${key}`)
					})
				}
			}
		}

		searchRecursively(current, currentPath)
	}

	// Handle special cases
	if (path === "$" || path === "") {
		results.push({
			path: "$",
			value: obj
		})
	} else {
		traverse(obj, "$", parts)
	}

	return results
}

export function getJsonPathSuggestions(json: any): string[] {
	const suggestions: string[] = []

	function collectPaths(obj: any, currentPath: string): void {
		if (obj && typeof obj === "object") {
			if (Array.isArray(obj)) {
				suggestions.push(`${currentPath}[*]`)
				suggestions.push(`${currentPath}.length`)
				obj.forEach((_, index) => {
					if (index < 3) {
						// Limit suggestions for performance
						suggestions.push(`${currentPath}[${index}]`)
					}
				})
				if (obj.length > 0) {
					collectPaths(obj[0], `${currentPath}[0]`)
				}
			} else {
				Object.keys(obj).forEach((key) => {
					const newPath = currentPath === "$" ? `$.${key}` : `${currentPath}.${key}`
					suggestions.push(newPath)
					if (suggestions.length < 50) {
						// Limit for performance
						collectPaths(obj[key], newPath)
					}
				})
			}
		}
	}

	suggestions.push("$")
	collectPaths(json, "$")

	// Add common patterns
	suggestions.push("$.*")
	suggestions.push("$..*")
	suggestions.push("$[*]")

	return [...new Set(suggestions)].sort()
}

export function validateJsonPath(expression: string): { valid: boolean; error?: string } {
	try {
		// Basic validation
		if (!expression) {
			return { valid: false, error: "Expression cannot be empty" }
		}

		// Check for basic syntax issues
		if (!expression.startsWith("$")) {
			return { valid: false, error: "JSONPath must start with $" }
		}

		// Check for unmatched brackets
		const openBrackets = (expression.match(/\[/g) || []).length
		const closeBrackets = (expression.match(/\]/g) || []).length
		if (openBrackets !== closeBrackets) {
			return { valid: false, error: "Unmatched brackets" }
		}

		return { valid: true }
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Invalid expression"
		}
	}
}

export function highlightJsonPath(json: string, paths: string[]): string {
	// This is a simplified implementation
	// In a real implementation, you'd want to properly parse and highlight
	let highlighted = json

	paths.forEach((path) => {
		// Simple highlighting - wrap matched content
		// This is a basic implementation and should be enhanced for production
		const pathParts = path
			.replace("$", "")
			.split(".")
			.filter((p) => p)
		// Implementation would depend on the specific highlighting library used
	})

	return highlighted
}

export const JSONPATH_EXAMPLES = [
	{ expression: "$", description: "Root object" },
	{ expression: "$.store", description: "Store property" },
	{ expression: "$.store.*", description: "All properties of store" },
	{ expression: "$..price", description: "All price properties recursively" },
	{ expression: "$.store.book[*]", description: "All books" },
	{ expression: "$.store.book[0]", description: "First book" },
	{ expression: "$.store.book[-1]", description: "Last book" },
	{ expression: "$.store.book[0,1]", description: "First two books" },
	{ expression: "$.store.book[?(@.price < 10)]", description: "Books with price less than 10" }
]
