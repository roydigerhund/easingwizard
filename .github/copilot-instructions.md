# Easing Wizard - Development Guidelines

## Package Manager
- **Always use `pnpm` instead of `npm`**
- Run `pnpm install` for dependencies
- Use `pnpm add` for adding packages
- Use `pnpm remove` for removing packages

## Project Structure
This is a monorepo with the following structure:
- [`apps/frontend/`](apps/frontend/) - React Router frontend application
- [`apps/api/`](apps/api/) - Hono backend API
- [`packages/core/`](packages/core/) - Shared core library

### Import Guidelines
- Use workspace dependencies with `workspace:*` for internal packages
- Frontend uses absolute imports where configured
- Core package exports shared utilities and types

## Development Commands
Run from root directory:
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm typecheck` - Type check all projects

Per-app commands:
- Frontend: `pnpm --filter frontend dev|build|typecheck`
- API: `pnpm --filter api dev|build|typecheck`
- Core: `pnpm --filter core build|typecheck`

## Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Keep functions focused and small
- Use [Prettier](apps/api/.prettierrc) for code formatting with [`prettier-plugin-organize-imports`](pnpm-lock.yaml)

## Frontend Development (React Router)
- Built with [React Router v7](apps/frontend/package.json) and [React 19](apps/frontend/package.json)
- Uses [Tailwind CSS v4](apps/frontend/package.json) for styling
- Components from [@headlessui/react](apps/frontend/package.json) and [@radix-ui](apps/frontend/package.json)
- State management with [Zustand](apps/frontend/package.json)
- Validation with [Zod](apps/frontend/package.json)

## API Development (Hono)
- Built with [Hono](packages/core/) framework
- Uses [Zod](packages/core/) for validation
- Node.js server with [@hono/node-server](pnpm-lock.yaml)
- Environment variables managed with [dotenv](pnpm-lock.yaml)

## Deployment
- Frontend configured for [Vercel deployment](apps/frontend/README.md)
- Uses [@vercel/react-router](apps/frontend/package.json) adapter
- Build outputs to `build/` directory

## Generated Files & Scripts
- Update generation scripts as needed for the new structure
- Ensure OpenAPI specs are generated correctly
- Pre-calculate data using generation scripts in core package

## Workspace Configuration
- Managed by [pnpm workspace](pnpm-workspace.yaml)
- Build orchestration with [Turbo](turbo.json)
- Shared dependencies hoisted to root when possible