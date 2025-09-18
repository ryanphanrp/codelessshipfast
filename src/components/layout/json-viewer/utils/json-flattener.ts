import type { FlattenOptions } from "../types"

export function flattenJson(
	json: any, 
	options: FlattenOptions = { separator: ".", arrayNotation: "bracket", preserveArrays: false }
): Record<string, any> {
	const { separator, arrayNotation, preserveArrays } = options
	const flattened: Record<string, any> = {}

	function flatten(obj: any, prefix: string = ""): void {
		if (obj === null || obj === undefined) {
			flattened[prefix] = obj
			return
		}

		if (Array.isArray(obj)) {
			if (preserveArrays) {
				flattened[prefix] = obj
			} else {
				obj.forEach((item, index) => {
					const key = arrayNotation === "bracket" 
						? `${prefix}[${index}]`
						: `${prefix}${separator}${index}`
					flatten(item, key)
				})
			}
		} else if (typeof obj === "object") {
			Object.keys(obj).forEach(key => {
				const newKey = prefix 
					? `${prefix}${separator}${key}`
					: key
				flatten(obj[key], newKey)
			})
		} else {
			flattened[prefix] = obj
		}
	}

	flatten(json)
	return flattened
}

export function unflattenJson(
	flattened: Record<string, any>, 
	options: FlattenOptions = { separator: ".", arrayNotation: "bracket", preserveArrays: false }
): any {
	const { separator, arrayNotation } = options
	const result: any = {}

	Object.keys(flattened).forEach(key => {
		const value = flattened[key]
		const keys = parseKey(key, separator, arrayNotation)
		
		let current = result
		
		for (let i = 0; i < keys.length - 1; i++) {
			const currentKey = keys[i]
			const nextKey = keys[i + 1]
			
			if (!(currentKey in current)) {
				// Determine if next level should be array or object
				const isNextArray = typeof nextKey === "number"
				current[currentKey] = isNextArray ? [] : {}
			}
			
			current = current[currentKey]
		}
		
		current[keys[keys.length - 1]] = value
	})

	return result
}

function parseKey(key: string, separator: string, arrayNotation: string): Array<string | number> {
	const keys: Array<string | number> = []
	
	if (arrayNotation === "bracket") {
		// Handle keys like "a.b[0].c[1].d"
		const parts = key.split(separator)
		
		for (const part of parts) {
			const bracketMatch = part.match(/^(.+?)\[(\d+)\]$/)
			if (bracketMatch) {
				keys.push(bracketMatch[1])
				keys.push(parseInt(bracketMatch[2], 10))
			} else {
				keys.push(part)
			}
		}
	} else {
		// Handle keys like "a.b.0.c.1.d"
		const parts = key.split(separator)
		
		for (const part of parts) {
			const asNumber = parseInt(part, 10)
			if (!isNaN(asNumber) && asNumber.toString() === part) {
				keys.push(asNumber)
			} else {
				keys.push(part)
			}
		}
	}
	
	return keys
}

export function convertToCSV(flattened: Record<string, any>): string {
	const entries = Object.entries(flattened)
	
	if (entries.length === 0) {
		return ""
	}

	const headers = ["Key", "Value", "Type"]
	const rows = entries.map(([key, value]) => [
		key,
		value === null ? "null" : value === undefined ? "undefined" : JSON.stringify(value),
		typeof value
	])

	const csvContent = [headers, ...rows]
		.map(row => row.map(cell => `"${cell?.toString().replace(/"/g, '""') || ""}"`).join(","))
		.join("\n")

	return csvContent
}

export function convertFromCSV(csv: string): Record<string, any> {
	const lines = csv.split("\n").filter(line => line.trim())
	
	if (lines.length < 2) {
		throw new Error("Invalid CSV format")
	}

	const flattened: Record<string, any> = {}
	
	// Skip header row
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i]
		const [key, valueStr, type] = parseCSVLine(line)
		
		if (!key) continue

		let value: any
		
		try {
			if (valueStr === "null") {
				value = null
			} else if (valueStr === "undefined") {
				value = undefined
			} else if (type === "string") {
				value = valueStr
			} else if (type === "number") {
				value = parseFloat(valueStr)
			} else if (type === "boolean") {
				value = valueStr === "true"
			} else {
				value = JSON.parse(valueStr)
			}
		} catch {
			value = valueStr // Fallback to string if parsing fails
		}
		
		flattened[key] = value
	}

	return flattened
}

