"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, UnfoldHorizontal, FoldHorizontal, CheckCircle, AlertTriangle } from "lucide-react"
import { 
	flattenJson, 
	unflattenJson, 
	convertToCSV,
	generateFlattenPreview,
	generateUnflattenPreview,
	validateFlattenedData,
	suggestOptimalOptions,
	FLATTEN_EXAMPLES
} from "../utils/json-flattener"
import type { FlattenOptions } from "../types"

interface FlattenerPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function FlattenerPanel({ input, error, isProcessing }: FlattenerPanelProps) {
	const [mode, setMode] = useState<"flatten" | "unflatten">("flatten")
	const [options, setOptions] = useState<FlattenOptions>({
		separator: ".",
		arrayNotation: "bracket",
		preserveArrays: false
	})
	const [flattened, setFlattened] = useState("")
	const [unflattened, setUnflattened] = useState("")
	const [processingError, setProcessingError] = useState<string | null>(null)
	const [copySuccess, setCopySuccess] = useState(false)
	const [selectedExample, setSelectedExample] = useState<string>("")

	// Process JSON when input or options change
	useEffect(() => {
		if (input.trim() && !error && !isProcessing && mode === "flatten") {
			try {
				const parsedJson = JSON.parse(input)
				const result = flattenJson(parsedJson, options)
				setFlattened(JSON.stringify(result, null, 2))
				setProcessingError(null)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Flattening failed")
				setFlattened("")
			}
		}
	}, [input, options, error, isProcessing, mode])

	// Suggest optimal options
	useEffect(() => {
		if (input.trim() && !error && !isProcessing && mode === "flatten") {
			try {
				const parsedJson = JSON.parse(input)
				const suggested = suggestOptimalOptions(parsedJson)
				if (JSON.stringify(suggested) !== JSON.stringify(options)) {
					// Could show a suggestion notification here
				}
			} catch {
				// Ignore errors for suggestions
			}
		}
	}, [input])

