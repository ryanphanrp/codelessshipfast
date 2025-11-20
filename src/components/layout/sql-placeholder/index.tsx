"use client";

import { Button } from "@/components/hexta-ui";
import { Card, CardContent, CardFooter } from "@/components/hexta-ui";
import { TextareaWithActions } from "@/components/hexta-ui";
import { useClipboard } from "@/hooks/use-clipboard";
import { handleError } from "@/lib/shared";
import { useState } from "react";
import { splitSQLAndLog } from "./formatter-utilities";
import {
  extractBindings,
  replaceQueryParams,
  useFormattedSQL,
} from "./use-sql-formatter";

const defaultSqlQuery = `SELECT * FROM crash_scene_investigations WHERE accident_document_code = ? AND weather_condition_code = ? AND end_date_time >= ? AND end_date_time <= ?;`;

const SqlPlaceholder = () => {
  const [sqlQuery, setSqlQuery] = useState(defaultSqlQuery);
  const [paramText, setParamText] = useState("");
  const [filledQuery, setFilledQuery] = useState("");
  const newQuery = useFormattedSQL(sqlQuery, paramText);
  const { pasteFromClipboard } = useClipboard();

  const fillQuery = () => {
    setFilledQuery(newQuery);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await pasteFromClipboard();
      if (!clipboardText) return;
      const { sqlQuery: sql, logHibernate } = splitSQLAndLog(clipboardText);
      if (sql) setSqlQuery(sql);
      if (logHibernate) setParamText(logHibernate);
      const bindings = extractBindings(logHibernate);
      const result = replaceQueryParams(sql, bindings);
      setFilledQuery(result);
    } catch (err) {
      handleError(err, {
        action: "paste-clipboard",
        component: "sql-placeholder",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4/5 py-6">
      <Card className="border-none-none">
        <CardContent>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="font-medium text-sm">SQL Query</label>
              <TextareaWithActions
                className="min-h-[120px] font-mono text-sm"
                placeholder="Paste SQL script with ? placeholders"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Parameters</label>
              <TextareaWithActions
                className="min-h-[120px]  font-mono text-sm"
                placeholder="Paste parameter list"
                value={paramText}
                onChange={(e) => setParamText(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="cursor-pointer px-6"
              onClick={handlePasteFromClipboard}
            >
              Paste then fill SQL
            </Button>
            <Button
              size="sm"
              className="cursor-pointer px-6"
              variant="outline"
              onClick={fillQuery}
            >
              Fill SQL Query
            </Button>
          </div>
        </CardFooter>
      </Card>
      {filledQuery && (
        <Card className="border-none-none">
          <CardContent>
            <div className="space-y-2">
              <label className="font-medium text-sm">Result</label>
              <TextareaWithActions
                className="min-h-[120px] font-mono text-sm"
                value={filledQuery}
                readOnly
                showPaste={false}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SqlPlaceholder;
