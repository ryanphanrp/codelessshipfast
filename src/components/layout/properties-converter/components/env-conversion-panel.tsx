import { useClipboard } from "@/hooks/use-clipboard"
import type { ClipboardState, ConversionMode, EnvVariable, ExampleItem } from "@/types"
import { useState } from "react"
import { InputPanel } from "./input-panel"
import { OutputPanel } from "./output-panel"

interface EnvConversionPanelProps {
	mode: ConversionMode
	input: string
	output: string
	error: string | null
	isConverting: boolean
	examples: readonly ExampleItem[]
	onInputChange: (value: string) => void
	onClearInput: () => void
	onClearOutput: () => void
	onConvert: () => void
}

export function EnvConversionPanel({
	mode,
	input,
	output,
	error,
	isConverting,
	examples,
	onInputChange,
	onClearInput,
	onClearOutput,
	onConvert
}: EnvConversionPanelProps) {
	const { copyToClipboard, pasteFromClipboard, state: clipboardState } = useClipboard()

	const handlePasteInput = async () => {
		const clipboardText = await pasteFromClipboard()
		if (clipboardText) {
			onInputChange(clipboardText)
		}
	}

	const handleCopyInput = () => {
		if (input.trim()) {
			copyToClipboard(input)
		}
	}

	const handleCopyOutput = () => {
		copyToClipboard(output)
	}

	const parseEnvVariables = (output: string) => {
		if (!output.trim()) return []

		return output
			.split("\n")
			.filter((line) => line.trim())
			.map((line) => {
				const [key, ...valueParts] = line.split("=")
				return {
					key: key.trim(),
					value: valueParts.join("=").trim()
				}
			})
	}

	const envVariables = parseEnvVariables(output)

	const inputTitle =
		mode === "yaml-to-env" ? "YAML/Properties Input" : "Spring/@Value/Property Keys"
	const inputPlaceholder =
		mode === "yaml-to-env"
			? "Paste your YAML or properties here..."
			: "Paste @Value annotations or property keys (e.g., abc.efg.makeNow)..."

	return (
		<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<InputPanel
				title={inputTitle}
				value={input}
				placeholder={inputPlaceholder}
				examples={examples}
				hasInput={input.trim().length > 0}
				clipboardState={clipboardState}
				isConverting={isConverting}
				onChange={onInputChange}
				onPaste={handlePasteInput}
				onCopy={handleCopyInput}
				onClear={onClearInput}
				onLoadExample={(content) => onInputChange(content)}
				onConvert={onConvert}
			/>

			<OutputPanel
				title={`Environment Variables (${envVariables.length})`}
				content={output}
				error={error}
				isConverting={isConverting}
				envVariables={envVariables}
				onCopy={handleCopyOutput}
				onClear={onClearOutput}
				displayMode="env-variables"
			/>
		</div>
	)
}
