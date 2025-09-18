"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, CheckCircle, AlertCircle } from "lucide-react"
import { generateJsonSchema, validateJsonSchema, prettifySchema } from "../utils/schema-generator"
import type { JsonSchema, SchemaGeneratorOptions } from "../types"

interface SchemaGeneratorPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function SchemaGeneratorPanel({ input, error, isProcessing }: SchemaGeneratorPanelProps) {
	const [schema, setSchema] = useState<JsonSchema | null>(null)
	const [schemaString, setSchemaString] = useState("")
	const [options, setOptions] = useState<SchemaGeneratorOptions>({
		required: false,
		additionalProperties: true,
		generateExamples: false,
		generateDescriptions: false
	})
	const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null)
	const [copySuccess, setCopySuccess] = useState(false)

	useEffect(() => {
		if (input.trim() && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const generatedSchema = generateJsonSchema(parsedJson, options)
				const validation = validateJsonSchema(generatedSchema)
				
				setSchema(generatedSchema)
				setSchemaString(prettifySchema(generatedSchema))
				setValidationResult(validation)
			} catch (err) {
				setSchema(null)
				setSchemaString("")
				setValidationResult({
					valid: false,
					errors: [err instanceof Error ? err.message : "Invalid JSON input"]
				})
			}
		}
	}, [input, options, error, isProcessing])

	const handleOptionChange = (key: keyof SchemaGeneratorOptions, value: boolean) => {
		setOptions(prev => ({
			...prev,
			[key]: value
		}))
	}

	const copyToClipboard = async () => {
		if (schemaString) {
			await navigator.clipboard.writeText(schemaString)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		}
	}

	const downloadSchema = () => {
		if (schemaString) {
			const blob = new Blob([schemaString], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'schema.json'
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}

	const getSchemaStats = () => {
		if (!schema) return null
		
		const countProperties = (obj: any): number => {
			let count = 0
			if (obj && typeof obj === 'object') {
				if (obj.properties) {
					count += Object.keys(obj.properties).length
					Object.values(obj.properties).forEach((prop: any) => {
						count += countProperties(prop)
					})
				}
				if (obj.items) {
					count += countProperties(obj.items)
				}
			}
			return count
		}

		return {
			totalProperties: countProperties(schema),
			hasRequired: !!schema.required && schema.required.length > 0,
			allowsAdditional: schema.additionalProperties !== false,
			schemaVersion: schema.$schema || "Not specified"
		}
	}

	const stats = getSchemaStats()

	return (
		<div className="space-y-4">
			{/* Options Panel */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						Schema Generation Options
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="required"
								checked={options.required}
								onCheckedChange={(checked) => handleOptionChange('required', !!checked)}
							/>
							<label htmlFor="required" className="text-sm font-medium">
								Mark fields as required
							</label>
						</div>
						
						<div className="flex items-center space-x-2">
							<Checkbox
								id="additionalProperties"
								checked={options.additionalProperties}
								onCheckedChange={(checked) => handleOptionChange('additionalProperties', !!checked)}
							/>
							<label htmlFor="additionalProperties" className="text-sm font-medium">
								Allow additional properties
							</label>
						</div>
						
						<div className="flex items-center space-x-2">
							<Checkbox
								id="generateExamples"
								checked={options.generateExamples}
								onCheckedChange={(checked) => handleOptionChange('generateExamples', !!checked)}
							/>
							<label htmlFor="generateExamples" className="text-sm font-medium">
								Include examples
							</label>
						</div>
						
						<div className="flex items-center space-x-2">
							<Checkbox
								id="generateDescriptions"
								checked={options.generateDescriptions}
								onCheckedChange={(checked) => handleOptionChange('generateDescriptions', !!checked)}
							/>
							<label htmlFor="generateDescriptions" className="text-sm font-medium">
								Generate descriptions
							</label>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Schema Output */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm">
							Generated JSON Schema
							{validationResult && (
								validationResult.valid ? (
									<Badge variant="default" className="bg-green-500">
										<CheckCircle className="h-3 w-3 mr-1" />
										Valid
									</Badge>
								) : (
									<Badge variant="destructive">
										<AlertCircle className="h-3 w-3 mr-1" />
										Invalid
									</Badge>
								)
							)}
						</CardTitle>
						
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={copyToClipboard}
								disabled={!schemaString}
								className="h-8"
							>
								{copySuccess ? (
									<CheckCircle className="h-3 w-3" />
								) : (
									<Copy className="h-3 w-3" />
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadSchema}
								disabled={!schemaString}
								className="h-8"
							>
								<Download className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</CardHeader>
				
				<CardContent>
					{error || isProcessing ? (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							{isProcessing ? "Generating schema..." : "Enter valid JSON to generate schema"}
						</div>
					) : validationResult && !validationResult.valid ? (
						<div className="space-y-2">
							<p className="text-sm text-red-600">Schema validation failed:</p>
							<ul className="list-disc list-inside text-sm text-red-600">
								{validationResult.errors.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						</div>
					) : schemaString ? (
						<div className="space-y-4">
							{/* Schema Statistics */}
							{stats && (
								<div className="bg-muted rounded-lg p-3">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<span className="font-medium">Properties:</span>
											<div className="text-muted-foreground">{stats.totalProperties}</div>
										</div>
										<div>
											<span className="font-medium">Required Fields:</span>
											<div className="text-muted-foreground">
												{stats.hasRequired ? "Yes" : "No"}
											</div>
										</div>
										<div>
											<span className="font-medium">Additional Props:</span>
											<div className="text-muted-foreground">
												{stats.allowsAdditional ? "Allowed" : "Forbidden"}
											</div>
										</div>
										<div>
											<span className="font-medium">Schema Version:</span>
											<div className="text-muted-foreground text-xs">
												{stats.schemaVersion.includes('2020-12') ? 'Draft 2020-12' : 'Other'}
											</div>
										</div>
									</div>
								</div>
							)}
							
							<Separator />
							
							{/* Schema Content */}
							<div className="bg-background border rounded-lg">
								<pre className="p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
									<code>{schemaString}</code>
								</pre>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							Enter valid JSON to generate schema
						</div>
					)}
				</CardContent>
			</Card>

			{/* Help Text */}
			<Card>
				<CardContent className="pt-6">
					<div className="text-sm text-muted-foreground space-y-2">
						<h4 className="font-medium text-foreground">About JSON Schema Generation</h4>
						<p>
							This tool generates JSON Schema Draft 2020-12 from your input JSON data. 
							The schema describes the structure, data types, and constraints of your JSON.
						</p>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li><strong>Required Fields:</strong> Marks all non-null fields as required in the schema</li>
							<li><strong>Additional Properties:</strong> Controls whether objects can have properties not defined in the schema</li>
							<li><strong>Examples:</strong> Includes example values from your data in the schema</li>
							<li><strong>Descriptions:</strong> Generates basic descriptions for properties</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}