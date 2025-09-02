/**
 * Shared validation utilities
 */

/**
 * Validate that a string is not empty after trimming
 */
export function validateNotEmpty(
	value: string,
	fieldName: string
): { isValid: boolean; error?: string } {
	if (!value || !value.trim()) {
		return { isValid: false, error: `${fieldName} cannot be empty` }
	}
	return { isValid: true }
}

/**
 * Validate that a string matches a regex pattern
 */
export function validatePattern(
	value: string,
	pattern: RegExp,
	fieldName: string,
	patternDescription?: string
): { isValid: boolean; error?: string } {
	if (!pattern.test(value)) {
		const description = patternDescription ? ` (${patternDescription})` : ""
		return { isValid: false, error: `${fieldName} must match pattern${description}` }
	}
	return { isValid: true }
}

/**
 * Validate property key format (allows alphanumeric, dots, hyphens, underscores)
 */
export function validatePropertyKey(key: string): { isValid: boolean; error?: string } {
	const propertyKeyPattern = /^[a-zA-Z0-9._-]+$/
	return validatePattern(
		key,
		propertyKeyPattern,
		"Property key",
		"alphanumeric with dots, hyphens, and underscores"
	)
}

/**
 * Validate that all required fields are present
 */
export function validateRequired<T extends Record<string, unknown>>(
	obj: T,
	requiredFields: (keyof T)[]
): { isValid: boolean; error?: string } {
	for (const field of requiredFields) {
		if (obj[field] === null || obj[field] === undefined || obj[field] === "") {
			return { isValid: false, error: `${String(field)} is required` }
		}
	}
	return { isValid: true }
}

/**
 * Generic input validator that combines multiple validations
 */
export function createValidator(
	validations: Array<(value: string) => { isValid: boolean; error?: string }>
) {
	return (value: string): { isValid: boolean; error?: string } => {
		for (const validation of validations) {
			const result = validation(value)
			if (!result.isValid) {
				return result
			}
		}
		return { isValid: true }
	}
}
