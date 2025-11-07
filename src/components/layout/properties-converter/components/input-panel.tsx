import { Button } from "@/components/hexta-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/hexta-ui";
import { Textarea } from "@/components/hexta-ui";
import type { ClipboardState, ExampleItem } from "@/types";
import { ArrowRight, FileText, Play } from "lucide-react";
import { memo, useCallback } from "react";
import { ExampleLoader } from "./example-loader";
import { InputActions } from "./input-actions";

interface InputPanelProps {
  title: string;
  value: string;
  placeholder: string;
  examples: readonly ExampleItem[];
  hasInput: boolean;
  clipboardState: ClipboardState;
  isConverting: boolean;
  onChange: (value: string) => void;
  onPaste: () => void;
  onCopy: () => void;
  onClear: () => void;
  onLoadExample: (content: string) => void;
  onConvert: () => void;
  showReverse?: boolean;
  onReverse?: () => void;
}

export const InputPanel = memo(function InputPanel({
  title,
  value,
  placeholder,
  examples,
  hasInput,
  clipboardState,
  isConverting,
  onChange,
  onPaste,
  onCopy,
  onClear,
  onLoadExample,
  onConvert,
  showReverse = false,
  onReverse,
}: InputPanelProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleLoadExample = useCallback(
    (content: string) => {
      onLoadExample(content);
    },
    [onLoadExample],
  );

  const handleReverse = useCallback(() => {
    onReverse?.();
  }, [onReverse]);

  return (
    <Card className="p-0-none border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <InputActions
            hasInput={hasInput}
            clipboardState={clipboardState}
            onPaste={onPaste}
            onCopy={onCopy}
            onClear={onClear}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0-none border-0">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="min-h-[300px] font-mono text-sm"
        />
        <div className="flex justify-between gap-2">
          <ExampleLoader
            examples={examples}
            onLoadExample={handleLoadExample}
          />
          <div className="flex gap-2">
            {showReverse && onReverse && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReverse}
                disabled={!value.trim()}
                className="gap-2"
              >
                Reverse
              </Button>
            )}
            <Button
              onClick={onConvert}
              disabled={!value.trim() || isConverting}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Convert
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
