import type { JsonDiffItem } from "../types"

export function compareJson(left: any, right: any, path = "$"): JsonDiffItem[] {
	const differences: JsonDiffItem[] = []

	function compare(leftValue: any, rightValue: any, currentPath: string): void {
		// Handle null/undefined cases
		if (leftValue === null && rightValue === null) {
			differences.push({
				type: "unchanged",
				path: currentPath,
				oldValue: leftValue,
				newValue: rightValue
			})
			return
		}

		if (leftValue === null || leftValue === undefined) {
			differences.push({
				type: "added",
				path: currentPath,
				newValue: rightValue,
				message: `Added ${typeof rightValue}`
			})
			return
		}

		if (rightValue === null || rightValue === undefined) {
			differences.push({
				type: "removed",
				path: currentPath,
				oldValue: leftValue,
				message: `Removed ${typeof leftValue}`
			})
			return
		}

		// Handle type mismatches
		if (typeof leftValue !== typeof rightValue) {
			differences.push({
				type: "modified",
				path: currentPath,
				oldValue: leftValue,
				newValue: rightValue,
				message: `Type changed from ${typeof leftValue} to ${typeof rightValue}`
			})
			return
		}

		// Handle arrays
		if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
			compareArrays(leftValue, rightValue, currentPath)
			return
		}

		// Handle objects
		if (typeof leftValue === "object" && typeof rightValue === "object") {
			compareObjects(leftValue, rightValue, currentPath)
			return
		}

		// Handle primitive values
		if (leftValue === rightValue) {
			differences.push({
				type: "unchanged",
				path: currentPath,
				oldValue: leftValue,
				newValue: rightValue
			})
		} else {
			differences.push({
				type: "modified",
				path: currentPath,
				oldValue: leftValue,
				newValue: rightValue,
				message: `Value changed from ${JSON.stringify(leftValue)} to ${JSON.stringify(rightValue)}`
			})
		}
	}

	function compareArrays(leftArray: any[], rightArray: any[], currentPath: string): void {
		const maxLength = Math.max(leftArray.length, rightArray.length)

		for (let i = 0; i < maxLength; i++) {
			const itemPath = `${currentPath}[${i}]`

			if (i >= leftArray.length) {
				differences.push({
					type: "added",
					path: itemPath,
					newValue: rightArray[i],
					message: `Added array item at index ${i}`
				})
			} else if (i >= rightArray.length) {
				differences.push({
					type: "removed",
					path: itemPath,
					oldValue: leftArray[i],
					message: `Removed array item at index ${i}`
				})
			} else {
				compare(leftArray[i], rightArray[i], itemPath)
			}
		}
	}

	function compareObjects(
		leftObj: Record<string, any>,
		rightObj: Record<string, any>,
		currentPath: string
	): void {
		const leftKeys = Object.keys(leftObj)
		const rightKeys = Object.keys(rightObj)
		const allKeys = new Set([...leftKeys, ...rightKeys])

		for (const key of allKeys) {
			const propertyPath = currentPath === "$" ? `$.${key}` : `${currentPath}.${key}`

			if (!(key in leftObj)) {
				differences.push({
					type: "added",
					path: propertyPath,
					newValue: rightObj[key],
					message: `Added property "${key}"`
				})
			} else if (!(key in rightObj)) {
				differences.push({
					type: "removed",
					path: propertyPath,
					oldValue: leftObj[key],
					message: `Removed property "${key}"`
				})
			} else {
				compare(leftObj[key], rightObj[key], propertyPath)
			}
		}
	}

	compare(left, right, path)
	return differences
}

export function generateDiffSummary(differences: JsonDiffItem[]): {
	total: number
	added: number
	removed: number
	modified: number
	unchanged: number
} {
	const summary = {
		total: differences.length,
		added: 0,
		removed: 0,
		modified: 0,
		unchanged: 0
	}

	differences.forEach((diff) => {
		summary[diff.type]++
	})

	return summary
}

export function filterDifferences(
	differences: JsonDiffItem[],
	showUnchanged: boolean = false
): JsonDiffItem[] {
	if (showUnchanged) {
		return differences
	}
	return differences.filter((diff) => diff.type !== "unchanged")
}

export function generateUnifiedDiff(differences: JsonDiffItem[]): string {
	let output = ""

	differences.forEach((diff) => {
		switch (diff.type) {
			case "added":
				output += `+ ${diff.path}: ${JSON.stringify(diff.newValue)}\n`
				break
			case "removed":
				output += `- ${diff.path}: ${JSON.stringify(diff.oldValue)}\n`
				break
			case "modified":
				output += `- ${diff.path}: ${JSON.stringify(diff.oldValue)}\n`
				output += `+ ${diff.path}: ${JSON.stringify(diff.newValue)}\n`
				break
			case "unchanged":
				if (diff.oldValue !== undefined) {
					output += `  ${diff.path}: ${JSON.stringify(diff.oldValue)}\n`
				}
				break
		}
	})

	return output
}

export function exportDiffAsJson(differences: JsonDiffItem[]): string {
	return JSON.stringify(differences, null, 2)
}

export function exportDiffAsCsv(differences: JsonDiffItem[]): string {
	const headers = ["Type", "Path", "Old Value", "New Value", "Message"]
	const rows = differences.map((diff) => [
		diff.type,
		diff.path,
		diff.oldValue !== undefined ? JSON.stringify(diff.oldValue) : "",
		diff.newValue !== undefined ? JSON.stringify(diff.newValue) : "",
		diff.message || ""
	])

	const csvContent = [headers, ...rows]
		.map((row) => row.map((cell) => `"${cell?.toString().replace(/"/g, '""') || ""}"`).join(","))
		.join("\n")

	return csvContent
}

export function findDeepDifferences(differences: JsonDiffItem[]): JsonDiffItem[] {
	// Filter for differences that are deeply nested (more than 3 levels)
	return differences.filter((diff) => {
		const pathDepth = diff.path.split(/[.\[]/).length - 1
		return pathDepth > 3
	})
}

export function groupDifferencesByType(
	differences: JsonDiffItem[]
): Record<string, JsonDiffItem[]> {
	return differences.reduce(
		(groups, diff) => {
			if (!groups[diff.type]) {
				groups[diff.type] = []
			}
			groups[diff.type].push(diff)
			return groups
		},
		{} as Record<string, JsonDiffItem[]>
	)
}

export function calculateSimilarityScore(differences: JsonDiffItem[]): number {
	const totalNodes = differences.length
	if (totalNodes === 0) return 100

	const unchangedCount = differences.filter((diff) => diff.type === "unchanged").length
	return Math.round((unchangedCount / totalNodes) * 100)
}

export function highlightDifferences(jsonString: string, differences: JsonDiffItem[]): string {
	// This is a simplified implementation
	// In production, you'd want to properly parse and highlight the JSON
	let highlighted = jsonString

	differences.forEach((diff) => {
		if (diff.type !== "unchanged") {
			// Simple highlighting - this would need to be enhanced for production use
			const pathSegments = diff.path.split(".")
			// Implementation would depend on the specific highlighting approach
		}
	})

	return highlighted
}
