/**
 * IntlMixin - Provides internationalization functionality
 * Allows components to load and use translations from locales.json
 */

let globalLocale = 'es-PE';
const translationsCache = new Map();
const translationsRegistry = new Map();

export function registerTranslations(tagName, localesData) {
  if (typeof tagName !== 'string' || !tagName) return;
  translationsRegistry.set(tagName, localesData || {});
}

export function getRegisteredTranslations(tagName) {
  if (typeof tagName !== 'string' || !tagName) return undefined;
  return translationsRegistry.get(tagName);
}

export const IntlMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        ...(super.properties || {}),
        locale: { type: String, reflect: true },
      };
    }

    constructor() {
      super();
      this.locale = globalLocale;
      this._translations = {};
      this._onLocaleChanged = (e) => {
        try {
          const newLocale = e && e.detail && e.detail.locale;
          if (newLocale && newLocale !== this.locale) {
            this.locale = newLocale;
            this.requestUpdate('locale');
          }
        } catch (_) {}
      };
      // Listen for global locale changes so all instances update
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('academy-locale-changed', this._onLocaleChanged);
      }
    }

    /**
     * Load translations from locales.json
     * @param {Object} localesData - The translations object from locales.json
     */
    loadTranslations(localesData) {
      this._translations = localesData || {};
      const cacheKey = this.constructor.name;
      translationsCache.set(cacheKey, this._translations);
    }

    /**
     * Translate a key
     * @param {string} key - The translation key
     * @param {Object} params - Optional parameters for interpolation
     * @returns {string} The translated text
     */
    t(key, params = {}) {
      const translations = this._translations[this.locale] || this._translations[globalLocale] || {};
      let text = translations[key];

      if (!text) {
        return key;
      }

      // Simple parameter interpolation
      Object.keys(params).forEach((param) => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });

      return text;
    }

    /**
     * Set the global locale
     * @param {string} locale - The locale to set (e.g., 'es-PE', 'en-EN')
     */
    setLocale(locale) {
      // Use the static setter so the change is propagated globally
      if (this.constructor && typeof this.constructor.setGlobalLocale === 'function') {
        this.constructor.setGlobalLocale(locale);
      } else {
        const oldLocale = this.locale;
        globalLocale = locale;
        this.locale = locale;
        if (oldLocale !== locale) this.requestUpdate('locale', oldLocale);
      }
    }

    /**
     * Get the current locale
     * @returns {string} The current locale
     */
    getLocale() {
      return this.locale;
    }

    /**
     * Get the global locale
     * @returns {string} The global locale
     */
    static getGlobalLocale() {
      return globalLocale;
    }

    /**
     * Set the global locale for all components
     * @param {string} locale - The locale to set
     */
    static setGlobalLocale(locale) {
      const old = globalLocale;
      globalLocale = locale;
      try {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('academy-locale-changed', { detail: { locale } }));
        }
      } catch (_) {}
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      try {
        if (typeof window !== 'undefined' && window.removeEventListener) {
          window.removeEventListener('academy-locale-changed', this._onLocaleChanged);
        }
      } catch (_) {}
    }
  };