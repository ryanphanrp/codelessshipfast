import type { JsonViewerMode } from "@/types"

export interface JsonNode {
	key: string
	value: any
	type: "object" | "array" | "string" | "number" | "boolean" | "null"
	children?: JsonNode[]
	expanded?: boolean
	path: string
	depth: number
}

export interface ValidationError {
	line: number
	column: number
	message: string
	severity: "error" | "warning"
}

export interface JsonValidationResult {
	isValid: boolean
	parsed?: any
	errors: ValidationError[]
}

export interface JsonViewerState {
	mode: JsonViewerMode
	input: string
	output: string
	error: string | null
	isProcessing: boolean
	validationResult?: JsonValidationResult
	treeData?: JsonNode[]
}

export interface JsonViewerProps {
	mode: JsonViewerMode
	input: string
	output: string
	error: string | null
	isProcessing: boolean
	validationResult?: JsonValidationResult
	treeData?: JsonNode[]
	examples: ExampleItem[]
	onInputChange: (input: string) => void
	onModeChange: (mode: JsonViewerMode) => void
	onClearInput: () => void
	onClearOutput: () => void
	onProcess: () => void
	onToggleNode?: (path: string) => void
}

export interface ExampleItem {
	label: string
	content: string
}

// Schema generation types
export interface JsonSchema {
	$schema?: string
	type?: string | string[]
	title?: string
	description?: string
	properties?: Record<string, JsonSchema>
	required?: string[]
	additionalProperties?: boolean | JsonSchema
	items?: JsonSchema | JsonSchema[]
	enum?: any[]
	const?: any
	format?: string
	pattern?: string
	minimum?: number
	maximum?: number
	minLength?: number
	maxLength?: number
	minItems?: number
	maxItems?: number
	uniqueItems?: boolean
	allOf?: JsonSchema[]
	anyOf?: JsonSchema[]
	oneOf?: JsonSchema[]
	not?: JsonSchema
	examples?: any[]
}

export interface SchemaGeneratorOptions {
	required?: boolean
	additionalProperties?: boolean
	generateExamples?: boolean
	generateDescriptions?: boolean
}

// JSONPath types
export interface JsonPathResult {
	path: string
	value: any
	match: boolean
}

export interface JsonPathState {
	expression: string
	results: JsonPathResult[]
	error?: string
	isEvaluating: boolean
}

// Diff comparison types
export interface JsonDiffItem {
	type: 'added' | 'removed' | 'modified' | 'unchanged'
	path: string
	oldValue?: any
	newValue?: any
	message?: string
}

export interface JsonDiffState {
	leftJson: string
	rightJson: string
	diff: JsonDiffItem[]
	viewMode: 'unified' | 'split'
	isComparing: boolean
	error?: string
}

// Statistics types
export interface JsonStats {
	totalNodes: number
	maxDepth: number
	totalProperties: number
	totalArrays: number
	totalValues: number
	dataTypes: Record<string, number>
	averageArrayLength: number
	memoryEstimate: number
	parseTime: number
	complexityScore: number
	propertyFrequency: Record<string, number>
}

// Flattener types
export interface FlattenOptions {
	separator: string
	arrayNotation: 'bracket' | 'dot'
	preserveArrays: boolean
}

export interface FlattenState {
	original: string
	flattened: string
	options: FlattenOptions
	mode: 'flatten' | 'unflatten'
	isProcessing: boolean
	error?: string
}

// Visualizer types
export interface VisualNode {
	id: string
	label: string
	type: 'object' | 'array' | 'property' | 'value'
	dataType?: string
	value?: any
	children?: string[]
	parent?: string
	depth: number
	expanded?: boolean
}

export interface VisualEdge {
	id: string
	source: string
	target: string
	label?: string
}

export interface VisualizationData {
	nodes: VisualNode[]
	edges: VisualEdge[]
}

export interface VisualizerState {
	data: VisualizationData
	layout: 'tree' | 'radial' | 'force'
	zoomLevel: number
	selectedNode?: string
	filterType?: string
	searchQuery?: string
}

// Enhanced visualization types for new panel
export interface VisualizationNode extends VisualNode {
	x?: number
	y?: number
	size?: number
	path?: string
}

export interface VisualizationEdge extends VisualEdge {
	x1?: number
	y1?: number
	x2?: number
	y2?: number
}

export interface VisualizationLayout {
	nodes: VisualizationNode[]
	edges: VisualizationEdge[]
	width: number
	height: number
}

export interface VisualizationOptions {
	maxDepth: number
	nodeSize: number
	showLabels: boolean
	colorScheme: 'type' | 'depth' | 'value'
	compactMode: boolean
}

export interface LayoutMetrics {
	totalNodes: number
	visibleNodes: number
	totalEdges: number
	maxDepth: number
	edges: number
}
