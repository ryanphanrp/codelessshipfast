# Development Commands for CodelessShipFast

## Essential Commands (Always Use Bun)

### Development
```bash
# Start development server with Turbopack (fast refresh)
bun run dev

# Start production server on port 9999
bun run start

# Build for production
bun run build
```

### Code Quality & Testing
```bash
# Type checking with Turbo
bun run check:types

# Linting (Biome)
bun run lint              # Check linting issues
bun run lint:fix          # Auto-fix linting issues

# Formatting (Biome)
bun run format            # Format code with Biome
bun run format:check      # Format and check with Biome

# Testing (Vitest)
bun run test              # Run tests in watch mode
bun run test:run          # Run tests once
bun run test:ui           # Run tests with UI interface
bun run test:coverage     # Run tests with coverage report
```

### Dependencies & UI
```bash
# Add Shadcn UI components
bun run ui:add

# Update dependencies
bun run up:lib

# Clean project
bun run clean
```

## Quality Gates Before Task Completion
1. **Type Safety**: Run `bun run check:types`
2. **Linting**: Run `bun run lint`
3. **Testing**: Run `bun run test:run` (if applicable)
4. **Formatting**: Run `bun run format:check`

## Git Workflow
```bash
# Git hooks are configured for commit validation
# Uses conventional commits enforced by Commitlint
# Prepare script automatically sets up hooks: bun run prepare
```