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
	],
	schema: [
		{
			label: "E-commerce Product",
			content: `{
  "id": 1,
  "name": "Wireless Headphones",
  "price": 199.99,
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "inStock": true,
  "rating": 4.5,
  "tags": ["audio", "wireless", "noise-cancelling"],
  "specifications": {
    "color": "Black",
    "weight": "250g",
    "batteryLife": "30 hours",
    "connectivity": ["Bluetooth 5.0", "USB-C"]
  },
  "reviews": [
    {
      "userId": 123,
      "rating": 5,
      "comment": "Excellent sound quality!",
      "date": "2024-01-15T10:30:00Z"
    }
  ]
}`
		},
		{
			label: "User Profile",
			content: `{
  "id": "user_123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "isActive": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  },
  "createdAt": "2023-01-15T10:30:00Z",
  "lastLogin": "2024-01-20T15:45:00Z"
}`
		}
	],
	jsonpath: [
		{
			label: "Store Inventory",
			content: `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  },
  "expensive": 10
}`
		},
		{
			label: "Company Employees",
			content: `{
  "company": {
    "name": "Tech Solutions Inc",
    "employees": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "department": "Engineering",
        "salary": 95000,
        "skills": ["JavaScript", "React", "Node.js"]
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "department": "Design",
        "salary": 75000,
        "skills": ["Figma", "Photoshop", "UI/UX"]
      },
      {
        "id": 3,
        "name": "Carol Davis",
        "department": "Engineering",
        "salary": 105000,
        "skills": ["Python", "Django", "PostgreSQL"]
      }
    ]
  }
}`
		}
	],
	stats: [
		{
			label: "API Response Data",
			content: `{
  "metadata": {
    "version": "1.0",
    "timestamp": "2024-01-20T10:30:00Z",
    "totalRecords": 1000
  },
  "data": {
    "users": [
      {
        "id": 1,
        "username": "alice_dev",
        "profile": {
          "firstName": "Alice",
          "lastName": "Johnson",
          "age": 28,
          "email": "alice@example.com",
          "isActive": true
        },
        "permissions": ["read", "write", "admin"],
        "settings": {
          "theme": "dark",
          "notifications": {
            "email": true,
            "push": false,
            "sms": true
          },
          "privacy": {
            "profileVisible": true,
            "showEmail": false
          }
        },
        "statistics": {
          "loginCount": 245,
          "lastActive": "2024-01-19T18:22:00Z",
          "averageSessionDuration": 1800
        }
      },
      {
        "id": 2,
        "username": "bob_designer",
        "profile": {
          "firstName": "Bob",
          "lastName": "Smith",
          "age": 32,
          "email": "bob@example.com",
          "isActive": false
        },
        "permissions": ["read"],
        "settings": {
          "theme": "light",
          "notifications": {
            "email": false,
            "push": true,
            "sms": false
          }
        },
        "statistics": {
          "loginCount": 89,
          "lastActive": "2024-01-10T14:15:00Z",
          "averageSessionDuration": 3600
        }
      }
    ],
    "summary": {
      "totalUsers": 2,
      "activeUsers": 1,
      "averageAge": 30,
      "commonPermissions": ["read"],
      "themePreferences": {
        "dark": 1,
        "light": 1
      }
    }
  }
}`
		}
	],
	flatten: [
		{
			label: "Nested Configuration",
			content: `{
  "app": {
    "name": "My Application",
    "version": "1.2.3",
    "database": {
      "host": "localhost",
      "port": 5432,
      "credentials": {
        "username": "admin",
        "password": "secret123"
      },
      "options": {
        "ssl": true,
        "poolSize": 10,
        "timeout": 30000
      }
    },
    "features": {
      "authentication": true,
      "logging": {
        "level": "info",
        "destinations": ["console", "file"]
      },
      "caching": {
        "enabled": true,
        "ttl": 3600,
        "providers": ["redis", "memory"]
      }
    },
    "api": {
      "version": "v1",
      "endpoints": ["/users", "/posts", "/comments"],
      "rateLimit": {
        "requests": 100,
        "window": "1h"
      }
    }
  }
}`
		},
		{
			label: "User Preferences",
			content: `{
  "user": {
    "profile": {
      "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "contact": {
          "email": "john@example.com",
          "phone": "+1234567890"
        }
      },
      "preferences": {
        "ui": {
          "theme": "dark",
          "language": "en",
          "fontSize": "medium"
        },
        "notifications": {
          "email": true,
          "push": false,
          "frequency": "daily"
        }
      }
    },
    "settings": {
      "privacy": {
        "profileVisible": true,
        "activityTracking": false
      },
      "security": {
        "twoFactorAuth": true,
        "sessionTimeout": 1800
      }
    }
  }
}`
		}
	],
	visualize: [
		{
			label: "Organization Chart",
			content: `{
  "company": {
    "name": "Tech Solutions",
    "ceo": {
      "name": "Sarah Wilson",
      "department": "Executive",
      "reports": {
        "engineering": {
          "name": "Mike Chen",
          "title": "VP Engineering",
          "teams": {
            "frontend": {
              "lead": "Alice Johnson",
              "members": ["Bob Smith", "Carol Davis"]
            },
            "backend": {
              "lead": "David Brown",
              "members": ["Eve Wilson", "Frank Miller"]
            }
          }
        },
        "product": {
          "name": "Lisa Garcia",
          "title": "VP Product",
          "teams": {
            "design": {
              "lead": "Tom Anderson",
              "members": ["Amy Taylor", "Chris Lee"]
            },
            "research": {
              "lead": "Maria Rodriguez",
              "members": ["John Kim"]
            }
          }
        }
      }
    }
  }
}`
		},
		{
			label: "Data Structure",
			content: `{
  "root": {
    "id": "root",
    "children": [
      {
        "id": "branch1",
        "value": "Branch 1",
        "children": [
          {
            "id": "leaf1",
            "value": "Leaf 1",
            "data": [1, 2, 3, 4, 5]
          },
          {
            "id": "leaf2",
            "value": "Leaf 2",
            "metadata": {
              "created": "2024-01-01",
              "modified": "2024-01-15"
            }
          }
        ]
      },
      {
        "id": "branch2",
        "value": "Branch 2",
        "children": [
          {
            "id": "leaf3",
            "value": "Leaf 3",
            "properties": {
              "color": "blue",
              "size": "large",
              "active": true
            }
          }
        ]
      }
    ]
  }
}`
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
