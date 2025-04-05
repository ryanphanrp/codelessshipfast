import { RecordProtobuf } from "@/components/layout/record-protobuf"

export default function Features() {
	return (
		<main className="flex h-screen w-full flex-col">
			<div className="my-8 ml-8 font-bold text-2xl text-cyan-700">Record to Protobuf</div>
			<RecordProtobuf className="h-full" />
		</main>
	)
}
