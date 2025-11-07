"use client"

import { Button } from "@/components/hexta-ui"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/hexta-ui"
import { useClipboard } from "@/hooks/use-clipboard"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface EnvVariableItemProps {
	envKey: string
	envValue: string
}

export function EnvVariableItem({ envKey, envValue }: EnvVariableItemProps) {
	const { copyToClipboard } = useClipboard()
	const [copiedItem, setCopiedItem] = useState<"key" | "value" | "full" | null>(null)

	const handleCopy = (type: "key" | "value" | "full") => {
		let textToCopy = ""
		switch (type) {
			case "key":
				// Sanitize key before copying
				textToCopy = envKey
					.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
					.trim()
				break
			case "value":
				// Sanitize value before copying
				textToCopy = envValue
					.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
					.trim()
				break
			case "full":
				// Sanitize both key and value for full line
				const sanitizedKey = envKey.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim()
				const sanitizedValue = envValue.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim()
				textToCopy = `${sanitizedKey}=${sanitizedValue}`
				break
		}

		copyToClipboard(textToCopy)
		setCopiedItem(type)
		setTimeout(() => setCopiedItem(null), 2000)
	}

	return (
		<TooltipProvider>
			<div className="group flex items-center gap-2  border bg-card p-3 transition-colors hover:bg-accent/50">
				{/* Key-Value Display */}
				<div className="flex-1 font-mono text-sm">
					<span className="font-semibold text-blue-600 dark:text-blue-400">{envKey}</span>
					<span className="mx-2 text-muted-foreground">=</span>
					<span className="text-green-600 dark:text-green-400">{envValue || '""'}</span>
				</div>

				{/* Copy Buttons Group */}
				<div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					{/* Copy Key Button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy("key")}
								className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30">
								{copiedItem === "key" ? (
									<Check className="h-3.5 w-3.5" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Copy key</p>
						</TooltipContent>
					</Tooltip>

					{/* Copy Value Button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy("value")}
								className="h-7 w-7 p-0 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30">
								{copiedItem === "value" ? (
									<Check className="h-3.5 w-3.5" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Copy value</p>
						</TooltipContent>
					</Tooltip>

					{/* Copy Full Line Button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy("full")}
								className="h-7 px-2 text-muted-foreground hover:bg-accent">
								{copiedItem === "full" ? (
									<Check className="h-3.5 w-3.5" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Copy full line</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	)
}
