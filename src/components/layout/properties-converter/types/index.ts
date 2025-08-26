export type ConversionMode = 'yaml-to-env' | 'spring-to-env'

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