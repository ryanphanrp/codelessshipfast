"use client"

import { Button } from "@/components/ui/button"
import { useClipboard } from "@/hooks/use-clipboard"
import { Copy } from "lucide-react"
import { useState } from "react"

interface EnvVariableItemProps {
	envKey: string
	envValue: string
}

export function EnvVariableItem({ envKey, envValue }: EnvVariableItemProps) {
	const { copyToClipboard } = useClipboard()
	const [hoveredElement, setHoveredElement] = useState<'key' | 'value' | null>(null)

	const handleCopyKey = () => {
		copyToClipboard(envKey)
	}

	const handleCopyValue = () => {
		copyToClipboard(envValue)
	}

	const handleCopyFull = () => {
		copyToClipboard(`${envKey}=${envValue}`)
	}

	return (
		<div className="group flex items-center gap-2 rounded border p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
			<div className="flex-1 font-mono text-sm">
				<span 
					className="relative cursor-pointer rounded px-1 font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
					onMouseEnter={() => setHoveredElement('key')}
					onMouseLeave={() => setHoveredElement(null)}
					onClick={handleCopyKey}
					title="Click to copy key">
					{envKey}
					{hoveredElement === 'key' && (
						<Button
							variant="ghost"
							size="sm"
							className="-top-1 -right-1 absolute h-5 w-5 bg-blue-100 p-0 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
							onClick={(e) => {
								e.stopPropagation()
								handleCopyKey()
							}}>
							<Copy className="h-3 w-3" />
						</Button>
					)}
				</span>
				<span className="mx-2">=</span>
				<span 
					className="relative cursor-pointer rounded px-1 text-green-600 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30"
					onMouseEnter={() => setHoveredElement('value')}
					onMouseLeave={() => setHoveredElement(null)}
					onClick={handleCopyValue}
					title="Click to copy value">
					{envValue || '""'}
					{hoveredElement === 'value' && (
						<Button
							variant="ghost"
							size="sm"
							className="-top-1 -right-1 absolute h-5 w-5 bg-green-100 p-0 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
							onClick={(e) => {
								e.stopPropagation()
								handleCopyValue()
							}}>
							<Copy className="h-3 w-3" />
						</Button>
					)}
				</span>
			</div>
			<div className="opacity-0 transition-opacity group-hover:opacity-100">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleCopyFull}
					className="h-6 px-2"
					title="Copy full env variable">
					<Copy className="h-3 w-3" />
				</Button>
			</div>
		</div>
	)
}