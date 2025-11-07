"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { JsonValidationResult, ValidationError } from "../types"

interface ValidationPanelProps {
	validationResult?: JsonValidationResult
	input: string
}

function ValidationStatus({ isValid, errorCount }: { isValid: boolean; errorCount: number }) {
	if (isValid) {
		return (
			<div className="flex items-center space-x-2 text-green-600">
				<CheckCircle className="h-5 w-5" />
				<span className="font-medium">Valid JSON</span>
			</div>
		)
	}

	return (
		<div className="flex items-center space-x-2 text-red-600">
			<XCircle className="h-5 w-5" />
			<span className="font-medium">
				Invalid JSON ({errorCount} error{errorCount !== 1 ? "s" : ""})
			</span>
		</div>
	)
}

function ErrorDisplay({ error }: { error: ValidationError }) {
	const getSeverityIcon = (severity: string) => {
		switch (severity) {
			case "error":
				return <XCircle className="h-4 w-4 text-red-500" />
			case "warning":
				return <AlertTriangle className="h-4 w-4 text-yellow-500" />
			default:
				return <AlertTriangle className="h-4 w-4 text-gray-500" />
		}
	}

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "error":
				return "border-red-200 bg-red-50"
			case "warning":
				return "border-yellow-200 bg-yellow-50"
			default:
				return "border-gray-200 bg-gray-50"
		}
	}

	return (
		<div className={cn("mb-2  border p-3", getSeverityColor(error.severity))}>
			<div className="flex items-start space-x-2">
				{getSeverityIcon(error.severity)}
				<div className="flex-1">
					<div className="mb-1 flex items-center space-x-2">
						<span className="font-medium text-sm">{error.severity.toUpperCase()}</span>
						{error.line > 0 && (
							<span className="text-gray-500 text-xs">
								Line {error.line}, Column {error.column}
							</span>
						)}
					</div>
					<p className="text-gray-700 text-sm">{error.message}</p>
				</div>
			</div>
		</div>
	)
}

function JsonWithErrorHighlighting({
	input,
	errors
}: { input: string; errors: ValidationError[] }) {
	if (errors.length === 0) {
		return (
			<pre className="overflow-x-auto  border border-green-200 bg-green-50 p-3 text-sm">
				<code className="text-green-800">{input}</code>
			</pre>
		)
	}

	// For now, just show the input without highlighting
	// In a real implementation, you might want to add syntax highlighting
	// and error markers at specific positions
	return (
		<pre className="overflow-x-auto  border border-red-200 bg-red-50 p-3 text-sm">
			<code className="text-red-800">{input}</code>
		</pre>
	)
}

export function ValidationPanel({ validationResult, input }: ValidationPanelProps) {
	if (!validationResult) {
		return (
			<div className=" border bg-gray-50 p-6">
				<div className="text-center text-gray-500">
					<div className="mb-2 text-2xl">🔍</div>
					<p className="font-medium">No validation result</p>
					<p className="text-sm">Process JSON to see validation results</p>
				</div>
			</div>
		)
	}

	const { isValid, errors } = validationResult

	return (
		<div className="space-y-4">
			<div className=" border bg-white p-4">
				<ValidationStatus isValid={isValid} errorCount={errors.length} />
			</div>

			{!isValid && errors.length > 0 && (
				<div className=" border bg-white p-4">
					<h3 className="mb-3 font-medium text-gray-900 text-sm">Errors Found:</h3>
					<div className="space-y-2">
						{errors.map((error, index) => (
							<ErrorDisplay key={index} error={error} />
						))}
					</div>
				</div>
			)}

			{input.trim() && (
				<div className=" border bg-white p-4">
					<h3 className="mb-3 font-medium text-gray-900 text-sm">JSON Input:</h3>
					<JsonWithErrorHighlighting input={input} errors={errors} />
				</div>
			)}
		</div>
	)
}
