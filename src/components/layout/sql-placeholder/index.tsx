"use client"

import { Button } from "@/components/ui/button"
import FunctionTextarea from "@/components/ui/function-textarea"
import { useClipboard } from "@/hooks/use-clipboard"
import { Card, CardContent } from "@shadui/card"
import { useState } from "react"
import { splitSQLAndLog } from "./formatter-utilities"
import { extractBindings, replaceQueryParams, useFormattedSQL } from "./use-sql-formatter"

const defaultSqlQuery = `SELECT * FROM crash_scene_investigations WHERE accident_document_code = ? AND weather_condition_code = ? AND end_date_time >= ? AND end_date_time <= ?;`

const SqlPlaceholder = () => {
	const [sqlQuery, setSqlQuery] = useState(defaultSqlQuery)
	const [paramText, setParamText] = useState("")
	const [filledQuery, setFilledQuery] = useState("")
	const newQuery = useFormattedSQL(sqlQuery, paramText)
	const { pasteFromClipboard } = useClipboard()

	const fillQuery = () => {
		setFilledQuery(newQuery)
	}

	const handlePasteFromClipboard = async () => {
		try {
			const clipboardText = await pasteFromClipboard()
			if (!clipboardText) return
			const { sqlQuery: sql, logHibernate } = splitSQLAndLog(clipboardText)
			if (sql) setSqlQuery(sql)
			if (logHibernate) setParamText(logHibernate)
			const bindings = extractBindings(logHibernate)
			const result = replaceQueryParams(sql, bindings)
			setFilledQuery(result)
		} catch (err) {
			console.error("Failed to read clipboard:", err)
		}
	}

	return (
		<div className="p-4">
			<Card className="border-none shadow-none">
				<CardContent className="w-full items-center">
					<div className="flex w-full items-center">
						<div className="w-full">
							<FunctionTextarea
								className="w-full font-code"
								placeholder="Paste SQL script with ? placeholders"
								value={sqlQuery}
								onChange={setSqlQuery}
							/>
						</div>
						<div className="ml-2 w-full">
							<FunctionTextarea
								className="w-full font-code"
								placeholder="Paste parameter list"
								value={paramText}
								onChange={setParamText}
							/>
						</div>
					</div>
					<div className="my-2 w-full">
						<Button className="mr-4 cursor-pointer" onClick={handlePasteFromClipboard}>
							Paste then fill SQL
						</Button>
						<Button className="cursor-pointer" onClick={fillQuery}>
							Fill SQL Query
						</Button>
					</div>
				</CardContent>
			</Card>
			{filledQuery && (
				<Card className="border-none shadow-none">
					<CardContent>
						<FunctionTextarea className="font-code" value={filledQuery} readOnly />
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default SqlPlaceholder
