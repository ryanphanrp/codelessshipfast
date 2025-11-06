"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	wrapLines?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, wrapLines = false, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[100px] w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 resize-none",
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