	const handleModeChange = (newMode: "flatten" | "unflatten") => {
		setMode(newMode)
		setProcessingError(null)
		if (newMode === "unflatten") {
			// Initialize with flattened data if available
			if (flattened) {
		try {
			const parsed = JSON.parse(flattened)
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				setProcessingError('Invalid JSON: must be an object')
				return
			}
			const validation = validateFlattenedData(parsed as Record<string, any>)
			if (validation.valid) {
				const result = unflattenJson(parsed as Record<string, any>, options)
						setUnflattened(JSON.stringify(result, null, 2))
					} else {
						setProcessingError(`Validation failed: ${validation.errors.join(", ")}`)
					}
				} catch (err) {
					setProcessingError(err instanceof Error ? err.message : "Unflatten failed")
				}
			}
		}
	}

	const handleOptionChange = (key: keyof FlattenOptions, value: any) => {
		setOptions(prev => ({
			...prev,
			[key]: value
		}))
	}

	const processUnflatten = () => {
		if (flattened) {
		try {
			const parsed = JSON.parse(flattened)
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				setProcessingError('Invalid JSON: must be an object')
				return
			}
			const validation = validateFlattenedData(parsed as Record<string, any>)
			
			if (!validation.valid) {
				setProcessingError(`Validation failed: ${validation.errors.join(", ")}`)
				return
			}

			const result = unflattenJson(parsed as Record<string, any>, options)
				setUnflattened(JSON.stringify(result, null, 2))
				setProcessingError(null)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Unflatten failed")
			}
		}
	}

	const copyResult = async () => {
		const content = mode === "flatten" ? flattened : unflattened
		if (content) {
			await navigator.clipboard.writeText(content)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const downloadResult = (format: "json" | "csv") => {
		if (!flattened) return

		let content = ""
		let filename = ""
		let mimeType = ""

		if (format === "json") {
			content = mode === "flatten" ? flattened : unflattened
			filename = `${mode === "flatten" ? "flattened" : "unflattened"}.json`
			mimeType = "application/json"
		} else {
		try {
			const parsed = JSON.parse(flattened)
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				return
			}
			content = convertToCSV(parsed as Record<string, any>)
			filename = "flattened.csv"
			mimeType = "text/csv"
			} catch {
				return
			}
		}

		const blob = new Blob([content], { type: mimeType })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const loadExample = (exampleKey: string) => {
		const example = FLATTEN_EXAMPLES[exampleKey as keyof typeof FLATTEN_EXAMPLES]
		if (example) {
			setSelectedExample(exampleKey)
			try {
				const result = flattenJson(example.data, options)
				setFlattened(JSON.stringify(result, null, 2))
				setProcessingError(null)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Example loading failed")
			}
		}
	}

	const getResultCount = () => {
		try {
			const parsed = JSON.parse(mode === "flatten" ? flattened : unflattened)
			if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
				return mode === "flatten" ? Object.keys(parsed).length : "N/A"
			}
			return 0
		} catch {
			return 0
		}
	}

	return (
		<div className="space-y-4">
			{/* Mode and Options */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						{mode === "flatten" ? <UnfoldHorizontal className="h-4 w-4" /> : <FoldHorizontal className="h-4 w-4" />}
						Flatten/Unflatten Options
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Tabs value={mode} onValueChange={(v) => handleModeChange(v as typeof mode)}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="flatten" className="text-sm">
								<UnfoldHorizontal className="h-3 w-3 mr-2" />
								Flatten
							</TabsTrigger>
							<TabsTrigger value="unflatten" className="text-sm">
								<FoldHorizontal className="h-3 w-3 mr-2" />
								Unflatten
							</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className="grid md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Separator</label>
							<Select
								value={options.separator}
								onValueChange={(value) => handleOptionChange("separator", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value=".">. (dot)</SelectItem>
									<SelectItem value="_">_ (underscore)</SelectItem>
									<SelectItem value="-">- (dash)</SelectItem>
									<SelectItem value="/">/ (slash)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Array Notation</label>
							<Select
								value={options.arrayNotation}
								onValueChange={(value) => handleOptionChange("arrayNotation", value as "bracket" | "dot")}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="bracket">Bracket [0]</SelectItem>
									<SelectItem value="dot">Dot .0</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Options</label>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="preserveArrays"
									checked={options.preserveArrays}
									onCheckedChange={(checked) => handleOptionChange("preserveArrays", !!checked)}
								/>
								<label htmlFor="preserveArrays" className="text-sm">
									Preserve Arrays
								</label>
							</div>
						</div>
					</div>

					{mode === "unflatten" && (
						<Button onClick={processUnflatten} disabled={!flattened}>
							Process Unflatten
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Examples */}
			{mode === "flatten" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Examples</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{Object.entries(FLATTEN_EXAMPLES).map(([key, example]) => (
								<Button
									key={key}
									variant={selectedExample === key ? "default" : "outline"}
									size="sm"
									onClick={() => loadExample(key)}
									className="text-xs"
								>
									{example.name}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Results */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm">
							{mode === "flatten" ? "Flattened Result" : "Unflattened Result"}
							{(flattened || unflattened) && (
								<Badge variant="secondary">
									{getResultCount()} {mode === "flatten" ? "keys" : "restored"}
								</Badge>
							)}
							{processingError && (
								<Badge variant="destructive">
									<AlertTriangle className="h-3 w-3 mr-1" />
									Error
								</Badge>
							)}
						</CardTitle>
						
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={copyResult}
								disabled={!(mode === "flatten" ? flattened : unflattened)}
							>
								{copySuccess ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => downloadResult("json")}
								disabled={!flattened}
							>
								<Download className="h-3 w-3" />
							</Button>
							{mode === "flatten" && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => downloadResult("csv")}
									disabled={!flattened}
								>
									CSV
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{error || isProcessing ? (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							{isProcessing ? "Processing..." : "Enter valid JSON to flatten/unflatten"}
						</div>
					) : processingError ? (
						<div className="space-y-2">
							<p className="text-sm text-red-600">Processing Error:</p>
							<div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
								{processingError}
							</div>
						</div>
					) : (mode === "flatten" ? flattened : unflattened) ? (
						<div className="space-y-4">
							{/* Preview */}
							{mode === "flatten" && input && (
								<div>
									<h4 className="font-medium mb-2 text-sm">Structure Comparison</h4>
									<div className="grid md:grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Original depth:</span>
											<span className="ml-2 font-medium">
												{(() => {
													try {
														const parsed = JSON.parse(input)
														const getDepth = (obj: any): number => {
															if (typeof obj !== "object" || obj === null) return 0
															return 1 + Math.max(0, ...Object.values(obj).map(getDepth))
														}
														return getDepth(parsed)
													} catch {
														return "N/A"
													}
												})()}
											</span>
										</div>
										<div>
											<span className="text-muted-foreground">Flattened keys:</span>
											<span className="ml-2 font-medium">{getResultCount()}</span>
										</div>
									</div>
								</div>
							)}
							
							<Separator />
							
			{/* Result Display */}
							<div className="bg-background border rounded-lg">
								<pre className="p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
									<code>{mode === "flatten" ? flattened : unflattened}</code>
								</pre>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							{mode === "flatten" ? "Enter JSON to flatten" : "Generate flattened data first to unflatten"}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="text-sm text-muted-foreground space-y-2">
						<h4 className="font-medium text-foreground">JSON Flattening Guide</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h5 className="font-medium mb-2">Flattening Options:</h5>
								<ul className="space-y-1 text-xs">
									<li><strong>Separator:</strong> Character used to join nested keys</li>
									<li><strong>Array Notation:</strong> How array indices are represented</li>
									<li><strong>Preserve Arrays:</strong> Keep arrays as-is instead of flattening</li>
								</ul>
							</div>
							<div>
								<h5 className="font-medium mb-2">Use Cases:</h5>
								<ul className="space-y-1 text-xs">
									<li>• Convert nested JSON for CSV export</li>
									<li>• Simplify data structures for processing</li>
									<li>• Create flat configuration files</li>
									<li>• Prepare data for database storage</li>
									<li>• Generate key-value pairs</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}