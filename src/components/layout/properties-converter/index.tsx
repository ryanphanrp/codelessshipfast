"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useClipboard } from "@/hooks/use-clipboard"
import { ArrowRight, ClipboardPaste, Copy, FileText, Play, Trash2 } from "lucide-react"
import { EnvVariableItem } from "./env-variable-item"
import { usePropertiesConverter } from "./hooks/use-properties-converter"
import type { ConversionMode } from "./types"

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

			<Tabs value={mode} onValueChange={handleModeChange} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="yaml-to-env">YAML/Properties → ENV</TabsTrigger>
					<TabsTrigger value="spring-to-env">Spring @Value → ENV</TabsTrigger>
				</TabsList>

				<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Input Panel */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									{mode === 'yaml-to-env' ? 'YAML/Properties Input' : 'Spring @Value Input'}
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
										: 'Paste your Java code with @Value annotations here...'
								}
								className="min-h-[300px] font-mono text-sm"
							/>
							<div className="flex justify-between gap-2">
								<TabsContent value={mode} className="mt-0">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePasteExample(mode === 'yaml-to-env' ? EXAMPLE_YAML : EXAMPLE_SPRING)
										}
										className="gap-2">
										Load Example
									</Button>
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
			</Tabs>
		</div>
	)
}