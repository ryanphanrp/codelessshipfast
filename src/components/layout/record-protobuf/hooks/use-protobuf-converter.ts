import { useAsyncOperation, useFileOperations } from "@/hooks"
import { ErrorFactory, downloadProtoFile, validateNotEmpty } from "@/lib/shared"
import type { ProtoType } from "@/types"
import { useState } from "react"
import { toast } from "sonner"
import {
	cleanJavaRecord,
	convertInterfaceToNewFormat,
	convertJavaInterfaceToProto,
	convertJavaRecordToProto,
	normalizeProtoFieldOrder
} from "../utils/protobuf-convert"

export function useProtobufConverter() {
	const [javaCode, setJavaCode] = useState("")
	const [cleanedJava, setCleanedJava] = useState("")
	const [protoCode, setProtoCode] = useState("")

	const asyncOperation = useAsyncOperation()
	const { downloadProto } = useFileOperations()

	const validateInput = (msg: string) => {
		const validation = validateNotEmpty(javaCode, "Java code")
		if (!validation.isValid) {
			throw ErrorFactory.validation(validation.error || msg, "javaCode", javaCode.slice(0, 50))
		}
		return true
	}

	const performConversion = (type: ProtoType): string => {
		switch (type) {
			case "clean":
				return cleanJavaRecord(javaCode)
			case "record":
				return convertJavaRecordToProto(javaCode)
			case "interface":
				return convertJavaInterfaceToProto(javaCode)
			case "standardize":
				return convertInterfaceToNewFormat(javaCode)
			case "sort":
				return normalizeProtoFieldOrder(javaCode)
			default:
				throw ErrorFactory.validation(`Invalid conversion type: ${type}`, "type", type)
		}
	}

	const handleConvert = (type: ProtoType) => {
		asyncOperation.execute(
			async () => {
				validateInput("Please enter Java code.")
				const result = performConversion(type)
				setProtoCode(result)
				return result
			},
			{
				onSuccess: () => {
					toast.success("Conversion successful!")
				},
				context: { conversionType: type, inputLength: javaCode.length }
			}
		)
	}

	const handleDownload = () => {
		if (protoCode.trim()) {
			downloadProto(protoCode, "converted.proto")
		}
	}

	return {
		javaCode,
		setJavaCode,
		cleanedJava,
		protoCode,
		handleConvert,
		handleDownload,
		isConverting: asyncOperation.loading,
		error: asyncOperation.error
	}
}