function parseCSVLine(line: string): [string, string, string] {
	const result: string[] = []
	let current = ""
	let inQuotes = false
	let i = 0

	while (i < line.length) {
		const char = line[i]
		
		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"'
				i += 2
			} else {
				inQuotes = !inQuotes
				i++
			}
		} else if (char === ',' && !inQuotes) {
			result.push(current)
			current = ""
			i++
		} else {
			current += char
			i++
		}
	}
	
	result.push(current)
	
	return [result[0] || "", result[1] || "", result[2] || ""]
}

export function generateFlattenPreview(json: any, options: FlattenOptions): {
	original: string
	flattened: string
	count: number
} {
	const flattened = flattenJson(json, options)
	const count = Object.keys(flattened).length

	return {
		original: JSON.stringify(json, null, 2),
		flattened: JSON.stringify(flattened, null, 2),
		count
	}
}

export function generateUnflattenPreview(flattened: Record<string, any>, options: FlattenOptions): {
	flattened: string
	unflattened: string
	success: boolean
	error?: string
} {
	try {
		const unflattened = unflattenJson(flattened, options)
		
		return {
			flattened: JSON.stringify(flattened, null, 2),
			unflattened: JSON.stringify(unflattened, null, 2),
			success: true
		}
	} catch (error) {
		return {
			flattened: JSON.stringify(flattened, null, 2),
			unflattened: "",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}
	}
}

export function validateFlattenedData(flattened: Record<string, any>): {
	valid: boolean
	errors: string[]
	warnings: string[]
} {
	const errors: string[] = []
	const warnings: string[] = []

	if (Object.keys(flattened).length === 0) {
		warnings.push("No data to unflatten")
	}

	Object.keys(flattened).forEach(key => {
		if (!key || key.trim() === "") {
			errors.push("Empty key found")
		}

		if (key.includes("..")) {
			warnings.push(`Potentially malformed key: ${key}`)
		}

		if (key.length > 500) {
			warnings.push(`Very long key detected: ${key.substring(0, 50)}...`)
		}
	})

	return {
		valid: errors.length === 0,
		errors,
		warnings
	}
}

export function suggestOptimalOptions(json: any): FlattenOptions {
	// Analyze the JSON structure to suggest optimal flattening options
	let hasArrays = false
	let maxDepth = 0

	function analyze(obj: any, depth = 0): void {
		maxDepth = Math.max(maxDepth, depth)
		
		if (Array.isArray(obj)) {
			hasArrays = true
			obj.forEach(item => analyze(item, depth + 1))
		} else if (typeof obj === "object" && obj !== null) {
			Object.values(obj).forEach(value => analyze(value, depth + 1))
		}
	}

	analyze(json)

	return {
		separator: maxDepth > 5 ? "_" : ".",
		arrayNotation: hasArrays ? "bracket" : "dot",
		preserveArrays: false
	}
}

export const FLATTEN_EXAMPLES = {
	simple: {
		name: "Simple Object",
		data: {
			name: "John",
			age: 30,
			address: {
				street: "123 Main St",
				city: "New York"
			}
		}
	},
	withArrays: {
		name: "Object with Arrays",
		data: {
			users: [
				{ name: "Alice", age: 25 },
				{ name: "Bob", age: 30 }
			],
			settings: {
				theme: "dark",
				notifications: ["email", "push"]
			}
		}
	},
	complex: {
		name: "Complex Nested Structure",
		data: {
			company: {
				departments: [
					{
						name: "Engineering",
						employees: [
							{
								name: "Alice",
								skills: ["React", "TypeScript"],
								contact: {
									email: "alice@company.com",
									phone: "555-0101"
								}
							}
						]
					}
				],
				metadata: {
					founded: 2020,
					location: {
						country: "USA",
						coordinates: {
							lat: 40.7128,
							lng: -74.0060
						}
					}
				}
			}
		}
	}
}