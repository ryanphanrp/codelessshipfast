import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "./button";
import { toast } from "./sonner";
import { Textarea } from "./textarea";

interface FunctionTextareaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const FunctionTextarea = ({
  value,
  onChange,
  placeholder,
  readOnly,
  className,
}: FunctionTextareaProps) => {
  const { state, copyToClipboard, pasteFromClipboard } = useClipboard();

  const handlePaste = async () => {
    const text = (await pasteFromClipboard()) ?? "";
    onChange?.(text);
    toast.info("Pasted.");
  };

  const handleCopy = async () => {
    copyToClipboard(value).then(() => console.info("Text copied!"));
    toast.success("Copied!");
  };

  return (
    <div className="relative">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`h-40 w-full ${className}`}
        readOnly={readOnly}
      />
      <div className="absolute top-2 right-2 flex">
        {!readOnly && (
          <Button
            onClick={handlePaste}
            size="sm"
            className="mx-1 font-semibold"
          >
            Paste
          </Button>
        )}
        <Button onClick={handleCopy} size="sm" className="mx-1 font-semibold">
          Copy
        </Button>
      </div>
    </div>
  );
};

export default FunctionTextarea;
