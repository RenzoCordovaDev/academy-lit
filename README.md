# Ecosistema Academy Lit Components

Repositorio monorepo que contiene un ecosistema para crear, desarrollar y publicar Web Components con Lit, con una CLI para scaffolding, paquetes core con mixins/utilidades y un catálogo de componentes independientes.

Este README describe la arquitectura, paquetes principales, convenciones, uso de la CLI, integración con demos (incluyendo forwarding de eventos desde iframes), pattern de internacionalización y flujo de publicación.

---

**Índice**

- **Visión general**
- **Estructura del monorepo**
- **Paquetes principales**
  - `@academy-lit/lit-cli`
  - `@academy-lit/core`
  - `@academy-lit/component-mixin`
  - `@academy-lit/scoped-elements-mixin`
  - `@academy-lit/intl-mixin`
  - `@academy-lit-components/*` (catálogo de componentes)
- **Convenciones y patrones**
  - Nombres y tag names
  - Estilos y tokens
  - Eventos
  - Internacionalización (`locales.json`)
- **CLI: comandos y plantillas**
  - `lit-dev init <nombre-proyecto>`
  - `lit-dev generate component <nombre>` (`g c`)
  - `lit-dev add <componentes...>`
  - `lit-dev list`
  - Plantillas incluidas (demo, index, package.json)
- **Demos y forwarding de eventos (iframes)**
  - Motivo
  - Implementación en demos generados
  - Snippet `postMessage`
- **Academy Helper Demo**
  - Propósitos y API
  - Controles y eventos
  - Integración con iframes y postMessage
- **Desarrollo local**
  - Requisitos
  - Scripts útiles
- **Publicación**
  - Versionado y comandos
- **Buenas prácticas y consideraciones**
- **Preguntas frecuentes (FAQ)**
- **Contribuciones**

---

## Visión general

El objetivo del ecosistema es proporcionar:
- Un CLI para scaffolding y manejo de demos.
- Paquetes core reutilizables (tokens, utilidades, mixins).
- Un catálogo de componentes Web Components publicados individualmente.
- Un entorno de demos que facilita probar componentes (incluso dentro de iframes) y capturar eventos para debug/documentación.

## Estructura del monorepo

Estructura esperada (pnpm + lerna):

```
lit-ecosystem/
├── packages/
│   ├── cli/                           # @academy-lit/lit-cli
│   ├── core/                          # @academy-lit/core
│   ├── component-mixin/               # @academy-lit/component-mixin
│   ├── scoped-elements-mixin/         # @academy-lit/scoped-elements-mixin
│   ├── intl-mixin/                    # @academy-lit/intl-mixin
│   └── [componentes]/                 # @academy-lit-components/button, @academy-lit-components/input, etc.
├── pnpm-workspace.yaml
├── lerna.json
└── package.json
```

Cada componente es un paquete independiente en `packages/` y contiene `src/`, `demo/`, `locales.json`, `index.js`, `package.json` y `README.md`.

## Paquetes principales

### 1) `@academy-lit/lit-cli`
- CLI para crear proyectos y generar componentes con plantillas.
- Genera demo completo con `demo.js` y `demo/index.html` y añade el forwarding de eventos desde iframes.
- Plantillas se encuentran en `cli/templates/`.

### 2) `@academy-lit/core`
- Tokens de diseño, utilidades DOM y helpers.
- Exporta `tokens`, `utils` y `base-component`.

### 3) `@academy-lit/component-mixin`
- Mixin base para componentes (propiedades comunes, sanitización con DOMPurify, skeletons, helpers de scoped elements).
- Incluye `ScopedElementsMixin` e `IntlMixin` (internacionalización).

### 4) `@academy-lit/scoped-elements-mixin`
- Gestión de elementos con scope para evitar colisiones y facilitar testing.

### 5) `@academy-lit/intl-mixin`
- Manejo de traducciones por componente con archivo `locales.json` en la raíz del package.
- API: `t(key, params)`, `setLocale(locale)`, `loadTranslations(localesData)`.

### 6) `@academy-lit-components/*`
- Cada componente (ej. `@academy-lit-components/button`) es publicable y contiene demo, tests, locales, styles, y auto-registro.

## Convenciones y patrones

- Tags: `academy-component-name`.
- Clases: `ComponentName`.
- Archivos: `component-name.js`.
- Tokens: usar `@academy-lit/core/tokens`.
- Eventos: prefijo `academy-` y `bubbles: true, composed: true`.
- `locales.json` con claves por componente (ej. `es-PE`, `en-EN`, `pt-BR`).

## CLI: comandos y plantillas

