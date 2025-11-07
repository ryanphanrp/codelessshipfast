"use client"

import { Button } from "@/components/hexta-ui"
import { Check, Copy, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface K8sModalProps {
	isOpen: boolean
	onClose: () => void
	output: string
	error: string | null
	isConverting: boolean
}

export function K8sModal({ isOpen, onClose, output, error, isConverting }: K8sModalProps) {
	const [copied, setCopied] = useState(false)
	const [editableOutput, setEditableOutput] = useState(output)
	const modalRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Handle ESC key to close modal
	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onClose()
			}
		}

		document.addEventListener("keydown", handleEscapeKey)
		return () => {
			document.removeEventListener("keydown", handleEscapeKey)
		}
	}, [isOpen, onClose])

	// Handle click outside modal to close
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
				onClose()
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen, onClose])

	// Handle copy functionality with input validation
	const handleCopy = useCallback(async () => {
		try {
			// Validate content before copying
			const textToCopy = editableOutput || output
			if (!textToCopy.trim()) {
				console.warn("No content to copy")
				return
			}

			// Additional validation for clipboard content
			const sanitizedText = textToCopy
				.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
				.trim()

			await navigator.clipboard.writeText(sanitizedText)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy text: ", err)
			// Fallback to traditional method if clipboard API fails
			try {
				const textArea = document.createElement("textarea")
				textArea.value = editableOutput || output
				document.body.appendChild(textArea)
				textArea.select()
				document.execCommand("copy")
				document.body.removeChild(textArea)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} catch (fallbackErr) {
				console.error("Fallback copy also failed: ", fallbackErr)
			}
		}
	}, [editableOutput, output])

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = "unset"
		}

		return () => {
			document.body.style.overflow = "unset"
		}
	}, [isOpen])

	// Sync editable output with output prop and manage focus
	useEffect(() => {
		setEditableOutput(output)
	}, [output])

	// Handle focus management
	useEffect(() => {
		if (isOpen && textareaRef.current && !isConverting && !error) {
			// Focus textarea when modal opens
			const timeoutId = setTimeout(() => {
				textareaRef.current?.focus()
			}, 100)

			return () => clearTimeout(timeoutId)
		}
	}, [isOpen, isConverting, error])

	// Handle textarea change with input sanitization
	const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		// Basic input sanitization - remove any potentially dangerous content
		const sanitizedValue = e.target.value
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
			.replace(/javascript:/gi, "") // Remove javascript: URLs
			.replace(/on\w+\s*=/gi, "") // Remove event handlers
		setEditableOutput(sanitizedValue)
	}, [])

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop overlay */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
				aria-hidden="true"
			/>

			{/* Modal */}
			<div
				ref={modalRef}
				className="relative z-10 mx-4 max-h-[80vh] w-full max-w-3xl  transform rounded-xl border border-gray-200 bg-white opacity-100  transition-all duration-300 dark:border-gray-700 dark:bg-gray-900"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				aria-describedby="modal-description">
				{/* Modal header */}
				<div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-700">
					<div>
						<h2 id="modal-title" className="font-semibold text-gray-900 text-xl dark:text-white">
							Kubernetes Environment Variables
						</h2>
						<p id="modal-description" className="mt-1 text-gray-600 text-sm dark:text-gray-400">
							Formatted for K8s deployment configuration
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="h-8 w-8 p-0 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label="Close modal">
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Modal content */}
				<div className="p-6">
					{isConverting ? (
						<div className="flex items-center justify-center py-12">
							<div className="flex items-center space-x-3">
								<div className="h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2"></div>
								<span className="text-gray-600 dark:text-gray-400">
									Converting to K8s format...
								</span>
							</div>
						</div>
					) : error ? (
						<div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="font-medium text-red-800 text-sm dark:text-red-200">
										Conversion Error
									</h3>
									<p className="mt-2 text-red-700 text-sm dark:text-red-300">{error}</p>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<label
									htmlFor="k8s-output"
									className="block font-medium text-gray-700 text-sm dark:text-gray-300">
									YAML Configuration
								</label>
								<Button
									onClick={handleCopy}
									disabled={!output.trim()}
									className="flex items-center space-x-2 bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
									{copied ? (
										<>
											<Check className="h-4 w-4" />
											<span>Copied!</span>
										</>
									) : (
										<>
											<Copy className="h-4 w-4" />
											<span>Copy</span>
										</>
									)}
								</Button>
							</div>

							<textarea
								ref={textareaRef}
								id="k8s-output"
								value={editableOutput}
								onChange={handleTextareaChange}
								className="h-64 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
								placeholder="K8s environment variables will appear here..."
								spellCheck={false}
								aria-label="K8s YAML configuration editor"
							/>

							<div className="text-gray-500 text-xs dark:text-gray-400">
								💡 Tip: You can edit the YAML directly in the textarea above. The format follows
								Kubernetes standard for environment variables in deployment configurations.
							</div>
						</div>
					)}
				</div>

				{/* Modal footer */}
				<div className="flex justify-end border-gray-200 border-t p-6 dark:border-gray-700">
					<Button
						variant="outline"
						onClick={onClose}
						className="px-6 py-2 transition-colors duration-200">
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}
