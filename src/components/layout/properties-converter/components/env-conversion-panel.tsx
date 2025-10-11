import { useClipboard } from "@/hooks/use-clipboard"
import type { ClipboardState, ConversionMode, EnvVariable, ExampleItem } from "@/types"
import { useCallback, useMemo } from "react"
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

	const parseEnvVariables = useCallback((output: string, mode: ConversionMode): EnvVariable[] => {
		if (!output.trim()) return []

		if (mode === "yaml-to-k8s-env") {
			// Parse K8s YAML format: - name: KEY\n  value: 'value'
			const variables: EnvVariable[] = []
			const lines = output.split("\n")

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim()
				if (line.startsWith("- name:")) {
					const key = line.replace("- name:", "").trim()
					const nextLine = lines[i + 1]?.trim()
					let value = ""

					if (nextLine && nextLine.startsWith("value:")) {
						value = nextLine
							.replace("value:", "")
							.trim()
							.replace(/^['"]|['"]$/g, "")
					}

					variables.push({ key, value })
				}
			}

			return variables
		} else {
			// Parse regular ENV format: KEY=value
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
	}, [])

	const envVariables = useMemo(
		() => parseEnvVariables(output, mode),
		[output, mode, parseEnvVariables]
	)

	const inputTitle = useMemo(() => {
		switch (mode) {
			case "yaml-to-env":
				return "YAML/Properties Input"
			case "spring-to-env":
				return "Spring/@Value/Property Keys"
			case "yaml-to-k8s-env":
				return "YAML/Properties Input (K8s Mode)"
			default:
				return "Input"
		}
	}, [mode])

	const inputPlaceholder = useMemo(() => {
		switch (mode) {
			case "yaml-to-env":
				return "Paste your YAML or properties here..."
			case "spring-to-env":
				return "Paste @Value annotations or property keys (e.g., abc.efg.makeNow)..."
			case "yaml-to-k8s-env":
				return "YAML input converted to K8s environment format..."
			default:
				return "Paste your input here..."
		}
	}, [mode])

	const outputTitle = useMemo(() => {
		const count = envVariables.length
		switch (mode) {
			case "yaml-to-k8s-env":
				return `K8s Environment Variables (${count})`
			default:
				return `Environment Variables (${count})`
		}
	}, [mode, envVariables.length])

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
				title={outputTitle}
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
