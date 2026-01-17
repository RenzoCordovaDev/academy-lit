# Proyecto: Ecosistema Lit Components CLI

## Contexto General
Estamos desarrollando un ecosistema completo para la creación y gestión de Web Components con Lit, inspirado en el patrón BBVA Spherica/Glomo. El proyecto consiste en:

1. **CLI** (`@academy-lit/lit-cli`): Herramienta de línea de comandos para scaffolding y gestión
2. **Paquetes Core**: Mixins y utilidades base reutilizables
3. **Catálogo de Componentes**: Componentes individuales publicados independientemente en npm

## Arquitectura del Proyecto

### Estructura del Monorepo (pnpm workspaces + lerna)
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

## Paquetes Core del Sistema

### 1. @academy-lit/core
**Propósito**: Utilidades base, design tokens, helpers
**Exports**:
- `./tokens` - Design tokens (colores, espaciado, tipografía)
- `./utils` - Utilidades (eventos, validación, DOM helpers)
- `./base-component` - Clase base opcional

### 2. @academy-lit/component-mixin
**Propósito**: Mixin base para configuración de componentes
**Funcionalidades**:
- Propiedades: `ambient`, `mode`, `loading`, `mediaRangeConfig`, `loadingA11yLabel`
- Método `sanitizeHtml(content, allowedTags, tagNameCheck)` - Sanitización con DOMPurify
- Getter `_skeletonTemplate` - Template para loading state
- Método estático `scopedElementsFromClasses(classes)` - Helper para scoped elements
- Compatibilidad iOS Safari <= 16
- Integra `ScopedElementsMixin` e `IntlMixin`

**Patrón de uso**:
```javascript
import { ComponentMixin } from '@academy-lit/component-mixin';

class MyComponent extends ComponentMixin(LitElement) {
  static get is() { return 'my-component'; }
  
  static get scopedElements() {
    const classes = [Button, Icon];
    return MyComponent.scopedElementsFromClasses(classes);
  }
  
  render() {
    return html`
      <div class="component">
        ${this.loading ? this._skeletonTemplate : this._contentTemplate}
      </div>
    `;
  }
}
```

### 3. @academy-lit/scoped-elements-mixin
**Propósito**: Aislamiento de custom elements, evita colisiones
**API**:
- `static get scopedElements()` - Define elementos usados
- `defineScopedElement(tagName, ComponentClass)` - Registra elemento
- `getScopedElement(tagName)` - Obtiene clase registrada

### 4. @academy-lit/intl-mixin
**Propósito**: Internacionalización con archivo locales.json
**API**:
- `t(key, params)` - Traduce una clave
- `setLocale(locale)` - Cambia locale global
- `getLocale()` - Obtiene locale actual
- `loadTranslations(localesData)` - Carga traducciones

**Formato locales.json** (siempre en raíz del componente):
```json
{
  "es-PE": {
    "component-action-button": "Aceptar",
    "component-loading-text": "Cargando..."
  },
  "en-EN": {
    "component-action-button": "Accept",
    "component-loading-text": "Loading..."
  },
  "pt-BR": {
    "component-action-button": "Aceitar",
    "component-loading-text": "Carregando..."
  }
}
```

## Estructura de un Componente Individual
```
packages/button/
├── src/
│   ├── button.js              # Componente principal con ComponentMixin
│   ├── button.styles.scss     # Estilos SCSS con tokens
│   └── button.test.js         # Tests con @web/test-runner
├── demo/
│   ├── index.html             # Demo interactiva
│   ├── demo.js                # Lógica de la demo
│   └── examples/              # Ejemplos adicionales (opcional)
├── locales.json               # SIEMPRE en raíz con estructura { "es-PE": {}, "en-EN": {} }
├── index.js                   # Entry point (exports + auto-register)
├── package.json               # Package individual
├── custom-elements.json       # Metadata para IDEs
├── README.md
└── vite.config.js
```

## Patrón de Código para Componentes

### Componente Típico (button.js)
```javascript
import { LitElement, html } from 'lit';
import { ComponentMixin } from '@academy-lit/component-mixin';
import { buttonStyles } from './button.styles.scss';

export class Button extends ComponentMixin(LitElement) {
  static get is() {
    return 'academy-button';
  }

  static get styles() {
    return [buttonStyles];
  }

  static get properties() {
    return {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  static get scopedElements() {
    // Si usa otros componentes
    const classes = [Icon, Badge];
    return Button.scopedElementsFromClasses(classes);
  }

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
  }

  render() {
    return html`
      <button
        part="button"
        class="btn btn--${this.variant} btn--${this.size}"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick(e) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('academy-button-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      }));
    }
  }
}

