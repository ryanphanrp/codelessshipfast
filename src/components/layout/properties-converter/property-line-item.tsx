"use client"

import { Button } from "@/components/hexta-ui"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/hexta-ui"
import { useClipboard } from "@/hooks/use-clipboard"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface PropertyLineItemProps {
	line: string
	lineNumber: number
}

export function PropertyLineItem({ line, lineNumber }: PropertyLineItemProps) {
	const { copyToClipboard } = useClipboard()
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		copyToClipboard(line)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Parse the line to separate key and value
	const separatorIndex = line.indexOf("=")
	const hasValue = separatorIndex > -1
	const key = hasValue ? line.substring(0, separatorIndex).trim() : line.trim()
	const value = hasValue ? line.substring(separatorIndex + 1).trim() : ""

	// Don't render empty lines
	if (!line.trim()) return null

	return (
		<TooltipProvider>
			<div className="group flex items-center gap-2  border bg-card px-3 py-2 transition-colors hover:bg-accent/50">
				{/* Line Number */}
				<span className="min-w-[2rem] text-right font-mono text-muted-foreground text-xs">
					{lineNumber}
				</span>

				{/* Property Content */}
				<div className="flex-1 font-mono text-sm">
					{hasValue ? (
						<>
							<span className="font-semibold text-blue-600 dark:text-blue-400">{key}</span>
							<span className="mx-1 text-muted-foreground">=</span>
							<span className="text-green-600 dark:text-green-400">{value || '""'}</span>
						</>
					) : (
						<span className="text-foreground">{line}</span>
					)}
				</div>

				{/* Copy Button */}
				<div className="opacity-0 transition-opacity group-hover:opacity-100">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm" onClick={handleCopy} className="h-7 w-7 p-0">
								{copied ? (
									<Check className="h-3.5 w-3.5 text-green-600" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Copy line</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	)
}
