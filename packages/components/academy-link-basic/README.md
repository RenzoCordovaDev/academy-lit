# @academy-lit-components/academy-link-basic

> Componente de enlace estilizado para navegaciones internas y externas.

Description
`academy-link-basic` es un componente que encapsula enlaces accesibles, permitiendo variantes visuales y soporte para atributos `target` y `rel`.

Instalación
-----------
```bash
npm install @academy-lit-components/academy-link-basic
```

Uso
----
```html
<academy-link-basic href="https://example.com" target="_blank">Visitar</academy-link-basic>
```

Propiedades públicas
--------------------
- `href` (String) — URL de destino.
- `target` (String) — destino de navegación, p.ej. `_blank`.
- `rel` (String) — valor del atributo `rel`.
- `disabled` (Boolean) — desactiva la navegación (previene click).

Eventos
-------
- `academy-link-basic-click` — disparado en click; `event.detail` contiene `{ originalEvent }`.

Desarrollo
---------
```bash
pnpm install
pnpm run build:styles
pnpm run dev
pnpm run test
```

Publicación
-----------
```bash
npm publish --access public
```