"use client"

import { Button } from "@/components/hexta-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/hexta-ui"
import { AlertTriangle, RefreshCw } from "lucide-react"
import React from "react"

interface Props {
	children: React.ReactNode
	fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface State {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo)
	}

	reset = () => {
		this.setState({ hasError: false, error: null })
	}

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				return <this.props.fallback error={this.state.error} reset={this.reset} />
			}

			return (
				<Card className="m-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
							<AlertTriangle className="h-5 w-5" />
							Something went wrong
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-red-700 text-sm dark:text-red-300">
							An error occurred while processing your request. Please try again.
						</p>
						{process.env.NODE_ENV === "development" && (
							<details className="text-red-600 text-xs dark:text-red-400">
								<summary className="cursor-pointer font-semibold">Error details</summary>
								<pre className="mt-2 overflow-auto  bg-red-100 p-2 dark:bg-red-900/30">
									{this.state.error.stack}
								</pre>
							</details>
						)}
						<Button onClick={this.reset} className="gap-2">
							<RefreshCw className="h-4 w-4" />
							Try again
						</Button>
					</CardContent>
				</Card>
			)
		}

		return this.props.children
	}
}
