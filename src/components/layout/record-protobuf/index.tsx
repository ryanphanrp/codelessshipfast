"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FunctionTextarea from "@/components/ui/function-textarea"
import { useState } from "react"
import { toast } from "sonner"
import { cleanJavaRecord, convertJavaRecordToProto } from "./protobuf-convert"

export function RecordProtobuf() {
	const [javaCode, setJavaCode] = useState("")
	const [cleanedJava, setCleanedJava] = useState("")
	const [protoCode, setProtoCode] = useState("")

	const handleClean = () => {
		if (!javaCode.trim()) {
			toast.error("Please enter Java record code")
			return
		}

		try {
			const cleaned = cleanJavaRecord(javaCode)
			setCleanedJava(cleaned)
			toast.success("Java record cleaned successfully!")
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "An error occurred")
		}
	}

	const handleConvert = () => {
		if (!cleanedJava.trim()) {
			toast.error("Please clean the Java record first")
			return
		}

		try {
			const proto = convertJavaRecordToProto(cleanedJava)
			setProtoCode(proto)
			toast.success("Conversion successful!")
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "An error occurred")
		}
	}

	const handleRawConvert = () => {
		if (!javaCode.trim()) {
			toast.error("Please enter Java record code")
			return
		}

		try {
			const proto = convertJavaRecordToProto(javaCode)
			setProtoCode(proto)
			toast.success("Conversion successful!")
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "An error occurred")
		}
	}

	const handleDownload = () => {
		const blob = new Blob([protoCode], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = "converted.proto"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	return (
		<div className="mx-auto max-w-3xl space-y-4">
			<h1 className="font-bold text-xl">Java Record to gRPC Converter</h1>

			<Card className="border-none p-0 shadow-none">
				<CardContent className="space-y-2">
					<FunctionTextarea
						placeholder="Enter Java 17 record class..."
						value={javaCode}
						onChange={(e) => setJavaCode(e)}
					/>
					<div className="flex gap-2">
						<Button onClick={handleClean}>Clean</Button>
						<Button onClick={handleRawConvert}>Convert</Button>
					</div>
				</CardContent>
			</Card>

			{cleanedJava && (
				<Card className="border-none p-0 shadow-none">
					<CardContent className="space-y-2">
						<FunctionTextarea value={cleanedJava} />
						<Button onClick={handleConvert}>Convert</Button>
					</CardContent>
				</Card>
			)}

			{protoCode && (
				<Card className="border-none p-0 shadow-none">
					<CardContent className="space-y-2">
						<FunctionTextarea value={protoCode} />
						<Button onClick={handleDownload}>Download .proto</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
