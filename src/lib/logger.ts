/**
 * Centralized logging system
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
	level: LogLevel
	message: string
	data?: unknown
	timestamp: string
	context?: string
}

class Logger {
	private isDevelopment = process.env.NODE_ENV === "development"
	private logs: LogEntry[] = []
	private maxLogs = 1000

	private formatMessage(
		level: LogLevel,
		message: string,
		data?: unknown,
		context?: string
	): string {
		const timestamp = new Date().toISOString()
		const contextStr = context ? `[${context}] ` : ""
		const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : ""
		return `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}${dataStr}`
	}

	private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
		const entry: LogEntry = {
			level,
			message,
			data,
			timestamp: new Date().toISOString(),
			context
		}

		// Store log entry
		this.logs.push(entry)

		// Keep only recent logs
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs)
		}

		// Console output in development
		if (this.isDevelopment) {
			const formattedMessage = this.formatMessage(level, message, data, context)

			switch (level) {
				case "debug":
					console.debug(formattedMessage)
					break
				case "info":
					console.info(formattedMessage)
					break
				case "warn":
					console.warn(formattedMessage)
					break
				case "error":
					console.error(formattedMessage)
					break
			}
		}
	}

	debug(message: string, data?: unknown, context?: string): void {
		this.log("debug", message, data, context)
	}

	info(message: string, data?: unknown, context?: string): void {
		this.log("info", message, data, context)
	}

	warn(message: string, data?: unknown, context?: string): void {
		this.log("warn", message, data, context)
	}

	error(message: string, data?: unknown, context?: string): void {
		this.log("error", message, data, context)
	}

	// Get recent logs for debugging
	getLogs(level?: LogLevel, limit: number = 50): LogEntry[] {
		let filteredLogs = this.logs

		if (level) {
			filteredLogs = this.logs.filter((log) => log.level === level)
		}

		return filteredLogs.slice(-limit)
	}

	// Clear logs
	clearLogs(): void {
		this.logs = []
	}

	// Export logs for debugging
	exportLogs(): string {
		return this.logs
			.map((entry) => this.formatMessage(entry.level, entry.message, entry.data, entry.context))
			.join("\n")
	}
}

// Create singleton instance
export const logger = new Logger()

// Convenience functions for different contexts
export const createContextLogger = (context: string) => ({
	debug: (message: string, data?: unknown) => logger.debug(message, data, context),
	info: (message: string, data?: unknown) => logger.info(message, data, context),
	warn: (message: string, data?: unknown) => logger.warn(message, data, context),
	error: (message: string, data?: unknown) => logger.error(message, data, context)
})

// Context-specific loggers
export const clipboardLogger = createContextLogger("clipboard")
export const sqlLogger = createContextLogger("sql-formatter")
export const navigationLogger = createContextLogger("navigation")
export const conversionLogger = createContextLogger("conversion")
