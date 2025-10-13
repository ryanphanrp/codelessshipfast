import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";
import { ClipboardList, Copy, ScrollText, WrapText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FunctionTextareaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  showWrapToggle?: boolean;
}

const FunctionTextarea = ({
  value,
  onChange,
  placeholder,
  readOnly,
  className,
  showWrapToggle = true,
}: FunctionTextareaProps) => {
  const { state, copyToClipboard, pasteFromClipboard } = useClipboard();
  const [wrapLines, setWrapLines] = useState(false);

  const handlePaste = async () => {
    const text = (await pasteFromClipboard()) ?? "";
    if (onChange) {
      // Create a synthetic event for paste functionality
      const syntheticEvent = {
        target: { value: text },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(syntheticEvent);
    }
    if (text.trim()) {
      toast.info("Pasted.");
    } else {
      toast.warning("Clipboard is empty or contains only invalid content.");
    }
  };

  const handleCopy = async () => {
    copyToClipboard(value).then(() => console.info("Text copied!"));
    toast.success("Copied!");
  };

  return (
    <div className="relative flex h-full flex-col">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "min-h-[200px] w-full flex-1 border-gray-600 resize-none rounded-md border font-code text-sm shadow-none",
          className,
        )}
        readOnly={readOnly}
        wrapLines={wrapLines}
      />
      <div className="absolute top-1 right-1 flex gap-1">
        {showWrapToggle && (
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "size-6 text-muted-foreground hover:text-foreground",
              wrapLines && "text-primary",
            )}
            onClick={() => setWrapLines(!wrapLines)}
            title={
              wrapLines ? "Switch to horizontal scroll" : "Wrap long lines"
            }
          >
            {wrapLines ? (
              <ScrollText className="h-4 w-4" />
            ) : (
              <WrapText className="h-4 w-4" />
            )}
          </Button>
        )}
        {!readOnly && (
          <Button
            size="icon"
            variant="ghost"
            className="size-6 text-muted-foreground hover:text-foreground"
            onClick={handlePaste}
            title="Paste"
          >
            <ClipboardList className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="size-6 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FunctionTextarea;