- `lit-dev init <nombre-proyecto>`: scaffolding de proyecto.
- `lit-dev generate component <nombre>` (`g c`): genera package con `src/`, `demo/`, `index.js`, `locales.json`, `package.json`, tests.
- Opciones: `--dir`, `--scope`, `--no-tests`, `--no-demo`.
- Plantillas en `cli/templates/` incluyen `demo.js.ejs` que ahora agrega forwarding seguro de `academy-*` CustomEvents.

## Demos y forwarding de eventos (iframes)

Problema: eventos dentro de iframes no burbujean al padre. Solución adoptada:
- Las demos generadas inyectan un interceptor en `EventTarget.prototype.dispatchEvent` que detecta `CustomEvent`s con tipo que empieza por `academy-`, serializa de forma segura `detail` y reenvía el evento al `window.parent` mediante `postMessage({ __academyDemoEvent: true, event: { type, detail, isCustomEvent:true } })`.
- El `academy-helper-demo` escucha `window.message` y registra eventos reenviados en su `_events` interno.
- Para iframes cross-origin, el snippet debe incluirse en la página del iframe (colaboración del proveedor del iframe) — no se puede inyectar desde el padre.

Snippet incluido en demos generados (resumen):
- Interceptar `dispatchEvent`.
- Si `event.type.startsWith('academy-')` y `event instanceof CustomEvent`, serializar `event.detail` evitando nodos y funciones.
- `window.parent.postMessage(...)` con payload marcado `__academyDemoEvent: true`.

## `academy-helper-demo`

`packages/base/academy-helper-demo/` contiene un componente que sirve como contenedor de demos:
- Controles: locale, mode, viewport, ambient, cases.
- `showEvents` (control de visibilidad del control de eventos) y `showEventsLog` (estado del panel del log).
- `only-custom` atributo para aceptar solo CustomEvents.
- `events` atributo (CSV) para allowlist de tipos que se registran.
- `_events` array que almacena entradas con formato `{ time, type, detail }`.
- Botón `Events` con badge contador y panel flotante anclado al botón. Botón `Clear` para vaciar el log.

API y extensibilidad (pendiente):
- Se propone exponer `addEvent(eventData)` como API pública para que demos/componentes same-origin puedan llamar directamente.
- También se propone `emitDemoEvent()` helper para simplificar integraciones.

## Desarrollo local

Requisitos:
- Node.js >= 18
- pnpm (recomendado)

Instalación en el monorepo:

```bash
pnpm install
```

Scripts comunes:

- Desde la raíz (monorepo):
  - `pnpm -r build` — build de todos los paquetes.
  - `pnpm -r test` — ejecutar tests en todos los paquetes.
