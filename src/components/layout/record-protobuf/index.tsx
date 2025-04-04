"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FunctionTextarea from "@/components/ui/function-textarea"
import { useProtobufConverter } from "./hooks/use-protobuf-converter"

export function RecordProtobuf() {
	const {
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
	} = useProtobufConverter()

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
						<Button size="sm" className="px-6" onClick={handleClean}>
							Clean
						</Button>
						<Button size="sm" className="px-6" onClick={handleRawConvert}>
							Convert
						</Button>
						<Button size="sm" className="px-6" onClick={handleChuanHoa}>
							Chuẩn hóa
						</Button>
						<Button size="sm" className="px-6" onClick={handleSapxepproto}>
							Sắp xếp
						</Button>
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
