# Repository Guidelines

## Project Structure & Module Organization
- **Structured Organization**: Maintain organized file structure:
  - Components grouped by functionality in logical subdirectories
  - Images organized by category (branding/, projects/, ui/, etc.)
  - Assets properly separated between `src/assets/` (processed) and `public/` (static)
  - Clear naming conventions for all files and directories
- `src/pages/`: Route files (`.astro`) for each page.
- `src/components/` and `src/layouts/`: Reusable UI and layout components (PascalCase).
- `src/assets/` and `public/`: Images and static files. Use `src/assets` for processed assets; `public` serves files as‑is.
- `docs/`: How‑to guides and development docs (Spanish).
- Config and deployment: `astro.config.mjs`, `tailwind.config.*`, `postcss.config.js`, `tsconfig.json`, `Dockerfile`, `.caprover`, `captain-definition`, `nginx.conf.template`, `deploy-caprover.sh`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Astro, default at http://localhost:4321).
- `npm run build`: Build production site into `dist/`.
- `npm run preview`: Serve the built `dist/` locally for validation.
- Docker (optional): `docker build -t sgsite . && docker run -p 8080:80 sgsite`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep lines focused and readable.
- Components: PascalCase in `src/components` (e.g., `HeroSection.astro`).
- Pages/routes: kebab-case in `src/pages` (e.g., `casos-exito.astro`).
- Assets: lowercase-hyphen names; avoid spaces. Prefer `src/assets/` for imports; put public URLs in `public/`.
- Styling: Tailwind utility-first; place global rules in `src/styles/global.css`.

## Testing Guidelines
- No test suite is configured yet. Recommended: unit tests with Vitest + Testing Library; E2E with Playwright.
- Suggested naming: `*.test.ts` next to source or under `tests/`.
- Aim for critical-path coverage (navigation, modals, forms) before PRs that change UI behavior.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (Spanish-friendly): `feat:`, `fix:`, `docs:`, `chore:` + breve descripción.
- PRs: concise description, linked issue, screenshots/GIFs for UI changes, and deployment notes (CSP/CDN, CapRover) when relevant.
- Keep branches focused (e.g., `feature/caprover-optimization`).

## Rule Management & Code Quality
- **CRITICAL**: When adding new project rules, update ALL AI assistant rule files:
  - `CLAUDE.md` (Claude Code)
  - `GEMINI.md` (Gemini) 
  - `AGENTS.md` (GitHub Copilot/Cursor)
  - `.trae/rules/project_rules.md` (Trae)
- **Documentation**: Document all new functionality in `docs/` folder.
- **Code Quality**: Keep code clean, clear, and simple with short Spanish comments for developers.

## Astro Best Practices & SEO Excellence
- **Astro Framework**: Always follow Astro best practices and optimizations:
  - Use component islands architecture effectively
  - Optimize bundle sizes with selective hydration
  - Implement proper static site generation (SSG) strategies
  - Use Astro's built-in image optimization
  - Follow Astro's performance recommendations
- **SEO Excellence**: Apply comprehensive SEO best practices:
  - Semantic HTML structure with proper heading hierarchy
  - Meta tags optimization (title, description, keywords, Open Graph, Twitter Cards)
  - Structured data implementation when applicable
  - Image optimization with descriptive alt attributes and filenames
  - URL structure optimization with meaningful slugs
  - Site performance optimization (Core Web Vitals)

## Security & Configuration Tips
- CSP: if adding external fonts/icons/CDNs, update CSP consistently (see recent Font Awesome CSP fixes) and prefer local assets when possible.
- Secrets/config: set via CapRover environment variables; do not commit secrets.
- Images: optimize before committing; place large media in `public/` and reference by path.
