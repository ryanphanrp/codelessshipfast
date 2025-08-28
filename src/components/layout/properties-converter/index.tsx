"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClipboard } from "@/hooks/use-clipboard"
import { ArrowLeftRight, ArrowRight, ChevronDown, ClipboardPaste, Copy, FileText, Play, Trash2 } from "lucide-react"
import { EnvVariableItem } from "./env-variable-item"
import { PropertyLineItem } from "./property-line-item"
import { usePropertiesConverter } from "./hooks/use-properties-converter"
import type { ConversionMode } from "./types"
import { useState } from "react"

const EXAMPLE_YAML = `app:
  redis:
    host: localhost
    port: 6379
    value-key: redis-value
  database:
    connection-url: jdbc:mysql://localhost:3306/db
    username: admin
server:
  port: 8080`

const EXAMPLE_SPRING = `@Value("\${app.redis.host}")
private String redisHost;

@Value("\${app.redis.port:6379}")
private int redisPort;

@Value("\${database.connection-url}")
private String dbUrl;

@Value("\${server.port:8080}")
private int serverPort;`

const EXAMPLE_PLAIN_PROPS = `abc.efg.gh-oo.makeNow
app.redis.hostName=localhost
server.connection-timeout=5000
database.pool.maxSize
auth.jwt.secretKey=mySecret
service.retryAttempts=3
api.base-url=https://api.example.com`

