import { LitElement, html } from 'lit';
import { AcademyComponentMixin } from '@academy-lit/academy-component-mixin';
import { academyButtonBasicStyles } from './academy-button-basic.styles.js';

export class AcademyButtonBasic extends AcademyComponentMixin(LitElement) {
  static get is() {
    return 'academy-button-basic';
  }

  static get properties() {
    return {
      textKey: { type: String, attribute: 'text-key' },
    };
  }

  static get styles() {
    return [academyButtonBasicStyles];
  }

  constructor() {
    super();
    this.textKey = 'I am a academy-button-basic component';
  }

  render() {
    return html`
      <div class="academy-button-basic">
        ${this.textKey ? this.t(this.textKey) : html`<slot></slot>`}
      </div>
    `;
  }
}

customElements.define(AcademyButtonBasic.is, AcademyButtonBasic);