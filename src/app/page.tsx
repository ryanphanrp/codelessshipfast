import HomePage from "@/components/layout/homepage"
import Link from "next/link"

export default function MainLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex h-14 items-center px-4 lg:px-6">
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Link className="font-medium text-sm underline-offset-4 hover:underline" href="#features">
						Features
					</Link>
					<Link className="font-medium text-sm underline-offset-4 hover:underline" href="/sign-in">
						Sign In
					</Link>
				</nav>
			</header>
			<main className="w-full py-8">
				<HomePage />
			</main>
		</div>
	)
}
