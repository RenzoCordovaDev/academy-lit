# @academy-lit/scoped-elements-mixin

Mixin para scoping de custom elements y evitar colisiones de tags.

Descripción
-----------
Proporciona helpers para registrar elementos con tags locales y obtener clases registradas en el scope del componente.

Uso
---
```javascript
import { ScopedElementsMixin } from '@academy-lit/scoped-elements-mixin';

class MyComp extends ScopedElementsMixin(LitElement) {
	static get scopedElements() {
		return { 'my-button': MyButton };
	}
}
```

API
---
- `defineScopedElement(tagName, ComponentClass)` — registra un elemento en el scope.
- `getScopedElement(tagName)` — obtiene la clase registrada.

Desarrollo
---------
```bash
pnpm install
# @academy-lit/scoped-elements-mixin

Scoped elements mixin to avoid custom element tag collisions.

Description
-----------
`@academy-lit/scoped-elements-mixin` provides helpers to register locally-scoped custom elements and to retrieve registered classes within a component scope.

Usage
-----
```js
import { ScopedElementsMixin } from '@academy-lit/scoped-elements-mixin';

class MyComp extends ScopedElementsMixin(LitElement) {
	static get scopedElements() {
		return { 'my-button': MyButton };
	}
}
```

API
---
- `defineScopedElement(tagName, ComponentClass)`: register an element in the scope
- `getScopedElement(tagName)`: get the registered class

Development
-----------
```bash
pnpm install
pnpm run build
pnpm run test
```

Publish
-------
```bash
npm publish --access public
```