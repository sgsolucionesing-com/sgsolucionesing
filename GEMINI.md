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

*   **Framework**: [Astro](https://astro.build/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon#readme)

### TypeScript

This project uses TypeScript. The `tsconfig.json` file extends `astro/tsconfigs/strict` and defines a path alias `@/*` for the `src` directory.

### Coding Conventions

*   **HTML/Astro**: Use 2-space indentation and semantic HTML.
*   **CSS/Tailwind**: Use Tailwind classes whenever possible. Group classes by category (layout, spacing, typography, etc.).
*   **JavaScript**: Use camelCase for variable and function names. Use `const` for variables that do not change.

### Naming Conventions

*   **Components**: PascalCase (e.g., `HeroSection.astro`)
*   **Pages/Routes**: kebab-case (e.g., `casos-exito.astro`)
*   **Assets**: lowercase-hyphen names

### File Structure & Organization

*   **Structured File Organization**: Maintain organized file structure:
    *   Components grouped by functionality in logical subdirectories
    *   Images organized by category (branding/, projects/, ui/, etc.)
    *   Assets properly separated between `src/assets/` (processed) and `public/` (static)
    *   Clear naming conventions for all files and directories
*   **`src/pages/`**: Route files (`.astro`) for each page.
*   **`src/components/`**: Reusable UI components (PascalCase).
*   **`src/layouts/`**: Reusable layout components (PascalCase).
*   **`src/assets/`**: Images and other assets that will be processed by Astro.
*   **`public/`**: Static assets that will be served as-is.
*   **`src/styles/`**: Global styles.
*   **`docs/`**: Project documentation.

### Components

*   **`Layout.astro`**: The main layout component that all pages use as a base.
*   **`Welcome.astro`**: The main component for the home page, which integrates all other components.
*   **`HeroSection.astro`**: The hero section with an animated background and the company logo.
*   **`StatsSection.astro`**: The statistics section with animated counters.
*   **`ServicesSection.astro`**: The services section with FontAwesome icons.
*   **`PlatformsSection.astro`**: The multi-platform access section with device icons.
*   **`AboutSection.astro`**: The "Who We Are" section with company information.
*   **`SectorsSection.astro`**: The application sectors section.
*   **`ProjectsSection.astro`**: The project library with images.
*   **`TestimonialsSection.astro`**: The testimonials section with custom avatars.

### Styling

*   **Colors**: The corporate colors are defined in `tailwind.config.mjs`.
*   **Typography**: The `Inter` and `Montserrat` font families are used for general text and headings, respectively.
*   **Reusable UI Components**: Several reusable UI components are defined in `src/styles/global.css`, including:
    *   `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`: Buttons with different styles.
    *   `.section`: A container for sections with consistent padding.
    *   `.gradient-bg`: A gradient background.
    *   `.hero-animated-bg`: An animated gradient background for the hero section.
    *   `.card-hover`: A card with a hover effect.
    *   `.stats-counter`: A counter with a gradient text effect.
    *   `.service-icon`: An icon with a gradient background and a shadow.
    *   `.section-divider`: A divider with a gradient.
    *   `.gradient-text`: A utility for creating gradient text.
*   **Animations and Effects**: The website uses several animations and effects, including an animated gradient background, scroll-based fade-in animations, and hover effects.

### Astro Best Practices & Performance Optimization

*   **Astro Framework Best Practices**: Always follow Astro optimizations and best practices:
    *   Use component islands architecture effectively
    *   Optimize bundle sizes with selective hydration
    *   Implement proper static site generation (SSG) strategies
    *   Use Astro's built-in image optimization
    *   Follow Astro's performance recommendations
*   **Performance**: Optimize images before adding them to the project.
*   **JavaScript**: Minimize the use of unnecessary JavaScript.
*   **Components**: Use Astro components for better performance.

### SEO Excellence

*   **Comprehensive SEO**: Apply comprehensive SEO best practices:
    *   Semantic HTML structure with proper heading hierarchy
    *   Meta tags optimization (title, description, keywords, Open Graph, Twitter Cards)
    *   Structured data implementation when applicable
    *   Image optimization with descriptive alt attributes and filenames
    *   URL structure optimization with meaningful slugs
    *   Site performance optimization (Core Web Vitals)
*   **Metadata**: Each page includes the necessary metadata for SEO (title, description, keywords), as well as Open Graph and Twitter metadata.
*   **Titles and Descriptions**: Follow the recommendations in `docs/seo-optimizacion.md` for writing effective titles and descriptions.
*   **Keywords**: Use the main and secondary keywords listed in `docs/seo-optimizacion.md`.
*   **URL Structure**: Use descriptive and friendly URLs that include relevant keywords.
*   **Image Optimization**: Use descriptive file names and `alt` attributes for images.
*   **Header Structure**: Maintain a clear hierarchy of headers (`<h1>`, `<h2>`, `<h3>`, etc.).
*   **Content**: Create original and valuable content that is updated regularly. Include keywords naturally, use lists and short paragraphs, and add internal links and multimedia.

### Accessibility

*   Use semantic HTML tags.
*   Ensure adequate contrast between text and background.
*   Provide alternative text for images.
*   Ensure that forms are accessible.
*   Verify keyboard navigation.

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

This project is optimized for deployment with CapRover and Docker.

### Deployment Files

*   `Dockerfile`: A multi-stage Dockerfile that builds the Astro application and serves it with Nginx.
*   `captain-definition`: A CapRover configuration file that specifies the path to the Dockerfile.
*   `nginx.conf.template`: An Nginx configuration template that includes settings for a Single Page Application (SPA), security headers, caching, and compression.
*   `deploy-caprover.sh`: A script that automates the deployment process to CapRover.

### Deployment Process

The recommended way to deploy the application is to use the `deploy-caprover.sh` script. This script will:

1.  Verify that the necessary files and dependencies are in place.
2.  Run tests if they exist.
3.  Build and test a local Docker image.
4.  Create a tarball for deployment to CapRover.

Alternatively, you can deploy the application manually by following the instructions in the `docs/despliegue-docker-caprover.md` file.

### Monitoring and Maintenance

*   **Health Checks**: The application exposes a `/health` endpoint that can be used to monitor its status.
*   **Status Endpoint**: The application exposes a `/status` endpoint that returns a JSON object with information about the service.
*   **Logs**: Logs can be viewed in the CapRover web panel or by using the `docker logs` command.

### Security

*   **Security Headers**: The Nginx configuration includes several security headers, such as `X-Frame-Options`, `X-Content-Type-Options`, and `Content-Security-Policy`.
*   **Content Security Policy (CSP)**: The CSP is configured to allow resources from trusted sources, such as Google Fonts and Font Awesome.
*   **Secrets**: Secrets should be set as environment variables in CapRover, not committed to the repository.

### Troubleshooting

If you encounter any problems during deployment, refer to the "Solución de Problemas" section in the `docs/despliegue-docker-caprover.md` file.
