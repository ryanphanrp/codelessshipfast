interface JavaToProtoMapping {
	int: string
	long: string
	float: string
	double: string
	boolean: string
	String: string
	[key: string]: string
}

function cleanJavaRecord(javaCode: string): string {
	// Validate input
	if (!javaCode?.trim()) {
		throw new Error("Input code cannot be empty")
	}

	// Clean the code first
	const cleaned = javaCode
		.replace(/^\s*@\S+.*$/gm, "") // Remove annotation lines
		.replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
		.replace(/\/\/.*$/gm, "") // Remove line comments
		.replace(/^.*\{[^{}]*\}$/gm, "") // Remove lines with annotations in Java record
		.trim()

	// Validate Java record syntax
	const recordRegex = /\s*record\s+[A-Z]\w*\s*\([^)]*\)\s*$/
	if (!recordRegex.test(cleaned)) {
		throw new Error(
			"Invalid Java record syntax. Expected format: record ClassName(Type field1, Type field2, ...)"
		)
	}

	// Validate field syntax
	const fieldsMatch = cleaned.match(/\((.*?)\)/)
	if (!fieldsMatch?.[1]) {
		throw new Error("No fields found in record declaration")
	}

	const fields = fieldsMatch[1].split(",").map((field) => field.trim())

	// Validate each field
	for (const field of fields) {
		if (field === "") continue // Skip empty fields

		const fieldParts = field.split(/\s+/)
		if (fieldParts.length !== 2) {
			throw new Error(`Invalid field format: "${field}". Expected format: "Type fieldName"`)
		}

		const [type, name] = fieldParts

		// Validate type name (should start with uppercase letter or be a primitive type)
		const validTypes = ["int", "long", "float", "double", "boolean", "String"]
		if (!validTypes.includes(type) && !/^[A-Z]\w*$/.test(type)) {
			throw new Error(
				`Invalid type "${type}" in field "${field}". Type should be a primitive type or start with an uppercase letter`
			)
		}

		// Validate field name (should start with lowercase letter)
		if (!/^[a-z]\w*$/.test(name)) {
			throw new Error(
				`Invalid field name "${name}" in field "${field}". Field name should start with a lowercase letter`
			)
		}
	}

	return cleaned
}

function convertType(javaType: string): string {
	const mapping: JavaToProtoMapping = {
		int: "int32",
		long: "int64",
		float: "float",
		double: "double",
		boolean: "bool",
		String: "string"
	}

	return mapping[javaType] || javaType
}

function convertJavaRecordToProto(cleanedJava: string): string {
	const regex = /record\s+(\w+)\s*\(([^)]+)\)/
	const match = cleanedJava.match(regex)

	if (!match) throw new Error("Invalid Java record format")

	const [, recordName, fieldsStr] = match

	const fields = fieldsStr.split(",").map((field: string, index: number) => {
		const parts = field.trim().split(/\s+/)
		if (parts.length < 2) throw new Error(`Invalid field format: ${field}`)

		const [type, name] = parts
		const commonValueMatch = name.match(/(\w+)CommonValue/i)

		if (commonValueMatch) {
			const baseName = commonValueMatch[1]
			return `${convertType(type)} ${baseName}Code = ${index * 2 + 1};\n  string ${baseName}Name = ${index * 2 + 2};`
		}

		return `${convertType(type)} ${name} = ${index + 1};`
	})

	return `syntax = "proto3";

message ${recordName} {
  ${fields.join("\n  ")}
}`
}

function normalizeProtoFieldOrder(protoCode: string) {
	// Validate input
	if (!protoCode?.trim()) {
		throw new Error("Input code cannot be empty")
	}

	// Find all message blocks
	const regex = /message\s+(\w+)\s*\{([^}]+)\}/g
	let normalizedProto = protoCode

	// Process each message block
	while (true) {
		const match = regex.exec(protoCode)
		if (!match) break

		const [fullMatch, messageName, messageContent] = match

		// Process fields while preserving blank lines
		const lines = messageContent.split("\n")
		const processedLines = lines.map((line) => {
			const trimmed = line.trim()
			if (!trimmed) {
				// Preserve blank lines
				return line
			}
			if (!trimmed.includes("=")) {
				// Keep non-field lines unchanged
				return line
			}

			// Update field numbers while preserving indentation
			const leadingSpaces = line.match(/^\s*/)?.[0] || ""
			const [fieldDef] = trimmed.split("=")
			const fieldNumber = lines.filter((l) => l.trim() && l.includes("=")).indexOf(line) + 1
			return `${leadingSpaces}${fieldDef.trim()} = ${fieldNumber};`
		})

		// Create new message block preserving original structure
		const newMessage = `message ${messageName} {${processedLines.join("\n")}}`

		// Replace old message block with new one
		normalizedProto = normalizedProto.replace(fullMatch, newMessage)
	}

	return normalizedProto
}

function convertInterfaceToNewFormat(javaInterface: string) {
	// Validate input
	if (!javaInterface?.trim()) {
		throw new Error("Input code cannot be empty")
	}

	// Extract interface name and content
	const interfaceMatch = javaInterface.match(/interface\s+(\w+)\s*\{([\s\S]*?)\}/)
	if (!interfaceMatch) {
		throw new Error("Invalid interface format")
	}

	const [, interfaceName, interfaceContent] = interfaceMatch

	// Split content into lines and process
	const lines = interfaceContent
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)

	// Extract all method declarations
	const methodRegex = /(\w+)\s+(\w+)\(\);/
	const methods = lines
		.map((line) => {
			const match = line.match(methodRegex)
			if (!match) return null
			return {
				type: match[1],
				name: match[2],
				fullDeclaration: line
			}
		})
		.filter((m): m is { type: string; name: string; fullDeclaration: string } => m !== null)

	// Generate new format for each method
	const newMethods = methods.map((method) => {
		const { type, name } = method
		return `  ${type} ${name}();
	default ${type} get${name.charAt(0).toUpperCase() + name.slice(1)}() {
		return ${name}();
	}`
	})

	// Reconstruct the interface
	return `public interface ${interfaceName} {
${newMethods.join("\n\n")}
}`
}

function convertJavaInterfaceToProto(javaCode: string) {
	const regex = /interface\s+(\w+)\s*\{([\s\S]*?)\}/
	const match = javaCode.match(regex)
	if (!match) throw new Error("Không tìm thấy interface hợp lệ")

	const interfaceName = match[1].replace(/^I/, "") // Xóa tiền tố 'I'
	const body = match[2].trim()

	const methodLines = body
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)

	const fields = methodLines
		.map((line, index) => {
			const match = line.match(/(\w+)\s+(\w+)\(\);/)
			if (!match) return null
			const type = convertType(match[1])
			const name = match[2]
			return `${type} ${name} = ${index + 1};`
		})
		.filter(Boolean)

	return `syntax = "proto3";

message ${interfaceName} {
  ${fields.join("\n  ")}
}`
}

export {
	cleanJavaRecord,
	convertInterfaceToNewFormat,
	convertJavaInterfaceToProto,
	convertJavaRecordToProto,
	normalizeProtoFieldOrder
}
