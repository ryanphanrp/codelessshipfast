import { type VariantProps, cva } from "class-variance-authority"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 transition-all duration-300 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-8",
	{
		variants: {
			variant: {
				default:
					"bg-background text-foreground border-border hover:shadow-md hover:border-primary/30",
				success:
					"border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
				error:
					"border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
				warning:
					"border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
				info: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
)

const iconMap = {
	default: Info,
	success: CheckCircle,
	error: XCircle,
	warning: AlertCircle,
	info: Info
}

export interface AlertProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {
	showIcon?: boolean
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant = "default", showIcon = true, children, ...props }, ref) => {
		const Icon = iconMap[variant || "default"]

		return (
			<div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
				{showIcon && <Icon className="h-5 w-5" />}
				{children}
			</div>
		)
	}
)
Alert.displayName = "Alert"

const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h5
			ref={ref}
			className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
			{...props}
		/>
	)
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
	)
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription, AlertTitle }
