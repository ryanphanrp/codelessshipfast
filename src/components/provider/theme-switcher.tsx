"use client"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Icons } from "../icons"

interface ThemeSwitcherProps {
	className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className={cn("h-8 w-8 px-0", className)}>
					<Icons.sun className="dark:-rotate-90 h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
					<Icons.moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem 
					className="cursor-pointer" 
					onClick={() => setTheme("light")}
				>
					<Icons.sun className="mr-2 h-4 w-4" />
					<span>Light</span>
					{theme === "light" && <Icons.check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem 
					className="cursor-pointer" 
					onClick={() => setTheme("dark")}
				>
					<Icons.moon className="mr-2 h-4 w-4" />
					<span>Dark</span>
					{theme === "dark" && <Icons.check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem 
					className="cursor-pointer" 
					onClick={() => setTheme("system")}
				>
					<Icons.laptop className="mr-2 h-4 w-4" />
					<span>System</span>
					{theme === "system" && <Icons.check className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}