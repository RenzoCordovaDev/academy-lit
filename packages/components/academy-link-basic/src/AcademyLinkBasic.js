import { LitElement, html } from 'lit';
import { AcademyComponentMixin } from '@academy-lit/academy-component-mixin';
// The styles are authored in <component>.styles.scss and compiled to <component>.styles.js
// The CLI ensures a `build:styles` script is added to package.json to generate this file.
import { AcademyLinkBasicStyles } from './academy-link-basic.styles.js';

export class AcademyLinkBasic extends AcademyComponentMixin(LitElement) {
  static get is() {
    return 'academy-link-basic';
  }

  static get properties() {
    return {
      textKey: { type: String, attribute: 'text-key' },
    };
  }

  constructor() {
    super();
    this.textKey = 'I am a academy-link-basic component';
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('academy-link-basic-click', {
      detail: true,
      bubbles: true,
      composed: true,
    }));
  }

  _handle2Click() {
    this.dispatchEvent(new CustomEvent('academy-link-basic-click-2', {
      detail: true,
      bubbles: true,
      composed: true,
    }));
  }
  static get styles() {
    return [AcademyLinkBasicStyles];
  }

  render() {
    return html`
      <div class="academy-link-basic">
        ${this.textKey ? this.t(this.textKey) : html`<slot></slot>`}
        <button @click=${this._handleClick}>Click Me</button>
        <button @click=${this._handle2Click}>Click Me</button>
      </div>
    `;
  }
}
