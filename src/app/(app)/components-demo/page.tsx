"use client"

import { useState } from "react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Alert,
	AlertDescription,
	AlertTitle,
	AnimatedButton,
	EnhancedBadge,
	EnhancedInput,
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger
} from "@/components/hexta-ui"
import { Sparkles, Zap, Shield, Rocket } from "lucide-react"

export default function ComponentsDemo() {
	const [searchValue, setSearchValue] = useState("")
	const [passwordValue, setPasswordValue] = useState("")

	return (
		<div className="container mx-auto space-y-12 px-4 py-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="mb-4 font-bold text-4xl">HextaUI Components Demo</h1>
				<p className="text-muted-foreground text-lg">
					Showcase of all enhanced HextaUI-inspired components
				</p>
			</div>

			{/* Buttons Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Animated Buttons</h2>
				<div className="flex flex-wrap gap-4">
					<AnimatedButton variant="default">Default Button</AnimatedButton>
					<AnimatedButton variant="outline">Outline Button</AnimatedButton>
					<AnimatedButton variant="gradient">Gradient Button</AnimatedButton>
					<AnimatedButton variant="default" size="sm">
						Small
					</AnimatedButton>
					<AnimatedButton variant="gradient" size="lg">
						Large
					</AnimatedButton>
				</div>
			</section>

			{/* Badges Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Enhanced Badges</h2>
				<div className="flex flex-wrap gap-3">
					<EnhancedBadge variant="default">Default</EnhancedBadge>
					<EnhancedBadge variant="secondary">Secondary</EnhancedBadge>
					<EnhancedBadge variant="success" icon={<Sparkles className="h-3 w-3" />}>
						Success
					</EnhancedBadge>
					<EnhancedBadge variant="destructive">Destructive</EnhancedBadge>
					<EnhancedBadge variant="warning">Warning</EnhancedBadge>
					<EnhancedBadge variant="info">Info</EnhancedBadge>
					<EnhancedBadge variant="outline">Outline</EnhancedBadge>
					<EnhancedBadge variant="gradient">Gradient</EnhancedBadge>
					<EnhancedBadge variant="success" size="lg" dismissible onDismiss={() => alert("Dismissed!")}>
						Dismissible
					</EnhancedBadge>
				</div>
			</section>

			{/* Alerts Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Alerts</h2>
				<div className="space-y-4">
					<Alert variant="default">
						<AlertTitle>Default Alert</AlertTitle>
						<AlertDescription>
							This is a default alert with hover effects and animations.
						</AlertDescription>
					</Alert>

					<Alert variant="success">
						<AlertTitle>Success!</AlertTitle>
						<AlertDescription>Your operation completed successfully.</AlertDescription>
					</Alert>

					<Alert variant="error">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>Something went wrong. Please try again.</AlertDescription>
					</Alert>

					<Alert variant="warning">
						<AlertTitle>Warning</AlertTitle>
						<AlertDescription>Please review your changes before proceeding.</AlertDescription>
					</Alert>

					<Alert variant="info">
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>Here's some helpful information for you.</AlertDescription>
					</Alert>
				</div>
			</section>

			{/* Inputs Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Enhanced Inputs</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm">Default Input</label>
						<EnhancedInput placeholder="Enter text..." />
					</div>

					<div>
						<label className="mb-2 block text-sm">Search Input</label>
						<EnhancedInput
							variant="search"
							placeholder="Search..."
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							clearable
							onClear={() => setSearchValue("")}
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm">Password Input</label>
						<EnhancedInput
							variant="password"
							placeholder="Enter password..."
							value={passwordValue}
							onChange={(e) => setPasswordValue(e.target.value)}
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm">Input with Error</label>
						<EnhancedInput placeholder="Invalid input" error="This field is required" />
					</div>
				</div>
			</section>

			{/* Accordion Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Accordion</h2>
				<Accordion type="single" collapsible className="w-full rounded-lg border p-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>What is HextaUI?</AccordionTrigger>
						<AccordionContent>
							HextaUI is an extended component library built on top of Shadcn UI, providing enhanced
							components with modern animations, better styling, and improved user experience.
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-2">
						<AccordionTrigger>What are the benefits?</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc space-y-1 pl-4">
								<li>Enhanced styling and animations</li>
								<li>Better out-of-box appearance</li>
								<li>Additional components like Accordion, Alert, etc.</li>
								<li>Same Radix UI foundation</li>
								<li>Full theme compatibility</li>
							</ul>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-3">
						<AccordionTrigger>How do I use it?</AccordionTrigger>
						<AccordionContent>
							Simply import components from <code className="rounded bg-muted px-1">@hexta</code> and use
							them in your React components. All components are fully typed with TypeScript.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			{/* Modal Section */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Modal</h2>
				<Modal>
					<ModalTrigger>
						<AnimatedButton variant="gradient">Open Modal</AnimatedButton>
					</ModalTrigger>
					<ModalContent className="sm:max-w-[525px]">
						<ModalHeader>
							<ModalTitle>Welcome to HextaUI</ModalTitle>
							<ModalDescription>
								This is an enhanced modal component with smooth animations and backdrop blur effects.
							</ModalDescription>
						</ModalHeader>
						<div className="grid gap-4 py-4">
							<Alert variant="success">
								<AlertTitle>Great Choice!</AlertTitle>
								<AlertDescription>
									You're using modern, beautifully designed components.
								</AlertDescription>
							</Alert>
							<div className="grid gap-2">
								<EnhancedInput placeholder="Enter your name..." />
								<EnhancedInput variant="search" placeholder="Search features..." />
							</div>
						</div>
						<ModalFooter>
							<ModalClose>
								<AnimatedButton variant="outline">Cancel</AnimatedButton>
							</ModalClose>
							<AnimatedButton variant="gradient">Save Changes</AnimatedButton>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</section>

			{/* Features Grid */}
			<section className="space-y-4">
				<h2 className="border-b pb-2 font-semibold text-2xl">Component Features</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-2 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-lg">
						<Zap className="h-8 w-8 text-primary" />
						<h3 className="font-semibold">Fast</h3>
						<p className="text-muted-foreground text-sm">
							Optimized components with smooth animations
						</p>
					</div>

					<div className="space-y-2 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-lg">
						<Shield className="h-8 w-8 text-primary" />
						<h3 className="font-semibold">Type Safe</h3>
						<p className="text-muted-foreground text-sm">Full TypeScript support with proper types</p>
					</div>

					<div className="space-y-2 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-lg">
						<Sparkles className="h-8 w-8 text-primary" />
						<h3 className="font-semibold">Beautiful</h3>
						<p className="text-muted-foreground text-sm">Modern design with attention to detail</p>
					</div>

					<div className="space-y-2 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-lg">
						<Rocket className="h-8 w-8 text-primary" />
						<h3 className="font-semibold">Ready</h3>
						<p className="text-muted-foreground text-sm">Production-ready, tested components</p>
					</div>
				</div>
			</section>
		</div>
	)
}
