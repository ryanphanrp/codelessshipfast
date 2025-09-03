"use client"

import type { JsonViewerMode } from "@/types"
import { ConversionHeader } from "../properties-converter/components/conversion-header"
import { JsonViewerTabs } from "./components/json-viewer-tabs"
import { MinifyPanel } from "./components/minify-panel"
import { PrettyPrintPanel } from "./components/pretty-print-panel"
import { TreeViewPanel } from "./components/tree-view-panel"
import { ValidationPanel } from "./components/validation-panel"
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

	return (
		<div className="container mx-auto space-y-6 p-6">
			<ConversionHeader
				title="JSON Viewer"
				description="Format, validate, and explore JSON data with multiple viewing modes"
			/>

			<JsonViewerTabs mode={mode} onModeChange={handleModeChange}>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Input Panel */}
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
									<button
										onClick={processJson}
										className="rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700 disabled:opacity-50"
										disabled={!input.trim() || isProcessing}>
										{isProcessing ? "Processing..." : "Process"}
									</button>
								</div>
							</div>
							<div className="p-4">
								<textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Paste your JSON here..."
									className="h-64 w-full resize-none rounded border p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={isProcessing}
								/>
							</div>
						</div>
					</div>

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
					</div>
				</div>
			</JsonViewerTabs>
		</div>
	)
}
