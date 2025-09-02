/**
 * Shared formatting utilities
 */

/**
 * Format a date-time string to YYYY-MM-DD HH:MM:SS format
 */
export function formatDateTime(dateTimeStr: string): string {
	try {
		// Parse the date string
		const date = new Date(dateTimeStr)

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return dateTimeStr
		}

		// Format to YYYY-MM-DD HH:MM:SS
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const day = String(date.getDate()).padStart(2, "0")
		const hours = String(date.getHours()).padStart(2, "0")
		const minutes = String(date.getMinutes()).padStart(2, "0")
		const seconds = String(date.getSeconds()).padStart(2, "0")

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
	} catch (error) {
		return dateTimeStr
	}
}

/**
 * Convert dot-separated, kebab-case, or camelCase property key to environment variable format
 * Examples:
 * - app.redis.value-key -> APP_REDIS_VALUE_KEY
 * - abc.efg.gh-oo.makeNow -> ABC_EFG_GH_OO_MAKE_NOW
 */
export function propertyKeyToEnvVar(key: string): string {
	return (
		key
			// First handle camelCase to snake_case (must be before replacing dots/hyphens)
			.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
			// Then replace dots and hyphens with underscores
			.replace(/[.-]/g, "_")
			// Convert to uppercase
			.toUpperCase()
	)
}

/**
 * Check if a string has content (non-empty after trimming)
 */
export function hasContent(str: string): boolean {
	return str.trim().length > 0
}

/**
 * Check if a value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
	return value === null || value === undefined
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
	try {
		return JSON.parse(jsonString) as T
	} catch {
		return fallback
	}
}
