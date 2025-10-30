# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: Always use `bun` instead of npm, yarn, or pnpm.

```bash
# Start development server with Turbopack
bun run dev

# Build for production  
bun run build

# Start production server on port 9999
bun run start

# Type checking
bun run check:types

# Linting and formatting
bun run lint              # Check linting issues
bun run lint:fix          # Auto-fix linting issues
bun run format            # Format code with Biome
bun run format:check      # Format and check with Biome

# Testing (Vitest)
bun run test              # Run tests in watch mode
bun run test:ui           # Run tests with UI
bun run test:run          # Run tests once
bun run test:coverage     # Run tests with coverage report

# Add Shadcn UI components
bun run ui:add

# Update dependencies
bun run up:lib

# Clean project
bun run clean
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.5 with App Router and Turbopack
- **Language**: TypeScript 5.8 with strict mode
- **Runtime**: React 19.1
- **UI**: Shadcn UI components + Tailwind CSS 4.1 + Lucide icons
- **Styling**: Tailwind CSS with CSS variables for theming
- **Code Quality**: Biome for linting/formatting
- **Testing**: Vitest + React Testing Library + jsdom
- **Git Hooks**: Husky + Commitlint (conventional commits)
- **AI Integration**: Multiple AI SDKs (Anthropic, Groq, DeepSeek, Vercel AI SDK)

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                   # App group with dashboard, settings
│   │   ├── dashboard/           # Main dashboard page
│   │   └── settings/            # Settings page
│   ├── features/                # Feature pages
│   │   ├── json-viewer/         # JSON viewer and formatter
│   │   ├── properties-converter/  # Properties file converter
│   │   ├── record-protobuf/     # Protobuf to JSON conversion
│   │   └── sql-placeholder/     # SQL formatting and placeholders
│   └── layout.tsx               # Root layout with metadata
├── components/
│   ├── layout/                  # Layout-specific components
│   │   ├── dashboard/           # Dashboard layout components
│   │   ├── homepage/            # Landing page layout
│   │   ├── json-viewer/         # JSON viewer feature components
│   │   ├── properties-converter/  # Properties converter components
│   │   ├── record-protobuf/     # Protobuf conversion components
│   │   ├── sql-placeholder/     # SQL formatting components
│   │   ├── sidebar/             # App sidebar navigation
│   │   └── brand/               # Branding components
│   ├── provider/                # Theme and design system providers
│   └── ui/                      # Shadcn UI components
├── config/                      # App configuration
│   ├── site.ts                 # Site metadata and links
│   └── fonts.ts                # Font configuration
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities and helpers
│   ├── shared/                  # Shared utilities
│   │   ├── clipboard.ts         # Clipboard operations
│   │   ├── errors.ts            # Error handling utilities
│   │   ├── file-operations.ts   # File I/O operations
│   │   ├── formatting.ts        # Text formatting utilities (with tests)
│   │   └── validation.ts        # Validation utilities (with tests)
│   ├── logger.ts                # Logging utility
│   └── utils.ts                 # General utilities (cn helper)
├── styles/                      # Global styles and themes
├── test/                        # Test utilities and setup
└── types/                       # TypeScript type definitions
```

### Key Features
- **JSON Viewer**: Interactive JSON viewer and formatter with syntax highlighting
- **Properties Converter**: Tool for converting between different properties file formats
- **Record Protobuf**: Protobuf to JSON conversion tool with validation
- **SQL Placeholder**: SQL formatting and placeholder utilities
- **Dashboard**: Main application interface with feature navigation
- **Theme System**: Dark/light mode with CSS variables and next-themes

### Component Architecture
- Uses functional components with TypeScript interfaces
- Follows Shadcn UI composition patterns
- Components are organized by feature/layout
- Custom hooks for complex logic (protobuf converter, SQL formatter, JSON viewer)
- Shared utilities for common operations (clipboard, file I/O, validation, formatting)
- Unit tests colocated with utilities (Vitest)

### Styling Approach
- **Tailwind CSS**: Utility-first with mobile-first responsive design
- **Design System**: Centralized theme provider with CSS variables
- **Component Library**: Shadcn UI with customizable variants
- **Code Organization**: Biome formatting with tab indentation, 100-char line width

### TypeScript Configuration
- Path aliases: `@/*` for src, `@shadui/*` for UI components
- Strict mode enabled
- Proper interface definitions over types
- Named exports preferred

### Development Guidelines

**Code Organization**
- Use React Server Components (RSC) by default
- Add `'use client'` only when necessary (interactivity, hooks, browser APIs)
- Follow kebab-case for file names, PascalCase for components
- Implement proper error handling and loading states
- Use proper form validation with React Hook Form + Zod

**Testing**
- Write unit tests for utilities and business logic
- Colocate tests with source files (e.g., `validation.test.ts` next to `validation.ts`)
- Use Vitest for testing with React Testing Library for component tests
- Run tests before committing (enforced by git hooks)

**Git Workflow**
- Commits follow conventional commit format (enforced by commitlint)
- Husky runs pre-commit hooks for linting and testing
- Use descriptive commit messages (feat:, fix:, docs:, refactor:, etc.)

**Shared Utilities**
- Use utilities from `@/lib/shared` for common operations:
  - `clipboard.ts`: Copy/paste operations
  - `errors.ts`: Error handling and formatting
  - `file-operations.ts`: File reading/writing
  - `formatting.ts`: Text formatting and transformation
  - `validation.ts`: Input validation and sanitization