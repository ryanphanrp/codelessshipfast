import type { JsonSchema, SchemaGeneratorOptions } from "../types"

export function generateJsonSchema(
	json: any,
	options: SchemaGeneratorOptions = {}
): JsonSchema {
	const {
		required = false,
		additionalProperties = true,
		generateExamples = false,
		generateDescriptions = false
	} = options

	function inferType(value: any): string | string[] {
		if (value === null) return "null"
		if (Array.isArray(value)) return "array"
		if (typeof value === "object") return "object"
		if (typeof value === "string") return "string"
		if (typeof value === "number") {
			return Number.isInteger(value) ? "integer" : "number"
		}
		if (typeof value === "boolean") return "boolean"
		return "string"
	}

	function generateSchemaForValue(value: any, key?: string): JsonSchema {
		const schema: JsonSchema = {
			type: inferType(value)
		}

		if (generateDescriptions && key) {
			schema.description = `Generated schema for ${key}`
		}

		if (value === null) {
			return schema
		}

		if (Array.isArray(value)) {
			if (value.length > 0) {
				const itemTypes = new Set(value.map(item => JSON.stringify(generateSchemaForValue(item))))
				if (itemTypes.size === 1) {
					schema.items = generateSchemaForValue(value[0])
				} else {
					schema.items = Array.from(itemTypes).map(type => JSON.parse(type) as JsonSchema)
				}
			}
			schema.minItems = 0
			if (generateExamples) {
				schema.examples = [value.slice(0, 3)]
			}
		} else if (typeof value === "object") {
			schema.properties = {}
			const requiredProps: string[] = []

			for (const [prop, propValue] of Object.entries(value)) {
				schema.properties[prop] = generateSchemaForValue(propValue, prop)
				if (required && propValue !== null && propValue !== undefined) {
					requiredProps.push(prop)
				}
			}

			if (requiredProps.length > 0) {
				schema.required = requiredProps
			}

			schema.additionalProperties = additionalProperties

			if (generateExamples) {
				schema.examples = [value]
			}
		} else if (typeof value === "string") {
			schema.minLength = 0
			if (value.length > 0) {
				schema.maxLength = Math.max(100, value.length * 2)
			}

			if (isEmail(value)) {
				schema.format = "email"
			} else if (isUri(value)) {
				schema.format = "uri"
			} else if (isDate(value)) {
				schema.format = "date-time"
			}

			if (generateExamples) {
				schema.examples = [value]
			}
		} else if (typeof value === "number") {
			if (Number.isInteger(value)) {
				schema.type = "integer"
			}
			schema.minimum = Math.floor(value - Math.abs(value))
			schema.maximum = Math.ceil(value + Math.abs(value))

			if (generateExamples) {
				schema.examples = [value]
			}
		} else if (typeof value === "boolean") {
			if (generateExamples) {
				schema.examples = [value]
			}
		}

		return schema
	}

	const schema = generateSchemaForValue(json)
	schema.$schema = "https://json-schema.org/draft/2020-12/schema"

	return schema
}

function isEmail(str: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(str)
}

function isUri(str: string): boolean {
	try {
		new URL(str)
		return true
	} catch {
		return false
	}
}

function isDate(str: string): boolean {
	const date = new Date(str)
	return !isNaN(date.getTime()) && str.includes("-")
}

export function validateJsonSchema(schema: JsonSchema): { valid: boolean; errors: string[] } {
	const errors: string[] = []

	if (!schema.$schema) {
		errors.push("Missing $schema property")
	}

	if (!schema.type) {
		errors.push("Missing type property")
	}

	return {
		valid: errors.length === 0,
		errors
	}
}

export function prettifySchema(schema: JsonSchema): string {
	return JSON.stringify(schema, null, 2)
}