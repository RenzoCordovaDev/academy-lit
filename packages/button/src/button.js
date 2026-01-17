import { LitElement, html } from 'lit';
import { ComponentMixin } from '@academy-lit/component-mixin';
import './button.styles.scss';

export class Button extends ComponentMixin(LitElement) {
  static get is() {
    return 'academy-button';
  }

  static get properties() {
    return {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
  }

  render() {
    return html`
      <button
        class="btn btn--${this.variant} btn--${this.size}"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick(e) {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent('academy-button-click', {
          detail: { originalEvent: e },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

customElements.define(Button.is, Button);