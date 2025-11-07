import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertCircle, Loader2, Info } from "lucide-react"

type StatusType = "idle" | "processing" | "success" | "error" | "warning" | "info"

interface StatusIndicatorProps {
	status: StatusType
	message?: string
	size?: "sm" | "md" | "lg"
	showIcon?: boolean
	inline?: boolean
	className?: string
}

const statusConfig = {
	idle: {
		icon: null,
		color: "text-muted-foreground",
		bg: "bg-muted/50",
		border: "border-border",
		dot: "bg-gray-400"
	},
	processing: {
		icon: Loader2,
		color: "text-primary",
		bg: "bg-primary/10",
		border: "border-primary/20",
		dot: "bg-primary animate-pulse"
	},
	success: {
		icon: CheckCircle2,
		color: "text-green-600 dark:text-green-400",
		bg: "bg-green-500/10",
		border: "border-green-500/20",
		dot: "bg-green-500"
	},
	error: {
		icon: XCircle,
		color: "text-red-600 dark:text-red-400",
		bg: "bg-red-500/10",
		border: "border-red-500/20",
		dot: "bg-red-500"
	},
	warning: {
		icon: AlertCircle,
		color: "text-yellow-600 dark:text-yellow-400",
		bg: "bg-yellow-500/10",
		border: "border-yellow-500/20",
		dot: "bg-yellow-500"
	},
	info: {
		icon: Info,
		color: "text-primary",
		bg: "bg-primary/10",
		border: "border-primary/20",
		dot: "bg-primary"
	}
}

const sizeConfig = {
	sm: {
		container: "px-2 py-1 text-xs gap-1.5",
		icon: "size-3",
		dot: "size-1.5"
	},
	md: {
		container: "px-3 py-2 text-sm gap-2",
		icon: "size-4",
		dot: "size-2"
	},
	lg: {
		container: "px-4 py-3 text-base gap-2.5",
		icon: "size-5",
		dot: "size-2.5"
	}
}

export function StatusIndicator({
	status,
	message,
	size = "md",
	showIcon = true,
	inline = false,
	className
}: StatusIndicatorProps) {
	const config = statusConfig[status]
	const sizes = sizeConfig[size]
	const Icon = config.icon

	if (inline) {
		return (
			<span className={cn("inline-flex items-center gap-1.5", className)}>
				<span className={cn("", sizes.dot, config.dot)} />
				{message && <span className={cn("font-medium", config.color)}>{message}</span>}
			</span>
		)
	}

	return (
		<div
			className={cn(
				"flex items-center  border font-mono",
				config.bg,
				config.border,
				config.color,
				sizes.container,
				className
			)}>
			{showIcon && Icon && (
				<Icon
					className={cn(sizes.icon, status === "processing" && "animate-spin")}
				/>
			)}
			{message && <span className="font-medium">{message}</span>}
		</div>
	)
}

// Dot-only version for compact displays
export function StatusDot({
	status,
	size = "md",
	className
}: Pick<StatusIndicatorProps, "status" | "size" | "className">) {
	const config = statusConfig[status]
	const sizes = sizeConfig[size]

	return (
		<span
			className={cn(
				"inline-block ",
				sizes.dot,
				config.dot,
				className
			)}
			aria-label={status}
		/>
	)
}
