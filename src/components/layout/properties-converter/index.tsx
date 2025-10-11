"use client"

import type { ConversionMode, ExampleItem } from "@/types"
import { useState } from "react"
import { ConversionHeader } from "./components/conversion-header"
import { ConversionTabs } from "./components/conversion-tabs"
import { EnvConversionPanel } from "./components/env-conversion-panel"
import { ErrorBoundary } from "./components/error-boundary"
import { K8sConversionButton } from "./components/k8s-conversion-button"
import { K8sModal } from "./components/k8s-modal"
import { YamlPropertiesPanel } from "./components/yaml-properties-panel"
import { EXAMPLES } from "./constants/examples"
import { usePropertiesConverter } from "./hooks/use-properties-converter"
import { convertProperties } from "./utils/properties-convert"

export default function PropertiesConverter() {
	const {
		mode,
		input,
		output,
		error,
		isConverting,
		setInput,
		setMode,
		clearInput,
		clearOutput,
		manualConvert
	} = usePropertiesConverter()

	// Separate state for K8s conversion
	const [k8sOutput, setK8sOutput] = useState("")
	const [k8sError, setK8sError] = useState<string | null>(null)
	const [isK8sConverting, setIsK8sConverting] = useState(false)
	const [isK8sModalOpen, setIsK8sModalOpen] = useState(false)

	const handleModeChange = (newMode: string) => {
		setMode(newMode as ConversionMode)
		// Reset K8s state when switching modes
		setK8sOutput("")
		setK8sError(null)
		setIsK8sModalOpen(false)
	}

	const handleK8sConversion = async () => {
		if (!input.trim()) return

		setIsK8sConverting(true)
		setK8sError(null)
		setK8sOutput("")
		setIsK8sModalOpen(true)

		try {
			const result = convertProperties(input, "yaml-to-k8s-env")
			setK8sOutput(result)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "K8s conversion failed"
			setK8sError(errorMessage)
			console.error("K8s conversion error:", error)
		} finally {
			setIsK8sConverting(false)
		}
	}

	const handleK8sModalClose = () => {
		setIsK8sModalOpen(false)
	}

	const getExamples = () => {
		if (mode === "yaml-to-env") return EXAMPLES.yaml
		if (mode === "spring-to-env") return EXAMPLES.spring
		return mode === "yaml-to-properties" ? EXAMPLES.yaml : EXAMPLES.properties
	}

	const showK8sButton = (mode === "yaml-to-env" || mode === "spring-to-env") && input.trim()

	return (
		<ErrorBoundary>
			<div className="container mx-auto space-y-6 p-6">
				<ConversionHeader
					title="Properties to Environment Variables"
					description="Convert YAML/Properties or Spring @Value annotations to environment variables"
				/>

				<ErrorBoundary>
					<ConversionTabs mode={mode} onModeChange={handleModeChange}>
						{(mode === "yaml-to-env" || mode === "spring-to-env") && (
							<EnvConversionPanel
								mode={mode}
								input={input}
								output={output}
								error={error}
								isConverting={isConverting}
								examples={getExamples()}
								onInputChange={setInput}
								onClearInput={clearInput}
								onClearOutput={clearOutput}
								onConvert={manualConvert}
							/>
						)}

						{(mode === "yaml-to-properties" || mode === "properties-to-yaml") && (
							<YamlPropertiesPanel
								mode={mode}
								input={input}
								output={output}
								error={error}
								isConverting={isConverting}
								examples={getExamples()}
								onInputChange={setInput}
								onModeChange={setMode}
								onClearInput={clearInput}
								onClearOutput={clearOutput}
								onConvert={manualConvert}
							/>
						)}
					</ConversionTabs>
				</ErrorBoundary>

				{showK8sButton && (
					<ErrorBoundary>
						<K8sConversionButton
							input={input}
							isConverting={isK8sConverting}
							onConvert={handleK8sConversion}
						/>
					</ErrorBoundary>
				)}

				{/* K8s Modal */}
				<ErrorBoundary>
					<K8sModal
						isOpen={isK8sModalOpen}
						onClose={handleK8sModalClose}
						output={k8sOutput}
						error={k8sError}
						isConverting={isK8sConverting}
					/>
				</ErrorBoundary>
			</div>
		</ErrorBoundary>
	)
}
