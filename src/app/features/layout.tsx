export default async function AppLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <main className="w-full">{children}</main>
}
