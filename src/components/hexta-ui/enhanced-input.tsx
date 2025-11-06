import { type InputHTMLAttributes, forwardRef, useState } from "react"
import { Eye, EyeOff, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EnhancedInputProps extends InputHTMLAttributes<HTMLInputElement> {
	variant?: "default" | "search" | "password"
	error?: string
	clearable?: boolean
	onClear?: () => void
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
	(
		{
			className,
			type = "text",
			variant = "default",
			error,
			clearable = false,
			onClear,
			value,
			...props
		},
		ref
	) => {
		const [showPassword, setShowPassword] = useState(false)
		const [isFocused, setIsFocused] = useState(false)

		const isPassword = variant === "password" || type === "password"
		const isSearch = variant === "search"
		const inputType = isPassword ? (showPassword ? "text" : "password") : type
		const hasValue = value !== undefined && value !== ""

		return (
			<div className="relative w-full">
				<div className="relative">
					{/* Search Icon */}
					{isSearch && (
						<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
							<Search className="h-4 w-4 text-muted-foreground" />
						</div>
					)}

					{/* Input Field */}
					<input
						type={inputType}
						className={cn(
							"flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all duration-200",
							"file:border-0 file:bg-transparent file:font-medium file:text-sm",
							"placeholder:text-muted-foreground",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"disabled:cursor-not-allowed disabled:opacity-50",
							"hover:border-primary/50",
							error && "border-red-500 focus-visible:ring-red-500",
							isFocused && "shadow-lg shadow-primary/10",
							isSearch && "pl-10",
							(clearable || isPassword) && "pr-10",
							className
						)}
						ref={ref}
						value={value}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						{...props}
					/>

					{/* Clear Button */}
					{clearable && hasValue && !isPassword && (
						<button
							type="button"
							onClick={onClear}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm opacity-70 transition-all hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring">
							<X className="h-4 w-4" />
							<span className="sr-only">Clear</span>
						</button>
					)}

					{/* Password Toggle */}
					{isPassword && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm opacity-70 transition-all hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring">
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
						</button>
					)}
				</div>

				{/* Error Message */}
				{error && (
					<p className="mt-1.5 text-red-600 text-sm dark:text-red-400 animate-fade-in">{error}</p>
				)}
			</div>
		)
	}
)

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
