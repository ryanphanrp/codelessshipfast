"use client"

import { Badge } from "@/components/hexta-ui"
import { Button } from "@/components/hexta-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/hexta-ui"
import { Input } from "@/components/hexta-ui"
import { Separator } from "@/components/hexta-ui"
import { AlertCircle, BookOpen, CheckCircle, Copy, Search, Target } from "lucide-react"
import { useEffect, useState } from "react"
import type { JsonPathResult } from "../types"
import {
	JSONPATH_EXAMPLES,
	evaluateJsonPath,
	getJsonPathSuggestions,
	validateJsonPath
} from "../utils/jsonpath-evaluator"

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
			const resultText = results.map((r) => `${r.path}: ${JSON.stringify(r.value)}`).join("\n")
			await navigator.clipboard.writeText(resultText)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const downloadResults = () => {
		if (results.length > 0) {
			const resultData = results.map((r) => ({ path: r.path, value: r.value }))
			const jsonString = JSON.stringify(resultData, null, 2)
			const blob = new Blob([jsonString], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = "jsonpath-results.json"
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
							disabled={!expression || expression === "$"}>
							Reset
						</Button>
					</div>

					{/* Examples */}
					<div className="space-y-2">
						<h4 className="flex items-center gap-2 font-medium text-sm">
							<BookOpen className="h-3 w-3" />
							Common Patterns
						</h4>
						<div className="flex flex-wrap gap-1">
							{JSONPATH_EXAMPLES.slice(0, 6).map((example, index) => (
								<Button
									key={index}
									variant={selectedExample === example.expression ? "default" : "outline"}
									size="sm"
									className="h-7 font-mono text-xs"
									onClick={() => handleExampleSelect(example.expression)}>
									{example.expression}
								</Button>
							))}
						</div>
					</div>

					{/* Suggestions based on current JSON */}
					{suggestions.length > 0 && (
						<div className="space-y-2">
							<h4 className="flex items-center gap-2 font-medium text-sm">
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
											className="h-6 px-2 font-mono text-xs"
											onClick={() => handleSuggestionClick(suggestion)}>
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
									{results.length} match{results.length !== 1 ? "es" : ""}
								</Badge>
							)}
							{evaluationError && (
								<Badge variant="destructive">
									<AlertCircle className="mr-1 h-3 w-3" />
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
								className="h-8">
								{copySuccess ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadResults}
								disabled={results.length === 0}
								className="h-8">
								Download
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{error || isProcessing ? (
						<div className="flex h-32 items-center justify-center text-muted-foreground">
							{isProcessing ? "Processing..." : "Enter valid JSON to evaluate JSONPath"}
						</div>
					) : evaluationError ? (
						<div className="space-y-2">
							<p className="text-red-600 text-sm">Evaluation Error:</p>
							<div className="rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
								{evaluationError}
							</div>
						</div>
					) : results.length > 0 ? (
						<div className="space-y-4">
							{/* Results Summary */}
							<div className="rounded-lg bg-muted p-3">
								<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
									<div>
										<span className="font-medium">Matches:</span>
										<div className="text-muted-foreground">{results.length}</div>
									</div>
									<div>
										<span className="font-medium">Expression:</span>
										<div className="font-mono text-muted-foreground text-xs">{expression}</div>
									</div>
									<div>
										<span className="font-medium">Type:</span>
										<div className="text-muted-foreground">
											{results.length === 1 ? "Single" : "Multiple"} result
											{results.length !== 1 ? "s" : ""}
										</div>
									</div>
								</div>
							</div>

							<Separator />

							{/* Results List */}
							<div className="max-h-96 space-y-3 overflow-y-auto">
								{results.map((result, index) => (
									<div key={index} className="space-y-2 rounded-lg border p-3">
										<div className="flex items-center justify-between">
											<span className="font-mono text-muted-foreground text-xs">{result.path}</span>
											<Badge variant="outline" className="text-xs">
												{typeof result.value}
											</Badge>
										</div>
										<div className="rounded border bg-background p-2">
											<pre className="overflow-x-auto whitespace-pre-wrap text-sm">
												<code>{JSON.stringify(result.value, null, 2)}</code>
											</pre>
										</div>
									</div>
								))}
							</div>
						</div>
					) : expression && expression !== "$" ? (
						<div className="flex h-32 items-center justify-center text-muted-foreground">
							No matches found for this JSONPath expression
						</div>
					) : (
						<div className="flex h-32 items-center justify-center text-muted-foreground">
							Enter a JSONPath expression to search the JSON data
						</div>
					)}
				</CardContent>
			</Card>

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-2 text-muted-foreground text-sm">
						<h4 className="font-medium text-foreground">JSONPath Syntax Guide</h4>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<h5 className="mb-2 font-medium">Basic Syntax:</h5>
								<ul className="space-y-1 text-xs">
									<li>
										<code className="rounded bg-muted px-1">$</code> - Root object
									</li>
									<li>
										<code className="rounded bg-muted px-1">.property</code> - Child property
									</li>
									<li>
										<code className="rounded bg-muted px-1">['property']</code> - Bracket notation
									</li>
									<li>
										<code className="rounded bg-muted px-1">[0]</code> - Array index
									</li>
									<li>
										<code className="rounded bg-muted px-1">[*]</code> - All array elements
									</li>
								</ul>
							</div>
							<div>
								<h5 className="mb-2 font-medium">Advanced Features:</h5>
								<ul className="space-y-1 text-xs">
									<li>
										<code className="rounded bg-muted px-1">..*</code> - Recursive descent
									</li>
									<li>
										<code className="rounded bg-muted px-1">[0,1]</code> - Multiple indices
									</li>
									<li>
										<code className="rounded bg-muted px-1">[start:end]</code> - Array slice
									</li>
									<li>
										<code className="rounded bg-muted px-1">?(@.price &gt; 10)</code> - Filter
										expression
									</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