customElements.define(Button.is, Button);
```

### Estilos (button.styles.scss)
```scss
:host {
  display: inline-block;
  --button-bg: var(--color-primary, #007bff);
}

:host([hidden]) {
  display: none;
}

.btn {
  background: var(--button-bg);
  padding: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: Arial, sans-serif;
}

.btn--primary {
  background: var(--color-primary, #007bff);
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

:host([loading]) .btn {
  opacity: 0.5;
  pointer-events: none;
}
```

### Entry Point (index.js)
```javascript
export { Button } from './src/button.js';
export { buttonStyles } from './src/button.styles.scss';

// Auto-registro del componente
import './src/button.js';
```

### Package.json de Componente
```json
{
  "name": "@academy-lit-components/button",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./locales.json": "./locales.json"
  },
  "files": ["/src/", "/demo/", "index.js", "locales.json"],
  "scripts": {
    "dev": "vite demo",
    "build": "vite build",
    "test": "web-test-runner \"src/**/*.test.js\""
  },
  "dependencies": {
    "@academy-lit/core": "^1.0.0",
    "@academy-lit/component-mixin": "^1.0.0",
    "lit": "^3.0.0"
  },
  "peerDependencies": {
    "lit": "^3.0.0"
  }
}
```

## CLI - Comandos Principales

### `lit-dev init <nombre-proyecto>`
Crea un nuevo proyecto con:
- Estructura de carpetas
- package.json con dependencias core
- Configuración Vite
- Archivos de configuración (eslint, prettier)
- Componente ejemplo

### `lit-dev generate component <nombre>` (alias: `g c`)
Genera un componente con scaffolding completo:
- `src/component.js` - Componente con ComponentMixin
- `src/component.styles.js` - Estilos con tokens
- `src/component.test.js` - Tests básicos
- `demo/index.html` - Demo interactiva
- `demo/demo.js` - Controles de demo
- `locales.json` - Traducciones base (es-PE, en-EN, pt-BR)
- `index.js` - Entry point
- `package.json` - Package configuration
- `README.md` - Documentación

**Opciones**:
- `--dir <path>` - Directorio custom
- `--scope <scope>` - Scope npm custom
- `--no-tests` - Sin tests
- `--no-demo` - Sin demo

### `lit-dev add <componentes...>`
Instala componentes del catálogo:
```bash
lit-dev add button input card
```
- Instala packages npm
- Actualiza imports en main.js (opcional)

## Instalación de Componentes

### Usando el CLI
Para instalar un componente desde el catálogo, utiliza el comando:

```bash
lit-dev add <nombre-del-componente>
```

Por ejemplo, para instalar el componente `button`:

```bash
lit-dev add button
```

### Usando npm
Como alternativa, puedes instalar un componente directamente desde npm con el siguiente comando:

```bash
npm install @academy-lit-components/<nombre-componente>
```

Por ejemplo, para instalar el componente `button`:

```bash
npm install @academy-lit-components/button
```

Después de instalarlo, importa el componente en tu proyecto para usarlo:

```javascript
import '@academy-lit-components/button';
```

Y luego úsalo en tu HTML:

```html
<academy-button>Click me</academy-button>
```

### `lit-dev list`
Lista componentes disponibles en el catálogo

### `lit-dev dev`
Inicia servidor de desarrollo con Vite (HMR incluido)

## Convenciones de Naming

### Componentes
- **Tag name**: `academy-component-name` (prefijo `academy-`)
- **Clase**: `ComponentName` (PascalCase)
- **Archivo**: `component-name.js` (kebab-case)
- **Package**: `@academy-lit-components/component-name`

### Traducciones (locales.json)
- **Keys**: `component-name-description-text`
- **Ejemplo**: `button-submit-text`, `form-field-error-required`

### Eventos
- **Nombre**: `academy-component-event-name`
- **Ejemplo**: `academy-button-click`, `academy-form-submit`

### CSS Custom Properties
- **Nombre**: `--component-property-name`
- **Ejemplo**: `--button-bg`, `--card-padding`

### CSS Parts
- **Nombre**: `part="element-name"`
- **Ejemplo**: `part="button"`, `part="header"`

## Patrones de Uso de Mixins

### Componente con Múltiples Mixins
```javascript
import { ComponentMixin } from '@academy-lit/component-mixin';
// ComponentMixin ya incluye ScopedElementsMixin e IntlMixin

class MyComponent extends ComponentMixin(LitElement) {
  // Acceso a:
  // - this.t(key) - traducciones
  // - this.sanitizeHtml(content) - sanitización
  // - this.loading - estado de carga
  // - this._skeletonTemplate - template skeleton
  // - this.scopedElementsFromClasses() - scoped elements
}
```

### Uso de Traducciones
```javascript
render() {
  return html`
    <button>${this.t('button-submit-text')}</button>
    <p>${this.t('greeting', { name: 'Juan' })}</p>
  `;
}
```

### Scoped Elements
```javascript
import { Button } from '@academy-lit-components/button';
import { Input } from '@academy-lit-components/input';

static get scopedElements() {
  const classes = [Button, Input];
  return MyComponent.scopedElementsFromClasses(classes);
}

render() {
  return html`
    <academy-button>Click</academy-button>
    <academy-input></academy-input>
  `;
}
```

## Demo Pattern

Cada componente debe tener una demo interactiva en `demo/index.html` que incluya:
- **Header**: Título y descripción
- **Controles**: Selectores para locale, ambient, loading
- **Ejemplos**: Básico, variantes, estados, eventos
- **Event Log**: Console para ver eventos disparados
- **Code snippets**: Ejemplos de código HTML

## Testing Pattern
```javascript
import { fixture, expect, html } from '@open-wc/testing';
import './button.js';

describe('Button', () => {
  it('renders with default props', async () => {
    const el = await fixture(html`<academy-button>Click</academy-button>`);
    expect(el.shadowRoot.querySelector('button')).to.exist;
  });

  it('emits click event', async () => {
    const el = await fixture(html`<academy-button>Click</academy-button>`);
    let clicked = false;
    el.addEventListener('academy-button-click', () => clicked = true);
    el.shadowRoot.querySelector('button').click();
    expect(clicked).to.be.true;
  });

  it('respects disabled state', async () => {
    const el = await fixture(html`<academy-button disabled>Click</academy-button>`);
    expect(el.shadowRoot.querySelector('button').disabled).to.be.true;
  });
});
```

## Publicación en NPM

### Versionado Independiente
Cada componente tiene su propia versión semántica:
- `@academy-lit-components/button`: v2.1.0
- `@academy-lit-components/input`: v1.5.3
- `@academy-lit/core`: v1.0.0

### Comandos de Publicación
```bash
# Ver cambios pendientes
lerna changed

# Publicar con bump automático
lerna publish

# Publicar componente específico
pnpm --filter @academy-lit-components/button publish
```

## Dependencias Importantes

### Runtime
- `lit`: ^3.0.0 - Framework base
- `dompurify`: ^3.0.0 - Sanitización HTML (en component-mixin)

### DevTools
- `vite`: ^5.0.0 - Dev server y build
- `@web/test-runner`: ^0.18.0 - Testing
- `@open-wc/testing`: ^4.0.0 - Testing helpers
- `ejs`: ^3.1.9 - Templates del CLI
- `commander`: ^11.0.0 - CLI framework
- `chalk`: ^5.0.0 - Terminal colors
- `ora`: ^7.0.0 - Spinners
- `inquirer`: ^9.0.0 - Prompts interactivos

## Workflows de Desarrollo

### Crear Nuevo Componente
```bash
cd packages
lit-dev generate component my-component
cd my-component
npm install
npm run dev  # Demo en http://localhost:5173
```

### Trabajar en Componente Existente
```bash
cd packages/button
npm run dev     # Demo
npm run test    # Tests
npm run build   # Build para producción
```

### Trabajar en el Monorepo
```bash
# Instalar todo
pnpm install

# Dev de un package específico
pnpm --filter @academy-lit-components/button dev

# Build todos los packages
pnpm -r build

# Tests de todo
pnpm -r test
```

## Consideraciones Especiales

1. **locales.json SIEMPRE en raíz del componente** - No en subcarpetas
2. **Prefijo de componentes**: `academy-` para evitar colisiones
3. **Design tokens**: Usar siempre de `@academy-lit/core/tokens`
4. **CSS Custom Properties**: Permitir override con fallbacks a tokens
5. **Eventos**: Usar `bubbles: true, composed: true` para atravesar shadow DOM
6. **Accesibilidad**: Incluir `aria-label`, roles y keyboard navigation
7. **iOS Safari <= 16**: ComponentMixin maneja compatibilidad automáticamente

## Objetivos del Proyecto

1. ✅ CLI funcional para scaffolding rápido
2. ✅ Componentes instalables individualmente vía npm
3. ✅ Sistema de mixins reutilizables
4. ✅ Internacionalización consistente
5. ✅ Demos interactivas para cada componente
6. ✅ Testing automatizado
7. ✅ Documentación clara y completa

---

**Nota para Copilot**: Al generar código, siempre seguir estos patrones y convenciones. Priorizar claridad, reutilización y adherencia a los estándares Web Components.