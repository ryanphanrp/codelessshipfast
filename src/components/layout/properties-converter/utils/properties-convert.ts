import yaml from 'js-yaml'

export type ConversionMode = 'yaml-to-env' | 'spring-to-env' | 'yaml-to-properties' | 'properties-to-yaml'

/**
 * Convert dot-separated, kebab-case, or camelCase property key to environment variable format
 * Examples: 
 * - app.redis.value-key -> APP_REDIS_VALUE_KEY
 * - abc.efg.gh-oo.makeNow -> ABC_EFG_GH_OO_MAKE_NOW
 */
function propertyKeyToEnvVar(key: string): string {
	return key
		// First handle camelCase to snake_case (must be before replacing dots/hyphens)
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		// Then replace dots and hyphens with underscores
		.replace(/[.-]/g, '_')
		// Convert to uppercase
		.toUpperCase()
}

/**
 * Flatten nested object to dot notation
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
	const flattened: Record<string, any> = {}

	for (const [key, value] of Object.entries(obj)) {
		const newKey = prefix ? `${prefix}.${key}` : key

		if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
			Object.assign(flattened, flattenObject(value, newKey))
		} else if (Array.isArray(value)) {
			// Handle arrays by joining with comma or indexing
			flattened[newKey] = value.join(',')
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

		if (!parsed || typeof parsed !== 'object') {
			throw new Error('Invalid input format')
		}

		const flattened = flattenObject(parsed)
		const envVars: string[] = []

		for (const [key, value] of Object.entries(flattened)) {
			const envKey = propertyKeyToEnvVar(key)
			const envValue = value?.toString() || ''
			envVars.push(`${envKey}=${envValue}`)
		}

		return envVars.join('\n')
	} catch (error) {
		throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

/**
 * Parse Java properties format (key=value or key: value)
 */
function parsePropertiesFormat(input: string): Record<string, any> {
	const result: Record<string, any> = {}
	const lines = input.split('\n')

	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
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
	const keys = path.split('.')
	let current = obj

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]
		if (!(key in current) || typeof current[key] !== 'object') {
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
			const propertyKey = fullProperty.split(':')[0].trim()
			// Extract default value if present
			const defaultValue = fullProperty.includes(':') 
				? fullProperty.split(':').slice(1).join(':').trim() 
				: ''
			
			properties.add(`${propertyKey}|${defaultValue}`)
		}

		// If no @Value annotations found, treat input as plain property keys
		if (!hasAnnotations) {
			const lines = input.split('\n')
			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
					continue
				}
				
				// Extract property key and optional value
				let propertyKey = ''
				let defaultValue = ''
				
				// Check for = separator
				if (trimmed.includes('=')) {
					const parts = trimmed.split('=')
					propertyKey = parts[0].trim()
					defaultValue = parts.slice(1).join('=').trim()
				} 
				// Check for : separator (but not in the middle of property names)
				else if (trimmed.includes(':') && !trimmed.match(/^[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+$/)) {
					const colonIdx = trimmed.lastIndexOf(':')
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
			throw new Error('No properties found in the input. Enter @Value annotations or property keys (e.g., abc.efg.makeNow)')
		}

		const envVars: string[] = []
		for (const prop of properties) {
			const [propertyKey, defaultValue] = prop.split('|')
			const envKey = propertyKeyToEnvVar(propertyKey)
			envVars.push(`${envKey}=${defaultValue}`)
		}

		return envVars.join('\n')
	} catch (error) {
		throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

/**
 * Convert YAML to Properties format
 */
export function convertYamlToProperties(input: string): string {
	try {
		const parsed = yaml.load(input)
		
		if (!parsed || typeof parsed !== 'object') {
			throw new Error('Invalid YAML format')
		}

		const flattened = flattenObject(parsed)
		const properties: string[] = []

		for (const [key, value] of Object.entries(flattened)) {
			const propValue = value?.toString() || ''
			properties.push(`${key}=${propValue}`)
		}

		return properties.join('\n')
	} catch (error) {
		throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

/**
 * Convert Properties to YAML format
 */
export function convertPropertiesToYaml(input: string): string {
	try {
		const parsed = parsePropertiesFormat(input)
		
		if (!parsed || Object.keys(parsed).length === 0) {
			throw new Error('No valid properties found')
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
		throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

/**
 * Main conversion function that handles all modes
 */
export function convertProperties(input: string, mode: ConversionMode): string {
	if (!input.trim()) {
		return ''
	}

	switch (mode) {
		case 'yaml-to-env':
			return convertYamlToEnv(input)
		case 'spring-to-env':
			return convertSpringToEnv(input)
		case 'yaml-to-properties':
			return convertYamlToProperties(input)
		case 'properties-to-yaml':
			return convertPropertiesToYaml(input)
		default:
			throw new Error('Invalid conversion mode')
	}
}
