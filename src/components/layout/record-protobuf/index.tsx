"use client"

import { Button } from "@/components/hexta-ui"
import { Card, CardContent } from "@/components/hexta-ui"
import { Textarea } from "@/components/hexta-ui"
import { cn } from "@/lib/utils"
import { useProtobufConverter } from "./hooks/use-protobuf-converter"

export function RecordProtobuf({ className }: { className?: string }) {
	const { javaCode, setJavaCode, cleanedJava, protoCode, handleConvert, handleDownload } =
		useProtobufConverter()

	return (
		<div className={cn("container mx-auto max-w-7xl space-y-6 p-6", className)}>
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Java Record to gRPC Converter</h1>
				<p className="text-muted-foreground">
					Convert Java record classes to Protocol Buffer definitions
				</p>
			</div>

			<div className="flex flex-wrap gap-2">
				<Button size="sm" onClick={() => handleConvert("clean")}>
					Clean
				</Button>
				<Button size="sm" variant="outline" onClick={() => handleConvert("record")}>
					Convert Record
				</Button>
				<Button size="sm" variant="outline" onClick={() => handleConvert("interface")}>
					Convert Interface
				</Button>
				<Button size="sm" variant="outline" onClick={() => handleConvert("standardize")}>
					Standardize
				</Button>
				<Button size="sm" variant="outline" onClick={() => handleConvert("sort")}>
					Sort
				</Button>
			</div>

			<div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-2">
				<Card className="flex flex-col border-none p-0-none">
					<CardContent className="flex-1 px-0">
						<div className="flex h-full flex-col space-y-2">
							<label className="font-medium text-sm">Java Record Input</label>
							<Textarea
								placeholder="Enter Java 17 record class..."
								value={javaCode}
								className="min-h-[500px] flex-1 font-mono text-sm"
								onChange={(e) => setJavaCode(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6">
					{cleanedJava && (
						<Card className="flex flex-col-none">
							<CardContent className="flex-1 px-0">
								<div className="flex h-full flex-col space-y-4">
									<label className="font-medium text-sm">Cleaned Java</label>
									<Textarea
										className="min-h-[200px] flex-1 font-mono text-sm"
										value={cleanedJava}
										readOnly
									/>
									<Button onClick={() => handleConvert("record")}>Convert to Proto</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{protoCode && (
						<Card className="flex flex-col-none">
							<CardContent className="flex-1 px-0">
								<div className="flex h-full flex-col space-y-4">
									<label className="font-medium text-sm">Protocol Buffer Definition</label>
									<Textarea
										className="min-h-[200px] flex-1 font-mono text-sm"
										value={protoCode}
										readOnly
									/>
									<Button onClick={handleDownload}>Download .proto</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}
