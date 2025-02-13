type FormatRules = {
	[key: string]: (param: string) => string
}

const defaultRules: FormatRules = {
	null: () => "NULL",
	true: () => "1",
	false: () => "0",
	default: (param: string) => `'${param}'`
}

export const formatParam = (param: string, customRules: FormatRules = {}) => {
	const rules = { ...defaultRules, ...customRules }

	if (param === "null") return rules.null(param)
	if (param === "true") return rules.true(param)
	if (param === "false") return rules.false(param)

	return customRules[param] ? customRules[param](param) : rules.default(param)
}
