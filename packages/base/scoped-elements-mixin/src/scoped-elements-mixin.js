/**
 * ScopedElementsMixin - Provides scoped custom elements registration
 * Avoids global custom element name collisions
 */

const scopedElementsRegistry = new WeakMap();

export const ScopedElementsMixin = (superClass) =>
  class extends superClass {
    /**
     * Get the scoped elements for this component
     * Override this in your component to define which elements to scope
     * @returns {Object} An object mapping tag names to element classes
     */
    static get scopedElements() {
      return {};
    }

    constructor() {
      super();
      this._initializeScopedElements();
    }

    /**
     * Initialize scoped elements for this component instance
     */
    _initializeScopedElements() {
      const scopedElements = this.constructor.scopedElements;
      if (!scopedElements || Object.keys(scopedElements).length === 0) {
        return;
      }

      const registry = {};
      Object.entries(scopedElements).forEach(([tagName, ElementClass]) => {
        this.defineScopedElement(tagName, ElementClass);
        registry[tagName] = ElementClass;
      });

      scopedElementsRegistry.set(this, registry);
    }

    /**
     * Define a scoped element
     * @param {string} tagName - The tag name for the element
     * @param {Class} ElementClass - The element class to register
     */
    defineScopedElement(tagName, ElementClass) {
      // Check if element is already defined globally
      if (!customElements.get(tagName)) {
        try {
          customElements.define(tagName, ElementClass);
        } catch (error) {
          console.warn(`Failed to define scoped element ${tagName}:`, error);
        }
      }
    }

    /**
     * Get a scoped element class by tag name
     * @param {string} tagName - The tag name to look up
     * @returns {Class|undefined} The element class if found
     */
    getScopedElement(tagName) {
      const registry = scopedElementsRegistry.get(this);
      return registry ? registry[tagName] : undefined;
    }

    /**
     * Helper method to convert an array of classes to scopedElements format
     * @param {Array<Class>} classes - Array of element classes
     * @returns {Object} Object mapping tag names to classes
     */
    static scopedElementsFromClasses(classes) {
      const result = {};
      classes.forEach((ElementClass) => {
        if (ElementClass.is) {
          result[ElementClass.is] = ElementClass;
        } else {
          console.warn('Element class must have a static "is" property:', ElementClass);
        }
      });
      return result;
    }
  };