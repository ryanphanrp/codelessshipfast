import type { JsonStats } from "../types"

export function analyzeJsonStats(json: any): JsonStats {
	const startTime = performance.now()
	
	let totalNodes = 0
	let maxDepth = 0
	let totalProperties = 0
	let totalArrays = 0
	let totalValues = 0
	const dataTypes: Record<string, number> = {}
	const propertyFrequency: Record<string, number> = {}
	let arrayLengths: number[] = []

	function analyze(obj: any, depth = 0): void {
		totalNodes++
		maxDepth = Math.max(maxDepth, depth)

		const type = getDataType(obj)
		dataTypes[type] = (dataTypes[type] || 0) + 1

		if (obj === null || obj === undefined) {
			totalValues++
			return
		}

		if (Array.isArray(obj)) {
			totalArrays++
			arrayLengths.push(obj.length)
			
			obj.forEach((item, index) => {
				analyze(item, depth + 1)
			})
		} else if (typeof obj === "object") {
			const keys = Object.keys(obj)
			totalProperties += keys.length

			keys.forEach(key => {
				propertyFrequency[key] = (propertyFrequency[key] || 0) + 1
				analyze(obj[key], depth + 1)
			})
		} else {
			totalValues++
		}
	}

	analyze(json)

	const parseTime = performance.now() - startTime
	const averageArrayLength = arrayLengths.length > 0 
		? arrayLengths.reduce((sum, len) => sum + len, 0) / arrayLengths.length 
		: 0

	const memoryEstimate = estimateMemoryUsage(json)
	const complexityScore = calculateComplexityScore({
		maxDepth,
		totalNodes,
		totalArrays,
		totalProperties
	})

	return {
		totalNodes,
		maxDepth,
		totalProperties,
		totalArrays,
		totalValues,
		dataTypes,
		averageArrayLength: Math.round(averageArrayLength * 100) / 100,
		memoryEstimate,
		parseTime: Math.round(parseTime * 100) / 100,
		complexityScore,
		propertyFrequency
	}
}

function getDataType(value: any): string {
	if (value === null) return "null"
	if (value === undefined) return "undefined"
	if (Array.isArray(value)) return "array"
	if (typeof value === "object") return "object"
	if (typeof value === "string") return "string"
	if (typeof value === "number") {
		return Number.isInteger(value) ? "integer" : "number"
	}
	if (typeof value === "boolean") return "boolean"
	return "unknown"
}

function estimateMemoryUsage(obj: any): number {
	// Rough estimation of memory usage in bytes
	let size = 0

	function calculateSize(value: any): void {
		if (value === null || value === undefined) {
			size += 8 // Basic pointer size
		} else if (typeof value === "boolean") {
			size += 4
		} else if (typeof value === "number") {
			size += 8 // 64-bit number
		} else if (typeof value === "string") {
			size += value.length * 2 + 16 // UTF-16 encoding + overhead
		} else if (Array.isArray(value)) {
			size += 24 // Array object overhead
			value.forEach(item => calculateSize(item))
		} else if (typeof value === "object") {
			size += 24 // Object overhead
			Object.keys(value).forEach(key => {
				size += key.length * 2 + 16 // Key string
				calculateSize(value[key])
			})
		}
	}

	calculateSize(obj)
	return size
}

function calculateComplexityScore(stats: {
	maxDepth: number
	totalNodes: number
	totalArrays: number
	totalProperties: number
}): number {
	// Complexity score based on depth, nodes, and structural complexity
	const depthWeight = Math.min(stats.maxDepth * 10, 50) // Max 50 points
	const nodeWeight = Math.min(stats.totalNodes / 100, 30) // Max 30 points
	const structureWeight = Math.min((stats.totalArrays + stats.totalProperties) / 50, 20) // Max 20 points
	
	return Math.round(depthWeight + nodeWeight + structureWeight)
}

export function generateStatsReport(stats: JsonStats): string {
	return `
JSON Statistics Report
=====================

Structure:
- Total Nodes: ${stats.totalNodes}
- Maximum Depth: ${stats.maxDepth}
- Total Properties: ${stats.totalProperties}
- Total Arrays: ${stats.totalArrays}
- Total Values: ${stats.totalValues}

Data Types:
${Object.entries(stats.dataTypes)
	.map(([type, count]) => `- ${type}: ${count} (${((count / stats.totalNodes) * 100).toFixed(1)}%)`)
	.join('\n')}

Arrays:
- Average Length: ${stats.averageArrayLength}

Performance:
- Parse Time: ${stats.parseTime}ms
- Memory Estimate: ${formatBytes(stats.memoryEstimate)}
- Complexity Score: ${stats.complexityScore}/100

Most Common Properties:
${Object.entries(stats.propertyFrequency)
	.sort(([,a], [,b]) => b - a)
	.slice(0, 10)
	.map(([prop, count]) => `- ${prop}: ${count}`)
	.join('\n')}
`.trim()
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes'
	
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function getOptimizationSuggestions(stats: JsonStats): string[] {
	const suggestions: string[] = []

	if (stats.maxDepth > 10) {
		suggestions.push("Consider flattening deeply nested structures (depth > 10)")
	}

	if (stats.memoryEstimate > 1024 * 1024) { // > 1MB
		suggestions.push("Large JSON size detected. Consider pagination or data chunking")
	}

	if (stats.complexityScore > 80) {
		suggestions.push("High complexity detected. Consider simplifying data structure")
	}

	const stringPercentage = (stats.dataTypes.string / stats.totalNodes) * 100
	if (stringPercentage > 70) {
		suggestions.push("High string content. Consider using enums or constants where possible")
	}

	const arrayCount = stats.dataTypes.array || 0
	if (arrayCount > 50 && stats.averageArrayLength > 100) {
		suggestions.push("Many large arrays detected. Consider implementing pagination")
	}

	if (stats.parseTime > 100) {
		suggestions.push("Slow parsing detected. Consider optimizing JSON structure or using streaming")
	}

	if (suggestions.length === 0) {
		suggestions.push("JSON structure appears to be well-optimized")
	}

	return suggestions
}

export function compareStats(stats1: JsonStats, stats2: JsonStats): {
	nodes: number
	depth: number
	properties: number
	arrays: number
	memoryDelta: number
	performanceDelta: number
} {
	return {
		nodes: stats2.totalNodes - stats1.totalNodes,
		depth: stats2.maxDepth - stats1.maxDepth,
		properties: stats2.totalProperties - stats1.totalProperties,
		arrays: stats2.totalArrays - stats1.totalArrays,
		memoryDelta: stats2.memoryEstimate - stats1.memoryEstimate,
		performanceDelta: stats2.parseTime - stats1.parseTime
	}
}

export function getDataTypeChart(stats: JsonStats): Array<{ name: string; value: number; percentage: number }> {
	return Object.entries(stats.dataTypes).map(([type, count]) => ({
		name: type,
		value: count,
		percentage: Math.round((count / stats.totalNodes) * 100)
	})).sort((a, b) => b.value - a.value)
}

export function getPropertyFrequencyChart(stats: JsonStats, limit = 10): Array<{ name: string; value: number }> {
	return Object.entries(stats.propertyFrequency)
		.sort(([,a], [,b]) => b - a)
		.slice(0, limit)
		.map(([prop, count]) => ({
			name: prop,
			value: count
		}))
}