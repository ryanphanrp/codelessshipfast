"use client"

import { useEffect, useState } from "react"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/hexta-ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/hexta-ui"
import type { JsonViewerMode } from "@/types"
import { ConversionHeader } from "../properties-converter/components/conversion-header"
import { FlattenerPanel } from "./components/flattener-panel"
import { JsonDiffPanel } from "./components/json-diff-panel"
import { JsonEditor } from "./components/json-editor"
import { JsonPathPanel } from "./components/jsonpath-panel"
import { MinifyPanel } from "./components/minify-panel"
import { PrettyPrintPanel } from "./components/pretty-print-panel"
import { SchemaGeneratorPanel } from "./components/schema-generator-panel"
import { StatsPanel } from "./components/stats-panel"
import { TreeViewPanel } from "./components/tree-view-panel"
import { ValidationPanel } from "./components/validation-panel"
import { VisualizerPanel } from "./components/visualizer-panel"
import { getExamples } from "./constants/examples"
import { useJsonViewer } from "./hooks/use-json-viewer"
import { evaluateJsonPath } from "./utils/jsonpath-evaluator"

export default function JsonViewer() {
	const {
		mode,
		input,
		output,
		error,
		isProcessing,
		validationResult,
		treeData,
		setInput,
		setMode,
		clearInput,
		clearOutput,
		processJson,
		toggleNode
	} = useJsonViewer()

	// JSONPath state
	const [jsonPathExpression, setJsonPathExpression] = useState("$")
	const [jsonPathResults, setJsonPathResults] = useState<any[]>([])
	const [copySuccess, setCopySuccess] = useState(false)

	const handleModeChange = (newMode: string) => {
		setMode(newMode as JsonViewerMode)
	}

	const handleJsonPathExpressionChange = (expression: string) => {
		setJsonPathExpression(expression)
	}

	const copyResults = async () => {
		if (jsonPathResults.length > 0) {
			const formattedResults = jsonPathResults
				.map((result, index) => {
					const prettyJson = JSON.stringify(result, null, 2)
					return `Result ${index + 1}:\n${prettyJson}`
				})
				.join("\n\n")

			await navigator.clipboard.writeText(formattedResults)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const pasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText()
			setInput(text)
		} catch (err) {
			// Handle clipboard error silently or show a message
			console.error("Failed to read clipboard:", err)
		}
	}

	const examples = getExamples(mode)

	// Default tabs
	const defaultTabs = [
		{ value: "pretty-print", label: "Pretty Print" },
		{ value: "tree-view", label: "JSON Viewer" }
	]

	// Advanced options
	const advancedOptions = [
		{ value: "validate", label: "Validate" },
		{ value: "minify", label: "Minify" },
		{ value: "schema", label: "Schema Generator" },
		{ value: "jsonpath", label: "JSONPath" },
		{ value: "stats", label: "Statistics" },
		{ value: "diff", label: "JSON Diff" },
		{ value: "flatten", label: "Flatten" },
		{ value: "visualize", label: "Visualize" }
	]

	// Check if JSONPath mode - special handling with different tabs
	const isJsonPathMode = mode === "jsonpath"
	const isAdvancedMode = !defaultTabs.some((tab) => tab.value === mode) && !isJsonPathMode
	const activeTab = isJsonPathMode ? "jsonpath-pretty" : isAdvancedMode ? "advanced" : mode

	// Evaluate JSONPath when input or expression changes
	useEffect(() => {
		if (isJsonPathMode && input.trim() && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const results = evaluateJsonPath(parsedJson, jsonPathExpression)
				setJsonPathResults(results)
			} catch (err) {
				setJsonPathResults([])
			}
		}
	}, [input, jsonPathExpression, isJsonPathMode, error, isProcessing])

	// Modes that don't need the main Process button (self-contained)
	const selfContainedModes = ["diff", "visualize", "schema", "jsonpath", "stats", "flatten"]
	const needsProcessButton = !selfContainedModes.includes(mode)

	return (
		<div className="container mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
			<ConversionHeader
				title="JSON Viewer"
				description="Format, validate, and explore JSON data with multiple viewing modes"
			/>

			<div
				className={`grid gap-8 ${
					// Full width for self-contained panels
					mode === "diff" || mode === "visualize" ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"
				}`}>
				{/* Input Panel - hidden for fully self-contained panels */}
				{!(mode === "diff" || mode === "visualize") && (
					<div className="space-y-6">
						<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
							<div className="flex flex-col gap-4 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-4">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-blue-500" />
									<h3 className="font-semibold text-base text-foreground">JSON Input</h3>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									{examples.length > 0 && (
										<select
											className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
											onChange={(e) => {
												const example = examples.find((ex) => ex.label === e.target.value)
												if (example) {
													setInput(example.content)
												}
											}}
											defaultValue="">
											<option value="" disabled>
												Load example...
											</option>
											{examples.map((example, index) => (
												<option key={index} value={example.label}>
													{example.label}
												</option>
											))}
										</select>
									)}
									<button
										onClick={pasteFromClipboard}
										className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										title="Paste from clipboard">
										📋 Paste
									</button>
									<button
										onClick={clearInput}
										className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
										disabled={!input}>
										Clear
									</button>
									{needsProcessButton && (
										<button
											onClick={processJson}
											className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
											disabled={!input.trim() || isProcessing}>
											{isProcessing ? "Processing..." : "Process"}
										</button>
									)}
									{!needsProcessButton && (
										<div className="flex items-center gap-1 text-muted-foreground text-xs">
											<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
											<span>
												{mode === "schema" ||
												mode === "jsonpath" ||
												mode === "stats" ||
												mode === "flatten"
													? "Auto-process"
													: "Self-contained"}
											</span>
										</div>
									)}
									{mode === "validate" && (
										<div className="flex items-center gap-1 text-green-600 text-xs">
											<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
											<span>Real-time</span>
										</div>
									)}
								</div>
							</div>
							<div className="p-4">
								<div className="max-h-[60vh] overflow-auto">
									<JsonEditor
										value={input}
										onChange={setInput}
										placeholder="Paste your JSON here..."
										height="60vh"
										disabled={isProcessing}
										theme="light"
										showLineNumbers={true}
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Output Panel */}
				<div className="space-y-6">
					{!(mode === "diff" || mode === "visualize") && (
						<>
							{isJsonPathMode ? (
								// JSONPath mode with custom tabs
								<Tabs value={activeTab} defaultValue="jsonpath-pretty">
									<div className="flex items-center justify-between border-b">
										<TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
											<TabsTrigger
												value="jsonpath-pretty"
												className="rounded-none border-transparent border-b-2 bg-transparent transition-all hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
												Pretty Print
											</TabsTrigger>
											<TabsTrigger
												value="jsonpath-table"
												className="rounded-none border-transparent border-b-2 bg-transparent transition-all hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
												Table
											</TabsTrigger>
										</TabsList>

										{/* Advanced Options Dropdown */}
										<div className="p-2">
											<Select
												value={mode}
												onValueChange={(value) => setMode(value as JsonViewerMode)}>
												<SelectTrigger className="w-48">
													<SelectValue placeholder="More options..." />
												</SelectTrigger>
												<SelectContent>
													{advancedOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* JSONPath Expression Input */}
									<div className="border-b p-4">
										<div className="flex gap-2">
											<input
												type="text"
												value={jsonPathExpression}
												onChange={(e) => handleJsonPathExpressionChange(e.target.value)}
												placeholder="Enter JSONPath expression (e.g., $.store.book[*].title)"
												className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
											/>
											<button
												onClick={() => handleJsonPathExpressionChange("$")}
												className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 font-medium text-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
												Reset
											</button>
										</div>
									</div>

									<TabsContent value="jsonpath-pretty" className="mt-0">
										<div className="p-4">
											{jsonPathResults.length > 0 && (
												<div className="mb-4 flex items-center justify-between">
													<div className="text-muted-foreground text-sm">
														{jsonPathResults.length} result{jsonPathResults.length !== 1 ? "s" : ""}{" "}
														found
													</div>
													<button
														onClick={copyResults}
														className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
														title="Copy all results">
														{copySuccess ? "✅ Copied!" : "📋 Copy All"}
													</button>
												</div>
											)}
											{jsonPathResults.length > 0 ? (
												<div className="max-h-96 space-y-3 overflow-auto">
													{jsonPathResults.map((result, index) => (
														<div key={index} className="rounded-lg border bg-card p-3 shadow-sm">
															<div className="mb-2 flex items-center justify-between">
																<span className="font-medium text-muted-foreground text-xs">
																	Result {index + 1}
																</span>
																<button
																	onClick={async () => {
																		const prettyJson = JSON.stringify(result, null, 2)
																		await navigator.clipboard.writeText(prettyJson)
																	}}
																	className="text-muted-foreground text-xs transition-colors hover:text-foreground"
																	title="Copy this result">
																	📋
																</button>
															</div>
															<pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted/50 p-2 text-sm">
																<code>{JSON.stringify(result, null, 2)}</code>
															</pre>
														</div>
													))}
												</div>
											) : (
												<div className="flex h-32 items-center justify-center text-muted-foreground">
													{jsonPathExpression === "$"
														? "Enter a JSONPath expression to filter results"
														: "No matches found for this expression"}
												</div>
											)}
										</div>
									</TabsContent>

									<TabsContent value="jsonpath-table" className="mt-0">
										<div className="p-4">
											{jsonPathResults.length > 0 && (
												<div className="mb-4 flex items-center justify-between">
													<div className="text-muted-foreground text-sm">
														{jsonPathResults.length} result{jsonPathResults.length !== 1 ? "s" : ""}{" "}
														in table view
													</div>
													<button
														onClick={copyResults}
														className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
														title="Copy all results">
														{copySuccess ? "✅ Copied!" : "📋 Copy All"}
													</button>
												</div>
											)}
											{jsonPathResults.length > 0 ? (
												<div className="overflow-x-auto">
													<table className="w-full border-collapse rounded-lg border">
														<thead>
															<tr className="bg-muted">
																<th className="border border-border p-2 text-left font-medium text-sm">
																	#
																</th>
																<th className="border border-border p-2 text-left font-medium text-sm">
																	Path
																</th>
																<th className="border border-border p-2 text-left font-medium text-sm">
																	Value
																</th>
																<th className="border border-border p-2 text-left font-medium text-sm">
																	Type
																</th>
																<th className="border border-border p-2 text-left font-medium text-sm">
																	Actions
																</th>
															</tr>
														</thead>
														<tbody>
															{jsonPathResults.map((result, index) => (
																<tr key={index} className="hover:bg-muted/50">
																	<td className="border border-border p-2 text-muted-foreground text-sm">
																		{index + 1}
																	</td>
																	<td className="border border-border p-2 font-mono text-muted-foreground text-xs">
																		{result.path || `[${index}]`}
																	</td>
																	<td className="border border-border p-2">
																		{typeof result === "object" && result !== null ? (
																			<pre className="max-w-xs overflow-x-auto rounded bg-muted/30 p-1 text-xs">
																				{JSON.stringify(result, null, 2)}
																			</pre>
																		) : (
																			<span className="text-sm">{String(result)}</span>
																		)}
																	</td>
																	<td className="border border-border p-2">
																		<span className="rounded bg-muted px-2 py-1 font-medium text-xs">
																			{typeof result}
																		</span>
																	</td>
																	<td className="border border-border p-2">
																		<button
																			onClick={async () => {
																				const prettyJson = JSON.stringify(result, null, 2)
																				await navigator.clipboard.writeText(prettyJson)
																			}}
																			className="text-muted-foreground text-xs transition-colors hover:text-foreground"
																			title="Copy this result">
																			📋
																		</button>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											) : (
												<div className="flex h-32 items-center justify-center text-muted-foreground">
													{jsonPathExpression === "$"
														? "Enter a JSONPath expression to filter results"
														: "No matches found for this expression"}
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>
							) : (
								// Regular modes with default tabs
								<Tabs
									value={activeTab}
									onValueChange={(value) => {
										if (value !== "advanced") {
											setMode(value as JsonViewerMode)
										}
									}}>
									<div className="flex items-center justify-between border-b">
										<TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
											{defaultTabs.map((tab) => (
												<TabsTrigger
													key={tab.value}
													value={tab.value}
													className="rounded-none border-transparent border-b-2 bg-transparent transition-all hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
													{tab.label}
												</TabsTrigger>
											))}
										</TabsList>

										{/* Advanced Options Dropdown */}
										<div className="p-2">
											<Select
												value={isAdvancedMode ? mode : undefined}
												onValueChange={(value) => setMode(value as JsonViewerMode)}>
												<SelectTrigger className="w-48">
													<SelectValue placeholder="More options..." />
												</SelectTrigger>
												<SelectContent>
													{advancedOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<TabsContent value="pretty-print" className="mt-0">
										<PrettyPrintPanel
											input={input}
											output={output}
											error={error}
											isProcessing={isProcessing}
										/>
									</TabsContent>

									<TabsContent value="tree-view" className="mt-0">
										<TreeViewPanel treeData={treeData} onToggleNode={toggleNode} />
									</TabsContent>

									<TabsContent value="advanced" className="mt-0">
										{mode === "validate" && (
											<ValidationPanel validationResult={validationResult} input={input} />
										)}

										{mode === "minify" && (
											<MinifyPanel
												input={input}
												output={output}
												error={error}
												isProcessing={isProcessing}
											/>
										)}

										{mode === "schema" && (
											<SchemaGeneratorPanel
												input={input}
												error={error}
												isProcessing={isProcessing}
											/>
										)}

										{mode === "stats" && (
											<StatsPanel input={input} error={error} isProcessing={isProcessing} />
										)}

										{mode === "flatten" && (
											<FlattenerPanel input={input} error={error} isProcessing={isProcessing} />
										)}
									</TabsContent>
								</Tabs>
							)}
						</>
					)}

					{/* Self-contained panels (full width when needed) */}
					{(mode === "diff" || mode === "visualize") && (
						<>
							{mode === "diff" && (
								<JsonDiffPanel input={input} error={error} isProcessing={isProcessing} />
							)}

							{mode === "visualize" && (
								<VisualizerPanel input={input} error={error} isProcessing={isProcessing} />
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
