"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Copy, Download, GitCompare, Eye, EyeOff, RotateCcw, CheckCircle } from "lucide-react"
import { JsonEditor } from "./json-editor"
import { 
	compareJson, 
	generateDiffSummary, 
	filterDifferences,
	generateUnifiedDiff,
	exportDiffAsJson,
	exportDiffAsCsv,
	calculateSimilarityScore
} from "../utils/json-diff"
import type { JsonDiffItem } from "../types"

interface JsonDiffPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function JsonDiffPanel({ input, error, isProcessing }: JsonDiffPanelProps) {
	const [leftJson, setLeftJson] = useState("")
	const [rightJson, setRightJson] = useState("")
	const [differences, setDifferences] = useState<JsonDiffItem[]>([])
	const [viewMode, setViewMode] = useState<"unified" | "split">("split")
	const [showUnchanged, setShowUnchanged] = useState(false)
	const [isComparing, setIsComparing] = useState(false)
	const [comparisonError, setComparisonError] = useState<string | null>(null)
	const [copySuccess, setCopySuccess] = useState(false)

	// Initialize left side with current input
	useEffect(() => {
		if (input && !leftJson) {
			setLeftJson(input)
		}
	}, [input, leftJson])

	// Perform comparison
	const performComparison = () => {
		if (!leftJson.trim() || !rightJson.trim()) {
			setComparisonError("Both JSON inputs are required for comparison")
			setDifferences([])
			return
		}

		setIsComparing(true)
		setComparisonError(null)

		try {
			const leftParsed = JSON.parse(leftJson)
			const rightParsed = JSON.parse(rightJson)
			
			const diffResults = compareJson(leftParsed, rightParsed)
			setDifferences(diffResults)
		} catch (err) {
			setComparisonError(err instanceof Error ? err.message : "Comparison failed")
			setDifferences([])
		} finally {
			setIsComparing(false)
		}
	}

	// Auto-compare when both sides have valid JSON
	useEffect(() => {
		if (leftJson.trim() && rightJson.trim()) {
			const debounceTimer = setTimeout(() => {
				performComparison()
			}, 500)
			
			return () => clearTimeout(debounceTimer)
		}
	}, [leftJson, rightJson])

	const filteredDifferences = filterDifferences(differences, showUnchanged)
	const summary = generateDiffSummary(differences)
	const similarityScore = calculateSimilarityScore(differences)

	const copyResults = async (format: 'json' | 'unified' | 'csv') => {
		if (differences.length === 0) return

		let content = ""
		switch (format) {
			case 'json':
				content = exportDiffAsJson(filteredDifferences)
				break
			case 'unified':
				content = generateUnifiedDiff(filteredDifferences)
				break
			case 'csv':
				content = exportDiffAsCsv(filteredDifferences)
				break
		}

		await navigator.clipboard.writeText(content)
		setCopySuccess(true)
		setTimeout(() => setCopySuccess(false), 2000)
	}

