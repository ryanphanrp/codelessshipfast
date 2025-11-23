"use client"

import { Button } from "@/components/hexta-ui"
import { Check, Copy } from "lucide-react"
import { useMemo, useState } from "react"
import { List } from "react-window"

interface PrettyPrintPanelProps {
	input: string
	output: string
	error: string | null
	isProcessing: boolean
}

export function PrettyPrintPanel({ input, output, error, isProcessing }: PrettyPrintPanelProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(output)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy:", err)
		}
	}

	// Split output into lines for virtualization
	const lines = useMemo(() => {
		if (!output) return []
		return output.split("\n")
	}, [output])

	// Use virtualization for large JSON (>1000 lines)
	const useVirtualization = lines.length > 1000

	if (error) {
		return (
			<div className="border border-red-200 bg-red-50 p-4">
				<div className="mb-2 flex items-center space-x-2 text-red-700">
					<span className="font-medium">Error:</span>
					<span>{error}</span>
				</div>
			</div>
		)
	}

	if (!output && !isProcessing) {
		return (
			<div className="border bg-gray-50 p-6">
				<div className="text-center text-gray-500">
					<div className="mb-2 text-2xl">📄</div>
					<p className="font-medium">No output yet</p>
					<p className="text-sm">Process valid JSON to see pretty printed result</p>
				</div>
			</div>
		)
	}

	return (
		<div className="border bg-white">
			<div className="flex items-center justify-between border-b bg-gray-50 p-3">
				<div className="flex items-center gap-2">
					<h3 className="font-medium text-gray-900 text-sm">Pretty Printed JSON</h3>
					{useVirtualization && (
						<span className="bg-blue-100 px-2 py-0.5 text-blue-700 text-xs">
							Optimized for {lines.length.toLocaleString()} lines
						</span>
					)}
				</div>
				{output && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleCopy}
						className="flex items-center space-x-1">
						{copied ? (
							<>
								<Check className="h-3 w-3" />
								<span>Copied!</span>
							</>
						) : (
							<>
								<Copy className="h-3 w-3" />
								<span>Copy</span>
							</>
						)}
					</Button>
				)}
			</div>

			<div className="p-4">
				{isProcessing ? (
					<div className="flex items-center justify-center py-8">
						<div className="h-6 w-6 animate-spin border-primary border-b-2"></div>
						<span className="ml-2 text-gray-600 text-sm">Processing...</span>
					</div>
				) : useVirtualization ? (
					// Virtualized list for large JSON
					<div className="max-h-[60vh] overflow-auto border bg-gray-50">
						<List
							defaultHeight={Math.min(600, window.innerHeight * 0.6)}
							rowCount={lines.length}
							rowHeight={20}
							className="font-mono text-sm"
							rowProps={{ lines }}
							rowComponent={({ index, lines: rowLines }) => (
								<div className="flex border-b border-gray-100 px-3 py-0.5 hover:bg-gray-100">
									<span className="mr-4 w-12 flex-shrink-0 text-right text-gray-400">{index + 1}</span>
									<span className="whitespace-pre text-gray-900">{rowLines[index]}</span>
								</div>
							)}
						/>
					</div>
				) : (
					// Regular display for smaller JSON
					<div className="max-h-[60vh] overflow-auto border bg-gray-50">
						<pre className="p-3 font-mono text-sm">
							{lines.map((line, index) => (
								<div key={index} className="flex hover:bg-gray-100">
									<span className="mr-4 w-12 flex-shrink-0 text-right text-gray-400">{index + 1}</span>
									<span className="whitespace-pre text-gray-900">{line}</span>
								</div>
							))}
						</pre>
					</div>
				)}
			</div>
		</div>
	)
}
