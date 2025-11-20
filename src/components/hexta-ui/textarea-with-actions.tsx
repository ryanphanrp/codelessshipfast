"use client";

import * as React from "react";
import { useState } from "react";
import { Copy, ClipboardPaste, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { useClipboard } from "@/hooks/use-clipboard";

interface TextareaWithActionsProps extends React.ComponentProps<"textarea"> {
	showCopy?: boolean;
	showPaste?: boolean;
	onPasteAction?: (text: string) => void;
}

const TextareaWithActions = React.forwardRef<
	HTMLTextAreaElement,
	TextareaWithActionsProps
>(function TextareaWithActions(
	{
		className,
		showCopy = true,
		showPaste = true,
		onPasteAction,
		value,
		onChange,
		readOnly,
		disabled,
		...props
	},
	ref
) {
	const { copyToClipboard, pasteFromClipboard, state } = useClipboard();
	const [showCopied, setShowCopied] = useState(false);

	const handleCopy = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const textToCopy = String(value || "");
		if (!textToCopy.trim()) return;

		await copyToClipboard(textToCopy);

		if (state.success) {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		}
	};

	const handlePaste = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (readOnly || disabled) return;

		const pastedText = await pasteFromClipboard();

		if (pastedText && onChange) {
			// Create a synthetic event to pass to onChange
			const syntheticEvent = {
				target: { value: pastedText },
				currentTarget: { value: pastedText },
			} as React.ChangeEvent<HTMLTextAreaElement>;

			onChange(syntheticEvent);
			onPasteAction?.(pastedText);
		}
	};

	const showButtons = (showCopy && value) || (showPaste && !readOnly && !disabled);

	return (
		<div className="relative">
			<Textarea
				ref={ref}
				className={cn(className)}
				value={value}
				onChange={onChange}
				readOnly={readOnly}
				disabled={disabled}
				{...props}
			/>
			{showButtons && (
				<div className="absolute top-2 right-2 flex gap-1">
					{showPaste && !readOnly && !disabled && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-background/95 shadow-sm hover:bg-background"
							onClick={handlePaste}
							title="Paste from clipboard"
						>
							<ClipboardPaste className="h-3.5 w-3.5" />
						</Button>
					)}
					{showCopy && value && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-background/95 shadow-sm hover:bg-background"
							onClick={handleCopy}
							title={showCopied ? "Copied!" : "Copy to clipboard"}
						>
							{showCopied ? (
								<Check className="h-3.5 w-3.5 text-green-600" />
							) : (
								<Copy className="h-3.5 w-3.5" />
							)}
						</Button>
					)}
				</div>
			)}
		</div>
	);
});

export { TextareaWithActions };