- Para un package específico (ej. button):
  - `cd packages/components/academy-button-basic` (o usar `pnpm --filter`)
  - `npm install`
  - `npm run dev` — inicia demo con Vite.
  # Ecosistema Academy Lit Components

  Monorepo para crear, desarrollar y publicar Web Components con Lit. Incluye una CLI para scaffolding, paquetes core (tokens y mixins) y un catálogo de componentes independientes con demos y tests.

  Contenido principal
  - Visión general y estructura
  - Paquetes principales
  - Convenciones y patrones de código
  - Uso de la CLI y plantillas
  - Demos (incluye reenvío de eventos desde iframes)
  - `academy-helper-demo`: contenedor de demos y registrador de eventos
  - Desarrollo local y publicación

  ## Visión general

  El objetivo es facilitar la creación de componentes reutilizables, con herramientas para:
  - Generar scaffolding y demos desde la CLI.
  - Reutilizar tokens y utilidades comunes.
  - Probar componentes localmente (incluso dentro de iframes) y capturar sus eventos para depuración y documentación.

  ## Estructura del monorepo

  Ejemplo de organización (pnpm + lerna):

  ```
  lit-ecosystem/
  ├── packages/
  │   ├── cli/
  │   ├── core/
  │   ├── component-mixin/
  │   ├── scoped-elements-mixin/
  │   ├── intl-mixin/
  │   └── [componentes]/
  ├── pnpm-workspace.yaml
  ├── lerna.json
  └── package.json
  ```

  Cada componente vive en su propio package dentro de `packages/` y típicamente contiene `src/`, `demo/`, `locales.json`, `index.js`, `package.json` y `README.md`.

  ## Paquetes principales

  - `@academy-lit/lit-cli`: CLI para crear proyectos y generar componentes con plantillas (incluye plantillas para demos).
  - `@academy-lit/core`: tokens de diseño, utilidades DOM y helpers.
  - `@academy-lit/component-mixin`: mixin base con propiedades comunes, sanitización (DOMPurify), skeletons y helpers para scoped elements.
  - `@academy-lit/scoped-elements-mixin`: ayuda a aislar custom elements y evitar colisiones.
  - `@academy-lit/intl-mixin`: gestión de traducciones por componente (`locales.json`).
  - `@academy-lit-components/*`: catálogo de componentes publicables (ej. button, input).

  ## Convenciones y patrones

  - Tag names: `academy-component-name`.
  - Clases: PascalCase (`ComponentName`).
  - Archivos: kebab-case (`component-name.js`).
  - Tokens: usar `@academy-lit/core/tokens`.
  - Eventos: prefijo `academy-` y siempre con `bubbles: true, composed: true`.
  - Traducciones: `locales.json` en la raíz del package (ej. `es-PE`, `en-EN`).

  ## CLI: comandos básicos

  - `lit-dev init <nombre-proyecto>` — crea un proyecto base.
  - `lit-dev generate component <nombre>` (alias `g c`) — genera scaffolding de un componente con demo y tests.
  - `lit-dev add <componentes...>` — instala componentes del catálogo.
  - `lit-dev list` — lista componentes disponibles.

  Las plantillas están en `cli/templates/` y la plantilla de demo incluye por defecto un pequeño interceptor para reenviar eventos `academy-*` desde iframes al contenedor.

  ## Demos y reenvío de eventos desde iframes

  Problema: los eventos que ocurren dentro de un iframe no se propagan al documento padre. Solución adoptada:

  - Las demos generadas inyectan un interceptor en `EventTarget.prototype.dispatchEvent` que detecta `CustomEvent`s cuyo tipo empieza por `academy-`, serializa `event.detail` de forma segura y llama a `window.parent.postMessage(...)` con un payload marcado (por ejemplo `__academyDemoEvent: true`).
  - El componente `academy-helper-demo` escucha `message` en `window` y normaliza los eventos reenviados en su registro interno.

  Nota: para iframes cross-origin el snippet debe incluirse en la página dentro del iframe (no se puede inyectar desde el padre).

  Resumen del enfoque:

  - Interceptar `dispatchEvent` en el demo.
  - Si el evento es `CustomEvent` y `type.startsWith('academy-')`, serializar `detail` evitando funciones y nodos.
  - Enviar `postMessage` al padre con una marca que permita reconocer el payload.

  ## `academy-helper-demo` (contenedor de demos)

  Ubicación: `packages/base/academy-helper-demo/`.

  Características principales:
  - Controles globales para locale, modo visual, viewport y ambient.
  - `showEvents` y `showEventsLog` para controlar el panel de eventos.
  - Atributo `only-custom` para registrar solo `CustomEvent`s.
  - Atributo `events` (CSV) para permitir solo tipos específicos.
  - `_events`: array con entradas `{ time, type, detail }` que alimentan un panel con contador y botón `Clear`.

  Extensibilidad (pendiente):

  - Propuesta para exponer `addEvent(eventData)` como API pública para integraciones same-origin.
  - Se puede añadir un helper `emitDemoEvent()` para demos que corran en el mismo origen.

  ## Desarrollo local

  Requisitos mínimos:

  - Node.js >= 18
  - pnpm (recomendado)

  Instalación en el monorepo:

  ```bash
  pnpm install
  ```

  Comandos útiles:

  - `pnpm -r build` — build de todos los paquetes.
  - `pnpm -r test` — ejecutar tests de todos los paquetes.
  - `pnpm --filter @academy-lit-components/button dev` — dev de un package específico.

  Dentro de un package (ejemplo):

  ```bash
  cd packages/components/academy-button-basic
  npm install
  npm run dev
  npm run test
  ```

  ## Publicación

  Se usa `lerna` junto a `pnpm`:

  - `lerna changed` — ver paquetes con cambios.
  - `lerna publish` — publicar paquetes con bump automático.
  - `pnpm --filter @academy-lit-components/button publish` — publicar un paquete específico.

  ## Buenas prácticas

  - Mantener `locales.json` en la raíz de cada package.
  - Usar `ScopedElementsMixin` para evitar colisiones de tags.
  - Despachar eventos con `bubbles: true, composed: true`.
  - Mantener las demos simples y documentadas.
  - Para iframes cross-origin, incluir el snippet de `postMessage` dentro del iframe.

  ## FAQ

  Q: ¿Por qué reenviar eventos desde demos en iframes?
  A: Porque los eventos no cruzan el límite del iframe; `postMessage` es una forma segura y estandarizada de comunicar acciones del demo al contenedor.

  Q: ¿Cómo limito qué eventos se registran en el log?
  A: Usa el atributo `events="tipo1,tipo2"` en `academy-helper-demo` o activa `only-custom` para aceptar solo `CustomEvent`s.

  ## Contribuciones

  - Abrir PRs contra `main`.
  - Seguir las convenciones del repo.
  - Añadir tests para nuevas funcionalidades.

