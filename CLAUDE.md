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

# Add Shadcn UI components
bun run ui:add

# Update dependencies
bun run up:lib

# Clean project
bun run clean
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **UI**: Shadcn UI components + Tailwind CSS + Lucide icons
- **Styling**: Tailwind CSS with CSS variables for theming
- **Code Quality**: Biome for linting/formatting
- **AI Integration**: Multiple AI SDKs (Anthropic, Groq, DeepSeek)

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # App group with dashboard, settings
│   ├── features/          # Feature pages (protobuf, sql-placeholder)
│   └── layout.tsx         # Root layout with metadata
├── components/
│   ├── layout/            # Layout-specific components
│   │   ├── dashboard/     # Dashboard layout
│   │   ├── homepage/      # Landing page layout
│   │   ├── record-protobuf/  # Protobuf conversion feature
│   │   ├── sql-placeholder/  # SQL formatting feature
│   │   ├── sidebar/       # App sidebar
│   │   └── brand/         # Branding components
│   ├── provider/          # Theme and design system providers
│   └── ui/                # Shadcn UI components
├── config/                # App configuration
│   ├── site.ts           # Site metadata and links
│   └── fonts.ts          # Font configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (utils.ts with cn helper)
└── styles/               # Global styles and themes
```

### Key Features
- **Record Protobuf**: Protobuf to JSON conversion tool with validation
- **SQL Placeholder**: SQL formatting and placeholder utilities  
- **Dashboard**: Main application interface
- **Theme System**: Dark/light mode with CSS variables

### Component Architecture
- Uses functional components with TypeScript interfaces
- Follows Shadcn UI composition patterns
- Components are organized by feature/layout
- Custom hooks for complex logic (protobuf converter, SQL formatter)

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
- Use React Server Components (RSC) by default
- Add `'use client'` only when necessary
- Follow kebab-case for file names, PascalCase for components
- Implement proper error handling and loading states
- Use proper form validation with React Hook Form + Zod