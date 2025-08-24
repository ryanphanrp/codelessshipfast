# Qwen Code Context for `codelessshipfast`

## Project Overview

This is a Next.js 15 application bootstrapped with `create-next-app`. It uses TypeScript, Tailwind CSS, and shadcn/ui components. The project is configured to use Bun as the preferred package manager. Key features include:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui
- **Package Manager**: Bun
- **Code Quality**: Biome.js for linting and formatting
- **Deployment**: Configured for Vercel deployment

## Key Configurations

- **Alias**: `@/*` maps to `./src/*`
- **UI Alias**: `@shadui/*` maps to `./src/components/ui/*`
- **Font Optimization**: Uses `next/font` for automatic font optimization.
- **Git Hooks**: Husky is configured for git hooks.

## Building and Running

### Development

To start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

To build the application for production:

```bash
bun run build
```

To start the production server:

```bash
bun start
```

### Code Quality

- **Linting**: `bun run lint`
- **Fix Lint Issues**: `bun run lint:fix`
- **Formatting**: `bun run format`
- **Type Checking**: `bun run check:types`

## Development Conventions

- **Component Structure**: Components are located in `src/components`. UI components from shadcn/ui are in `src/components/ui`.
- **Layouts**: Layout components are in `src/components/layout`.
- **Pages**: Pages are defined in `src/app`.
- **Styling**: Uses Tailwind CSS with `clsx` and `tailwind-merge` for conditional styling.
- **Code Style**: Enforced by Biome.js. Configuration is in `biome.json`.