import { describe, expect, it } from "vitest"
import {
	createValidator,
	validateNotEmpty,
	validatePattern,
	validatePropertyKey
} from "./validation"

describe("Validation utilities", () => {
	describe("validateNotEmpty", () => {
		it("should validate non-empty strings", () => {
			const result = validateNotEmpty("hello", "Test field")
			expect(result.isValid).toBe(true)
			expect(result.error).toBeUndefined()
		})

		it("should reject empty strings", () => {
			const result = validateNotEmpty("", "Test field")
			expect(result.isValid).toBe(false)
			expect(result.error).toBe("Test field cannot be empty")
		})

		it("should reject whitespace-only strings", () => {
			const result = validateNotEmpty("   ", "Test field")
			expect(result.isValid).toBe(false)
			expect(result.error).toBe("Test field cannot be empty")
		})
	})

	describe("validatePattern", () => {
		it("should validate matching patterns", () => {
			const pattern = /^[a-z]+$/
			const result = validatePattern("hello", pattern, "Test field")
			expect(result.isValid).toBe(true)
			expect(result.error).toBeUndefined()
		})

		it("should reject non-matching patterns", () => {
			const pattern = /^[a-z]+$/
			const result = validatePattern("Hello123", pattern, "Test field", "lowercase letters only")
			expect(result.isValid).toBe(false)
			expect(result.error).toBe("Test field must match pattern (lowercase letters only)")
		})
	})

	describe("validatePropertyKey", () => {
		it("should validate valid property keys", () => {
			const validKeys = [
				"simple",
				"with.dots",
				"with-dashes",
				"with_underscores",
				"camelCase",
				"PascalCase",
				"mixed_case.with-DOTS"
			]

			validKeys.forEach((key) => {
				const result = validatePropertyKey(key)
				expect(result.isValid).toBe(true)
				expect(result.error).toBeUndefined()
			})
		})

		it("should reject invalid property keys", () => {
			const invalidKeys = [
				"with spaces",
				"with@symbols",
				"with#hash",
				"with$dollar",
				"with%percent"
			]

			invalidKeys.forEach((key) => {
				const result = validatePropertyKey(key)
				expect(result.isValid).toBe(false)
				expect(result.error).toBeDefined()
			})
		})
	})

	describe("createValidator", () => {
		it("should combine multiple validation rules", () => {
			const validator = createValidator([
				(value) => validateNotEmpty(value, "Field"),
				(value) => validatePattern(value, /^[a-z]+$/, "Field", "lowercase only")
			])

			expect(validator("hello")).toEqual({ isValid: true, error: undefined })
			expect(validator("")).toEqual({ isValid: false, error: "Field cannot be empty" })
			expect(validator("Hello")).toEqual({
				isValid: false,
				error: "Field must match pattern (lowercase only)"
			})
		})

		it("should stop at first validation failure", () => {
			const validator = createValidator([
				(value) => validateNotEmpty(value, "Field"),
				(value) => validatePattern(value, /^[a-z]+$/, "Field", "lowercase only")
			])

			const result = validator("")
			expect(result.isValid).toBe(false)
			expect(result.error).toBe("Field cannot be empty")
		})
	})
})