export default function PropertiesConverter() {
	const { mode, input, output, error, isConverting, setInput, setMode, clearInput, clearOutput, manualConvert } =
		usePropertiesConverter()
	const { copyToClipboard, pasteFromClipboard, state: clipboardState } = useClipboard()

	const handleModeChange = (newMode: string) => {
		setMode(newMode as ConversionMode)
	}

	const handlePasteExample = (example: string) => {
		setInput(example)
	}

	const handleCopyInput = () => {
		if (input.trim()) {
			copyToClipboard(input)
		}
	}

	const handlePasteInput = async () => {
		const clipboardText = await pasteFromClipboard()
		if (clipboardText) {
			setInput(clipboardText)
		}
	}

	const parseEnvVariables = (output: string) => {
		if (!output.trim()) return []
		
		return output.split('\n').filter(line => line.trim()).map(line => {
			const [key, ...valueParts] = line.split('=')
			return {
				key: key.trim(),
				value: valueParts.join('=').trim()
			}
		})
	}

	const envVariables = parseEnvVariables(output)

	return (
		<div className="container mx-auto space-y-6 p-6">
			<div className="space-y-2 text-center">
				<h1 className="font-bold text-3xl">Properties to Environment Variables</h1>
				<p className="text-muted-foreground">
					Convert YAML/Properties or Spring @Value annotations to environment variables
				</p>
			</div>

		<Tabs value={mode.startsWith('yaml-to-') || mode.startsWith('properties-to-') ? 'yaml-properties' : mode} onValueChange={(value) => {
				if (value === 'yaml-properties') {
					handleModeChange('yaml-to-properties')
				} else {
					handleModeChange(value)
				}
			}} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="yaml-to-env">YAML/Properties → ENV</TabsTrigger>
					<TabsTrigger value="spring-to-env">Spring/@Value/Keys → ENV</TabsTrigger>
					<TabsTrigger value="yaml-properties">YAML ↔ Properties</TabsTrigger>
				</TabsList>

				{/* ENV Conversion Tab Content */}
				{(mode === 'yaml-to-env' || mode === 'spring-to-env') && (
					<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Input Panel */}
						<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									{mode === 'yaml-to-env' ? 'YAML/Properties Input' : 'Spring/@Value/Property Keys'}
								</CardTitle>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handlePasteInput}
										className="gap-2">
										<ClipboardPaste className="h-4 w-4" />
										Paste
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopyInput}
										disabled={!input.trim()}
										className="gap-2">
										<Copy className="h-4 w-4" />
										{clipboardState.success ? 'Copied!' : 'Copy'}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={clearInput}
										disabled={!input}
										className="gap-2">
										<Trash2 className="h-4 w-4" />
										Clear
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<Textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder={
									mode === 'yaml-to-env'
										? 'Paste your YAML or properties here...'
										: 'Paste @Value annotations or property keys (e.g., abc.efg.makeNow)...'
								}
								className="min-h-[300px] font-mono text-sm"
							/>
							<div className="flex justify-between gap-2">
								<TabsContent value={mode} className="mt-0">
									{mode === 'yaml-to-env' ? (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handlePasteExample(EXAMPLE_YAML)}
											className="gap-2">
											Load Example
										</Button>
									) : (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm" className="gap-2">
													Load Example
													<ChevronDown className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem onClick={() => handlePasteExample(EXAMPLE_SPRING)}>
													@Value Annotations
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handlePasteExample(EXAMPLE_PLAIN_PROPS)}>
													Plain Property Keys
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</TabsContent>
								<Button
									onClick={manualConvert}
									disabled={!input.trim() || isConverting}
									className="gap-2">
									<Play className="h-4 w-4" />
									Convert
									<ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Output Panel */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Environment Variables ({envVariables.length})
								</CardTitle>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => copyToClipboard(output)}
										disabled={!output}
										className="gap-2">
										<Copy className="h-4 w-4" />
										Copy All
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={clearOutput}
										disabled={!output}
										className="gap-2">
										<Trash2 className="h-4 w-4" />
										Clear
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{error ? (
								<div className="rounded border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
									<strong>Error:</strong> {error}
								</div>
							) : envVariables.length > 0 ? (
								<ScrollArea className="h-[350px] w-full">
									<div className="space-y-2">
										{envVariables.map((envVar, index) => (
											<EnvVariableItem
												key={index}
												envKey={envVar.key}
												envValue={envVar.value}
											/>
										))}
									</div>
								</ScrollArea>
							) : (
								<div className="flex h-[350px] items-center justify-center rounded border-2 border-gray-200 border-dashed">
									<div className="text-center text-muted-foreground">
										<FileText className="mx-auto mb-2 h-8 w-8" />
										<p>Environment variables will appear here</p>
										<p className="text-sm">Click Convert to generate output</p>
									</div>
								</div>
							)}
							{isConverting && (
								<p className="mt-2 text-muted-foreground text-sm">Converting...</p>
							)}
							</CardContent>
						</Card>
					</div>
				)}

				{/* YAML ↔ Properties Conversion Tab */}
				{(mode === 'yaml-to-properties' || mode === 'properties-to-yaml') && (
					<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Input Panel for YAML/Properties */}
						<Card>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										{mode === 'yaml-to-properties' ? 'YAML Input' : 'Properties Input'}
									</CardTitle>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handlePasteInput}
											className="gap-2">
											<ClipboardPaste className="h-4 w-4" />
											Paste
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleCopyInput}
											disabled={!input.trim()}
											className="gap-2">
											<Copy className="h-4 w-4" />
											Copy
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={clearInput}
											disabled={!input}
											className="gap-2">
											<Trash2 className="h-4 w-4" />
											Clear
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<Textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder={
										mode === 'yaml-to-properties'
											? 'Paste your YAML configuration here...'
											: 'Paste your properties configuration here...'
									}
									className="min-h-[300px] font-mono text-sm"
								/>
								<div className="flex justify-between gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePasteExample(
											mode === 'yaml-to-properties' ? EXAMPLE_YAML : EXAMPLE_PLAIN_PROPS
										)}
										className="gap-2">
										Load Example
									</Button>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												// Toggle between YAML to Properties and Properties to YAML
												const newMode = mode === 'yaml-to-properties' ? 'properties-to-yaml' : 'yaml-to-properties'
												setMode(newMode as ConversionMode)
												// Swap input and output
												const temp = input
												setInput(output)
												clearOutput()
											}}
											disabled={!output}
											className="gap-2">
											<ArrowLeftRight className="h-4 w-4" />
											Reverse
										</Button>
										<Button
											onClick={manualConvert}
											disabled={!input.trim() || isConverting}
											className="gap-2">
											<Play className="h-4 w-4" />
											Convert
											<ArrowRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Output Panel for Properties/YAML */}
						<Card>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										{mode === 'yaml-to-properties' ? 'Properties Output' : 'YAML Output'}
									</CardTitle>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(output)}
											disabled={!output}
											className="gap-2">
											<Copy className="h-4 w-4" />
											Copy All
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={clearOutput}
											disabled={!output}
											className="gap-2">
											<Trash2 className="h-4 w-4" />
											Clear
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{error ? (
									<div className="rounded border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
										<strong>Error:</strong> {error}
									</div>
								) : output ? (
									mode === 'yaml-to-properties' ? (
										// Properties output - use line-by-line display
										<ScrollArea className="h-[350px] w-full">
											<div className="space-y-1">
												{output.split('\n').filter(line => line.trim()).map((line, index) => (
													<PropertyLineItem
														key={index}
														line={line}
														lineNumber={index + 1}
													/>
												))}
											</div>
										</ScrollArea>
									) : (
										// YAML output - use textarea for proper formatting
										<Textarea
											value={output}
											readOnly
											className="min-h-[350px] bg-muted/50 font-mono text-sm"
										/>
									)
								) : (
									<div className="flex h-[350px] items-center justify-center rounded border-2 border-gray-200 border-dashed">
										<div className="text-center text-muted-foreground">
											<FileText className="mx-auto mb-2 h-8 w-8" />
											<p>{mode === 'yaml-to-properties' ? 'Properties' : 'YAML'} output will appear here</p>
											<p className="text-sm">Click Convert to generate output</p>
										</div>
									</div>
								)}
								{isConverting && (
									<p className="mt-2 text-muted-foreground text-sm">Converting...</p>
								)}
							</CardContent>
						</Card>
					</div>
				)}
			</Tabs>
		</div>
	)
}
