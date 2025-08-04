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
- `pnpm generate` - Generate preset data and linear easings
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all build outputs

Per-app commands (use exact package names):

- Frontend: `pnpm --filter easingwizard-frontend dev|build|typecheck`
- API: `pnpm --filter easingwizard-api dev|build|typecheck`
- Core: `pnpm --filter easingwizard-core build|typecheck|generate`

Alternative shorthand commands:

- `pnpm dev:frontend` / `pnpm dev:api` - Start individual apps
- `pnpm build:frontend` / `pnpm build:api` / `pnpm build:core` - Build individual packages

## Code Style

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Keep functions focused and small
- Use Prettier for code formatting with plugins:
  - `prettier-plugin-organize-imports` (all packages)
  - `prettier-plugin-tailwindcss` (frontend only)
- Prettier config in root `.prettierrc` and per-app overrides

## Frontend Development (React Router)

- Built with React Router v7 and React 19
- Uses Tailwind CSS v4 for styling
- Components from @headlessui/react and @radix-ui packages
- State management with Zustand
- Validation with Zod v4

## API Development (Hono)

- Built with Hono framework v4.8+
- Uses Zod v4 for validation and OpenAPI generation with zod-openapi
- Node.js server with @hono/node-server
- Environment variables managed with dotenv
- OpenAPI documentation with @scalar/hono-api-reference
- TypeScript compilation with tsc and tsc-alias for path mapping
- API follows RESTful conventions with HATEOAS links
- Relative URLs for internal API resources, absolute for external links

## Deployment

- Frontend configured for Vercel deployment
- Uses @react-router/node adapter
- Build outputs to `build/` directory

## Generated Files & Scripts

- Update generation scripts as needed for the new structure
- Ensure OpenAPI specs are generated correctly
- Pre-calculate data using generation scripts in core package
- `easings.yml` contains predefined easing curves with CSS and math definitions
- Generated files are in `packages/core/src/generated/` (linear-easings.ts, preset-data.ts)

## Environment & Requirements

- Node.js >= 22 (specified in package.json engines)
- pnpm 10.0.0+ for package management
- TypeScript 5.8+ for type checking

## Workspace Configuration

- Managed by pnpm workspace
- Build orchestration with Turbo
- Shared dependencies hoisted to root when possible
