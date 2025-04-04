import { useState } from "react"
import { toast } from "sonner"
import {
	cleanJavaRecord,
	convertInterfaceToNewFormat,
	convertJavaRecordToProto,
	normalizeProtoFieldOrder
} from "../utils/protobuf-convert"

export function useProtobufConverter() {
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

	const handleChuanHoa = () => {
		if (!javaCode.trim()) {
			toast.error("Vui lòng nhập Java interface.")
			return
		}

		try {
			const proto = convertInterfaceToNewFormat(javaCode)
			setProtoCode(proto)
			toast.success("Chuyển đổi Interface thành công!")
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "An error occurred")
		}
	}

	const handleSapxepproto = () => {
		if (!javaCode.trim()) {
			toast.error("Vui lòng nhập Java interface.")
			return
		}

		try {
			const proto = normalizeProtoFieldOrder(javaCode)
			setProtoCode(proto)
			toast.success("Chuyển đổi Interface thành công!")
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

	return {
		javaCode,
		setJavaCode,
		cleanedJava,
		protoCode,
		handleClean,
		handleConvert,
		handleRawConvert,
		handleDownload,
		handleChuanHoa,
		handleSapxepproto
	}
}
