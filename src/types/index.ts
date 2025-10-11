/**
 * Central type definitions for the entire application
 */

// Common/shared types
export type ConversionMode =
	| "yaml-to-env"
	| "spring-to-env"
	| "yaml-to-properties"
	| "properties-to-yaml"
	| "yaml-to-k8s-env"

// JSON Viewer types
export type JsonViewerMode =
	| "pretty-print"
	| "minify"
	| "tree-view"
	| "validate"
	| "schema"
	| "jsonpath"
	| "diff"
	| "stats"
	| "flatten"
	| "visualize"

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

// Clipboard types
export interface ClipboardState {
	success: boolean
	error?: string | null
}

export interface ClipboardResult {
	success: boolean
	text?: string
	error?: string | null
}

// Logging types
export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
	level: LogLevel
	message: string
	data?: unknown
	timestamp: string
	context?: string
}

// File operation types
export interface FileValidationResult {
	isValid: boolean
	error?: string
}

export interface DownloadOptions {
	filename: string
	mimeType?: string
}

// Validation types
export interface ValidationResult {
	isValid: boolean
	error?: string
}

// Component props types
export interface BaseComponentProps {
	className?: string
	children?: React.ReactNode
}

export interface InputActionsProps {
	hasInput: boolean
	clipboardState: ClipboardState
	onPaste: () => void
	onCopy: () => void
	onClear: () => void
}

export interface OutputActionsProps {
	hasOutput: boolean
	onCopy: () => void
	onClear: () => void
}

export interface ExampleItem {
	label: string
	content: string
}

// SQL formatter types
export type FormatRules = {
	[key: string]: (param: string) => string
}

// Protobuf converter types
export interface JavaToProtoMapping {
	int: string
	long: string
	float: string
	double: string
	boolean: string
	String: string
	[key: string]: string
}

export type ProtoType = "record" | "interface" | "standardize" | "sort" | "clean" | "oldInterface"

// Environment variable types
export interface EnvVariable {
	key: string
	value: string
}

// Error handling types
export interface ErrorState {
	hasError: boolean
	message?: string
	code?: string
}

// API response types
export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

// Theme types
export type Theme = "light" | "dark" | "system"

// Navigation types
export interface NavigationItem {
	title: string
	url: string
	icon: React.ComponentType<{ className?: string }>
}

// Form types
export interface FormField {
	name: string
	value: string
	error?: string
	touched?: boolean
}

export interface FormState {
	fields: Record<string, FormField>
	isSubmitting: boolean
	isValid: boolean
}
