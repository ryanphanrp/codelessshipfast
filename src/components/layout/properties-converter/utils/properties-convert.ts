import { ErrorFactory, propertyKeyToEnvVar } from "@/lib/shared"
import type { ConversionResult } from "@/types"
import yaml from "js-yaml"
import type { ConversionMode } from "../types"

/**
 * Flatten nested object to dot notation
 */
function flattenObject(obj: any, prefix = ""): Record<string, any> {
	const flattened: Record<string, any> = {}

	for (const [key, value] of Object.entries(obj)) {
		const newKey = prefix ? `${prefix}.${key}` : key

		if (value !== null && typeof value === "object" && !Array.isArray(value)) {
			Object.assign(flattened, flattenObject(value, newKey))
		} else if (Array.isArray(value)) {
			// Handle arrays by joining with comma or indexing
			flattened[newKey] = value.join(",")
		} else {
			flattened[newKey] = value
		}
	}

	return flattened
}

/**
 * Convert YAML/Properties to environment variables
 */
export function convertYamlToEnv(input: string): string {
	try {
		// Try to parse as YAML first
		let parsed: any
		try {
			parsed = yaml.load(input)
		} catch {
			// If YAML parsing fails, try parsing as Java properties format
			parsed = parsePropertiesFormat(input)
		}

		if (!parsed || typeof parsed !== "object") {
			throw ErrorFactory.validation(
				"Invalid input format - expected YAML or properties format",
				"input",
				input.slice(0, 50)
			)
		}

		const flattened = flattenObject(parsed)
		const envVars: string[] = []

		for (const [key, value] of Object.entries(flattened)) {
			const envKey = propertyKeyToEnvVar(key)
			const envValue = value?.toString() || ""
			envVars.push(`${envKey}=${envValue}`)
		}

		return envVars.join("\n")
	} catch (error) {
		if (error instanceof Error && error.message.includes("Validation Error")) {
			throw error // Re-throw AppError instances
		}
		throw ErrorFactory.conversion(
			`YAML to environment variables conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			input.slice(0, 100),
			"yaml-to-env"
		)
	}
}

/**
 * Parse Java properties format (key=value or key: value)
 */
function parsePropertiesFormat(input: string): Record<string, any> {
	const result: Record<string, any> = {}
	const lines = input.split("\n")

	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) {
			continue
		}

		// Handle both = and : separators
		const match = trimmed.match(/^([^=:]+)[=:]\s*(.*)$/)
		if (match) {
			const [, key, value] = match
			setNestedProperty(result, key.trim(), value.trim())
		}
	}

	return result
}

/**
 * Set nested property in object using dot notation
 */
function setNestedProperty(obj: any, path: string, value: string) {
	const keys = path.split(".")
	let current = obj

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]
		if (!(key in current) || typeof current[key] !== "object") {
			current[key] = {}
		}
		current = current[key]
	}

	current[keys[keys.length - 1]] = value
}

/**
 * Extract Spring @Value properties and plain property keys and convert to environment variables
 */
export function convertSpringToEnv(input: string): string {
	try {
		const properties = new Set<string>()

		// First, try to match @Value annotations
		const valueRegex = /@Value\s*\(\s*"\$\{([^}]+)\}"\s*\)/g
		let match
		let hasAnnotations = false

		while ((match = valueRegex.exec(input)) !== null) {
			hasAnnotations = true
			const fullProperty = match[1]
			// Extract property key (remove default value if present)
			const propertyKey = fullProperty.split(":")[0].trim()
			// Extract default value if present
			const defaultValue = fullProperty.includes(":")
				? fullProperty.split(":").slice(1).join(":").trim()
				: ""

			properties.add(`${propertyKey}|${defaultValue}`)
		}

		// If no @Value annotations found, treat input as plain property keys
		if (!hasAnnotations) {
			const lines = input.split("\n")
			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) {
					continue
				}

				// Extract property key and optional value
				let propertyKey = ""
				let defaultValue = ""

				// Check for = separator
				if (trimmed.includes("=")) {
					const parts = trimmed.split("=")
					propertyKey = parts[0].trim()
					defaultValue = parts.slice(1).join("=").trim()
				}
				// Check for : separator (but not in the middle of property names)
				else if (trimmed.includes(":") && !trimmed.match(/^[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+$/)) {
					const colonIdx = trimmed.lastIndexOf(":")
					propertyKey = trimmed.substring(0, colonIdx).trim()
					defaultValue = trimmed.substring(colonIdx + 1).trim()
				}
				// No separator, treat entire line as property key
				else {
					propertyKey = trimmed
				}

				// Validate property key format
				if (propertyKey && propertyKey.match(/^[a-zA-Z0-9._-]+$/)) {
					properties.add(`${propertyKey}|${defaultValue}`)
				}
			}
		}

		if (properties.size === 0) {
			throw ErrorFactory.validation(
				"No properties found in the input. Enter @Value annotations or property keys (e.g., abc.efg.makeNow)",
				"input",
				input.slice(0, 50)
			)
		}

		const envVars: string[] = []
		for (const prop of properties) {
			const [propertyKey, defaultValue] = prop.split("|")
			const envKey = propertyKeyToEnvVar(propertyKey)
			envVars.push(`${envKey}=${defaultValue}`)
		}

		return envVars.join("\n")
	} catch (error) {
		if (error instanceof Error && error.message.includes("Validation Error")) {
			throw error // Re-throw AppError instances
		}
		throw ErrorFactory.conversion(
			`Spring to environment variables conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			input.slice(0, 100),
			"spring-to-env"
		)
	}
}

