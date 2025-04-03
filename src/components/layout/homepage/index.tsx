import Link from "next/link"

function HomePage() {
	return (
		<section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
			<div className="container px-4 md:px-6">
				<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<h1 className="font-bold text-3xl tracking-tighter sm:text-5xl xl:text-6xl/none">
								The complete platform <br />
								for building the Web
							</h1>
							<p className="max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400">
								Give your team the toolkit to stop configuring and start innovating. Securely build,
								deploy, and scale the best web experiences.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row">
							<Link
								className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-8 font-medium text-neutral-50 text-sm shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:focus-visible:ring-neutral-300 dark:hover:bg-neutral-50/90"
								href="#">
								Get Started
							</Link>
							<Link
								className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-8 font-medium text-sm shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
								href="#">
								Contact Sales
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomePage
