"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import FunctionTextarea from "../ui/function-textarea"

const SqlPlaceholder = () => {
	const [sqlQuery, setSqlQuery] = useState(
		`SELECT * FROM crash_scene_investigations WHERE accident_document_code = ? AND weather_condition_code = ? AND end_date_time >= ? AND end_date_time <= ?;`
	)
	const [paramText, setParamText] = useState("")
	const [filledQuery, setFilledQuery] = useState("")

	const formatParam = (param: string) => {
		if (param === "null") return "NULL"
		if (param === "true") return "1"
		if (param === "false") return "0"
		return `'${param}'`
	}

	const fillQuery = () => {
		const params = paramText
			.split("\n")
			.map((line) => line.match(/- \[(.*?)\]/)?.[1])
			.filter((val) => val !== undefined)

		let newQuery = sqlQuery
		params.forEach((param) => {
			newQuery = newQuery.replace("?", formatParam(param))
		})

		setFilledQuery(newQuery)
	}

	return (
		<div className="p-4">
			<Card className="border-none shadow-none">
				<CardContent>
					<div className="mb-4">
						<FunctionTextarea
							placeholder="Paste SQL script with ? placeholders"
							value={sqlQuery}
							onChange={setSqlQuery}
						/>
					</div>
					<div className="mb-4">
						<FunctionTextarea
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
						<FunctionTextarea value={filledQuery} readOnly />
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default SqlPlaceholder
