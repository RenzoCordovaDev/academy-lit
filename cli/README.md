# @academy-lit/lit-cli

CLI para scaffolding y gestión del ecosistema `@academy-lit`.

# @academy-lit/lit-cli

Breve
 - `lit-dev` es la herramienta de línea de comandos para crear proyectos y componentes dentro del ecosistema Academy Lit.

Objetivo
 - Facilitar scaffolding, generación de componentes y operaciones comunes (instalación de componentes del catálogo, demos, builds) con convenciones listas para publicar.
 - Este CLI fue creado para formar, fortalecer y mejorar el conocimiento en Lit con un enfoque académico. Proporciona plantillas didácticas, demos interactivas y ejercicios prácticos para aprender patrones clave (mixins, scoped elements, internacionalización, design tokens). Está diseñado para enseñar buenas prácticas —accesibilidad, testing y despliegue reproducible— y, al mismo tiempo, acelerar la creación de componentes listos para producción.
 - Además, el CLI soporta la creación de aplicaciones web y componentes web pensados para arquitecturas de microfrontend: scaffolding de apps, demos y paquetes desacoplados que facilitan la integración como microfrontends.

Requisitos
 - Node.js 18+
 - pnpm (recomendado)

Instalación
 - Global (cuando esté publicado):
   - `npm install -g @academy-lit/lit-cli`
 - Uso directo sin instalar:
   - `npx @academy-lit/lit-cli <comando>`

Comandos importantes
 - `lit-dev init <nombre-proyecto>`
   - Crea un proyecto Vite con demo, configuraciones y un componente ejemplo.

 - `lit-dev generate component <nombre>` (alias `lit-dev g c <nombre>`)
   - Genera: `src/`, `demo/`, `locales.json`, `test/`, `index.js`, `package.json` y scripts de build.
   - Opciones: `--dir <path>`, `--scope <scope>`, `--no-tests`, `--no-demo`.

 - `lit-dev add <componentes...>`
   - Instala componentes del catálogo: p. ej. `lit-dev add button input`.

 - `lit-dev list`
   - Lista componentes disponibles en el catálogo.

 - `lit-dev dev`
   - Inicia servidor de demo (Vite) para desarrollo.

Publicación (flujo breve)
 1. Fusionar cambios en `main`.
 2. Actualizar versiones con Lerna: `npx lerna version` (o `patch|minor|major`).
 3. `git push --follow-tags`.
 4. CI publica automáticamente (workflow en `/.github/workflows`) usando `npx lerna publish from-package --yes`.

Notas prácticas
 - Asegura `publishConfig.access: "public"` en cada `package.json` a publicar.
 - Lerna reemplaza `workspace:*` con las versiones reales al versionar; no publiques paquetes con `workspace:*` en el registry.
 - Valida qué archivos entran al paquete con:
   - `cd cli && npm pack --dry-run`

Plantillas y código fuente
 - Plantillas de scaffolding: `cli/templates/` (EJS).

Catálogo de Componentes
 - El proyecto incluye un catálogo de componentes básicos (botones, inputs, enlaces, helpers) que sirven como punto de partida para crear nuevos componentes y aprender patrones comunes.
 - Estos componentes sirven de referencia y pueden instalarse desde el CLI con `lit-dev add <component-name>`.
 - URL temporal del catálogo: https://catalog.academy-lit.dev (temporal — pendiente URL final)

Contribuir
 - Abrir PRs al repo principal; ejecutar `pnpm -r test` y `pnpm -r build` antes de versionar.

Más información
 - Repo: https://github.com/RenzoCordovaDev/academy-lit
