type FormatRules = {
	[key: string]: (param: string) => string
}

const defaultRules: FormatRules = {
	null: () => "NULL",
	true: () => "1",
	false: () => "0",
	default: (param: string) => `'${param}'`
}

// Regular expression for matching YYYY-MM-DD HH:mm:ss format
const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

export const formatParam = (param: string, customRules: FormatRules = {}) => {
	const rules = { ...defaultRules, ...customRules }

	if (param === "null") return rules.null(param)
	if (param === "true") return rules.true(param)
	if (param === "false") return rules.false(param)

	// Check if the parameter matches timestamp format
	if (timestampRegex.test(param)) {
		return `TIMESTAMP '${param}'`
	}

	return customRules[param] ? customRules[param](param) : rules.default(param)
}

export function splitSQLAndLog(input: string): { sqlQuery: string; logHibernate: string } {
	const lines = input.split("\n") // Tách từng dòng
	let sqlQuery = []
	let logHibernate = []
	let foundLog = false

	for (const line of lines) {
		if (line.includes("org.hibernate.orm.jdbc.bind")) {
			foundLog = true
		}
		if (foundLog) {
			logHibernate.push(line)
		} else {
			sqlQuery.push(line)
		}
	}

	return {
		sqlQuery: sqlQuery.join("\n").trim(),
		logHibernate: logHibernate.join("\n").trim()
	}
}
