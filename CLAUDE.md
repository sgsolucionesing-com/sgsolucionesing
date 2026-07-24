# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

S&G Soluciones de Ingeniería website - landing page for an industrial automation and software development company located in the northern coast of Colombia. The company is young with a highly qualified team, specializing in industrial automation solutions, industrial processes, Industry 4.0 IoT projects, and software development.

## Development Commands

- `npm run dev` - Start development server on localhost:4321
- `npm run build` - Build for production in ./dist/
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands
- Docker: `docker build -t sgsite . && docker run -p 8080:80 sgsite`

## Architecture & Technology Stack

### Core Technologies
- **Astro 5.x** - Static site generator (SSG), no server-side rendering
- **Tailwind CSS 3.x** (`@astrojs/tailwind`) - Utility-first CSS framework
- **astro-icon** - Icon support using Iconify (`@iconify-json/mdi`)
- **@astrojs/mdx** - MDX support for project content
- **@astrojs/sitemap** - Sitemap generation
- **TypeScript** - Type safety (extends astro/tsconfigs/strict)
- **Zod** - Content collection schema validation

### Project Structure
```
src/
├── pages/          # Route files (.astro) - kebab-case naming
├── components/     # Reusable UI components - PascalCase naming
│   └── nocturne/   # Section components for the "Nocturne" design system
├── layouts/         # Page templates (BaseLayout.astro is the only layout)
├── content/         # Content collections (proyectos/, config.ts with Zod schema)
├── assets/          # Processed images and assets
└── styles/          # Global CSS (nocturne.css)

public/             # Static files served as-is
docs/               # Development documentation (Spanish)
```

### Page Structure
The website has these routes:
1. **Home page** (`index.astro`) - Main landing page, composed of the `nocturne/` section components
2. **Contact** (`contacto.astro`) - Contact information and form
3. **Proyectos listing** (`proyectos/index.astro`) - Project/case study index
4. **Proyecto detail** (`proyectos/[slug].astro`) - Dynamic route rendering a single `proyectos` content collection entry

There is no `casos-exito.astro` page; "casos de éxito" content lives under `proyectos/`.

## Coding Standards & Conventions

### Code Style
- **Indentation**: 2 spaces consistently
- **Language**: All content and comments in Spanish
- **Code Quality**: Clear, concise, and maintainable with short helpful comments
- **HTML**: Semantic HTML5 structure
- **CSS**: Tailwind utility-first approach where applicable; the Nocturne design system also uses hand-written CSS classes (see below)
- **JavaScript**: camelCase for variables/functions, use `const` for immutable values

### Naming Conventions
- **Components**: PascalCase (e.g., `Servicios.astro`)
- **Pages/Routes**: kebab-case (e.g., `contacto.astro`)
- **Assets**: lowercase-hyphen names, no spaces
- **Variables**: camelCase for JS, kebab-case for CSS classes

### File Organization
- Use `src/assets/` for processed assets that will be imported
- Use `public/` for static files served as-is
- Optimize images before committing
- Place large media in `public/` and reference by path

## Component Architecture

