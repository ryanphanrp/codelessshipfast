"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/hexta-ui"
import { ConversionHeader } from "../properties-converter/components/conversion-header"
import { JsonEditor } from "./components/json-editor"
import { PrettyPrintPanel } from "./components/pretty-print-panel"
import { TreeViewPanel } from "./components/tree-view-panel"
import { getExamples } from "./constants/examples"
import { useJsonViewer } from "./hooks/use-json-viewer"

export default function JsonViewer() {
	const {
		mode,
		input,
		output,
		error,
		isProcessing,
		treeData,
		setInput,
		setMode,
		clearInput,
		processJson,
		toggleNode
	} = useJsonViewer()

	const pasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText()
			setInput(text)
		} catch (err) {
			console.error("Failed to read clipboard:", err)
		}
	}

	const examples = getExamples(mode)

	return (
		<div className="container mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
			<ConversionHeader
				title="JSON Viewer"
				description="Format and explore JSON data with interactive viewing"
			/>

			<div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
				{/* Input Panel */}
				<div className="space-y-6">
					<div className="overflow-hidden border bg-card">
						<div className="flex flex-col gap-4 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-4">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 bg-primary/50" />
								<h3 className="font-semibold text-base text-foreground">JSON Input</h3>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								{examples.length > 0 && (
									<select
										className="border border-input bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
									className="inline-flex items-center justify-center border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									title="Paste from clipboard">
									📋 Paste
								</button>
								<button
									onClick={clearInput}
									className="inline-flex items-center justify-center border border-input bg-background px-3 py-1.5 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
									disabled={!input}>
									Clear
								</button>
								<button
									onClick={processJson}
									className="inline-flex items-center justify-center bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
									disabled={!input.trim() || isProcessing}>
									{isProcessing ? "Processing..." : "Process"}
								</button>
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

				{/* Output Panel */}
				<div className="space-y-6">
					<Tabs
						value={mode}
						onValueChange={(value) => setMode(value as "pretty-print" | "tree-view")}>
						<div className="border-b">
							<TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
								<TabsTrigger
									value="pretty-print"
									className="border-transparent border-b-2 bg-transparent transition-all hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-background">
									Pretty Print
								</TabsTrigger>
								<TabsTrigger
									value="tree-view"
									className="border-transparent border-b-2 bg-transparent transition-all hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:bg-background">
									Tree View
								</TabsTrigger>
							</TabsList>
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
					</Tabs>
				</div>
			</div>
		</div>
	)
}
