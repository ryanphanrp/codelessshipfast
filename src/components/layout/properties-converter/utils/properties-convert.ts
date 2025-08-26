import yaml from 'js-yaml'

export type ConversionMode = 'yaml-to-env' | 'spring-to-env'

/**
 * Convert dot-separated or kebab-case property key to environment variable format
 * Example: app.redis.value-key -> APP_REDIS_VALUE_KEY
 */
function propertyKeyToEnvVar(key: string): string {
	return key
		.replace(/[.-]/g, '_')
		.replace(/([a-z])([A-Z])/g, '$1_$2')
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
 * Extract Spring @Value properties and convert to environment variables
 */
export function convertSpringToEnv(input: string): string {
	try {
		// Regex to match @Value("${property.key}") or @Value("${property.key:defaultValue}")
		const valueRegex = /@Value\s*\(\s*"\$\{([^}]+)\}"\s*\)/g
		const properties = new Set<string>()
		let match

		while ((match = valueRegex.exec(input)) !== null) {
			const fullProperty = match[1]
			// Extract property key (remove default value if present)
			const propertyKey = fullProperty.split(':')[0].trim()
			// Extract default value if present
			const defaultValue = fullProperty.includes(':') 
				? fullProperty.split(':').slice(1).join(':').trim() 
				: ''
			
			properties.add(`${propertyKey}|${defaultValue}`)
		}

		if (properties.size === 0) {
			throw new Error('No @Value properties found in the input')
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
 * Main conversion function that handles both modes
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
		default:
			throw new Error('Invalid conversion mode')
	}
}