"use client"

import { cn } from "@/lib/utils"
import { useClipboard } from "@/hooks/use-clipboard"
import React, { useCallback, useRef, useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, ClipboardPaste, Check } from "lucide-react"
import { Button } from "@/components/hexta-ui"

interface JsonEditorProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
	height?: string
	readOnly?: boolean
	theme?: "dark" | "light"
	showLineNumbers?: boolean
	wrapLongLines?: boolean
}

export function JsonEditor({
	value,
	onChange,
	placeholder = "Paste your JSON here...",
	disabled = false,
	className,
	height = "16rem", // 64 in Tailwind (h-64)
	readOnly = false,
	theme = "light",
	showLineNumbers = true,
	wrapLongLines = false
}: JsonEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [isFocused, setIsFocused] = useState(false)
	const { copyToClipboard, pasteFromClipboard, state } = useClipboard()
	const [showCopied, setShowCopied] = useState(false)

	// Auto-resize textarea to match content
	const adjustTextareaHeight = useCallback(() => {
		if (textareaRef.current) {
			const textarea = textareaRef.current
			textarea.style.height = "auto"
			textarea.style.height = `${Math.max(textarea.scrollHeight, 200)}px`
		}
	}, [])

	useEffect(() => {
		adjustTextareaHeight()
	}, [value, adjustTextareaHeight])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		onChange(newValue)
		adjustTextareaHeight()
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Handle Tab key for proper indentation
		if (e.key === "Tab") {
			e.preventDefault()
			const textarea = e.currentTarget
			const start = textarea.selectionStart
			const end = textarea.selectionEnd

			// Insert tab character
			const newValue = value.substring(0, start) + "  " + value.substring(end)
			onChange(newValue)

			// Move cursor
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 2
			}, 0)
		}

		// Handle auto-closing brackets
		if (e.key === "{" || e.key === "[") {
			e.preventDefault()
			const textarea = e.currentTarget
			const start = textarea.selectionStart
			const end = textarea.selectionEnd
			const closingChar = e.key === "{" ? "}" : "]"

			const newValue = value.substring(0, start) + e.key + closingChar + value.substring(end)

			onChange(newValue)

			// Position cursor between brackets
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 1
			}, 0)
		}

		// Handle auto-closing quotes
		if (e.key === '"') {
			e.preventDefault()
			const textarea = e.currentTarget
			const start = textarea.selectionStart
			const end = textarea.selectionEnd

			const newValue = value.substring(0, start) + '""' + value.substring(end)

			onChange(newValue)

			// Position cursor between quotes
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 1
			}, 0)
		}
	}

	// Format JSON when Ctrl/Cmd + F is pressed
	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "f") {
			e.preventDefault()
			try {
				const parsed = JSON.parse(value)
				const formatted = JSON.stringify(parsed, null, 2)
				onChange(formatted)
			} catch {
				// Invalid JSON, don't format
			}
		}
	}

	const isValidJson = useCallback(() => {
		if (!value.trim()) return true
		try {
			JSON.parse(value)
			return true
		} catch {
			return false
		}
	}, [value])

	const handleCopy = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const textToCopy = String(value || "")
		if (!textToCopy.trim()) return

		await copyToClipboard(textToCopy)

		if (state.success) {
			setShowCopied(true)
			setTimeout(() => setShowCopied(false), 2000)
		}
	}

	const handlePaste = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (readOnly || disabled) return

		const pastedText = await pasteFromClipboard()

		if (pastedText) {
			onChange(pastedText)
		}
	}

	const syntaxHighlighterStyle = theme === "dark" ? oneDark : oneLight

	return (
		<div className={cn("relative", className)}>
			<div className="relative">
				{/* Syntax Highlighter Background */}
				{value && !isFocused && (
					<div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ height }}>
						<SyntaxHighlighter
							language="json"
							style={syntaxHighlighterStyle}
							showLineNumbers={showLineNumbers}
							wrapLongLines={wrapLongLines}
							customStyle={{
								margin: 0,
								padding: "12px",
								fontSize: "14px",
								fontFamily:
									'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
								background: "transparent",
								minHeight: height,
								border: "none",
								borderRadius: "6px"
							}}
							codeTagProps={{
								style: {
									fontSize: "14px",
									fontFamily:
										'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
								}
							}}>
							{value}
						</SyntaxHighlighter>
					</div>
				)}

				{/* Textarea for editing */}
				<textarea
					ref={textareaRef}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onKeyPress={handleKeyPress}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={placeholder}
					disabled={disabled}
					readOnly={readOnly}
					spellCheck={false}
					className={cn(
						"w-full resize-none  border p-3 font-mono text-sm transition-colors",
						"focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
						"disabled:cursor-not-allowed disabled:opacity-50",
						// Make textarea transparent when not focused to show syntax highlighting
						isFocused ? "bg-white text-gray-900" : "bg-transparent text-transparent caret-gray-900",
						!isValidJson() && "border-red-300 focus:ring-red-500",
						className
					)}
					style={{
						minHeight: height,
						lineHeight: "1.5",
						fontFamily:
							'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
					}}
				/>
			</div>

			{/* Validation indicator */}
			{value.trim() && (
				<div className="-top-2 absolute right-2 z-10">
					<div
						className={cn("h-2 w-2 ", isValidJson() ? "bg-green-500" : "bg-red-500")}
						title={isValidJson() ? "Valid JSON" : "Invalid JSON"}
					/>
				</div>
			)}

			{/* Format hint */}
			<div className="absolute right-2 bottom-2 z-10">
				<div className=" bg-white/80 px-2 py-1 text-gray-400 text-xs">
					{(navigator.platform.includes("Mac") ? "Cmd" : "Ctrl") + "+F to format"}
				</div>
			</div>

			{/* Copy/Paste buttons */}
			{(value || (!readOnly && !disabled)) && (
				<div className="absolute top-2 right-2 z-20 flex gap-1">
					{!readOnly && !disabled && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-background/95 shadow-sm hover:bg-background"
							onClick={handlePaste}
							title="Paste from clipboard"
						>
							<ClipboardPaste className="h-3.5 w-3.5" />
						</Button>
					)}
					{value && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-background/95 shadow-sm hover:bg-background"
							onClick={handleCopy}
							title={showCopied ? "Copied!" : "Copy to clipboard"}
						>
							{showCopied ? (
								<Check className="h-3.5 w-3.5 text-green-600" />
							) : (
								<Copy className="h-3.5 w-3.5" />
							)}
						</Button>
					)}
				</div>
			)}
		</div>
	)
}
