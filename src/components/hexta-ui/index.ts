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

// Feedback Components
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
export { Progress } from "./progress"
export { Slider } from "./slider"
export { Skeleton } from "./skeleton"

// Re-export commonly used types
export type { VariantProps } from "class-variance-authority"
