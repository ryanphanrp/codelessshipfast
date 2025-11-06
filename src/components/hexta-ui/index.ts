// ===== Original HextaUI-inspired Marketing Components =====
export { AnimatedButton } from "./animated-button"
export { HeroSection } from "./hero-section"
export { FeatureCard } from "./feature-card"

// ===== HextaUI Enhanced Components (First Batch) =====
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
export { Alert, AlertDescription, AlertTitle } from "./alert"
export {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalPortal,
	ModalTitle,
	ModalTrigger
} from "./modal"
export { EnhancedInput } from "./enhanced-input"
export { EnhancedBadge } from "./enhanced-badge"

// ===== Complete HextaUI Component Replacement =====
// Core Components
export { Button, buttonVariants, type ButtonProps } from "./button"
export { Avatar, AvatarFallback, AvatarImage } from "./avatar"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

// Form Components
export { Checkbox } from "./checkbox"
export { Switch } from "./switch"
export { Label } from "./label"
export { Input, type InputProps } from "./input"
export { Textarea, type TextareaProps } from "./textarea"
export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue
} from "./select"

// Layout Components
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
export { Separator } from "./separator"
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger
} from "./dialog"
export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "./dropdown-menu"
export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetPortal,
	SheetTitle,
	SheetTrigger
} from "./sheet"
export { Badge, badgeVariants, type BadgeProps } from "./badge"
export { ScrollArea, ScrollBar } from "./scroll-area"

// Feedback Components
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
export { Progress } from "./progress"
export { Slider } from "./slider"
export { Skeleton } from "./skeleton"

// Additional Layout Components
export {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger
} from "./popover"
export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from "./command"
export {
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "./carousel"

// Form Components
export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField
} from "./form"

// Toast Components
export {
	Toast,
	ToastAction,
	type ToastActionElement,
	ToastClose,
	ToastDescription,
	ToastProvider,
	type ToastProps,
	ToastTitle,
	ToastViewport
} from "./toast"
export { Toaster } from "./toaster"

// Custom Components
export { default as FunctionTextarea } from "./function-textarea"

// Re-export commonly used types
export type { VariantProps } from "class-variance-authority"
