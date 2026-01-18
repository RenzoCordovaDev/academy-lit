# @academy-lit-components/helper-demo

Helper component for creating interactive demos of Academy Lit components.

## Features

- 🌍 **Locale selector** - Switch between languages (es-PE, en-EN, pt-BR)
- 🌓 **Mode selector** - Toggle between light and dark modes
- 🎨 **Ambient selector** - Change ambient/theme (primary, secondary, etc.)
- 📋 **Event logger** - Capture and display component events
- 🎯 **Optional controls** - Show only the controls you need

## Installation

```bash
npm install --save-dev @academy-lit-components/helper-demo
```

## Usage

### Basic Example

```html
<academy-helper-demo show-locale show-events>
  <academy-button-basic>Click me</academy-button-basic>
</academy-helper-demo>
```

### All Features

```html
<academy-helper-demo 
  show-locale 
  show-mode 
  show-ambient 
  show-events
>
  <academy-button-basic>Button</academy-button-basic>
  <academy-link-basic href="/">Link</academy-link-basic>
</academy-helper-demo>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show-locale` | Boolean | `false` | Show language selector |
| `show-mode` | Boolean | `false` | Show mode selector (light/dark) |
| `show-ambient` | Boolean | `false` | Show ambient selector |
| `show-events` | Boolean | `false` | Show event logger |
| `locale` | String | `'es-PE'` | Current locale |
| `mode` | String | `'light'` | Current mode |
| `ambient` | String | `'primary'` | Current ambient |

## Events

| Event | Description |
|-------|-------------|
| `locale-changed` | Fired when locale changes |
| `mode-changed` | Fired when mode changes |
| `ambient-changed` | Fired when ambient changes |

## Automatic Propagation

The helper automatically propagates changes to child components:
- Sets `locale` via `setLocale()` method
- Sets `mode` property
- Sets `ambient` property

## Development Only

This component is intended for demo purposes only. Install as a dev dependency:

```json
{
  "devDependencies": {
    "@academy-lit-components/helper-demo": "^1.0.0"
  }
}
```