	const downloadResults = (format: 'json' | 'unified' | 'csv') => {
		if (differences.length === 0) return

		let content = ""
		let filename = ""
		let mimeType = ""

		switch (format) {
			case 'json':
				content = exportDiffAsJson(filteredDifferences)
				filename = 'json-diff.json'
				mimeType = 'application/json'
				break
			case 'unified':
				content = generateUnifiedDiff(filteredDifferences)
				filename = 'json-diff.txt'
				mimeType = 'text/plain'
				break
			case 'csv':
				content = exportDiffAsCsv(filteredDifferences)
				filename = 'json-diff.csv'
				mimeType = 'text/csv'
				break
		}

		const blob = new Blob([content], { type: mimeType })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const swapJsonInputs = () => {
		const temp = leftJson
		setLeftJson(rightJson)
		setRightJson(temp)
	}

	const getDiffIcon = (type: JsonDiffItem['type']) => {
		switch (type) {
			case 'added': return <span className="text-green-600 font-bold">+</span>
			case 'removed': return <span className="text-red-600 font-bold">-</span>
			case 'modified': return <span className="text-blue-600 font-bold">~</span>
			default: return <span className="text-gray-400 font-bold">=</span>
		}
	}

	const getDiffColor = (type: JsonDiffItem['type']) => {
		switch (type) {
			case 'added': return 'bg-green-50 border-green-200'
			case 'removed': return 'bg-red-50 border-red-200'
			case 'modified': return 'bg-blue-50 border-blue-200'
			default: return 'bg-gray-50 border-gray-200'
		}
	}

	return (
		<div className="space-y-4">
			{/* Input Section */}
			<div className="grid md:grid-cols-2 gap-4">
				{/* Left JSON */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between text-sm">
							<span>Original JSON</span>
							<Badge variant="secondary">Left</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<JsonEditor
							value={leftJson}
							onChange={setLeftJson}
							placeholder="Paste original JSON here..."
							height="12rem"
							showLineNumbers={true}
						/>
					</CardContent>
				</Card>

				{/* Right JSON */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between text-sm">
							<span>Modified JSON</span>
							<Badge variant="secondary">Right</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<JsonEditor
							value={rightJson}
							onChange={setRightJson}
							placeholder="Paste modified JSON here..."
							height="12rem"
							showLineNumbers={true}
						/>
					</CardContent>
				</Card>
			</div>

			{/* Controls */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							<Button
								onClick={performComparison}
								disabled={!leftJson.trim() || !rightJson.trim() || isComparing}
								size="sm"
							>
								<GitCompare className="h-4 w-4 mr-2" />
								{isComparing ? "Comparing..." : "Compare"}
							</Button>
							
							<Button
								variant="outline"
								onClick={swapJsonInputs}
								disabled={!leftJson.trim() && !rightJson.trim()}
								size="sm"
							>
								<RotateCcw className="h-4 w-4" />
							</Button>

							<Button
								variant="outline"
								onClick={() => setShowUnchanged(!showUnchanged)}
								size="sm"
							>
								{showUnchanged ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								{showUnchanged ? "Hide" : "Show"} Unchanged
							</Button>
						</div>

						{differences.length > 0 && (
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => copyResults('json')}
								>
									{copySuccess ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
								</Button>
								<Button
									variant="outline" 
									size="sm"
									onClick={() => downloadResults('json')}
								>
									<Download className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			{comparisonError ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-red-600 text-sm">
							<p className="font-medium mb-2">Comparison Error:</p>
							<p>{comparisonError}</p>
						</div>
					</CardContent>
				</Card>
			) : differences.length > 0 ? (
				<>
					{/* Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Comparison Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">{summary.added}</div>
									<div className="text-muted-foreground">Added</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-red-600">{summary.removed}</div>
									<div className="text-muted-foreground">Removed</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">{summary.modified}</div>
									<div className="text-muted-foreground">Modified</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-600">{summary.unchanged}</div>
									<div className="text-muted-foreground">Unchanged</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">{similarityScore}%</div>
									<div className="text-muted-foreground">Similar</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Diff View */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm">
									Differences ({filteredDifferences.length} of {differences.length})
								</CardTitle>
								<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
									<TabsList className="h-8">
										<TabsTrigger value="split" className="text-xs">Split</TabsTrigger>
										<TabsTrigger value="unified" className="text-xs">Unified</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						</CardHeader>
						<CardContent>
							{viewMode === "split" ? (
								<div className="space-y-2 max-h-96 overflow-y-auto">
									{filteredDifferences.map((diff, index) => (
										<div key={index} className={`border rounded p-3 ${getDiffColor(diff.type)}`}>
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 mt-1">
													{getDiffIcon(diff.type)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-mono text-xs text-muted-foreground mb-1">
														{diff.path}
													</div>
													{diff.type === 'added' && (
														<div className="text-sm">
															<span className="text-green-700 font-medium">Added: </span>
															<code className="bg-white px-1 rounded">
																{JSON.stringify(diff.newValue)}
															</code>
														</div>
													)}
													{diff.type === 'removed' && (
														<div className="text-sm">
															<span className="text-red-700 font-medium">Removed: </span>
															<code className="bg-white px-1 rounded">
																{JSON.stringify(diff.oldValue)}
															</code>
														</div>
													)}
													{diff.type === 'modified' && (
														<div className="text-sm space-y-1">
															<div>
																<span className="text-red-700 font-medium">From: </span>
																<code className="bg-white px-1 rounded">
																	{JSON.stringify(diff.oldValue)}
																</code>
															</div>
															<div>
																<span className="text-green-700 font-medium">To: </span>
																<code className="bg-white px-1 rounded">
																	{JSON.stringify(diff.newValue)}
																</code>
															</div>
														</div>
													)}
													{diff.message && (
														<div className="text-xs text-muted-foreground mt-1">
															{diff.message}
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="bg-background border rounded">
									<pre className="p-4 text-sm overflow-auto max-h-96 whitespace-pre">
										<code>{generateUnifiedDiff(filteredDifferences)}</code>
									</pre>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Export Options */}
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Export Results</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								<Button variant="outline" size="sm" onClick={() => downloadResults('json')}>
									Export JSON
								</Button>
								<Button variant="outline" size="sm" onClick={() => downloadResults('unified')}>
									Export Unified Diff
								</Button>
								<Button variant="outline" size="sm" onClick={() => downloadResults('csv')}>
									Export CSV
								</Button>
								<Button variant="outline" size="sm" onClick={() => copyResults('unified')}>
									Copy Unified Diff
								</Button>
							</div>
						</CardContent>
					</Card>
				</>
			) : (
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							Enter JSON in both fields to compare
						</div>
					</CardContent>
				</Card>
			)}

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="text-sm text-muted-foreground space-y-2">
						<h4 className="font-medium text-foreground">JSON Comparison Guide</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h5 className="font-medium mb-2">Change Types:</h5>
								<ul className="space-y-1 text-xs">
									<li><span className="text-green-600 font-bold">+</span> Added - New properties or array items</li>
									<li><span className="text-red-600 font-bold">-</span> Removed - Deleted properties or array items</li>
									<li><span className="text-blue-600 font-bold">~</span> Modified - Changed values</li>
									<li><span className="text-gray-400 font-bold">=</span> Unchanged - Identical values</li>
								</ul>
							</div>
							<div>
								<h5 className="font-medium mb-2">Features:</h5>
								<ul className="space-y-1 text-xs">
									<li>• Deep object and array comparison</li>
									<li>• Multiple export formats (JSON, CSV, Unified Diff)</li>
									<li>• Similarity score calculation</li>
									<li>• Toggle unchanged items visibility</li>
									<li>• Path-based change tracking</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}