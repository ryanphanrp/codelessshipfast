"use client"

import { Button } from "@/components/hexta-ui"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"

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

	if (error) {
		return (
			<div className="rounded-lg border border-red-200 bg-red-50 p-4">
				<div className="mb-2 flex items-center space-x-2 text-red-700">
					<span className="font-medium">Error:</span>
					<span>{error}</span>
				</div>
			</div>
		)
	}

	if (!output && !isProcessing) {
		return (
			<div className="rounded-lg border bg-gray-50 p-6">
				<div className="text-center text-gray-500">
					<div className="mb-2 text-2xl">📄</div>
					<p className="font-medium">No output yet</p>
					<p className="text-sm">Process valid JSON to see pretty printed result</p>
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-lg border bg-white">
			<div className="flex items-center justify-between border-b bg-gray-50 p-3">
				<h3 className="font-medium text-gray-900 text-sm">Pretty Printed JSON</h3>
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
						<div className="h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2"></div>
						<span className="ml-2 text-gray-600 text-sm">Processing...</span>
					</div>
				) : (
					<div className="overflow-x-auto rounded border bg-gray-50">
						<SyntaxHighlighter
							language="json"
							style={oneLight}
							showLineNumbers={true}
							customStyle={{
								margin: 0,
								padding: "12px",
								fontSize: "14px",
								borderRadius: "6px",
								background: "#f9fafb"
							}}>
							{output}
						</SyntaxHighlighter>
					</div>
				)}
			</div>
		</div>
	)
}
