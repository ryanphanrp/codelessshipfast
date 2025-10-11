export type ConversionMode =
	| "yaml-to-env"
	| "spring-to-env"
	| "yaml-to-properties"
	| "properties-to-yaml"
	| "yaml-to-k8s-env"

export interface ConversionResult {
	success: boolean
	output: string
	error?: string
}

export interface ConverterState {
	mode: ConversionMode
	input: string
	output: string
	error: string | null
	isConverting: boolean
}
