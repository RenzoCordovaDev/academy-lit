# @academy-lit/academy-intl-mixin

Mixin para internacionalización (i18n) usado por componentes Academy Lit.

Descripción
-----------
Provee helpers para cargar traducciones (`locales.json`) y el helper `t(key, params)` para renderizar textos localizados dentro de templates.

Uso
---
```javascript
import { IntlMixin } from '@academy-lit/academy-intl-mixin';

class MyComp extends IntlMixin(LitElement) {
	render() { return html`${this.t('component-action-button')}`; }
}
```

Propiedades / API
-----------------
- `t(key, params)` — traduce la clave con reemplazos.
- `setLocale(locale)` — cambia el locale activo.
- `getLocale()` — obtiene el locale actual.

Desarrollo
---------
```bash
pnpm install
# @academy-lit/academy-intl-mixin

Internationalization mixin for Academy Lit components.

Description
-----------
`@academy-lit/academy-intl-mixin` provides utilities to load `locales.json` and a `t(key, params)` helper to translate strings in templates.

Usage
-----
```js
import { IntlMixin } from '@academy-lit/academy-intl-mixin';

class MyComp extends IntlMixin(LitElement) {
  render() { return html`${this.t('component-action-button')}`; }
}
```

API
---
- `t(key, params)`: translate a key with optional params
- `setLocale(locale)`: set the active locale
- `getLocale()`: get the active locale

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