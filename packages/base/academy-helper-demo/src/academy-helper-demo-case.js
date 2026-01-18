import { LitElement, html } from 'lit';
import { academyHelperDemoCaseStyles } from './academy-helper-demo-case.styles.js';

export class AcademyHelperDemoCase extends LitElement {
  static get is() { return 'academy-helper-demo-case'; }

  static get styles() {
    return [academyHelperDemoCaseStyles];
  }

  static get properties() {
    return {
      header: { type: String },
      description: { type: String },
      src: { type: String },
      viewport: { type: String, reflect: true },
      locale: { type: String, reflect: true },
      mode: { type: String, reflect: true },
      ambient: { type: String, reflect: true },
      demoCase: { type: String },
      _frameReady: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.header = '';
    this.description = '';
    this.src = '';
    this.locale = 'es-PE';
    this.mode = 'light';
    this.ambient = 'primary';
    this.viewport = 'mobile';
    this.demoCase = 'case-1';
    this._frameReady = false;
    this._frameEl = null;
  }

  firstUpdated() {
    this._frameEl = this.shadowRoot.querySelector('#case-frame');
    // ensure iframe reflects initial viewport immediately
    try {
      if (this._frameEl) {
        this._frameEl.setAttribute('data-viewport', this.viewport || 'mobile');
        if (this.viewport === 'mobile') {
          this._frameEl.style.width = '360px';
          this._frameEl.style.height = '720px';
        }
      }
    } catch (_) {}
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('locale') || changed.has('mode') || changed.has('ambient') || changed.has('demoCase') || changed.has('viewport')) {
      this._postSettingsToFrame();
    }
  }

  _handleFrameLoad() {
    this._frameReady = true;
    this._postSettingsToFrame();
  }

  _postSettingsToFrame() {
    const frame = this._frameEl;
    if (!frame || !this._frameReady) return;
    const payload = {
      type: 'academy-demo-settings',
      locale: this.locale,
      mode: this.mode,
      viewport: this.viewport,
      ambient: this.ambient,
      demoCase: this.demoCase,
    };
    // Intentar vía postMessage
    try {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage(payload, '*');
      }
    } catch (_) {}

    // Fallback: aplicar directamente al DOM si es same-origin
    try {
      const doc = frame.contentDocument;
      if (doc) {
        const explicit = doc.querySelector('[data-demo-target]');
        const candidates = explicit ? [explicit] : Array.from(doc.querySelectorAll('*'))
          .filter(n => (n.tagName || '').includes('-'))
          .filter(n => {
            const t = (n.tagName || '').toLowerCase();
            return t !== 'academy-helper-demo' && t !== 'academy-helper-demo-case';
          });
        const el = candidates[0] || null;
        if (el) {
          try { if (typeof el.setLocale === 'function') el.setLocale(this.locale); else if ('locale' in el) el.locale = this.locale; } catch (_) {}
          try { if ('mode' in el) el.mode = this.mode; } catch (_) {}
          try { if ('ambient' in el) el.ambient = this.ambient; } catch (_) {}
          try { if ('viewport' in el) el.viewport = this.viewport; else el.setAttribute && el.setAttribute('data-viewport', this.viewport); } catch (_) {}
        }
      }
    } catch (_) {}
    // Also adjust iframe size to simulate device viewport inside the demo page (visual aid)
    try {
      if (frame) {
        frame.setAttribute('data-viewport', this.viewport || 'desktop');
        if (this.viewport === 'mobile') {
          frame.style.width = '360px';
          frame.style.height = '720px';
        } else if (this.viewport === 'tablet') {
          frame.style.width = '820px';
          frame.style.height = '1080px';
        } else {
          frame.style.width = '';
          frame.style.height = '';
        }
      }
    } catch (_) {}
  }

  render() {
    return html`
      <div class="case">
        ${this.header ? html`<div class="case__header">${this.header}</div>` : ''}
        ${this.description ? html`<div class="case__description">${this.description}</div>` : ''}
        ${this.src ? html`
          <iframe id="case-frame" class="case__frame" src="${this.src}" @load=${this._handleFrameLoad}></iframe>
        ` : html`<div style="color:#999; font-style: italic;">No src provided</div>`}
      </div>
    `;
  }
}

customElements.define(AcademyHelperDemoCase.is, AcademyHelperDemoCase);