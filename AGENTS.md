# Repository Guidelines

## Project Structure & Module Organization
- **Structured Organization**: Maintain organized file structure:
  - Components grouped by functionality in logical subdirectories
  - Images organized by category (branding/, images/, icons/, etc.)
  - Assets properly separated between `src/assets/` (processed) and `public/` (static)
  - Clear naming conventions for all files and directories
- `src/pages/`: Route files (`.astro`) — `index.astro`, `contacto.astro`, `proyectos/index.astro`, `proyectos/[slug].astro`.
- `src/components/nocturne/`: Section components (PascalCase) used to compose the pages — `Hero`, `Servicios`, `Casos`, `Nosotros`, `Testimonios`, `Contacto`.
- `src/layouts/`: `BaseLayout.astro`, the single layout used by every page.
- `src/content/`: Content collections — `proyectos/` (MDX case studies), schema in `config.ts`.
- `src/styles/`: `nocturne.css`, the design system (tokens + reusable classes).
- `src/assets/` and `public/`: Images and static files. Use `src/assets` for processed assets; `public` serves files as‑is.
- `docs/`: How‑to guides and development docs (Spanish).
- Config and deployment: `astro.config.mjs`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `Dockerfile`, `nginx.conf.template`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Astro, default at http://localhost:4321).
- `npm run build`: Build production site into `dist/`.
- `npm run preview`: Serve the built `dist/` locally for validation.
- Docker (optional): `docker build -t sgsite . && docker run -p 8080:80 sgsite`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep lines focused and readable.
- Components: PascalCase in `src/components/nocturne/` (e.g., `Servicios.astro`).
- Pages/routes: kebab-case in `src/pages` (e.g., `contacto.astro`).
- Assets: lowercase-hyphen names; avoid spaces. Prefer `src/assets/` for imports; put public URLs in `public/`.
- Styling: Tailwind utility-first for layout/spacing; use the Nocturne classes (`.kick`, `.btn-t`, `.btn-o`, `.sec`, `.phead`, `.factbar`, `.prose-n`, etc., defined in `src/styles/nocturne.css`) for design-system-specific styling.

## Testing Guidelines
- No test suite is configured yet. Recommended: unit tests with Vitest + Testing Library; E2E with Playwright.
- Suggested naming: `*.test.ts` next to source or under `tests/`.
- Aim for critical-path coverage (navigation, project gallery modal, contact form) before PRs that change UI behavior.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (Spanish-friendly): `feat:`, `fix:`, `docs:`, `chore:` + breve descripción.
- PRs: concise description, linked issue, screenshots/GIFs for UI changes, and deployment notes (CSP, Dokploy) when relevant.
- Keep branches focused (e.g., `feature/proyectos-filtro`).

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
  - Keep the site static and mostly zero-JS; avoid client-side hydration unless truly needed
  - Implement proper static site generation (SSG) strategies
  - Use Astro's built-in image optimization
  - Follow Astro's performance recommendations
- **SEO Excellence**: Apply comprehensive SEO best practices:
  - Semantic HTML structure with proper heading hierarchy
  - Meta tags optimization (title, description)
  - Image optimization with descriptive alt attributes and filenames
  - URL structure optimization with meaningful slugs
  - Site performance optimization (Core Web Vitals)
  - Sitemap generated automatically via `@astrojs/sitemap`

## Security & Configuration Tips
- CSP: defined in `nginx.conf.template`; if adding external fonts/scripts/CDNs, update it consistently and prefer local assets when possible.
- `nginx.conf.template` is rendered with `envsubst` at container start — never reference an environment variable there without confirming Dokploy defines it (see `docs/despliegue-dokploy.md` for the `${PORT}` incident that broke a deploy this way).
- Secrets/config: set via Dokploy environment variables; do not commit secrets.
- Images: optimize before committing; place large media in `public/` and reference by path.

## Deployment
- The site deploys to **Dokploy** (server `balerion`, app `LandingPage`, Swarm service `sgsolucionescom-landingpage-ugsoai`) via the multi-stage `Dockerfile`. See `docs/despliegue-dokploy.md` for the full process, manual deploy commands, and pre-update image verification.
