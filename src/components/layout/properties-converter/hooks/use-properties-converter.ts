import { useState, useCallback } from 'react'
import type { ConversionMode, ConverterState } from '../types'
import { convertProperties } from '../utils/properties-convert'

export function usePropertiesConverter() {
	const [state, setState] = useState<ConverterState>({
		mode: 'yaml-to-env',
		input: '',
		output: '',
		error: null,
		isConverting: false
	})

	const convert = useCallback(async (input: string, mode: ConversionMode) => {
		setState(prev => ({ ...prev, isConverting: true, error: null }))

		try {
			const output = convertProperties(input, mode)
			setState(prev => ({
				...prev,
				output,
				error: null,
				isConverting: false
			}))
		} catch (error) {
			setState(prev => ({
				...prev,
				output: '',
				error: error instanceof Error ? error.message : 'Conversion failed',
				isConverting: false
			}))
		}
	}, [])

	const setInput = useCallback((input: string) => {
		setState(prev => ({ ...prev, input }))
		// Remove auto-conversion - only convert when manually triggered
	}, [])

	const setMode = useCallback((mode: ConversionMode) => {
		setState(prev => ({ ...prev, mode }))
		// Remove auto-conversion - only convert when manually triggered
	}, [])

	const manualConvert = useCallback(() => {
		if (state.input.trim()) {
			convert(state.input, state.mode)
		}
	}, [convert, state.input, state.mode])

	const clearInput = useCallback(() => {
		setState(prev => ({ ...prev, input: '', output: '', error: null }))
	}, [])

	const clearOutput = useCallback(() => {
		setState(prev => ({ ...prev, output: '', error: null }))
	}, [])

	return {
		...state,
		setInput,
		setMode,
		clearInput,
		clearOutput,
		manualConvert
	}
}