### Layout System
- **`BaseLayout.astro`** (`src/layouts/`) - The single layout used by every page (home, contacto, proyectos/*). Renders the fixed nav (`.nav`, toggled `.solid` on scroll), the `<slot />` content, and the footer.
- Includes an inline script that toggles `.solid` on the nav past 40px of scroll, and drives a scroll-reveal effect via `IntersectionObserver` on elements with the `.rv` class (adds `.in` when they enter the viewport).
- Page components composed of section components under `src/components/nocturne/`.
- All text content in Spanish with `lang="es"`.

### Key Components (`src/components/nocturne/`)
- **`Hero.astro`** - Hero section
- **`Servicios.astro`** - Services section
- **`Casos.astro`** - Featured projects/case studies section
- **`Nosotros.astro`** - "Who We Are" company information
- **`Testimonios.astro`** - Testimonials section
- **`Contacto.astro`** - Contact section/form

### Project detail gallery
- `src/pages/proyectos/[slug].astro` renders the MDX body of a `proyectos` collection entry inside `.prose-n`, plus an image gallery with a lightbox-style modal.
- Modal supports keyboard navigation (arrow keys, Escape) and touch swipe on mobile.

## Critical Technical Details

### Design System — "Nocturne"
- Defined in `src/styles/nocturne.css`, imported once from `BaseLayout.astro`.
- **Design tokens** (CSS custom properties): `--teal`, `--navy`, `--ink`, `--paper`, `--line`, `--muted`.
- **Typography**: Barlow (body) and Barlow Condensed (headings/kickers), loaded from Google Fonts in `BaseLayout.astro`.
- **Reusable classes**: `.kick` (section kicker/eyebrow), `.btn-t` / `.btn-o` (filled/outline buttons), `.sec` (section padding), `.phead` (page header hero block used on interior pages), `.factbar` (stats/facts bar), `.prose-n` (MDX/prose content styling), among others defined in `nocturne.css`.
- Tailwind config (`tailwind.config.js`) exposes matching tokens as Tailwind colors: `teal`, `navy`, `ink`, `paper`, `line`, `muted`, and font families `cond` (Barlow Condensed) / `body` (Barlow). There is no `primary`/`secondary`/`dark-blue`/`light-gray` palette — that belonged to the previous design and no longer exists.

### Content Collections
- `src/content/config.ts` defines the `proyectos` collection with a Zod schema: `title`, `slug` (optional), `sector` (enum), `cliente`, `ubicacion`, `fecha`, `coverImage`, `resumen`, `kpis[]`, `tecnologias[]`, `tags[]`, `destacado`, `order`, `gallery[]`.
- Project entries are MDX files under `src/content/proyectos/`.

### Asset Management
- Images imported as Astro assets for optimization where applicable.
- Assets organized under `src/assets/` (branding, images, icons) and `public/`.

## SEO & Performance Requirements

### SEO Implementation
- **Meta Tags**: Title, description for proper search indexing (set via `BaseLayout.astro` props)
- **Structured Content**: Clear header hierarchy (h1, h2, h3)
- **URL Structure**: Descriptive, SEO-friendly URLs with relevant keywords
- **Image Optimization**: Descriptive filenames and alt attributes
- **Sitemap**: Generated automatically via `@astrojs/sitemap`, using `site` from `astro.config.mjs`

### Performance Optimization
- Minimize unnecessary JavaScript usage
- Use Astro components for better performance
- Optimize images before adding to project
- Implement lazy loading and compression

## Development Workflow

### Branch & Commit Strategy
- **Branching**: Create branch before starting implementation (feature/, fix/, docs/ prefixes)
- **Commits**: Follow Conventional Commits in Spanish-friendly format:
  - `feat:` - Nueva funcionalidad
  - `fix:` - Corrección de errores  
  - `docs:` - Actualizaciones de documentación
  - `chore:` - Tareas de mantenimiento
- **Messages**: Present tense verbs (Agrega, Corrige, Actualiza)
- **Frequency**: Commit after completing each implementation

### Rule Management & Documentation Requirements
- **CRITICAL**: When adding new project rules, update ALL AI assistant rule files:
  - `CLAUDE.md` (Claude Code)
  - `GEMINI.md` (Gemini)
  - `AGENTS.md` (GitHub Copilot/Cursor)
  - `.trae/rules/project_rules.md` (Trae)
- **Documentation**: Document all new functionality in `docs/` folder
- **Code Quality**: Keep code clean, clear, and simple with short Spanish comments for developers
- Maintain clear, concise Spanish documentation
- Include installation, usage, and contribution guidelines

### Astro Best Practices & SEO Optimization
- **Astro Framework**: Always follow Astro best practices and optimizations:
  - Optimize bundle sizes; this is a static, mostly zero-JS site — avoid adding client-side frameworks/hydration unless truly needed
  - Implement proper static site generation (SSG) strategies
  - Use Astro's built-in image optimization
  - Follow Astro's performance recommendations
- **SEO Excellence**: Apply comprehensive SEO best practices:
  - Semantic HTML structure with proper heading hierarchy
  - Meta tags optimization (title, description, Open Graph if added)
  - Image optimization with descriptive alt attributes and filenames
  - URL structure optimization with meaningful slugs
  - Site performance optimization (Core Web Vitals)
- **File Organization**: Maintain structured file organization:
  - Components grouped by functionality in logical subdirectories
  - Images organized by category (branding/, images/, icons/, etc.)
  - Assets properly separated between `src/assets/` (processed) and `public/` (static)
  - Clear naming conventions for all files and directories

### Testing Guidelines
- Test across browsers: Chrome, Firefox, Safari, Edge
- Test responsive design: mobile, tablet, laptop, desktop
- Use browser developer tools for debugging
- Run Lighthouse audits for performance, accessibility, SEO
- Recommended testing setup: Vitest + Testing Library for units, Playwright for E2E

## Security & Configuration

### Content Security Policy (CSP)
- Defined in `nginx.conf.template`. Update it when adding external fonts/scripts/CDNs.
- Prefer local assets when possible.

### Security Headers
- Nginx configuration includes security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- Never commit secrets or API keys

## Deployment

The site is deployed on **Dokploy** (server `balerion`, app `LandingPage`, Swarm service `sgsolucionescom-landingpage-ugsoai`). See `docs/despliegue-dokploy.md` for the full deployment guide, including the manual deploy/verification commands and the `${PORT}` pitfall to avoid in `nginx.conf.template` (Dokploy does not define that variable — use a fixed `listen 80;`).

### Deployment Files
- `Dockerfile` - Multi-stage build: Astro build (`node:20-alpine`) → Nginx (`nginx:1.27-alpine`)
- `nginx.conf.template` - Nginx configuration, rendered with `envsubst` at container start; serves the site as static (no SPA fallback — `try_files $uri $uri/ =404;`)

## Business Context

This website showcases S&G Soluciones de Ingeniería's capabilities in:
- Industrial automation solutions
- Industrial processes optimization  
- Industry 4.0 and IoT projects
- Custom software development

Target audience: Industrial clients in Colombia's northern coast region requiring modern, business-oriented, attractive, and minimalist design solutions.
