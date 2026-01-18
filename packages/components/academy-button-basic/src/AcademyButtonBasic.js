import { LitElement, html } from 'lit';
import { AcademyComponentMixin } from '@academy-lit/academy-component-mixin';
// The styles are authored in <component>.styles.scss and compiled to <component>.styles.js
// The CLI ensures a `build:styles` script is added to package.json to generate this file.
import { AcademyButtonBasicStyles } from './academy-button-basic.styles.js';

export class AcademyButtonBasic extends AcademyComponentMixin(LitElement) {
  static get is() {
    return 'academy-button-basic';
  }

  static get properties() {
    return {
      text: { type: String, attribute: 'text' },
      variant: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
      fullWidth: { type: Boolean, reflect: true, attribute: 'full-width' },
      loading: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.variant = 'primary';
    this.disabled = false;
    this.fullWidth = false;
    this.loading = false;
  }

  static get styles() {
    return [AcademyButtonBasicStyles];
  }

  render() {
    const classes = `academy-button-basic academy-button--${this.variant} ${this.fullWidth ? 'academy-button--full' : ''}`;
    return html`
      <button
        part="button"
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
        @click=${this._onClick}
      >
        ${this.loading
          ? html`<span class="skeleton" aria-hidden="true"></span>`
          : (this.text ? this.t(this.text) : html`<slot></slot>`)}
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(new CustomEvent('academy-button-basic-click', {
      detail: true,
      bubbles: true,
      composed: true,
    }));
  }
}
