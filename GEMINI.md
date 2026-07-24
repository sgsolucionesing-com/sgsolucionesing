# Project Overview

This is the website for S&G Soluciones de Ingeniería, an industrial automation and software development company. The website is built using the Astro framework and styled with Tailwind CSS.

## Building and Running

### Development

To run the development server:

```bash
npm run dev
```

This will start the server on `localhost:4321`.

### Production

To build the website for production:

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

To preview the production build locally:

```bash
npm run preview
```

### Docker (Optional)

To build and run the project with Docker:

```bash
docker build -t sgsite . && docker run -p 8080:80 sgsite
```

## Development Conventions

### Technologies

*   **Framework**: [Astro](https://astro.build/) (static site generation, no server-side rendering)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) plus the hand-written "Nocturne" design system (`src/styles/nocturne.css`)
*   **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon#readme) (Iconify, `@iconify-json/mdi`)
*   **Content**: `@astrojs/mdx` + Astro content collections for project case studies
*   **SEO**: `@astrojs/sitemap` for sitemap generation

### TypeScript

This project uses TypeScript. The `tsconfig.json` file extends `astro/tsconfigs/strict` and defines a path alias `@/*` for the `src` directory.

### Coding Conventions

*   **HTML/Astro**: Use 2-space indentation and semantic HTML.
*   **CSS/Tailwind**: Use Tailwind classes whenever possible; use the Nocturne classes (`.kick`, `.btn-t`, `.btn-o`, `.sec`, etc.) for design-system-specific styling.
*   **JavaScript**: Use camelCase for variable and function names. Use `const` for variables that do not change.

### Naming Conventions

*   **Components**: PascalCase (e.g., `Servicios.astro`)
*   **Pages/Routes**: kebab-case (e.g., `contacto.astro`)
*   **Assets**: lowercase-hyphen names

### File Structure & Organization

*   **Structured File Organization**: Maintain organized file structure:
    *   Components grouped by functionality in logical subdirectories
    *   Images organized by category (branding/, images/, icons/, etc.)
    *   Assets properly separated between `src/assets/` (processed) and `public/` (static)
    *   Clear naming conventions for all files and directories
*   **`src/pages/`**: Route files (`.astro`) for each page: `index.astro`, `contacto.astro`, `proyectos/index.astro`, `proyectos/[slug].astro`.
*   **`src/components/`**: Reusable UI components (PascalCase), grouped under `nocturne/`.
*   **`src/layouts/`**: The single `BaseLayout.astro` used by every page.
*   **`src/content/`**: Content collections — `proyectos/` (MDX entries) with the Zod schema in `config.ts`.
*   **`src/assets/`**: Images and other assets that will be processed by Astro.
*   **`public/`**: Static assets that will be served as-is.
*   **`src/styles/`**: Global styles (`nocturne.css`).
*   **`docs/`**: Project documentation.

### Components

*   **`BaseLayout.astro`**: The only layout component; all pages use it as a base. Renders the fixed nav, `<slot />`, footer, and the scroll/reveal script.
*   **`Hero.astro`**: The hero section (`src/components/nocturne/`).
*   **`Servicios.astro`**: The services section.
*   **`Casos.astro`**: The featured projects/case studies section.
*   **`Nosotros.astro`**: The "Who We Are" section with company information.
*   **`Testimonios.astro`**: The testimonials section.
*   **`Contacto.astro`**: The contact section/form.

### Styling

*   **Design tokens**: Defined as CSS custom properties in `src/styles/nocturne.css` (`--teal`, `--navy`, `--ink`, `--paper`, `--line`, `--muted`) and mirrored as Tailwind colors in `tailwind.config.js` (`teal`, `navy`, `ink`, `paper`, `line`, `muted`). There is no `primary`/`secondary`/`dark-blue`/`light-gray` palette — that belonged to a previous design.
*   **Typography**: The `Barlow` (body) and `Barlow Condensed` (headings/kickers) font families are used, exposed as the Tailwind font families `body` and `cond`.
*   **Reusable UI Classes**: Several reusable classes are defined in `src/styles/nocturne.css`, including:
    *   `.kick`: Section kicker/eyebrow label.
    *   `.btn-t` / `.btn-o`: Filled and outline button variants.
    *   `.sec`: Consistent section padding.
    *   `.sec-head`: Section heading block.
    *   `.phead`: Page-header hero block used on interior pages (e.g. project detail).
    *   `.factbar`: Stats/facts bar.
    *   `.prose-n`: Prose styling for MDX project content.
*   **Animations and Effects**: Scroll-based reveal via `IntersectionObserver` (`.rv` → `.in`), nav `.solid` state on scroll, hover transitions on buttons/cards.

### Astro Best Practices & Performance Optimization

*   **Astro Framework Best Practices**: Always follow Astro optimizations and best practices:
    *   Keep the site static/zero-JS by default; avoid client-side hydration unless truly needed
    *   Implement proper static site generation (SSG) strategies
    *   Use Astro's built-in image optimization
    *   Follow Astro's performance recommendations
*   **Performance**: Optimize images before adding them to the project.
*   **JavaScript**: Minimize the use of unnecessary JavaScript.
*   **Components**: Use Astro components for better performance.

### SEO Excellence

*   **Comprehensive SEO**: Apply comprehensive SEO best practices:
    *   Semantic HTML structure with proper heading hierarchy
    *   Meta tags optimization (title, description)
    *   Image optimization with descriptive alt attributes and filenames
    *   URL structure optimization with meaningful slugs
    *   Site performance optimization (Core Web Vitals)
*   **Metadata**: Each page passes `title` and `description` to `BaseLayout.astro` for SEO.
*   **Titles and Descriptions**: Follow the recommendations in `docs/seo-optimizacion.md` for writing effective titles and descriptions.
*   **URL Structure**: Use descriptive and friendly URLs that include relevant keywords.
*   **Image Optimization**: Use descriptive file names and `alt` attributes for images.
*   **Header Structure**: Maintain a clear hierarchy of headers (`<h1>`, `<h2>`, `<h3>`, etc.).
*   **Sitemap**: Generated automatically via `@astrojs/sitemap`, driven by `site` in `astro.config.mjs`.

### Accessibility

*   Use semantic HTML tags.
*   Ensure adequate contrast between text and background.
*   Provide alternative text for images.
*   Ensure that forms are accessible.
*   Verify keyboard navigation (the project detail gallery modal supports arrow keys and Escape).

## Contribution Guidelines

### Contribution Workflow

1.  Create a new branch from `main` with a descriptive prefix (e.g., `feature/`, `fix/`, `docs/`).
2.  Follow the coding conventions and keep changes focused.
3.  Make frequent commits with descriptive messages in Spanish.
4.  Update the documentation in the `docs/` folder if necessary.
5.  **CRITICAL**: When adding new project rules, update ALL AI assistant rule files:
    *   `CLAUDE.md` (Claude Code)
    *   `GEMINI.md` (Gemini)
    *   `AGENTS.md` (GitHub Copilot/Cursor)
    *   `.trae/rules/project_rules.md` (Trae)
6.  **Code Quality**: Keep code clean, clear, and simple with short Spanish comments for developers.
7.  **Documentation**: Document all new functionality in `docs/` folder.
8.  Create a Pull Request in GitHub with a clear description of the changes.

### Commit Messages

*   Follow Conventional Commits (Spanish-friendly): `feat:`, `fix:`, `docs:`, `chore:` + a brief description.
*   Use present tense verbs (e.g., "Agrega", "Corrige", "Actualiza").

### Testing and Debugging

*   **Browsers**: Test the site in Chrome, Firefox, Safari, and Edge.
*   **Devices**: Test the site on different screen sizes (mobile, tablet, laptop, desktop).
*   **Tools**: Use the browser's developer tools to debug and check for console errors. Use Lighthouse to evaluate performance, accessibility, SEO, and best practices.

## Deployment

This project is deployed on **Dokploy** (server `balerion`, app `LandingPage`, Swarm service `sgsolucionescom-landingpage-ugsoai`), using the multi-stage `Dockerfile`.

### Deployment Files

*   `Dockerfile`: A multi-stage Dockerfile that builds the Astro application (`node:20-alpine`) and serves it with Nginx (`nginx:1.27-alpine`).
*   `nginx.conf.template`: An Nginx configuration template, rendered with `envsubst` at container start. Serves the site as fully static content (`try_files $uri $uri/ =404;`, no SPA fallback), plus security headers, caching, and compression.

### Deployment Process

The recommended way to deploy is described step by step in `docs/despliegue-dokploy.md`, including the manual deploy commands and how to verify the built image (`nginx -t`) before updating the Swarm service.

### Monitoring and Maintenance

*   **Health Checks**: The application exposes a `/health` endpoint that can be used to monitor its status, and is used by the `HEALTHCHECK` in the `Dockerfile`.
*   **Status Endpoint**: The application exposes a `/status` endpoint that returns a JSON object with information about the service.
*   **Logs**: Logs can be viewed via `docker service logs sgsolucionescom-landingpage-ugsoai` on the Dokploy host.

### Security

*   **Security Headers**: The Nginx configuration includes several security headers, such as `X-Frame-Options`, `X-Content-Type-Options`, and `Content-Security-Policy`.
*   **Content Security Policy (CSP)**: Defined in `nginx.conf.template`; update it whenever a new external font/script/CDN source is added.
*   **Secrets**: Secrets should be set as environment variables in Dokploy, not committed to the repository.

### Troubleshooting

If you encounter deployment problems, see `docs/despliegue-dokploy.md`, particularly the note about `nginx.conf.template` never referencing environment variables that Dokploy does not define (the `${PORT}` incident is documented there as a cautionary example).
