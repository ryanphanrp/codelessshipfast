"use client"

import { Button } from "@shadui/button"
import { Card, CardContent } from "@shadui/card"
import FunctionTextarea from "@shadui/function-textarea"
import { useState } from "react"
import { formatParam } from "./sql-formatter"
import { extractBindings, replaceQueryParams, useFormattedSQL } from "./use-sql-formatter"
import { useClipboard } from "@/hooks/use-clipboard"
import { Console } from "console"

export function splitSQLAndLog(input: string): { sqlQuery: string; logHibernate: string } {
  const lines = input.split("\n"); // Tách từng dòng
  let sqlQuery = [];
  let logHibernate = [];
  let foundLog = false;

  for (const line of lines) {
    if (line.includes("org.hibernate.orm.jdbc.bind")) {
      foundLog = true;
    }
    if (foundLog) {
      logHibernate.push(line);
    } else {
      sqlQuery.push(line);
    }
  }

  return {
    sqlQuery: sqlQuery.join("\n").trim(),
    logHibernate: logHibernate.join("\n").trim(),
  };
}

const SqlPlaceholder = () => {
  const [sqlQuery, setSqlQuery] = useState(
    `SELECT * FROM crash_scene_investigations WHERE accident_document_code = ? AND weather_condition_code = ? AND end_date_time >= ? AND end_date_time <= ?;`
  )
  const [paramText, setParamText] = useState("")
  const [filledQuery, setFilledQuery] = useState("")
  const newQuery = useFormattedSQL(sqlQuery, paramText)
  const { pasteFromClipboard } = useClipboard();

  const fillQuery = () => {
    setFilledQuery(newQuery)
  }

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await pasteFromClipboard();
      if (!clipboardText) return;
      const { sqlQuery: sql, logHibernate } = splitSQLAndLog(clipboardText);
      if (sql) setSqlQuery(sql);
      if (logHibernate) setParamText(logHibernate);
      const bindings = extractBindings(logHibernate);
      const result = replaceQueryParams(sql, bindings);
      setFilledQuery(result)
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }

  return (
    <div className="p-4">
      <Card className="border-none shadow-none">
        <CardContent>
          <div className="mb-4">
            <FunctionTextarea
              className="font-code"
              placeholder="Paste SQL script with ? placeholders"
              value={sqlQuery}
              onChange={setSqlQuery}
            />
          </div>
          <div className="mb-4">
            <FunctionTextarea
              className="font-code"
              placeholder="Paste parameter list"
              value={paramText}
              onChange={setParamText}
            />
          </div>
          <Button className="mr-4" onClick={handlePasteFromClipboard}>Paste then fill SQL</Button>
          <Button onClick={fillQuery}>Fill SQL Query</Button>
        </CardContent>
      </Card>
      {filledQuery && (
        <Card className="mt-4 border-none shadow-none">
          <CardContent>
            <FunctionTextarea className="font-code" value={filledQuery} readOnly />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SqlPlaceholder
