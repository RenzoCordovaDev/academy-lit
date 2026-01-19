# @academy-lit-components/academy-button-basic

> Botón accesible y estilizable para acciones primarias y secundarias.

Descripción
-----------
`academy-button-basic` es un componente simple que expone estilos tematizables mediante variables CSS y soporta estados como `loading` y `disabled`. Es pensado para ser usado dentro de demos y formularios.

Instalación
-----------
```bash
npm install @academy-lit-components/academy-button-basic
```

Uso
----
```html
<academy-button-basic variant="primary">Guardar</academy-button-basic>
```

Ejemplo con JavaScript
----------------------
```html
<script type="module">
	import '@academy-lit-components/academy-button-basic';

	const btn = document.createElement('academy-button-basic');
	btn.textContent = 'Clic'
	btn.addEventListener('academy-button-basic-click', (e) => console.log('clicked', e.detail));
	document.body.appendChild(btn);
</script>
```

Propiedades públicas
# @academy-lit-components/academy-button-basic

Accessible, themeable button component for primary and secondary actions.

Description
-----------
`academy-button-basic` is a small button component that exposes themeable styles through CSS variables and supports states such as `loading` and `disabled`. It is intended for demos and forms.

Installation
------------
```bash
npm install @academy-lit-components/academy-button-basic
```

Usage
-----
```html
<academy-button-basic variant="primary">Save</academy-button-basic>
```

JavaScript example
------------------
```html
<script type="module">
	import '@academy-lit-components/academy-button-basic';

	const btn = document.createElement('academy-button-basic');
	btn.textContent = 'Click';
	btn.addEventListener('academy-button-basic-click', (e) => console.log('clicked', e.detail));
	document.body.appendChild(btn);
</script>
```

Public properties
-----------------
- `variant` (String) — `"primary" | "secondary"` — visual variant. Default: `"primary"`
- `size` (String) — `"sm" | "md" | "lg"` — button size. Default: `"md"`
- `disabled` (Boolean) — disables interactions
- `loading` (Boolean) — shows a loading state (spinner/skeleton)

Events
------
- `academy-button-basic-click` — emitted when the button is activated; `event.detail` includes `{ originalEvent }`.

Development
-----------
```bash
pnpm install
pnpm run build:styles
pnpm run dev
pnpm run test
```

Publish
-------
```bash
npm publish --access public
```