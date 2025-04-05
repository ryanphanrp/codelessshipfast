import { useClipboard } from "@/hooks/use-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@shadui/button"
import { toast } from "@shadui/sonner"
import { Textarea } from "@shadui/textarea"
import { ClipboardList, Copy } from "lucide-react"

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
		<div className="relative flex h-full flex-col">
			<Textarea
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					"min-h-[200px] w-full flex-1 resize-none rounded-md border font-code text-sm shadow-none",
					className
				)}
				readOnly={readOnly}
			/>
			<div className="absolute top-1 right-1 flex gap-1">
				{!readOnly && (
					<Button
						size="icon"
						className="bg-transparent text-primary shadow-none transition duration-300 ease-in-out hover:scale-110 hover:bg-transparent hover:text-cyan-700"
						onClick={handlePaste}
						title="Paste">
						<ClipboardList className="size-5" />
					</Button>
				)}
				<Button
					size="icon"
					className="bg-transparent text-primary shadow-none transition duration-300 ease-in-out hover:scale-110 hover:bg-transparent hover:text-cyan-700"
					onClick={handleCopy}
					title="Copy">
					<Copy className="size-5" />
				</Button>
			</div>
		</div>
	)
}

export default FunctionTextarea
