# @academy-lit/academy-component-mixin

Mixin base con utilidades y propiedades comunes para componentes Academy Lit.

Description
Incluye propiedades comunes (`ambient`, `mode`, `loading`, `mediaRangeConfig`, `loadingA11yLabel`), sanitización HTML con DOMPurify, y helpers para skeleton templates y scoped elements.

Uso
---
```javascript
import { ComponentMixin } from '@academy-lit/academy-component-mixin';

class MyComponent extends ComponentMixin(LitElement) {
	static get properties() { return { loading: { type: Boolean } }; }
	render() { return html`${this.loading ? this._skeletonTemplate : html`<slot>`}`; }
}
```

Propiedades públicas
--------------------
- `ambient` (String) — esquema visual.
- `mode` (String) — modo visual (`light`/`dark`).
- `loading` (Boolean) — estado de carga.
- `loadingA11yLabel` (String) — etiqueta accesible para loaders.

API relevante
------------
- `sanitizeHtml(content, allowedTags, tagNameCheck)` — sanitiza HTML con DOMPurify.
- `_skeletonTemplate` — getter para template de loading.
- `scopedElementsFromClasses(classes)` — helper para registrar scoped elements desde clases.

Desarrollo
---------
```bash
pnpm install
pnpm run build
pnpm run test
```

Publicación
-----------
```bash
npm publish --access public
```