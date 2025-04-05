"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FunctionTextarea from "@/components/ui/function-textarea"
import { cn } from "@/lib/utils"
import { useProtobufConverter } from "./hooks/use-protobuf-converter"

export function RecordProtobuf({ className }: { className?: string }) {
	const { javaCode, setJavaCode, cleanedJava, protoCode, handleConvert, handleDownload } =
		useProtobufConverter()

	return (
		<div className={cn("flex h-dvh flex-col", className)}>
			<div className="mb-4 font-bold text-xl">Java Record to gRPC Converter</div>

			<div className="buttons">
				<div className="flex flex-wrap gap-2">
					<Button size="sm" onClick={() => handleConvert("clean")}>
						Clean
					</Button>
					<Button size="sm" onClick={() => handleConvert("record")}>
						Convert Record
					</Button>
					<Button size="sm" onClick={() => handleConvert("interface")}>
						Convert Interface
					</Button>
					<Button size="sm" onClick={() => handleConvert("standardize")}>
						Standardize
					</Button>
					<Button size="sm" onClick={() => handleConvert("sort")}>
						Sort
					</Button>
				</div>
			</div>
			<div className="flex flex-1 gap-4">
				<Card className="mt-2 flex w-1/2 border-none shadow-none">
					<CardContent className=" flex flex-1 flex-col gap-4">
						<FunctionTextarea
							placeholder="Enter Java 17 record class..."
							value={javaCode}
							className="!text-xs"
							onChange={setJavaCode}
						/>
					</CardContent>
				</Card>

				<div className="flex w-1/2 flex-col gap-4">
					{cleanedJava && (
						<Card className="flex flex-1 border-none shadow-none">
							<CardContent className="flex flex-1 flex-col gap-4">
								<div className="flex-1">
									<FunctionTextarea className="!text-xs" value={cleanedJava} readOnly />
								</div>
								<Button onClick={() => handleConvert("record")}>Convert</Button>
							</CardContent>
						</Card>
					)}

					{protoCode && (
						<Card className="mt-2 flex flex-1 border-none shadow-none">
							<CardContent className="flex flex-1 flex-col gap-4">
								<div className="flex-1">
									<FunctionTextarea className="!text-xs" value={protoCode} readOnly />
								</div>
								<Button onClick={handleDownload}>Download .proto</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}
