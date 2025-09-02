export const EXAMPLE_YAML = `app:
  redis:
    host: localhost
    port: 6379
    value-key: redis-value
  database:
    connection-url: jdbc:mysql://localhost:3306/db
    username: admin
server:
  port: 8080`

export const EXAMPLE_SPRING = `@Value("\${app.redis.host}")
private String redisHost;

@Value("\${app.redis.port:6379}")
private int redisPort;

@Value("\${database.connection-url}")
private String dbUrl;

@Value("\${server.port:8080}")
private int serverPort;`

export const EXAMPLE_PLAIN_PROPS = `abc.efg.gh-oo.makeNow
app.redis.hostName=localhost
server.connection-timeout=5000
database.pool.maxSize
auth.jwt.secretKey=mySecret
service.retryAttempts=3
api.base-url=https://api.example.com`

export const EXAMPLES = {
	yaml: [{ label: "YAML Example", content: EXAMPLE_YAML }],
	spring: [
		{ label: "@Value Annotations", content: EXAMPLE_SPRING },
		{ label: "Plain Property Keys", content: EXAMPLE_PLAIN_PROPS }
	],
	properties: [{ label: "Properties Example", content: EXAMPLE_PLAIN_PROPS }]
} as const
