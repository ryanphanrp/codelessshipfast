/**
 * Test utilities for React Testing Library
 */

import { RenderOptions, render } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import React, { ReactElement } from "react"
import { afterEach, beforeEach, vi } from "vitest"

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange>
			{children}
		</ThemeProvider>
	)
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
	render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from "@testing-library/react"

// Override render method
export { customRender as render }

// Test data helpers
export const createMockFile = (name: string, size: number, type: string = "text/plain"): File => {
	const content = "mock file content"
	const blob = new Blob([content], { type })
	return new File([blob], name, { type })
}

export const createMockClipboardEvent = (text: string) => {
	return {
		clipboardData: {
			getData: () => text,
			setData: vi.fn()
		}
	}
}

// Common test selectors
export const selectors = {
	button: (name: string) => `button[name="${name}"]`,
	input: (name: string) => `input[name="${name}"]`,
	textarea: (name: string) => `textarea[name="${name}"]`,
	form: (name: string) => `form[name="${name}"]`,
	byText: (text: string | RegExp) => text,
	byRole: (role: string, name?: string) => ({ role, name }),
	byLabelText: (text: string | RegExp) => ({ label: text }),
	byPlaceholderText: (text: string | RegExp) => ({ placeholder: text }),
	byTestId: (id: string) => `[data-testid="${id}"]`
}

// Async helpers
export const waitForAsyncOperation = (ms: number = 0) =>
	new Promise((resolve) => setTimeout(resolve, ms))

// Mock helpers
export const mockConsole = () => {
	const originalConsole = { ...console }
	beforeEach(() => {
		console.log = vi.fn()
		console.warn = vi.fn()
		console.error = vi.fn()
	})
	afterEach(() => {
		Object.assign(console, originalConsole)
	})
}
