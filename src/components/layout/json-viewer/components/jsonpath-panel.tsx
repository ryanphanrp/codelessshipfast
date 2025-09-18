"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Search, CheckCircle, AlertCircle, BookOpen, Target } from "lucide-react"
import { 
	evaluateJsonPath, 
	getJsonPathSuggestions, 
	validateJsonPath,
	JSONPATH_EXAMPLES
} from "../utils/jsonpath-evaluator"
import type { JsonPathResult } from "../types"

interface JsonPathPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function JsonPathPanel({ input, error, isProcessing }: JsonPathPanelProps) {
	const [expression, setExpression] = useState("$")
	const [results, setResults] = useState<JsonPathResult[]>([])
	const [evaluationError, setEvaluationError] = useState<string | null>(null)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [copySuccess, setCopySuccess] = useState(false)
	const [selectedExample, setSelectedExample] = useState("")

	useEffect(() => {
		if (input.trim() && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const pathSuggestions = getJsonPathSuggestions(parsedJson)
				setSuggestions(pathSuggestions)
			} catch {
				setSuggestions([])
			}
		}
	}, [input, error, isProcessing])

	useEffect(() => {
		if (input.trim() && expression && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const validation = validateJsonPath(expression)
				
				if (!validation.valid) {
					setEvaluationError(validation.error || "Invalid JSONPath expression")
					setResults([])
					return
				}

				const pathResults = evaluateJsonPath(parsedJson, expression)
				setResults(pathResults)
				setEvaluationError(null)
			} catch (err) {
				setEvaluationError(err instanceof Error ? err.message : "Evaluation failed")
				setResults([])
			}
		} else {
			setResults([])
			setEvaluationError(null)
		}
	}, [input, expression, error, isProcessing])

	const handleExpressionChange = (value: string) => {
		setExpression(value)
		setSelectedExample("")
	}

	const handleExampleSelect = (example: string) => {
		setExpression(example)
		setSelectedExample(example)
	}

	const handleSuggestionClick = (suggestion: string) => {
		setExpression(suggestion)
		setSelectedExample("")
	}

	const copyResults = async () => {
		if (results.length > 0) {
			const resultText = results.map(r => `${r.path}: ${JSON.stringify(r.value)}`).join("\n")
			await navigator.clipboard.writeText(resultText)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const downloadResults = () => {
		if (results.length > 0) {
			const resultData = results.map(r => ({ path: r.path, value: r.value }))
			const jsonString = JSON.stringify(resultData, null, 2)
			const blob = new Blob([jsonString], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'jsonpath-results.json'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	return (
		<div className="space-y-4">
			{/* Expression Input */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<Search className="h-4 w-4" />
						JSONPath Expression
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Input
							value={expression}
							onChange={(e) => handleExpressionChange(e.target.value)}
							placeholder="Enter JSONPath expression (e.g., $.store.book[*].title)"
							className="font-mono text-sm"
						/>
						<Button
							variant="outline"
							onClick={() => handleExpressionChange("$")}
							size="sm"
							disabled={!expression || expression === "$"}
						>
							Reset
						</Button>
					</div>

					{/* Examples */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<BookOpen className="h-3 w-3" />
							Common Patterns
						</h4>
						<div className="flex flex-wrap gap-1">
							{JSONPATH_EXAMPLES.slice(0, 6).map((example, index) => (
								<Button
									key={index}
									variant={selectedExample === example.expression ? "default" : "outline"}
									size="sm"
									className="h-7 text-xs font-mono"
									onClick={() => handleExampleSelect(example.expression)}
								>
									{example.expression}
								</Button>
							))}
						</div>
					</div>

					{/* Suggestions based on current JSON */}
					{suggestions.length > 0 && (
						<div className="space-y-2">
							<h4 className="text-sm font-medium flex items-center gap-2">
								<Target className="h-3 w-3" />
								Available Paths
							</h4>
							<div className="max-h-24 overflow-y-auto">
								<div className="flex flex-wrap gap-1">
									{suggestions.slice(0, 12).map((suggestion, index) => (
										<Button
											key={index}
											variant="ghost"
											size="sm"
											className="h-6 text-xs font-mono px-2"
											onClick={() => handleSuggestionClick(suggestion)}
										>
											{suggestion}
										</Button>
									))}
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm">
							Evaluation Results
							{results.length > 0 && (
								<Badge variant="secondary">
									{results.length} match{results.length !== 1 ? 'es' : ''}
								</Badge>
							)}
							{evaluationError && (
								<Badge variant="destructive">
									<AlertCircle className="h-3 w-3 mr-1" />
									Error
								</Badge>
							)}
						</CardTitle>
						
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={copyResults}
								disabled={results.length === 0}
								className="h-8"
							>
								{copySuccess ? (
									<CheckCircle className="h-3 w-3" />
								) : (
									<Copy className="h-3 w-3" />
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadResults}
								disabled={results.length === 0}
								className="h-8"
							>
								Download
							</Button>
						</div>
					</div>
				</CardHeader>
				
				<CardContent>
					{error || isProcessing ? (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							{isProcessing ? "Processing..." : "Enter valid JSON to evaluate JSONPath"}
						</div>
					) : evaluationError ? (
						<div className="space-y-2">
							<p className="text-sm text-red-600">Evaluation Error:</p>
							<div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
								{evaluationError}
							</div>
						</div>
					) : results.length > 0 ? (
						<div className="space-y-4">
							{/* Results Summary */}
							<div className="bg-muted rounded-lg p-3">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
									<div>
										<span className="font-medium">Matches:</span>
										<div className="text-muted-foreground">{results.length}</div>
									</div>
									<div>
										<span className="font-medium">Expression:</span>
										<div className="text-muted-foreground font-mono text-xs">{expression}</div>
									</div>
									<div>
										<span className="font-medium">Type:</span>
										<div className="text-muted-foreground">
											{results.length === 1 ? 'Single' : 'Multiple'} result{results.length !== 1 ? 's' : ''}
										</div>
									</div>
								</div>
							</div>
							
							<Separator />
							
							{/* Results List */}
							<div className="space-y-3 max-h-96 overflow-y-auto">
								{results.map((result, index) => (
									<div key={index} className="border rounded-lg p-3 space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-mono text-xs text-muted-foreground">
												{result.path}
											</span>
											<Badge variant="outline" className="text-xs">
												{typeof result.value}
											</Badge>
										</div>
										<div className="bg-background border rounded p-2">
											<pre className="text-sm whitespace-pre-wrap overflow-x-auto">
												<code>{JSON.stringify(result.value, null, 2)}</code>
											</pre>
										</div>
									</div>
								))}
							</div>
						</div>
					) : expression && expression !== "$" ? (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							No matches found for this JSONPath expression
						</div>
					) : (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							Enter a JSONPath expression to search the JSON data
						</div>
					)}
				</CardContent>
			</Card>

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="text-sm text-muted-foreground space-y-2">
						<h4 className="font-medium text-foreground">JSONPath Syntax Guide</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h5 className="font-medium mb-2">Basic Syntax:</h5>
								<ul className="space-y-1 text-xs">
									<li><code className="bg-muted px-1 rounded">$</code> - Root object</li>
									<li><code className="bg-muted px-1 rounded">.property</code> - Child property</li>
									<li><code className="bg-muted px-1 rounded">['property']</code> - Bracket notation</li>
									<li><code className="bg-muted px-1 rounded">[0]</code> - Array index</li>
									<li><code className="bg-muted px-1 rounded">[*]</code> - All array elements</li>
								</ul>
							</div>
							<div>
								<h5 className="font-medium mb-2">Advanced Features:</h5>
								<ul className="space-y-1 text-xs">
									<li><code className="bg-muted px-1 rounded">..*</code> - Recursive descent</li>
									<li><code className="bg-muted px-1 rounded">[0,1]</code> - Multiple indices</li>
									<li><code className="bg-muted px-1 rounded">[start:end]</code> - Array slice</li>
									<li><code className="bg-muted px-1 rounded">?(@.price &gt; 10)</code> - Filter expression</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}