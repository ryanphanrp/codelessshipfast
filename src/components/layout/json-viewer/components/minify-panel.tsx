"use client"

import { Button } from "@/components/hexta-ui"
import { cn } from "@/lib/utils"
import { Check, Copy, Minimize2 } from "lucide-react"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
interface MinifyPanelProps {
	input: string
	output: string
	error: string | null
	isProcessing: boolean
}

export function MinifyPanel({ input, output, error, isProcessing }: MinifyPanelProps) {
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

	const calculateCompressionRatio = () => {
		if (!input || !output) return null
		const originalSize = input.length
		const compressedSize = output.length
		const ratio = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
		return {
			original: originalSize,
			compressed: compressedSize,
			saved: originalSize - compressedSize,
			ratio: parseFloat(ratio)
		}
	}

	const stats = calculateCompressionRatio()

	if (error) {
		return (
			<div className=" border border-red-200 bg-red-50 p-4">
				<div className="mb-2 flex items-center space-x-2 text-red-700">
					<span className="font-medium">Error:</span>
					<span>{error}</span>
				</div>
			</div>
		)
	}

	if (!output && !isProcessing) {
		return (
			<div className=" border bg-gray-50 p-6">
				<div className="text-center text-gray-500">
					<div className="mb-2 text-lg">🔸</div>
					<p className="font-medium">No output yet</p>
					<p className="text-sm">Process valid JSON to see minified result</p>
				</div>
			</div>
		)
	}

	return (
		<div className=" border bg-white">
			<div className="flex items-center justify-between border-b bg-gray-50 p-3">
				<div className="flex items-center space-x-2">
					<Minimize2 className="h-4 w-4 text-gray-600" />
					<h3 className="font-medium text-gray-900 text-sm">Minified JSON</h3>
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

			{stats && stats.ratio > 0 && (
				<div className="border-b bg-green-50 px-4 py-2 text-green-700 text-xs">
					<div className="flex items-center justify-between">
						<span>
							Compression saved {stats.saved} characters ({stats.ratio}%)
						</span>
						<span>
							{stats.original} → {stats.compressed} chars
						</span>
					</div>
				</div>
			)}

			<div className="p-4">
				{isProcessing ? (
					<div className="flex items-center justify-center py-8">
						<div className="h-6 w-6 animate-spin  border-blue-600 border-b-2"></div>
						<span className="ml-2 text-gray-600 text-sm">Minifying...</span>
					</div>
				) : (
					<div className="overflow-x-auto  border bg-gray-50">
						<SyntaxHighlighter
							language="json"
							style={oneLight}
							showLineNumbers={false}
							wrapLongLines={true}
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
