import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
	wrapLines?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, wrapLines = false, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				style={{
					whiteSpace: wrapLines ? "pre-wrap" : "pre",
					wordWrap: wrapLines ? "break-word" : "normal",
					overflowWrap: wrapLines ? "break-word" : "normal",
					overflow: wrapLines ? "auto" : "auto"
				}}
				{...props}
			/>
		)
	}
)
Textarea.displayName = "Textarea"

export { Textarea }
