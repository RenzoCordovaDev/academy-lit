import { LitElement, html } from 'lit';
import { academyHelperDemoStyles } from './academy-helper-demo.styles.js';

export class AcademyHelperDemo extends LitElement {
  static get is() {
    return 'academy-helper-demo';
  }

  // Enviar settings al iframe del caso activo
  _postSettingsToActiveIframe() {
    // Buscar el caso activo
    if (!Array.isArray(this._cases)) return;
    const activeCase = this._cases.find(c => c.value === this.demoCase);
    if (!activeCase || !activeCase.el) return;
    // Buscar el iframe dentro del caso
    const frame = activeCase.el.shadowRoot && activeCase.el.shadowRoot.querySelector('iframe');
    if (!frame || !frame.contentWindow) return;
    // Note: bridge wiring removed in simplified demo
    // Preparar settings
    const payload = {
      type: 'academy-demo-settings',
      locale: this.locale,
      mode: this.mode,
      viewport: this.viewport,
      ambient: this.ambient,
      demoCase: this.demoCase,
    };
    try {
      frame.contentWindow.postMessage(payload, '*');
    } catch (_) {}
  }

  static get styles() {
    return [academyHelperDemoStyles];
  }

  static get properties() {
    return {
      showLocale: { type: Boolean, attribute: 'show-locale' },
      showViewport: { type: Boolean, attribute: 'show-viewport' },
      showMode: { type: Boolean, attribute: 'show-mode' },
      showAmbient: { type: Boolean, attribute: 'show-ambient' },
      showCases: { type: Boolean, attribute: 'show-cases' },
      showEvents: { type: Boolean, attribute: 'show-events' },
      showEventsLog: { type: Boolean, attribute: false },
      // Toggle to only log CustomEvents
      onlyCustomEvents: { type: Boolean, attribute: 'only-custom' },
      // Allowlist of event types to log. Attribute 'events' accepts CSV: "type1,type2"
      events: {
        type: Array,
        attribute: 'events',
        converter: {
          fromAttribute: (value) => {
            if (!value) return [];
            try {
              return String(value)
                .split(',')
                .map(v => v.trim())
                .filter(Boolean);
            } catch (_) {
              return [];
            }
          },
        },
      },
      locale: { type: String, reflect: true },
      mode: { type: String, reflect: true },
      viewport: { type: String, reflect: true },
      ambient: { type: String, reflect: true },
      demoCase: { type: String },
      _cases: { type: Array, state: true },
      _events: { type: Array, state: true },
    };
  }

