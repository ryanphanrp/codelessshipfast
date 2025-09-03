import type { ExampleItem } from "../types"

export const EXAMPLES: Record<string, ExampleItem[]> = {
	"pretty-print": [
		{
			label: "User Profile",
			content: `{"name":"John Doe","age":30,"email":"john@example.com","active":true,"profile":{"avatar":"avatar.jpg","bio":"Software Developer"},"preferences":{"theme":"dark","notifications":true},"tags":["developer","react","typescript"]}`
		},
		{
			label: "API Response",
			content: `{"status":"success","data":{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2},"timestamp":"2024-01-15T10:30:00Z"}`
		}
	],
	minify: [
		{
			label: "Large Configuration",
			content: `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": "secret123"
    }
  },
  "features": [
    "authentication",
    "authorization",
    "logging"
  ],
  "settings": {
    "debug": false,
    "maxConnections": 100,
    "timeout": 30000
  }
}`
		}
	],
	"tree-view": [
		{
			label: "Nested Object Structure",
			content: `{"company":{"name":"Tech Corp","departments":{"engineering":{"teams":[{"name":"Frontend","members":3},{"name":"Backend","members":5}]},"design":{"teams":[{"name":"UI/UX","members":4}]}}},"locations":["New York","San Francisco","London"]}`
		},
		{
			label: "Complex Array Data",
			content: `[{"product":"Laptop","price":1299.99,"specs":{"cpu":"i7","ram":"16GB","storage":"512GB SSD"},"inStock":true},{"product":"Mouse","price":29.99,"specs":{"wireless":true,"dpi":1600},"inStock":false}]`
		}
	],
	validate: [
		{
			label: "Valid JSON",
			content: `{"message":"Hello World","status":200,"data":{"items":[1,2,3]}}`
		},
		{
			label: "JSON with Comments (Invalid)",
			content: `{
  // This is a comment
  "name": "Test",
  "value": 123
}`
		},
		{
			label: "Trailing Comma (Invalid)",
			content: `{"name":"Test","value":123,}`
		},
		{
			label: "Missing Quote (Invalid)",
			content: `{"name":"Test","value":123}`
		}
	]
}

// Get examples for a specific mode
export function getExamples(mode: string): ExampleItem[] {
	return EXAMPLES[mode] || []
}

// Get all examples
export function getAllExamples(): ExampleItem[] {
	return Object.values(EXAMPLES).flat()
}