/**
 * Convert YAML to Properties format
 */
export function convertYamlToProperties(input: string): string {
	try {
		const parsed = yaml.load(input)

		if (!parsed || typeof parsed !== "object") {
			throw ErrorFactory.validation("Invalid YAML format", "input", input.slice(0, 50))
		}

		const flattened = flattenObject(parsed)
		const properties: string[] = []

		for (const [key, value] of Object.entries(flattened)) {
			const propValue = value?.toString() || ""
			properties.push(`${key}=${propValue}`)
		}

		return properties.join("\n")
	} catch (error) {
		if (error instanceof Error && error.message.includes("Validation Error")) {
			throw error // Re-throw AppError instances
		}
		throw ErrorFactory.conversion(
			`YAML to properties conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			input.slice(0, 100),
			"yaml-to-properties"
		)
	}
}

/**
 * Convert Properties to YAML format
 */
export function convertPropertiesToYaml(input: string): string {
	try {
		const parsed = parsePropertiesFormat(input)

		if (!parsed || Object.keys(parsed).length === 0) {
			throw ErrorFactory.validation("No valid properties found", "input", input.slice(0, 50))
		}

		// Convert to YAML string
		const yamlOutput = yaml.dump(parsed, {
			indent: 2,
			lineWidth: -1,
			noRefs: true,
			sortKeys: false,
			quotingType: '"',
			forceQuotes: false
		})

		return yamlOutput
	} catch (error) {
		if (error instanceof Error && error.message.includes("Validation Error")) {
			throw error // Re-throw AppError instances
		}
		throw ErrorFactory.conversion(
			`Properties to YAML conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			input.slice(0, 100),
			"properties-to-yaml"
		)
	}
}

/**
 * Convert YAML to Kubernetes environment variables format
 */
export function convertYamlToK8sEnv(input: string): string {
	try {
		// Check if input looks like Java properties format (contains = and no YAML structure)
		const isPropertiesFormat = input
			.trim()
			.split("\n")
			.some(
				(line) =>
					line.trim() &&
					!line.trim().startsWith("#") &&
					!line.trim().startsWith("//") &&
					line.includes("=") &&
					!line.includes(":")
			)

		// Try to parse as YAML first
		let parsed: any
		try {
			parsed = yaml.load(input)
			// If YAML parsing returns a string and we detected properties format, try properties parser
			if (typeof parsed === "string" && isPropertiesFormat) {
				parsed = parsePropertiesFormat(input)
			}
		} catch {
			// If YAML parsing fails, try parsing as Java properties format
			parsed = parsePropertiesFormat(input)
		}

		if (!parsed || typeof parsed !== "object") {
			throw ErrorFactory.validation(
				"Invalid input format - expected YAML or properties format",
				"input",
				input.slice(0, 50)
			)
		}

		const flattened = flattenObject(parsed)
		const k8sEnvVars: string[] = []

		for (const [key, value] of Object.entries(flattened)) {
			const envKey = propertyKeyToEnvVar(key)

			// Validate K8s environment variable naming rules
			if (!isValidK8sEnvName(envKey)) {
				throw ErrorFactory.validation(
					`Invalid Kubernetes environment variable name: ${envKey}. Must match pattern [A-Za-z_][A-Za-z0-9_]* and be max 63 characters.`,
					"env_name",
					envKey
				)
			}

			const envValue = value?.toString() || ""
			// Format as YAML array with name and value
			k8sEnvVars.push(`- name: ${envKey}\n  value: '${envValue}'`)
		}

		return k8sEnvVars.join("\n")
	} catch (error) {
		if (error instanceof Error && error.message.includes("Validation Error")) {
			throw error // Re-throw AppError instances
		}
		throw ErrorFactory.conversion(
			`YAML to K8s environment variables conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			input.slice(0, 100),
			"yaml-to-k8s-env"
		)
	}
}

/**
 * Validate Kubernetes environment variable name according to K8s naming rules
 * Must match pattern [A-Za-z_][A-Za-z0-9_]* and be max 63 characters
 */
function isValidK8sEnvName(name: string): boolean {
	// Check length constraint (max 63 characters)
	if (name.length > 63) {
		return false
	}

	// Check naming pattern: starts with letter or underscore, followed by letters, numbers, or underscores
	const k8sNamePattern = /^[A-Za-z_][A-Za-z0-9_]*$/
	return k8sNamePattern.test(name)
}

/**
 * Main conversion function that handles all modes
 */
export function convertProperties(input: string, mode: ConversionMode): string {
	if (!input.trim()) {
		return ""
	}

	switch (mode) {
		case "yaml-to-env":
			return convertYamlToEnv(input)
		case "spring-to-env":
			return convertSpringToEnv(input)
		case "yaml-to-properties":
			return convertYamlToProperties(input)
		case "properties-to-yaml":
			return convertPropertiesToYaml(input)
		case "yaml-to-k8s-env":
			return convertYamlToK8sEnv(input)
		default:
			throw ErrorFactory.validation(`Invalid conversion mode: ${mode}`, "mode", mode)
	}
}
