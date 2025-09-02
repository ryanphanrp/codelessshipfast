import { useConversion } from "@/hooks/use-conversion"
import type { ConversionMode } from "@/types"
import { convertProperties } from "../utils/properties-convert"

export function usePropertiesConverter() {
	const conversion = useConversion<ConversionMode>({
		defaultMode: "yaml-to-env" as ConversionMode,
		validateInput: (input) => input.trim().length > 0,
		onSuccess: (result) => {
			// Additional success handling can be added here
		}
	})

	const manualConvert = () => {
		if (conversion.input.trim()) {
			conversion.convert(
				(input, mode) => convertProperties(input, mode as ConversionMode),
				conversion.mode
			)
		}
	}

	return {
		...conversion,
		manualConvert
	}
}
