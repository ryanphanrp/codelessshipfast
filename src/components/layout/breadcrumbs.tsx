"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export function Breadcrumbs() {
	const pathname = usePathname()

	// Generate breadcrumb items from pathname
	const segments = pathname.split("/").filter(Boolean)

	// Don't show breadcrumbs on home page
	if (segments.length === 0) return null

	const breadcrumbs = segments.map((segment, index) => {
		const href = `/${segments.slice(0, index + 1).join("/")}`
		// Convert kebab-case to Title Case
		const label = segment
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")

		return { label, href, isLast: index === segments.length - 1 }
	})

	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex items-center gap-2 text-sm text-muted-foreground">
				{/* Home link */}
				<li>
					<Link
						href="/"
						className="flex items-center gap-1 transition-colors hover:text-foreground"
						aria-label="Home">
						<Home className="size-4" />
					</Link>
				</li>

				{breadcrumbs.map((crumb, index) => (
					<Fragment key={crumb.href}>
						<li>
							<ChevronRight className="size-4" />
						</li>
						<li>
							{crumb.isLast ? (
								<span className="font-medium text-foreground" aria-current="page">
									{crumb.label}
								</span>
							) : (
								<Link
									href={crumb.href}
									className="transition-colors hover:text-foreground">
									{crumb.label}
								</Link>
							)}
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	)
}
