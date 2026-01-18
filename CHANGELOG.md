# CHANGELOG

## [1.0.0] - 2026-01-18
- Versión inicial pública del monorepo con scaffolding de CLI, paquetes core y componentes ejemplo.


## [1.0.1] - 2026-01-18
- Correcciones y mejoras menores:
	- CLI: default scope para `create` es ahora `@academy-lit-components/`.
	- Plantillas: generadores incluyen scripts locales para compilación de SCSS (`compile-scss-to-lit.cjs`, `watch-scss-to-lit.cjs`).
	- CI: workflows añadidos para publicar CLI y paquetes con `NPM_TOKEN`.
	- Publicación: `publishConfig.access` añadido a paquetes para permitir publish público.

