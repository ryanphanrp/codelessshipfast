# Code Style & Conventions for CodelessShipFast

## General Principles
- **Package Manager**: Always use `bun` instead of npm/yarn/pnpm
- **Framework Respect**: Follow existing patterns and conventions
- **Consistency**: Maintain consistent style across the codebase

## TypeScript Configuration
- **Strict Mode**: Enabled with no compromises
- **Path Aliases**: `@/*` for src, `@shadui/*` for UI components
- **Interface over Types**: Prefer interfaces for object shapes
- **Named Exports**: Use named exports over default exports

## File & Naming Conventions
- **File Names**: kebab-case for all files (e.g., `json-viewer.tsx`)
- **Component Names**: PascalCase (e.g., `JsonViewer`)
- **Directory Structure**: Feature-based organization
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase
- **Functions**: camelCase, descriptive names

## Code Style (Biome Configuration)
- **Indentation**: Tabs (not spaces)
- **Line Width**: 100 characters
- **Semicolons**: As needed (Biome rule)
- **Quotes**: Double quotes for strings
- **Trailing Commas**: None
- **Arrow Parentheses**: Always `() => {}`
- **Bracket Same Line**: Enabled

## React & Component Patterns
- **Server Components**: Use RSC by default, add `'use client'` only when necessary
- **Component Structure**: Functional components with TypeScript interfaces
- **Props**: Define interfaces for component props
- **State**: Use React hooks, prefer `useState` for local state
- **Styling**: Tailwind CSS with CSS variables for theming

## Import Organization
- **Order**: React hooks → Third-party → Internal components → Utils → Types
- **Path Resolution**: Use absolute imports with `@/` prefix
- **UI Components**: Import from `@/components/ui` or `@shadui/*`

## Testing Patterns
- **Files**: `*.test.ts` or `*.spec.ts` alongside source files
- **Framework**: Vitest with React Testing Library
- **Coverage**: Aim for meaningful coverage of utility functions
- **Test Utils**: Use provided test utilities in `src/test/test-utils.tsx`

## Form Handling
- **Library**: React Hook Form + Zod for validation
- **Components**: Use Shadcn UI form components
- **Validation**: Zod schemas for type-safe validation

## Error Handling & Loading
- **Error Boundaries**: Implement for route-level error handling
- **Loading States**: Use React Suspense and loading.tsx files
- **Toast Notifications**: Use Sonner for user feedback

## CSS & Styling
- **Utility-First**: Tailwind CSS classes primarily
- **Components**: Shadcn UI with customizable variants
- **Theme**: CSS variables for consistent theming
- **Responsive**: Mobile-first approach