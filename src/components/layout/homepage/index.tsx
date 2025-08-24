import Link from "next/link"

function HomePage() {
	return (
		<section className="container mx-auto px-4 py-24 lg:py-32">
			<div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
				<div className="flex flex-col justify-center space-y-8">
					<div className="space-y-4">
						<h1 className="font-bold text-4xl tracking-tight sm:text-5xl xl:text-6xl">
							The complete platform <br />
							for building the Web
						</h1>
						<p className="max-w-[600px] text-muted-foreground text-xl">
							Give your team the toolkit to stop configuring and start innovating. Securely build,
							deploy, and scale the best web experiences.
						</p>
					</div>
					<div className="flex flex-col gap-4 min-[400px]:flex-row">
						<Link
							className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground text-sm shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							href="/dashboard">
							Get Started
						</Link>
						<Link
							className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 font-medium text-sm shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							href="/features">
							View Features
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomePage
