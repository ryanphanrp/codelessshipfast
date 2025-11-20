// ===== REAL HextaUI Components =====
// All components copied from https://github.com/preetsuthar17/HextaUI

// Core Components
export { Button, buttonVariants } from "./button"
export { ButtonGroup } from "./button-group"
export { Avatar, AvatarFallback, AvatarImage } from "./avatar"
export { Badge, badgeVariants } from "./badge"
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

// Layout Components
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
export { Alert, AlertDescription, AlertTitle } from "./alert"
export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger
} from "./alert-dialog"
export { AspectRatio } from "./aspect-ratio"
export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb"
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
export { Separator } from "./separator"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

// Dialog & Modal Components
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
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger
} from "./drawer"
export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "./sheet"

// Menu Components
export {
	CommandMenu,
	CommandMenuClose,
	CommandMenuContent,
	CommandMenuDescription,
	CommandMenuEmpty,
	CommandMenuGroup,
	CommandMenuInput,
	CommandMenuItem,
	CommandMenuList,
	CommandMenuSeparator,
	CommandMenuTitle,
	CommandMenuTrigger,
	useCommandMenu
} from "./command-menu"
export {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger
} from "./context-menu"
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
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarPortal,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger
} from "./menubar"
export {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle
} from "./navigation-menu"

// Form Components
export { Checkbox } from "./checkbox"
export { Field, FieldDescription, FieldError, FieldLabel } from "./field"
export { Input } from "./input"
export { InputGroup, InputGroupText } from "./input-group"
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp"
export { Label } from "./label"
export { NativeSelect } from "./native-select"
export { RadioGroup, RadioGroupItem } from "./radio-group"
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
export { Switch } from "./switch"
export { Textarea } from "./textarea"
export { TextareaWithActions } from "./textarea-with-actions"

// Feedback Components
export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty"
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
export {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger
} from "./popover"
export { Progress } from "./progress"
export { Skeleton } from "./skeleton"
export { Spinner } from "./spinner"
export { Toaster } from "./sonner"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

// Data Display Components
export { Calendar } from "./calendar"
export {
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "./carousel"
export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from "./item"
export { Kbd } from "./kbd"
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
export { ScrollArea, ScrollBar } from "./scroll-area"
export { Slider } from "./slider"
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
export { Tree, TreeItem, TreeProvider, treeItemVariants, treeVariants } from "./tree"
export { VideoPlayer } from "./video-player"

// Sidebar Components
export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar
} from "./sidebar"

// Utility Components
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable"
export { Toggle, toggleVariants } from "./toggle"
export { ToggleGroup, ToggleGroupItem } from "./toggle-group"

// Re-export commonly used types
export type { VariantProps } from "class-variance-authority"
