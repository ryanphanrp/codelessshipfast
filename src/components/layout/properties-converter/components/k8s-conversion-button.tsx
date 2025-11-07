import { Button } from "@/components/hexta-ui"
import { Cloud, Loader2 } from "lucide-react"

interface K8sConversionButtonProps {
	input: string
	isConverting: boolean
	onConvert: () => void
	disabled?: boolean
}

export function K8sConversionButton({
	input,
	isConverting,
	onConvert,
	disabled = false
}: K8sConversionButtonProps) {
	const handleClick = () => {
		// Set the conversion mode to K8s and trigger conversion
		onConvert()
	}

	return (
		<div className="mt-4 w-full">
			<Button
				onClick={handleClick}
				disabled={disabled || !input.trim() || isConverting}
				className="h-10 w-full bg-primary font-medium text-white transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label={
					isConverting
						? "Converting to Kubernetes environment format"
						: "Convert to Kubernetes/Rancher environment format"
				}
				aria-describedby={disabled && !input.trim() ? "input-required-hint" : undefined}>
				{isConverting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
						Converting to K8s/Rancher Environment...
					</>
				) : (
					<>
						<Cloud className="mr-2 h-4 w-4" aria-hidden="true" />
						Convert to K8s/Rancher Environment
					</>
				)}
			</Button>
			{disabled && !input.trim() && (
				<p id="input-required-hint" className="sr-only">
					Input is required to enable conversion
				</p>
			)}
		</div>
	)
}
