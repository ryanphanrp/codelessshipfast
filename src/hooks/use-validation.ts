import { createValidator, validateNotEmpty, validatePattern } from "@/lib/shared"
import type { ValidationResult } from "@/types"
import React, { useCallback, useMemo } from "react"

interface FieldValidation {
	value: string
	isValid: boolean
	error: string | null
	touched: boolean
}

interface ValidationRule {
	validate: (value: string) => ValidationResult
	message?: string
}

interface ValidationOptions {
	rules?: ValidationRule[]
	required?: boolean
	pattern?: RegExp
	patternMessage?: string
	customValidator?: (value: string) => ValidationResult
}

/**
 * Hook for handling form field validation
 */
export function useValidation(initialValue: string = "", options: ValidationOptions = {}) {
	const { rules = [], required = false, pattern, patternMessage, customValidator } = options

	const [field, setField] = React.useState<FieldValidation>({
		value: initialValue,
		isValid: true,
		error: null,
		touched: false
	})

	// Build validation rules
	const validationRules = useMemo(() => {
		const builtRules = [...rules]

		if (required) {
			builtRules.unshift({
				validate: (value) => validateNotEmpty(value, "Field"),
				message: "This field is required"
			})
		}

		if (pattern) {
			builtRules.push({
				validate: (value) => validatePattern(value, pattern, "Field", patternMessage),
				message: patternMessage || "Invalid format"
			})
		}

		if (customValidator) {
			builtRules.push({
				validate: customValidator
			})
		}

		return builtRules
	}, [rules, required, pattern, patternMessage, customValidator])

	// Validate field
	const validate = useCallback(
		(value: string = field.value) => {
			for (const rule of validationRules) {
				const result = rule.validate(value)
				if (!result.isValid) {
					return {
						isValid: false,
						error: rule.message || result.error || "Validation failed"
					}
				}
			}
			return { isValid: true, error: null }
		},
		[field.value, validationRules]
	)

	// Set field value
	const setValue = useCallback(
		(value: string) => {
			const validation = validate(value)
			setField((prev) => ({
				...prev,
				value,
				isValid: validation.isValid,
				error: validation.error,
				touched: true
			}))
		},
		[validate]
	)

	// Mark field as touched
	const touch = useCallback(() => {
		setField((prev) => ({ ...prev, touched: true }))
	}, [])

	// Reset field
	const reset = useCallback((newValue: string = "") => {
		setField({
			value: newValue,
			isValid: true,
			error: null,
			touched: false
		})
	}, [])

	// Get field state
	const fieldState = useMemo(
		() => ({
			...field,
			showError: field.touched && !field.isValid && field.error
		}),
		[field]
	)

	return {
		...fieldState,
		setValue,
		touch,
		reset,
		validate
	}
}

/**
 * Hook for validating multiple fields
 */
export function useFormValidation(fields: Record<string, ValidationOptions>) {
	const fieldStates = Object.keys(fields).reduce(
		(acc, key) => {
			acc[key] = useValidation("", fields[key])
			return acc
		},
		{} as Record<string, ReturnType<typeof useValidation>>
	)

	const isValid = useMemo(() => {
		return Object.values(fieldStates).every((field) => field.isValid)
	}, [fieldStates])

	const hasErrors = useMemo(() => {
		return Object.values(fieldStates).some((field) => field.showError)
	}, [fieldStates])

	const reset = useCallback(() => {
		Object.values(fieldStates).forEach((field) => field.reset())
	}, [fieldStates])

	const validateAll = useCallback(() => {
		Object.values(fieldStates).forEach((field) => field.touch())
		return isValid
	}, [fieldStates, isValid])

	return {
		fields: fieldStates,
		isValid,
		hasErrors,
		reset,
		validateAll
	}
}
