/**
 * Standardized error handling utilities
 */

import { logger } from "@/lib/logger"
import { toast } from "sonner"

export enum ErrorType {
	VALIDATION = "validation",
	CONVERSION = "conversion",
	NETWORK = "network",
	PERMISSION = "permission",
	UNKNOWN = "unknown"
}

export enum ErrorSeverity {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
	CRITICAL = "critical"
}

export interface AppError {
	type: ErrorType
	severity: ErrorSeverity
	message: string
	code?: string
	cause?: Error
	context?: Record<string, unknown>
	timestamp: string
}

export class AppError extends Error {
	constructor(
		message: string,
		type: ErrorType = ErrorType.UNKNOWN,
		severity: ErrorSeverity = ErrorSeverity.MEDIUM,
		cause?: Error,
		code?: string,
		context?: Record<string, unknown>
	) {
		super(message)
		this.name = "AppError"
		this.type = type
		this.severity = severity
		this.cause = cause
		this.code = code
		this.context = context
		this.timestamp = new Date().toISOString()
	}
}

/**
 * Error factory functions for common error types
 */
export const ErrorFactory = {
	validation: (message: string, field?: string, value?: unknown) =>
		new AppError(message, ErrorType.VALIDATION, ErrorSeverity.LOW, undefined, "VALIDATION_ERROR", {
			field,
			value
		}),

	conversion: (message: string, input?: string, mode?: string) =>
		new AppError(
			message,
			ErrorType.CONVERSION,
			ErrorSeverity.MEDIUM,
			undefined,
			"CONVERSION_ERROR",
			{ input: input?.slice(0, 100), mode }
		),

	network: (message: string, url?: string, status?: number) =>
		new AppError(message, ErrorType.NETWORK, ErrorSeverity.HIGH, undefined, "NETWORK_ERROR", {
			url,
			status
		}),

	permission: (message: string, action?: string, resource?: string) =>
		new AppError(message, ErrorType.PERMISSION, ErrorSeverity.HIGH, undefined, "PERMISSION_ERROR", {
			action,
			resource
		})
}

/**
 * Error handler that provides consistent error processing
 */
export class ErrorHandler {
	private static instance: ErrorHandler

	private constructor() {}

	static getInstance(): ErrorHandler {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler()
		}
		return ErrorHandler.instance
	}

	/**
	 * Handle an error with appropriate logging and UI feedback
	 */
	handle(error: unknown, context?: Record<string, unknown>): AppError {
		const appError = this.normalizeError(error, context)

		// Log the error
		const logContext = { ...context, error: appError }
		switch (appError.severity) {
			case ErrorSeverity.LOW:
				logger.warn(appError.message, logContext)
				break
			case ErrorSeverity.MEDIUM:
			case ErrorSeverity.HIGH:
				logger.error(appError.message, appError, "error-handler")
				break
			case ErrorSeverity.CRITICAL:
				logger.error(`CRITICAL: ${appError.message}`, appError, "error-handler")
				break
		}

		// Show user-friendly error message
		this.showUserError(appError)

		return appError
	}

	/**
	 * Handle async operations with error handling
	 */
	async handleAsync<T>(
		operation: () => Promise<T>,
		context?: Record<string, unknown>
	): Promise<T | null> {
		try {
			return await operation()
		} catch (error) {
			this.handle(error, context)
			return null
		}
	}

	/**
	 * Convert any error type to AppError
	 */
	private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
		if (error instanceof AppError) {
			return error
		}

		if (error instanceof Error) {
			// Try to infer error type from error message
			let type = ErrorType.UNKNOWN
			let severity = ErrorSeverity.MEDIUM

			const message = error.message.toLowerCase()

			if (message.includes("validation") || message.includes("invalid")) {
				type = ErrorType.VALIDATION
				severity = ErrorSeverity.LOW
			} else if (message.includes("conversion") || message.includes("transform")) {
				type = ErrorType.CONVERSION
			} else if (message.includes("network") || message.includes("fetch")) {
				type = ErrorType.NETWORK
				severity = ErrorSeverity.HIGH
			}

			return new AppError(error.message, type, severity, error, undefined, context)
		}

		// Handle non-Error objects
		const message = typeof error === "string" ? error : "An unknown error occurred"
		return new AppError(
			message,
			ErrorType.UNKNOWN,
			ErrorSeverity.MEDIUM,
			undefined,
			undefined,
			context
		)
	}

	/**
	 * Show appropriate error message to user
	 */
	private showUserError(error: AppError): void {
		const getUserMessage = (error: AppError): string => {
			switch (error.type) {
				case ErrorType.VALIDATION:
					return `Validation Error: ${error.message}`
				case ErrorType.CONVERSION:
					return `Conversion Failed: ${error.message}`
				case ErrorType.NETWORK:
					return `Network Error: Please check your connection and try again`
				case ErrorType.PERMISSION:
					return `Permission Denied: ${error.message}`
				default:
					return `Something went wrong: ${error.message}`
			}
		}

		const userMessage = getUserMessage(error)

		switch (error.severity) {
			case ErrorSeverity.LOW:
				toast.error(userMessage)
				break
			case ErrorSeverity.MEDIUM:
			case ErrorSeverity.HIGH:
				toast.error(userMessage)
				break
			case ErrorSeverity.CRITICAL:
				toast.error(`Critical Error: ${userMessage}`)
				break
		}
	}
}

/**
 * Convenience functions for error handling
 */
export const errorHandler = ErrorHandler.getInstance()

export const handleError = (error: unknown, context?: Record<string, unknown>) =>
	errorHandler.handle(error, context)

export const handleAsync = <T>(operation: () => Promise<T>, context?: Record<string, unknown>) =>
	errorHandler.handleAsync(operation, context)
