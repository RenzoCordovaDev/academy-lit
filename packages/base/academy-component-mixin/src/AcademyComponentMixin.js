import { html } from 'lit';
import { IntlMixin, getRegisteredTranslations } from '@academy-lit/academy-intl-mixin';
import { ScopedElementsMixin } from '@academy-lit/scoped-elements-mixin';

/**
 * ComponentMixin - Base mixin that combines all core mixins
 * Provides: internationalization, scoped elements, loading state, sanitization
 */

export const AcademyComponentMixin = (superClass) =>
  class extends IntlMixin(ScopedElementsMixin(superClass)) {
    static get properties() {
      return {
        ...(super.properties || {}),
        ambient: { type: String, reflect: true },
        mode: { type: String, reflect: true },
        loading: { type: Boolean, reflect: true },
        loadingA11yLabel: { type: String, attribute: 'loading-a11y-label' },
        mediaRangeConfig: { type: Object, attribute: 'media-range-config' },
      };
    }

    constructor() {
      super();
      this.ambient = 'light';
      this.mode = 'default';
      this.loading = false;
      this.loadingA11yLabel = 'Loading...';
      this.mediaRangeConfig = {};

      this._loadRegisteredTranslations();
      
      // iOS Safari <= 16 compatibility
      this._ensureCompatibility();
    }

    _loadRegisteredTranslations() {
      if (this._translations && Object.keys(this._translations).length > 0) {
        return;
      }

      const tagName = this.constructor.is;
      const registered = getRegisteredTranslations(tagName);
      if (registered && typeof registered === 'object') {
        this.loadTranslations(registered);
      }
    }

    /**
     * Ensure compatibility with older browsers (iOS Safari <= 16)
     */
    _ensureCompatibility() {
      // Add polyfills or fallbacks if needed
      if (!window.customElements) {
        console.warn('Custom Elements not supported');
      }
    }

    /**
     * Sanitize HTML content using DOMPurify
     * @param {string} content - The HTML content to sanitize
     * @param {Array<string>} allowedTags - Optional array of allowed tags
     * @param {Function} tagNameCheck - Optional function to check tag names
     * @returns {string} Sanitized HTML
     */
    sanitizeHtml(content, allowedTags = null, tagNameCheck = null) {
      // For now, basic sanitization without DOMPurify
      // In production, you should install and use DOMPurify
      const div = document.createElement('div');
      div.textContent = content;
      return div.innerHTML;
    }

    /**
     * Get the skeleton template for loading state
     * Override this in your component for custom loading templates
     */
    get _skeletonTemplate() {
      return html`
        <div class="skeleton-loader" aria-label="${this.loadingA11yLabel}">
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      `;
    }

    /**
     * Helper method to convert an array of classes to scopedElements format
     * @param {Array<Class>} classes - Array of element classes
     * @returns {Object} Object mapping tag names to classes
     */
    static scopedElementsFromClasses(classes) {
      return ScopedElementsMixin.scopedElementsFromClasses
        ? ScopedElementsMixin.scopedElementsFromClasses(classes)
        : super.scopedElementsFromClasses(classes);
    }

    /**
     * Load translations from locales.json file
     * Automatically tries multiple paths based on component location
     * @param {string} localesPath - Optional custom path to locales.json
     */
    async loadLocalesFromFile(localesPath = null) {
      // If already loaded, skip
      if (Object.keys(this._translations).length > 0) {
        return;
      }

      // Prefer registered translations (no network)
      this._loadRegisteredTranslations();
      if (Object.keys(this._translations).length > 0) {
        this.requestUpdate();
        return;
      }

      const paths = localesPath ? [localesPath] : [
        '/locales.json',
        './locales.json',
        '../locales.json',
        '../../locales.json',
      ];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const localesData = await response.json();
            this.loadTranslations(localesData);
            this.requestUpdate(); // Force re-render after loading translations
            await this.updateComplete;
            return;
          }
        } catch (error) {
          // ignore and try next
        }
      }
      
      // translations are optional
    }

    /**
     * Automatically load locales: first via package import, then fallback to file fetch
     */
    async _loadLocalesAutomatically() {
      if (Object.keys(this._translations).length > 0) {
        return;
      }
      // Try to fetch locales.json from common locations (served by dev server or available in package)
      await this.loadLocalesFromFile().catch(() => {});
    }

    connectedCallback() {
      super.connectedCallback();
      // Auto-load locales.json if not already loaded, preferring package import
      this._loadLocalesAutomatically();
    }
  };