# @academy-lit/academy-core
# @academy-lit/academy-core

Design tokens and utility functions used across Academy Lit components.

Description
-----------
`@academy-lit/academy-core` provides design tokens (colors, spacing, typography) and small DOM helpers used by components in this repository.

Usage
-----
Import tokens or utilities from the package:

```js
import { tokens } from '@academy-lit/academy-core/tokens';
import { formatDate } from '@academy-lit/academy-core/utils';

console.log(tokens['--color-primary']);
console.log(formatDate(new Date()));
```

Public API
----------
- `tokens`: design token exports (CSS variables and JS helpers)
- `utils`: helper functions (DOM helpers, formatting)

Properties & Events
-------------------
This package does not expose web component properties or events; it provides utilities and token files.

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