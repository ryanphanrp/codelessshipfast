import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { ClipboardCopy, ClipboardPaste } from "lucide-react"
import { Button } from "./button"
import { Textarea } from "./textarea"

interface FunctionTextareaProps {
	value: string
	onChange?: (value: string) => void
	placeholder?: string
	readOnly?: boolean
	className?: string
}

const FunctionTextarea = ({
	value,
	onChange,
	placeholder,
	readOnly,
	className
}: FunctionTextareaProps) => {
	const [copy, isCopied] = useCopyToClipboard()

	const handlePaste = async () => {
		const text = await navigator.clipboard.readText()
		onChange?.(text)
	}

	const handleCopy = async () => {
		copy(value).then(() => console.info("Text copied!"))
	}

	return (
		<div className="relative">
			<Textarea
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				className={`h-40 w-full ${className}`}
				readOnly={readOnly}
			/>
			<div className="absolute top-2 right-2 flex gap-2">
				{!readOnly && (
					<Button onClick={handlePaste} variant="outline" size="icon" className="h-8 w-8">
						<ClipboardPaste className="h-4 w-4" />
					</Button>
				)}
				<Button onClick={handleCopy} variant="outline" size="icon" className="h-8 w-8">
					<ClipboardCopy className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}

export default FunctionTextarea
