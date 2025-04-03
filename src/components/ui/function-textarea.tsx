import { useClipboard } from "@/hooks/use-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@shadui/button"
import { toast } from "@shadui/sonner"
import { Textarea } from "@shadui/textarea"

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
	const { state, copyToClipboard, pasteFromClipboard } = useClipboard()

	const handlePaste = async () => {
		const text = (await pasteFromClipboard()) ?? ""
		onChange?.(text)
		toast.info("Pasted.")
	}

	const handleCopy = async () => {
		copyToClipboard(value).then(() => console.info("Text copied!"))
		toast.success("Copied!")
	}

	return (
		<div className="relative">
			<Textarea
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn("h-40 w-full font-code text-sm", className)}
				readOnly={readOnly}
			/>
			<div className="absolute top-2 right-2 flex">
				{!readOnly && (
					<Button onClick={handlePaste} size="xs" className="mx-1 px-2.5 py-2 font-semibold ">
						Paste
					</Button>
				)}
				<Button onClick={handleCopy} size="xs" className="mx-1 px-2.5 py-2 font-semibold">
					Copy
				</Button>
			</div>
		</div>
	)
}

export default FunctionTextarea
