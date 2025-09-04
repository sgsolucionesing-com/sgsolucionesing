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
- **Astro 5.x** - Static site generator with component islands (maintaining pure HTML)
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon system
- **astro-icon** - Additional icon support using Iconify
- **Splide.js** - Carousel/slider functionality
- **TypeScript** - Type safety (extends astro/tsconfigs/strict)
- **HTML5** - Semantic structure
- **JavaScript/Vue** - Interactive functionality (preferably Vue when needed)

### Project Structure
```
src/
├── pages/          # Route files (.astro) - kebab-case naming
├── components/     # Reusable UI components - PascalCase naming
├── layouts/        # Page templates (Layout.astro is main)
├── data/           # Static data (casos-exito.js contains project data)
├── assets/         # Processed images and assets
└── styles/         # Global CSS

public/             # Static files served as-is
docs/              # Development documentation (Spanish)
```

### Page Structure
The website has **3 main pages**:
1. **Home page** (index.astro) - Main landing page
2. **Success Cases** (casos-exito.astro) - Projects and achievements showcase
3. **Contact** (contacto.astro) - Contact information and forms

## Coding Standards & Conventions

### Code Style
- **Indentation**: 2 spaces consistently
- **Language**: All content and comments in Spanish
- **Code Quality**: Clear, concise, and maintainable with short helpful comments
- **HTML**: Semantic HTML5 structure
- **CSS**: Tailwind utility-first approach, group classes by category (layout, spacing, typography)
- **JavaScript**: camelCase for variables/functions, use `const` for immutable values

### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.astro`)
- **Pages/Routes**: kebab-case (e.g., `casos-exito.astro`)  
- **Assets**: lowercase-hyphen names, no spaces
- **Variables**: camelCase for JS, kebab-case for CSS classes

### File Organization
- Use `src/assets/` for processed assets that will be imported
- Use `public/` for static files served as-is
- Optimize images before committing
- Place large media in `public/` and reference by path

## Component Architecture

### Layout System
- **Layout.astro** - Main layout wrapper with Navigation/Footer, includes comprehensive SEO meta tags
- Page components composed of section components (HeroSection, AboutSection, etc.)
- Modal system for "Casos de Éxito" (success cases) gallery
- All text content in Spanish with lang="es"

### Key Components
- **HeroSection.astro** - Hero with animated background and logo
- **StatsSection.astro** - Statistics with animated counters
- **ServicesSection.astro** - Services with FontAwesome icons
- **PlatformsSection.astro** - Multi-platform access with device icons
- **AboutSection.astro** - "Who We Are" company information
- **ProjectsSection.astro** - Project library with images
- **TestimonialsSection.astro** - Testimonials with custom avatars
- **SuccessCasesModal.astro** - Modal system for project gallery

## Critical Technical Details

### View Transitions
- View Transitions are explicitly **DISABLED** via meta tag in Layout.astro
- This configuration fixes modal functionality issues - do not change

### Asset Management
- Images imported as Astro assets for optimization
- `casos-exito.js` contains extensive image imports and structured project data
- Assets organized in `assets/projects/casos-exito-assets/` with HOR/ and VER/ subdirectories

### Styling Implementation
- **Corporate Colors**: Defined in `tailwind.config.mjs`
- **Typography**: Inter (general text) and Montserrat (headings) from Google Fonts
- **Icons**: Font Awesome 6.4.0 loaded from cdnjs.cloudflare.com
- **Global Styles**: Custom reusable components in `src/styles/global.css`:
  - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` - Button variants
  - `.section` - Consistent section padding
  - `.gradient-bg`, `.hero-animated-bg` - Background effects
  - `.card-hover` - Card hover effects
  - `.stats-counter` - Gradient text counters
  - `.service-icon` - Gradient icon backgrounds

### Modal System
- Success cases modal uses vanilla JavaScript with TypeScript type assertions
- Modal state managed through DOM manipulation (style.display)
- Event listeners handle open/close/keyboard interactions
- Splide.js integration for carousel functionality within modal

## SEO & Performance Requirements

### SEO Implementation
- **Meta Tags**: Title, description, keywords for proper search indexing
- **Open Graph & Twitter Cards**: Social media optimization
- **Structured Content**: Clear header hierarchy (h1, h2, h3)
- **URL Structure**: Descriptive, SEO-friendly URLs with relevant keywords
- **Image Optimization**: Descriptive filenames and alt attributes
- **Content Strategy**: Original, valuable content with natural keyword integration

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
- **File Organization**: Maintain structured file organization:
  - Components grouped by functionality in logical subdirectories
  - Images organized by category (branding/, projects/, ui/, etc.)
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
- Update CSP when adding external fonts/icons/CDNs
- Current trusted sources: Google Fonts, Font Awesome (cdnjs.cloudflare.com)
- Prefer local assets when possible

### Security Headers
- Nginx configuration includes security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- Never commit secrets or API keys
- Use CapRover environment variables for sensitive configuration

## Deployment

### CapRover Deployment
- Optimized for CapRover deployment with Docker
- Health check endpoints: `/health` and `/status`
- Nginx configuration with gzip compression and security headers
- Use `./deploy-caprover.sh` for automated deployment
- Monitor via CapRover web panel or `docker logs`

### Deployment Files
- `Dockerfile` - Multi-stage build with Nginx
- `captain-definition` - CapRover configuration
- `nginx.conf.template` - Nginx configuration with SPA support
- `deploy-caprover.sh` - Automated deployment script

## Business Context

This website showcases S&G Soluciones de Ingeniería's capabilities in:
- Industrial automation solutions
- Industrial processes optimization  
- Industry 4.0 and IoT projects
- Custom software development

Target audience: Industrial clients in Colombia's northern coast region requiring modern, business-oriented, attractive, and minimalist design solutions.