# CodelessShipFast - Project Overview

## Project Purpose
CodelessShipFast is a Next.js 15 application featuring developer tools and utilities. It provides a comprehensive suite of web-based tools for developers including:

- **JSON Viewer**: Advanced JSON visualization, validation, and manipulation tools
- **Properties Converter**: Convert between different configuration formats (YAML, JSON, ENV)
- **Record Protobuf**: Protobuf to JSON conversion tool with validation
- **SQL Placeholder**: SQL formatting and placeholder utilities

## Tech Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript with strict mode
- **Package Manager**: Bun (primary) with npm compatibility
- **UI Framework**: Shadcn UI components + Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Testing**: Vitest with React Testing Library
- **Code Quality**: Biome for linting/formatting, Commitlint for conventional commits
- **Build Tools**: Turbopack for development, Next.js compiler for production

## Code Architecture
- **Component Organization**: Feature-based layout with shared UI components
- **State Management**: React hooks and context for complex state
- **File Structure**: Organized by feature domains with dedicated types, utils, hooks
- **Design System**: Centralized theme provider with CSS variables
- **Server Components**: Uses React Server Components (RSC) by default

## Development Workflow
- Strict TypeScript configuration with path aliases
- Biome formatting with tab indentation, 100-character line width
- Comprehensive testing setup with coverage reporting
- Git hooks for commit message validation
- Conventional commit messages enforced