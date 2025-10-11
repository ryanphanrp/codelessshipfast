import { describe, expect, it } from "vitest"
import { convertProperties } from "./properties-convert"

describe("K8s Environment Variables Conversion", () => {
	it("should convert YAML to K8s environment variables format", () => {
		const input = `app:
  redis:
    host: localhost
    port: 6379
  database:
    connection-url: jdbc:mysql://localhost:3306/db`

		const expected = `- name: APP_REDIS_HOST
  value: 'localhost'
- name: APP_REDIS_PORT
  value: '6379'
- name: APP_DATABASE_CONNECTION_URL
  value: 'jdbc:mysql://localhost:3306/db'`

		const result = convertProperties(input, "yaml-to-k8s-env")
		expect(result.trim()).toBe(expected.trim())
	})

	it("should handle complex nested structures", () => {
		const input = `server:
  config:
    database:
      connection:
        url: postgresql://localhost:5432/mydb
        pool:
          max: 10
          min: 2
  auth:
    jwt:
      secret: my-secret-key
      expiration: 3600`

		const result = convertProperties(input, "yaml-to-k8s-env")

		// Should contain all expected variables
		expect(result).toContain("name: SERVER_CONFIG_DATABASE_CONNECTION_URL")
		expect(result).toContain("value: 'postgresql://localhost:5432/mydb'")
		expect(result).toContain("name: SERVER_CONFIG_DATABASE_CONNECTION_POOL_MAX")
		expect(result).toContain("value: '10'")
		expect(result).toContain("name: SERVER_CONFIG_DATABASE_CONNECTION_POOL_MIN")
		expect(result).toContain("value: '2'")
		expect(result).toContain("name: SERVER_AUTH_JWT_SECRET")
		expect(result).toContain("value: 'my-secret-key'")
		expect(result).toContain("name: SERVER_AUTH_JWT_EXPIRATION")
		expect(result).toContain("value: '3600'")
	})

	it("should validate K8s environment variable naming rules", () => {
		// Test that valid names are accepted
		const validInput = `app:
  valid_name: value
  VALID_NAME: value
  valid123: value
  _private: value`

		expect(() => {
			convertProperties(validInput, "yaml-to-k8s-env")
		}).not.toThrow()
	})

	it("should reject invalid K8s environment variable names", () => {
		// Test that names starting with numbers are rejected
		const invalidInput = `'123-invalid': value`

		expect(() => {
			convertProperties(invalidInput, "yaml-to-k8s-env")
		}).toThrow("Invalid Kubernetes environment variable name")
	})

	it("should reject names that are too long", () => {
		// Create a name longer than 63 characters
		const longName = "a".repeat(64)
		const invalidInput = `app:
  '${longName}': value`

		expect(() => {
			convertProperties(invalidInput, "yaml-to-k8s-env")
		}).toThrow("Invalid Kubernetes environment variable name")
	})

	it("should handle special characters in keys", () => {
		const input = `app:
  config.value-key: some-value
  another-key: another-value`

		const result = convertProperties(input, "yaml-to-k8s-env")

		expect(result).toContain("name: APP_CONFIG_VALUE_KEY")
		expect(result).toContain("value: 'some-value'")
		expect(result).toContain("name: APP_ANOTHER_KEY")
		expect(result).toContain("value: 'another-value'")
	})

	it("should handle arrays by joining with commas", () => {
		const input = `app:
  servers:
    - server1
    - server2
    - server3`

		const result = convertProperties(input, "yaml-to-k8s-env")

		expect(result).toContain("name: APP_SERVERS")
		expect(result).toContain("value: 'server1,server2,server3'")
	})

	it("should handle Java properties format", () => {
		const input = `app.redis.host=localhost
app.redis.port=6379
database.url=jdbc:mysql://localhost:3306/db`

		const result = convertProperties(input, "yaml-to-k8s-env")

		expect(result).toContain("name: APP_REDIS_HOST")
		expect(result).toContain("value: 'localhost'")
		expect(result).toContain("name: APP_REDIS_PORT")
		expect(result).toContain("value: '6379'")
		expect(result).toContain("name: DATABASE_URL")
		expect(result).toContain("value: 'jdbc:mysql://localhost:3306/db'")
	})

	it("should handle empty values", () => {
		const input = `app:
  empty_value:
  null_value: null
  string_value: ""`

		const result = convertProperties(input, "yaml-to-k8s-env")

		expect(result).toContain("name: APP_EMPTY_VALUE")
		expect(result).toContain("value: ''")
		expect(result).toContain("name: APP_NULL_VALUE")
		expect(result).toContain("value: ''")
		expect(result).toContain("name: APP_STRING_VALUE")
		expect(result).toContain("value: ''")
	})
})
