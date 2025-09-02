"use client"

import type { ConversionMode, ExampleItem } from "@/types"
import { ConversionHeader } from "./components/conversion-header"
import { ConversionTabs } from "./components/conversion-tabs"
import { EnvConversionPanel } from "./components/env-conversion-panel"
import { YamlPropertiesPanel } from "./components/yaml-properties-panel"
import { EXAMPLES } from "./constants/examples"
import { usePropertiesConverter } from "./hooks/use-properties-converter"

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

	const handleModeChange = (newMode: string) => {
		setMode(newMode as ConversionMode)
	}

	const getExamples = () => {
		if (mode === "yaml-to-env") return EXAMPLES.yaml
		if (mode === "spring-to-env") return EXAMPLES.spring
		return mode === "yaml-to-properties" ? EXAMPLES.yaml : EXAMPLES.properties
	}

	return (
		<div className="container mx-auto space-y-6 p-6">
			<ConversionHeader
				title="Properties to Environment Variables"
				description="Convert YAML/Properties or Spring @Value annotations to environment variables"
			/>

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
		</div>
	)
}
