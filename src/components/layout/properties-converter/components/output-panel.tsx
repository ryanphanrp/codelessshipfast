import { Card, CardContent, CardHeader, CardTitle } from "@/components/hexta-ui";
import { Textarea } from "@/components/hexta-ui";
import { ScrollArea } from "@/components/hexta-ui";
import type { EnvVariable } from "@/types";
import { FileText } from "lucide-react";
import { memo, useMemo } from "react";
import { EnvVariableItem } from "../env-variable-item";
import { PropertyLineItem } from "../property-line-item";
import { OutputActions } from "./output-actions";

interface OutputPanelProps {
  title: string;
  content: string;
  error?: string | null;
  isConverting: boolean;
  envVariables?: EnvVariable[];
  propertyLines?: string[];
  onCopy: () => void;
  onClear: () => void;
  displayMode?: "env-variables" | "property-lines" | "textarea";
}

export const OutputPanel = memo(function OutputPanel({
  title,
  content,
  error,
  isConverting,
  envVariables = [],
  propertyLines = [],
  onCopy,
  onClear,
  displayMode = "textarea",
}: OutputPanelProps) {
  const hasContent = content.trim().length > 0;

  const parsedPropertyLines = useMemo(() => {
    return content ? content.split("\n").filter((line) => line.trim()) : [];
  }, [content]);

  return (
    <Card className="p-0 shadow-none border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
            {displayMode === "env-variables" && ` (${envVariables.length})`}
          </CardTitle>
          <OutputActions
            hasOutput={hasContent}
            onCopy={onCopy}
            onClear={onClear}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0 shadow-none border-0">
        {error ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
            <strong>Error:</strong> {error}
          </div>
        ) : hasContent ? (
          <>
            {displayMode === "env-variables" && envVariables.length > 0 && (
              <ScrollArea className="h-[350px] w-full">
                <div className="space-y-2">
                  {envVariables.map((envVar, index) => (
                    <EnvVariableItem
                      key={index}
                      envKey={envVar.key}
                      envValue={envVar.value}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
            {displayMode === "property-lines" &&
              parsedPropertyLines.length > 0 && (
                <ScrollArea className="h-[350px] w-full">
                  <div className="space-y-1">
                    {parsedPropertyLines.map((line, index) => (
                      <PropertyLineItem
                        key={index}
                        line={line}
                        lineNumber={index + 1}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            {displayMode === "textarea" && (
              <Textarea
                value={content}
                className="min-h-[350px] bg-muted/50 font-mono text-sm"
                readOnly
              />
            )}
          </>
        ) : (
          <div className="flex h-[350px] items-center justify-center rounded border-2 border-gray-200 border-dashed">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto mb-2 h-8 w-8" />
              <p>Output will appear here</p>
              <p className="text-sm">Click Convert to generate output</p>
            </div>
          </div>
        )}
        {isConverting && (
          <p className="mt-2 text-muted-foreground text-sm">Converting...</p>
        )}
      </CardContent>
    </Card>
  );
});
