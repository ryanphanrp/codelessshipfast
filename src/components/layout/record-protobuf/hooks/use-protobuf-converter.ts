import { useState } from "react"
import { toast } from "sonner"
import {
	cleanJavaRecord,
	convertInterfaceToNewFormat,
	convertJavaInterfaceToProto,
	convertJavaRecordToProto,
	normalizeProtoFieldOrder
} from "../utils/protobuf-convert"

type ProtoType = "record" | "interface" | "standardize" | "sort" | "clean" | "oldInterface"

export function useProtobufConverter() {
	const [javaCode, setJavaCode] = useState("")
	const [cleanedJava, setCleanedJava] = useState("")
	const [protoCode, setProtoCode] = useState("")

	const validateInput = (msg: string) => {
		if (!javaCode.trim()) {
			toast.error(msg)
			return false
		}
		return true
	}

	const handleConvert = (type: ProtoType) => {
		if (!validateInput("Please enter Java code.")) return

		try {
			let proto = ""

			switch (type) {
				case "clean":
					proto = cleanJavaRecord(javaCode)
					break
				case "record":
					proto = convertJavaRecordToProto(javaCode)
					break
				case "interface":
					proto = convertJavaInterfaceToProto(javaCode)
					break
				case "standardize":
					proto = convertInterfaceToNewFormat(javaCode)
					break
				case "sort":
					proto = normalizeProtoFieldOrder(javaCode)
					break
			}

			setProtoCode(proto)
			toast.success("Conversion successful!")
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
			toast.error(errorMessage)
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

	return {
		javaCode,
		setJavaCode,
		cleanedJava,
		protoCode,
		handleConvert,
		handleDownload
	}
}
