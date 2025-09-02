import { describe, expect, it } from "vitest"
import {
	formatDateTime,
	hasContent,
	isNullOrUndefined,
	propertyKeyToEnvVar,
	safeJsonParse
} from "./formatting"

describe("Formatting utilities", () => {
	describe("formatDateTime", () => {
		it("should format valid date string", () => {
			const result = formatDateTime("2023-12-25T10:30:00.000Z")
			expect(result).toMatch(/^2023-12-25 \d{2}:\d{2}:\d{2}$/)
		})

		it("should return original string for invalid date", () => {
			const invalidDate = "not-a-date"
			const result = formatDateTime(invalidDate)
			expect(result).toBe(invalidDate)
		})
	})

	describe("propertyKeyToEnvVar", () => {
		it("should convert camelCase to UPPER_SNAKE_CASE", () => {
			expect(propertyKeyToEnvVar("camelCase")).toBe("CAMEL_CASE")
		})

		it("should convert kebab-case to UPPER_SNAKE_CASE", () => {
			expect(propertyKeyToEnvVar("kebab-case")).toBe("KEBAB_CASE")
		})

		it("should convert dot.notation to UPPER_SNAKE_CASE", () => {
			expect(propertyKeyToEnvVar("app.database.url")).toBe("APP_DATABASE_URL")
		})

		it("should handle mixed formats", () => {
			expect(propertyKeyToEnvVar("app.redis.value-key")).toBe("APP_REDIS_VALUE_KEY")
		})
	})

	describe("hasContent", () => {
		it("should return true for non-empty strings", () => {
			expect(hasContent("hello")).toBe(true)
			expect(hasContent("  hello  ")).toBe(true)
		})

		it("should return false for empty strings", () => {
			expect(hasContent("")).toBe(false)
			expect(hasContent("   ")).toBe(false)
		})
	})

	describe("isNullOrUndefined", () => {
		it("should return true for null and undefined", () => {
			expect(isNullOrUndefined(null)).toBe(true)
			expect(isNullOrUndefined(undefined)).toBe(true)
		})

		it("should return false for other values", () => {
			expect(isNullOrUndefined("")).toBe(false)
			expect(isNullOrUndefined(0)).toBe(false)
			expect(isNullOrUndefined(false)).toBe(false)
			expect(isNullOrUndefined({})).toBe(false)
		})
	})

	describe("safeJsonParse", () => {
		it("should parse valid JSON", () => {
			const json = '{"name": "test", "value": 123}'
			const result = safeJsonParse(json, { default: true })
			expect(result).toEqual({ name: "test", value: 123 })
		})

		it("should return fallback for invalid JSON", () => {
			const invalidJson = "{invalid json}"
			const fallback = { error: true }
			const result = safeJsonParse(invalidJson, fallback)
			expect(result).toBe(fallback)
		})
	})
})
