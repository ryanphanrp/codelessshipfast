import { useClipboard } from "@/hooks/use-clipboard"
import type { ClipboardState, ConversionMode, ExampleItem } from "@/types"
import { ArrowLeftRight } from "lucide-react"
import { useCallback, useMemo } from "react"
import { InputPanel } from "./input-panel"
import { OutputPanel } from "./output-panel"

interface YamlPropertiesPanelProps {
	mode: ConversionMode
	input: string
	output: string
	error: string | null
	isConverting: boolean
	examples: readonly ExampleItem[]
	onInputChange: (value: string) => void
	onModeChange: (mode: ConversionMode) => void
	onClearInput: () => void
	onClearOutput: () => void
	onConvert: () => void
}

export function YamlPropertiesPanel({
	mode,
	input,
	output,
	error,
	isConverting,
	examples,
	onInputChange,
	onModeChange,
	onClearInput,
	onClearOutput,
	onConvert
}: YamlPropertiesPanelProps) {
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

	const handleReverse = () => {
		const newMode = mode === "yaml-to-properties" ? "properties-to-yaml" : "yaml-to-properties"
		onModeChange(newMode)
		// Swap input and output
		const temp = input
		onInputChange(output)
		onClearOutput()
	}

	const propertyLines = useMemo(() => {
		return output ? output.split("\n").filter((line) => line.trim()) : []
	}, [output])

	const inputTitle = useMemo(
		() => (mode === "yaml-to-properties" ? "YAML Input" : "Properties Input"),
		[mode]
	)

	const outputTitle = useMemo(
		() => (mode === "yaml-to-properties" ? "Properties Output" : "YAML Output"),
		[mode]
	)

	const inputPlaceholder = useMemo(
		() =>
			mode === "yaml-to-properties"
				? "Paste your YAML configuration here..."
				: "Paste your properties configuration here...",
		[mode]
	)

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
				showReverse={true}
				onReverse={handleReverse}
			/>

			<OutputPanel
				title={outputTitle}
				content={output}
				error={error}
				isConverting={isConverting}
				propertyLines={propertyLines}
				onCopy={handleCopyOutput}
				onClear={onClearOutput}
				displayMode={mode === "yaml-to-properties" ? "property-lines" : "textarea"}
			/>
		</div>
	)
}