  constructor() {
    super();
    this.showLocale = false;
    this.showMode = false;
    this.showAmbient = false;
    this.showViewport = false;
    this.showCases = false;
    this.showEvents = false;
    this.showEventsLog = false;
    this.locale = 'es-PE';
    this.mode = 'light';
    this.viewport = 'mobile';
    this.ambient = 'primary';
    this.demoCase = 'case-1';
    this._events = [];
    this._cases = [];
    this.events = [];
    this._boundHandleEvent = this._handleEvent.bind(this);
    this._listenersAttached = false;
    this._childListenersAttached = false;
    // Listen to forwarded events from iframe demos via postMessage
    this._boundMessageHandler = (e) => {
      try {
        const data = e && e.data;
        if (data && data.__academyDemoEvent && data.event) {
          const type = data.event.type || 'unknown';
          const detail = data.event.detail || null;
          // Call _handleEvent with a synthetic-safe event-like object
          this._handleEvent({ type, detail, target: { tagName: 'IFRAME' }, bubbles: true, composed: true, isCustomEvent: true });
        }
      } catch (_) {}
    };
    // Event listeners removed per simplified demo
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize children and cases; no event listeners attached by default
    try { window.addEventListener('message', this._boundMessageHandler); } catch (_) {}
    this.updateComplete.then(() => {
      this._initializeChildren();
      this._refreshCases();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // No event listeners to clean up in this simplified demo
    try { window.removeEventListener('message', this._boundMessageHandler); } catch (_) {}
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // If locale, mode, ambient, viewport, or case changed, update children and iframe
    if (changedProperties.has('locale')) {
      this._updateChildrenLocale();
      this._postSettingsToActiveIframe();
    }
    if (changedProperties.has('mode')) {
      this._updateChildrenMode();
      this._postSettingsToActiveIframe();
    }
    if (changedProperties.has('viewport')) {
      this._updateChildrenViewport();
      this._postSettingsToActiveIframe();
    }
    if (changedProperties.has('ambient')) {
      this._updateChildrenAmbient();
      this._postSettingsToActiveIframe();
    }
    if (changedProperties.has('demoCase')) {
      this._updateChildrenCase();
      this._postSettingsToActiveIframe();
    }
    if (changedProperties.has('showEvents')) {
      // If the control itself was hidden, also hide the log
      if (!this.showEvents) {
        this.showEventsLog = false;
      }
    }
  }

  _initializeChildren() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      // Proactively load locales from absolute path to ensure availability in dev
      if (typeof child.loadLocalesFromFile === 'function') {
        child.loadLocalesFromFile('/locales.json').catch(() => {});
      }
      if (child.setLocale) {
        child.setLocale(this.locale);
      } else if (child.locale !== undefined) {
        child.locale = this.locale;
      }
      if (child.mode !== undefined) {
        child.mode = this.mode;
      }
      if (child.viewport !== undefined) {
        try { child.viewport = this.viewport; } catch (_) {}
      } else if (typeof child.setViewport === 'function') {
        try { child.setViewport(this.viewport); } catch (_) {}
      }
      if (child.ambient !== undefined) {
        child.ambient = this.ambient;
      }
      if ('demoCase' in child) {
        try { child.demoCase = this.demoCase; } catch (_) {}
      } else if (typeof child.setDemoCase === 'function') {
        try { child.setDemoCase(this.demoCase); } catch (_) {}
      }
    });
  }

  // Event-listening plumbing removed per user request.

  _getSlottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot ? slot.assignedElements() : [];
  }

  _refreshCases() {
    const children = this._getSlottedChildren();
    const caseEls = children.filter(el => (el.tagName || '').toLowerCase() === 'academy-helper-demo-case');
    const cases = caseEls.map((el, idx) => {
      const header = (typeof el.header === 'string' && el.header) || el.getAttribute?.('header') || `Case ${idx + 1}`;
      const value = `case-${idx + 1}`;
      return { el, header, value };
    });
    this._cases = cases;
    if (cases.length && !cases.some(c => c.value === this.demoCase)) {
      this.demoCase = cases[0].value;
    }
    this._applyCaseVisibility();
  }

  _updateChildrenLocale() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      if (child.setLocale) {
        child.setLocale(this.locale);
      } else if (child.locale !== undefined) {
        child.locale = this.locale;
      }
    });
  }

  _updateChildrenMode() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      if (child.mode !== undefined) {
        child.mode = this.mode;
      }
    });
  }

  _updateChildrenViewport() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      if ('viewport' in child) {
        try { child.viewport = this.viewport; } catch (_) {}
      } else if (typeof child.setViewport === 'function') {
        try { child.setViewport(this.viewport); } catch (_) {}
      }
    });
  }

  _setViewport(v) {
    this.viewport = v;
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if ('viewport' in child) {
        try { child.viewport = this.viewport; } catch (_) {}
      } else if (typeof child.setViewport === 'function') {
        try { child.setViewport(this.viewport); } catch (_) {}
      }
    });
    this.dispatchEvent(new CustomEvent('viewport-changed', { detail: { viewport: this.viewport } }));
    this._postSettingsToActiveIframe();
  }

  _updateChildrenAmbient() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      if (child.ambient !== undefined) {
        child.ambient = this.ambient;
      }
    });
  }

  _updateChildrenCase() {
    const children = this._getSlottedChildren();
    children.forEach(child => {
      if ('demoCase' in child) {
        try { child.demoCase = this.demoCase; } catch (_) {}
      } else if (typeof child.setDemoCase === 'function') {
        try { child.setDemoCase(this.demoCase); } catch (_) {}
      }
    });
    this._applyCaseVisibility();
  }


  _handleEvent(event) {
    const targetTag = (event && event.target && event.target.tagName) ? event.target.tagName : '(unknown)';
    console.log('[AcademyHelperDemo] 🎯 _handleEvent llamado:', event && event.type, 'Target:', targetTag, 'Compuesto:', event && event.composed, 'Burbujas:', event && event.bubbles);
    // Filter by CustomEvent when enabled
    const isCustom = (typeof CustomEvent !== 'undefined' && event instanceof CustomEvent) || (event && event.isCustomEvent === true) || (event && event.__kind === 'CustomEvent');
    if (this.onlyCustomEvents && !isCustom) {
      return;
    }
    const type = event && event.type;
    // If allowlist is set and current type is not included, skip logging
    if (Array.isArray(this.events) && this.events.length > 0) {
      if (!type || !this.events.includes(type)) return;
    }
    const eventData = {
      time: new Date().toLocaleTimeString(),
      type,
      detail: this._stringifyDetail(event && event.detail),
    };
    this._events = [eventData, ...this._events.slice(0, 49)]; // Keep last 50 events
    this.requestUpdate();
  }

  

  _stringifyDetail(detail) {
    try {
      return JSON.stringify(detail, (key, value) => {
        // Avoid serializing native Events or DOM nodes
        if (typeof Event !== 'undefined' && value instanceof Event) {
          return { eventType: value.type };
        }
        if (typeof Node !== 'undefined' && value instanceof Node) {
          return { nodeName: value.nodeName };
        }
        if (typeof value === 'function') return undefined;
        return value;
      }, 2);
    } catch (err) {
      try {
        return JSON.stringify({ type: typeof detail }, null, 2);
      } catch (_) {
        return String(detail);
      }
    }
  }

  _handleLocaleChange(e) {
    this.locale = e.target.value;
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if (child.setLocale) {
        child.setLocale(this.locale);
      } else if (child.locale !== undefined) {
        child.locale = this.locale;
      }
    });
    this.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale: this.locale } }));
  }

  _handleModeChange(e) {
    this.mode = e.target.value;
    // Propagate mode to all slotted children
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if (child.mode !== undefined) {
        child.mode = this.mode;
      }
    });
    this.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: this.mode } }));
  }

  _toggleMode() {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    // propagate
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if (child.mode !== undefined) child.mode = this.mode;
    });
    this.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode: this.mode } }));
    this._postSettingsToActiveIframe();
  }

  _handleAmbientChange(e) {
    this.ambient = e.target.value;
    // Propagate ambient to all slotted children
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if (child.ambient !== undefined) {
        child.ambient = this.ambient;
      }
    });
    this.dispatchEvent(new CustomEvent('ambient-changed', { detail: { ambient: this.ambient } }));
  }

  _handleCaseChange(e) {
    this.demoCase = e.target.value;
    // Propagate case to all slotted children if they accept it
    const children = this.shadowRoot.querySelector('slot').assignedElements();
    children.forEach(child => {
      if ('demoCase' in child) {
        try { child.demoCase = this.demoCase; } catch (err) {}
      }
    });
    this.dispatchEvent(new CustomEvent('case-changed', { detail: { demoCase: this.demoCase } }));
    this._applyCaseVisibility();
  }

  _applyCaseVisibility() {
    if (!Array.isArray(this._cases)) return;
    this._cases.forEach(c => {
      const isActive = c.value === this.demoCase;
      try {
        c.el.style.display = isActive ? '' : 'none';
        c.el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      } catch (_) {}
    });
  }

  render() {
    return html`
      <div class="demo-container">
        ${this._renderControls()}

        ${this._renderViewportBar()}

        <div class="content">
          <slot @slotchange=${this._refreshCases}></slot>
        </div>

        <div id="__event-log-root">
          ${this.showEventsLog ? this._renderEventLog() : ''}
        </div>
      </div>
    `;
  }

  _renderControls() {
    const hasControls = this.showLocale || this.showMode || this.showAmbient || this.showCases || this.showViewport || this.showEvents;
    if (!hasControls) return '';

    return html`
      <div class="controls">
        <div class="controls-left">
          ${this.showCases && this._cases?.length ? html`
            <div class="control-group">
              <label for="cases-select">Cases</label>
              <select id="cases-select" @change=${this._handleCaseChange} .value=${this.demoCase}>
                ${this._cases.map(c => html`<option value=${c.value}>${c.header}</option>`) }
              </select>
            </div>
          ` : ''}

          ${this.showLocale ? html`
            <div class="control-group">
              <label for="locale-select">Language / Idioma</label>
              <select id="locale-select" @change=${this._handleLocaleChange} .value=${this.locale}>
                <option value="es-PE">Español (es-PE)</option>
                <option value="en-EN">English (en-EN)</option>
              </select>
            </div>
          ` : ''}

          ${this.showAmbient ? html`
            <div class="control-group">
              <label for="ambient-select">Ambient / Ambiente</label>
              <select id="ambient-select" @change=${this._handleAmbientChange} .value=${this.ambient}>
                <option value="primary">Primary / Primario</option>
                <option value="secondary">Secondary / Secundario</option>
                <option value="success">Success / Éxito</option>
                <option value="danger">Danger / Peligro</option>
                <option value="warning">Warning / Advertencia</option>
                <option value="info">Info / Información</option>
              </select>
            </div>
          ` : ''}
        </div>

        <div class="controls-right">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            ${this.showMode ? html`
                <div class="control-group mode-toggle">
                  <label for="mode-toggle">Mode / Modo</label>
                  <button id="mode-toggle" @click=${this._toggleMode} aria-pressed=${this.mode === 'dark'} title="Toggle mode">
                    ${this.mode === 'dark' ? html`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>` : html`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"><circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="4.2" y1="4.2" x2="5.8" y2="5.8"/><line x1="18.2" y1="18.2" x2="19.8" y2="19.8"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.2" y1="19.8" x2="5.8" y2="18.2"/><line x1="18.2" y1="5.8" x2="19.8" y2="4.2"/></g></svg>`}
                  </button>
                </div>
            ` : ''}

            ${this.showEvents ? html`
              <div class="control-group">
                <label for="show-events-toggle">Events</label>
                <div style="position:relative; display:inline-block;">
                  <button id="show-events-toggle" @click=${this._toggleShowEvents} aria-pressed=${this.showEventsLog} title="Toggle events log" class="icon-btn">
                    ${this.showEventsLog ? html`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 22a2.5 2.5 0 002.45-2H9.55A2.5 2.5 0 0012 22zM18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z"/></svg>` : html`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>`}
                  </button>
                  <span class="events-badge" aria-hidden="true">${this._events?.length || 0}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

    _toggleShowEvents() {
      this.showEventsLog = !this.showEventsLog;
      this.requestUpdate();
      // Wait for the update cycle to complete, then position the log
      if (this.updateComplete && typeof this.updateComplete.then === 'function') {
        this.updateComplete.then(() => this._positionEventLog()).catch(() => {});
      } else {
        // Fallback: small timeout if updateComplete isn't available
        setTimeout(() => this._positionEventLog(), 50);
      }
    }

    _positionEventLog() {
      if (!this.showEventsLog) return;
      const root = this.shadowRoot;
      const btn = root.getElementById('show-events-toggle');
      const logRoot = root.getElementById('__event-log-root');
      const log = logRoot && logRoot.querySelector('.event-log');
      if (!btn || !log) return;
      const btnRect = btn.getBoundingClientRect();

      // Ensure log dimensions are known
      log.style.position = 'fixed';
      log.style.zIndex = 1000;
      log.style.opacity = '1';
      log.style.transform = 'translateY(0)';

      // Allow the browser to compute size
      const logRect = log.getBoundingClientRect();

      // Preferred position: below the button, aligned to its left
      let top = btnRect.bottom + 8; // 8px gap
      let left = btnRect.left;

      // If it would overflow right edge, shift left
      if (left + logRect.width > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - logRect.width - 8);
      }

      // If it would overflow bottom edge, position above the button
      if (top + logRect.height > window.innerHeight - 8) {
        const altTop = btnRect.top - logRect.height - 8;
        if (altTop > 8) top = altTop;
      }

      // Apply final coords (fixed, viewport-relative)
      log.style.top = `${Math.round(top)}px`;
      log.style.left = `${Math.round(left)}px`;
    }

    

  _renderViewportBar() {
    // Render the viewport bar outside the main controls, next to the cases
    if (!this._cases || this._cases.length === 0) return '';
    // Render only when showViewport is true so we don't clutter demos that don't want controls
    if (!this.showViewport) return '';

    return html`
      <div style="margin: 1rem 0; width:100%;">
        <div class="viewport-segment" role="tablist" aria-label="Viewport selector">
          <div class="viewport-segment__item" role="tab" aria-pressed=${this.viewport === 'tablet'} @click=${() => this._setViewport('tablet')}>Tablet</div>
          <div class="viewport-segment__item" role="tab" aria-pressed=${this.viewport === 'mobile'} @click=${() => this._setViewport('mobile')}>Mobile</div>
          <div class="viewport-segment__item" role="tab" aria-pressed=${this.viewport === 'desktop'} @click=${() => this._setViewport('desktop')}>Desktop</div>
        </div>
      </div>
    `;
  }

  _renderEventLog() {
    return html`
      <div class="event-log">
        <div class="event-log__header" style="display:flex; align-items:center; justify-content:space-between;">
          <h3 style="margin:0; display:flex; align-items:center; gap:0.5rem;">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" style="flex:0 0 auto;">
              <path d="M16 4h-1.5a1.5 1.5 0 0 0-3 0H10a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M9 8h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            Event Log
          </h3>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="clear-btn" @click=${this._clearEvents} title="Clear events" part="clear-btn" aria-label="Clear event log">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M3 6h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
        ${this._events.length === 0 
          ? html`<p style="color: #666; font-style: italic;">No events captured yet...</p>`
          : this._events.map(event => html`
              <div class="event-entry">
                <span class="event-time">[${event.time}]</span>
                <strong>${event.type}</strong>
                ${event.detail ? html`<pre style="margin: 0.5rem 0 0 0; font-size: 0.75rem;">${event.detail}</pre>` : ''}
              </div>
            `)
        }
      </div>
    `;
  }

  _clearEvents() {
    this._events = [];
    this.requestUpdate();
  }
}

customElements.define(AcademyHelperDemo.is, AcademyHelperDemo);