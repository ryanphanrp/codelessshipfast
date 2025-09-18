"use client"

import type { JsonViewerMode } from "@/types"
import { ConversionHeader } from "../properties-converter/components/conversion-header"
import { JsonViewerTabs } from "./components/json-viewer-tabs"
import { MinifyPanel } from "./components/minify-panel"
import { PrettyPrintPanel } from "./components/pretty-print-panel"
import { TreeViewPanel } from "./components/tree-view-panel"
import { ValidationPanel } from "./components/validation-panel"
import { SchemaGeneratorPanel } from "./components/schema-generator-panel"
import { JsonPathPanel } from "./components/jsonpath-panel"
import { StatsPanel } from "./components/stats-panel"
import { JsonDiffPanel } from "./components/json-diff-panel"
import { FlattenerPanel } from "./components/flattener-panel"
import { VisualizerPanel } from "./components/visualizer-panel"
import { JsonEditor } from "./components/json-editor"
import { getExamples } from "./constants/examples"
import { useJsonViewer } from "./hooks/use-json-viewer"

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

	const handleModeChange = (newMode: string) => {
		setMode(newMode as JsonViewerMode)
	}

	const examples = getExamples(mode)

	// Modes that don't need the main Process button (self-contained)
	const selfContainedModes = ['diff', 'visualize', 'schema', 'jsonpath', 'stats', 'flatten']
	const needsProcessButton = !selfContainedModes.includes(mode)

	return (
		<div className="container mx-auto space-y-6 p-6">
			<ConversionHeader
				title="JSON Viewer"
				description="Format, validate, and explore JSON data with multiple viewing modes"
			/>

			<JsonViewerTabs mode={mode} onModeChange={handleModeChange}>
				<div className={`grid gap-6 ${
					// Full width for complex panels
					mode === 'diff' || mode === 'visualize' || mode === 'stats' 
						? 'grid-cols-1' 
						: 'grid-cols-1 lg:grid-cols-2'
				}`}>
					{/* Input Panel - hidden for fully self-contained panels */}
					{!(mode === 'diff' || mode === 'visualize') && (
					<div className="space-y-4">
						<div className="rounded-lg border bg-white">
							<div className="flex items-center justify-between border-b bg-gray-50 p-3">
								<h3 className="font-medium text-gray-900 text-sm">JSON Input</h3>
								<div className="flex items-center space-x-2">
									{examples.length > 0 && (
										<select
											className="rounded border bg-white px-2 py-1 text-xs"
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
										onClick={clearInput}
										className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
										disabled={!input}>
										Clear
									</button>
									{needsProcessButton && (
										<button
											onClick={processJson}
											className="rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700 disabled:opacity-50"
											disabled={!input.trim() || isProcessing}>
											{isProcessing ? "Processing..." : "Process"}
										</button>
									)}
									{!needsProcessButton && (
										<span className="text-xs text-gray-500">
											{mode === 'schema' || mode === 'jsonpath' || mode === 'stats' || mode === 'flatten' ? 'Processes automatically' : 'Self-contained panel'}
										</span>
									)}
									{mode === 'validate' && (
										<span className="text-xs text-green-600">
											Real-time validation
										</span>
									)}
								</div>
							</div>
							<div className="p-4">
								<JsonEditor
									value={input}
									onChange={setInput}
									placeholder="Paste your JSON here..."
									height="16rem"
									disabled={isProcessing}
									theme="light"
									showLineNumbers={true}
								/>
							</div>
						</div>
					</div>
					)}

					{/* Output Panel */}
					<div className="space-y-4">
						{mode === "pretty-print" && (
							<PrettyPrintPanel
								input={input}
								output={output}
								error={error}
								isProcessing={isProcessing}
							/>
						)}

						{mode === "minify" && (
							<MinifyPanel
								input={input}
								output={output}
								error={error}
								isProcessing={isProcessing}
							/>
						)}

						{mode === "tree-view" && (
							<TreeViewPanel treeData={treeData} onToggleNode={toggleNode} />
						)}

					{mode === "validate" && (
						<ValidationPanel validationResult={validationResult} input={input} />
					)}

					{mode === "schema" && (
						<SchemaGeneratorPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}

					{mode === "jsonpath" && (
						<JsonPathPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}

					{mode === "stats" && (
						<StatsPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}

					{mode === "diff" && (
						<JsonDiffPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}

					{mode === "flatten" && (
						<FlattenerPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}

					{mode === "visualize" && (
						<VisualizerPanel 
							input={input}
							error={error}
							isProcessing={isProcessing}
						/>
					)}
					</div>
				</div>
			</JsonViewerTabs>
		</div>
	)
}
