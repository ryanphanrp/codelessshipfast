"use client"

import { Button } from "@shadui/button"
import { Card, CardContent } from "@shadui/card"
import FunctionTextarea from "@shadui/function-textarea"
import { useState } from "react"
import { formatParam } from "./sql-formatter"
import { useFormattedSQL } from "./use-sql-formatter"

const SqlPlaceholder = () => {
  const [sqlQuery, setSqlQuery] = useState(
    `SELECT * FROM crash_scene_investigations WHERE accident_document_code = ? AND weather_condition_code = ? AND end_date_time >= ? AND end_date_time <= ?;`
  )
  const [paramText, setParamText] = useState("")
  const [filledQuery, setFilledQuery] = useState("")
  const newQuery = useFormattedSQL(sqlQuery, paramText)


  const fillQuery = () => {
    setFilledQuery(newQuery)
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
