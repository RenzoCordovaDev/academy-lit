# Publishing Strategy

This guide explains how to publish the CLI and packages, how versions are managed, and how to publish a sample component.

## Versions & Lerna

- Monorepo uses pnpm workspaces and Lerna.
- Lerna config: `version: independent` (see lerna.json). Each package versions independently.
- Recommended: Conventional Commits; bump versions per-package and use `lerna publish`.

## Publish Order

1) Base packages (runtime deps):
- @academy-lit/academy-core
- @academy-lit/scoped-elements-mixin
- @academy-lit/academy-intl-mixin
- @academy-lit/academy-component-mixin
- @academy-lit-components/academy-helper-demo (dev-only in most components)

2) Components in `packages/components/*` (e.g., academy-button-basic, academy-link-basic)

3) CLI `@academy-lit/lit-cli` can be published anytime.

All scoped packages have `publishConfig.access = public` set.

## CLI Publishing

Prereqs: `NPM_TOKEN` with publish rights (org or user scope) saved in GitHub Secrets.

Local publish:
```bash
pnpm install
cd cli
npm publish --access public
```

GitHub Actions (recommended):
- Workflow: `.github/workflows/publish-cli.yml`
- Trigger: manual (workflow_dispatch) or tag push `cli-v*`

Install for users:
```bash
npm i -g @academy-lit/lit-cli
# Provides `lit-dev` command
```

## Generated Components (outside monorepo)

Templates updated so generated packages are standalone:
- Depend on published versions: `^1.0.0` of core/mixins/helper demo.
- Include local scripts: `scripts/compile-scss-to-lit.cjs` and `scripts/watch-scss-to-lit.cjs`.
- Scripts:
```json
{
  "scripts": {
    "build:styles": "node ./scripts/compile-scss-to-lit.cjs src/<name>.styles.scss src/<name>.styles.js <Name>Styles",
    "dev": "pnpm run build:styles && vite demo",
    "build": "pnpm run build:styles && vite build"
  }
}
```

Scaffold example:
```bash
# In an empty directory
lit-dev create my-component @your-scope
npm install
npm run dev
```

Publish your component:
```bash
npm login
npm publish --access public
```

## Publish Base Packages

Local (manual):
```bash
pnpm -r build
cd packages/base/academy-core && npm publish --access public
cd ../scoped-elements-mixin && npm publish --access public
cd ../academy-intl-mixin && npm publish --access public
cd ../academy-component-mixin && npm publish --access public
cd ../components/academy-helper-demo && npm publish --access public
```

With Lerna:
```bash
# Bump versions (interactive) and tag
npx lerna version
# Publish packages with versions not on npm yet
npx lerna publish from-package --yes
```

## Publish a Sample Component

Example with `@academy-lit-components/academy-button-basic`:
```bash
pnpm -r build
cd packages/components/academy-button-basic
npm publish --access public
```

Ensure base packages are already on npm at versions compatible with the component's package.json.

## CI for Packages

Workflow: `.github/workflows/publish-packages.yml` (manual dispatch or tag `pkg-v*`). It runs build and `lerna publish from-package` using `NPM_TOKEN`.

## Notes

- Users can generate components with a custom scope using `lit-dev create <name> <scope>` and publish to their own npm scope.
- If you change base package major versions, update the CLI templates to match the new ranges.
