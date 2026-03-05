# Easing Wizard - Improvement Roadmap

## High Impact / Growth

### 1. Discoverability & SEO
- [ ] Add GitHub repo description
- [ ] Add topics: `css`, `easing`, `animation`, `bezier`, `tailwind`, `mcp`
- [ ] Add FAQ section mentioning API and MCP (from original Todos)
- [ ] Add landing section explaining "what is `linear()`" to capture search traffic

### 2. Testing
- [ ] Unit tests for core easing math (Spring settle time, Bounce heuristics, CRC validation)
- [ ] API integration tests for all `/v1/` endpoints
- [ ] E2E tests for frontend interactions

### 3. CI/CD Pipeline
- [ ] GitHub Actions workflow: `tsc --noEmit` + `turbo build` on PRs
- [ ] Gate deployments on passing tests + type-checks

---

## UX Improvements

### 4. Surface Suggested Duration in the UI
- [ ] Show "Recommended: 350-550ms" next to duration slider for physics-based curves (Spring, Bounce, Wiggle, Overshoot)
- [x] `suggested_duration_ms` already exists in API/MCP - just needs frontend integration

### 5. Touch Handling
- [ ] Fix Bezier curve breaking on touch devices (from original Todos)

### 6. Accessibility
- [ ] Keyboard navigation for the curve editor
- [ ] ARIA labels on interactive controls

---

## Developer Experience / API

### 8. Rate Limiting & CORS
- [ ] Add rate limiting to API
- [ ] Add explicit CORS configuration

### 9. MCP Resources
- [ ] Add MCP resources (e.g. `easing://presets/spring`) for browsable preset lists in agentic workflows

---

## Code Quality

### 11. Component Size
- [ ] Break up `EasingSelection.tsx` into smaller composable components

### 12. ESLint
- [ ] Add ESLint with TypeScript plugin alongside Prettier

