"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, BarChart3, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import { 
	analyzeJsonStats, 
	generateStatsReport, 
	formatBytes,
	getOptimizationSuggestions,
	getDataTypeChart,
	getPropertyFrequencyChart
} from "../utils/json-stats"
import type { JsonStats } from "../types"

interface StatsPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function StatsPanel({ input, error, isProcessing }: StatsPanelProps) {
	const [stats, setStats] = useState<JsonStats | null>(null)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [copySuccess, setCopySuccess] = useState(false)
	const [analysisError, setAnalysisError] = useState<string | null>(null)

	useEffect(() => {
		if (input.trim() && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const analyzedStats = analyzeJsonStats(parsedJson)
				const optimizationSuggestions = getOptimizationSuggestions(analyzedStats)
				
				setStats(analyzedStats)
				setSuggestions(optimizationSuggestions)
				setAnalysisError(null)
			} catch (err) {
				setAnalysisError(err instanceof Error ? err.message : "Analysis failed")
				setStats(null)
				setSuggestions([])
			}
		}
	}, [input, error, isProcessing])

	const copyReport = async () => {
		if (stats) {
			const report = generateStatsReport(stats)
			await navigator.clipboard.writeText(report)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const downloadReport = () => {
		if (stats) {
			const report = generateStatsReport(stats)
			const blob = new Blob([report], { type: 'text/plain' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'json-analysis-report.txt'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	const downloadStatsJson = () => {
		if (stats) {
			const jsonString = JSON.stringify(stats, null, 2)
			const blob = new Blob([jsonString], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'json-stats.json'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	if (error || isProcessing) {
		return (
			<div className="flex items-center justify-center h-96 text-muted-foreground">
				{isProcessing ? "Analyzing JSON structure..." : "Enter valid JSON to see statistics"}
			</div>
		)
	}

	if (analysisError) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-red-600 text-sm">
						<p className="font-medium mb-2">Analysis Error:</p>
						<p>{analysisError}</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-96 text-muted-foreground">
				Enter valid JSON to analyze its structure and performance characteristics
			</div>
		)
	}

	const dataTypeChart = getDataTypeChart(stats)
	const propertyChart = getPropertyFrequencyChart(stats, 10)
	
	const getComplexityColor = (score: number) => {
		if (score <= 30) return "text-green-600"
		if (score <= 60) return "text-yellow-600"
		return "text-red-600"
	}

	const getComplexityLabel = (score: number) => {
		if (score <= 30) return "Low"
		if (score <= 60) return "Medium"
		return "High"
	}

	return (
		<div className="space-y-4">
			{/* Overview Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{stats.totalNodes}</div>
							<p className="text-xs text-muted-foreground">Total Nodes</p>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">{stats.maxDepth}</div>
							<p className="text-xs text-muted-foreground">Max Depth</p>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">{formatBytes(stats.memoryEstimate)}</div>
							<p className="text-xs text-muted-foreground">Memory Est.</p>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<div className={`text-2xl font-bold ${getComplexityColor(stats.complexityScore)}`}>
								{stats.complexityScore}/100
							</div>
							<p className="text-xs text-muted-foreground">Complexity</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Statistics */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm">
							<BarChart3 className="h-4 w-4" />
							Structure Analysis
						</CardTitle>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={copyReport}>
								{copySuccess ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
							</Button>
							<Button variant="outline" size="sm" onClick={downloadReport}>
								<Download className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Structure Details */}
					<div>
						<h4 className="font-medium mb-3">Structure Overview</h4>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span>Total Properties:</span>
									<span className="font-medium">{stats.totalProperties}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Total Arrays:</span>
									<span className="font-medium">{stats.totalArrays}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Total Values:</span>
									<span className="font-medium">{stats.totalValues}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Average Array Length:</span>
									<span className="font-medium">{stats.averageArrayLength}</span>
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span>Parse Time:</span>
									<span className="font-medium">{stats.parseTime}ms</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Complexity Score:</span>
									<div className="flex items-center gap-2">
										<span className={`font-medium ${getComplexityColor(stats.complexityScore)}`}>
											{stats.complexityScore}/100
										</span>
										<Badge variant="outline" className="text-xs">
											{getComplexityLabel(stats.complexityScore)}
										</Badge>
									</div>
								</div>
								<div className="flex justify-between text-sm">
									<span>Memory Estimate:</span>
									<span className="font-medium">{formatBytes(stats.memoryEstimate)}</span>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Data Type Distribution */}
					<div>
						<h4 className="font-medium mb-3">Data Type Distribution</h4>
						<div className="space-y-3">
							{dataTypeChart.map((item, index) => (
								<div key={index} className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="capitalize">{item.name}:</span>
										<span className="font-medium">{item.value} ({item.percentage}%)</span>
									</div>
									<Progress value={item.percentage} className="h-2" />
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Property Frequency */}
					{propertyChart.length > 0 && (
						<>
							<div>
								<h4 className="font-medium mb-3">Most Common Properties</h4>
								<div className="space-y-2">
									{propertyChart.map((item, index) => (
										<div key={index} className="flex justify-between text-sm">
											<code className="bg-muted px-2 py-1 rounded text-xs">{item.name}</code>
											<span className="font-medium">{item.value} occurrences</span>
										</div>
									))}
								</div>
							</div>
							<Separator />
						</>
					)}

					{/* Performance Indicators */}
					<div>
						<h4 className="font-medium mb-3">Performance Indicators</h4>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="text-center p-3 border rounded">
								<div className="text-lg font-semibold">
									{stats.parseTime < 10 ? (
										<CheckCircle className="h-5 w-5 mx-auto text-green-600" />
									) : stats.parseTime < 100 ? (
										<AlertTriangle className="h-5 w-5 mx-auto text-yellow-600" />
									) : (
										<AlertTriangle className="h-5 w-5 mx-auto text-red-600" />
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">Parse Speed</p>
								<p className="text-xs font-medium">{stats.parseTime}ms</p>
							</div>
							
							<div className="text-center p-3 border rounded">
								<div className="text-lg font-semibold">
									{stats.maxDepth <= 5 ? (
										<CheckCircle className="h-5 w-5 mx-auto text-green-600" />
									) : stats.maxDepth <= 10 ? (
										<AlertTriangle className="h-5 w-5 mx-auto text-yellow-600" />
									) : (
										<AlertTriangle className="h-5 w-5 mx-auto text-red-600" />
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">Nesting Depth</p>
								<p className="text-xs font-medium">{stats.maxDepth} levels</p>
							</div>
							
							<div className="text-center p-3 border rounded">
								<div className="text-lg font-semibold">
									{stats.memoryEstimate < 1024 * 1024 ? (
										<CheckCircle className="h-5 w-5 mx-auto text-green-600" />
									) : stats.memoryEstimate < 10 * 1024 * 1024 ? (
										<AlertTriangle className="h-5 w-5 mx-auto text-yellow-600" />
									) : (
										<AlertTriangle className="h-5 w-5 mx-auto text-red-600" />
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-1">Memory Usage</p>
								<p className="text-xs font-medium">{formatBytes(stats.memoryEstimate)}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Optimization Suggestions */}
			{suggestions.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<TrendingUp className="h-4 w-4" />
							Optimization Suggestions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{suggestions.map((suggestion, index) => (
								<div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
									<div className="flex-shrink-0 mt-0.5">
										{suggestion.includes("well-optimized") ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<AlertTriangle className="h-4 w-4 text-yellow-600" />
										)}
									</div>
									<p className="text-sm">{suggestion}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Export Options */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">Export Analysis</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" size="sm" onClick={downloadReport}>
							Download Report (TXT)
						</Button>
						<Button variant="outline" size="sm" onClick={downloadStatsJson}>
							Download Data (JSON)
						</Button>
						<Button variant="outline" size="sm" onClick={copyReport}>
							Copy Report
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="text-sm text-muted-foreground space-y-2">
						<h4 className="font-medium text-foreground">Analysis Metrics</h4>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h5 className="font-medium mb-2">Structure Metrics:</h5>
								<ul className="space-y-1 text-xs">
									<li><strong>Total Nodes:</strong> Count of all JSON elements</li>
									<li><strong>Max Depth:</strong> Deepest nesting level</li>
									<li><strong>Properties:</strong> Total object properties</li>
									<li><strong>Arrays:</strong> Total array count and average size</li>
								</ul>
							</div>
							<div>
								<h5 className="font-medium mb-2">Performance Metrics:</h5>
								<ul className="space-y-1 text-xs">
									<li><strong>Parse Time:</strong> JSON parsing duration</li>
									<li><strong>Memory Est:</strong> Approximate memory usage</li>
									<li><strong>Complexity:</strong> Overall structural complexity (0-100)</li>
									<li><strong>Data Types:</strong> Distribution of value types</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}