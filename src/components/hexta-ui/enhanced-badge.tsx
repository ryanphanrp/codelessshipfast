import { type VariantProps, cva } from "class-variance-authority"
import { X } from "lucide-react"
import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-lg hover:scale-105",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:scale-105",
				success:
					"border-transparent bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-lg hover:shadow-destructive/30 hover:scale-105",
				warning:
					"border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105",
				info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105",
				outline:
					"border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:scale-105",
				gradient:
					"border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
			},
			size: {
				sm: "px-2 py-0.5 text-[10px]",
				md: "px-2.5 py-0.5 text-xs",
				lg: "px-3 py-1 text-sm"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "md"
		}
	}
)

export interface EnhancedBadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	dismissible?: boolean
	onDismiss?: () => void
	icon?: React.ReactNode
}

const EnhancedBadge = forwardRef<HTMLDivElement, EnhancedBadgeProps>(
	(
		{ className, variant, size, dismissible = false, onDismiss, icon, children, ...props },
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(badgeVariants({ variant, size }), dismissible && "pr-1", className)}
				{...props}>
				{icon && <span className="mr-1">{icon}</span>}
				<span>{children}</span>
				{dismissible && (
					<button
						type="button"
						onClick={onDismiss}
						className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
						<X className="h-3 w-3" />
						<span className="sr-only">Dismiss</span>
					</button>
				)}
			</div>
		)
	}
)
EnhancedBadge.displayName = "EnhancedBadge"

export { EnhancedBadge, badgeVariants }
