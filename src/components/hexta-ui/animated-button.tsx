import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "gradient"
	size?: "sm" | "md" | "lg"
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
	({ className, variant = "default", size = "md", children, ...props }, ref) => {
		const baseStyles =
			"inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

		const variants = {
			default:
				"bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
			outline:
				"border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95",
			gradient:
				"bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:from-purple-600 hover:via-pink-600 hover:to-red-600"
		}

		const sizes = {
			sm: "h-9 px-4 text-sm",
			md: "h-11 px-8 text-base",
			lg: "h-14 px-12 text-lg"
		}

		return (
			<button
				ref={ref}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				{...props}>
				{children}
			</button>
		)
	}
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
