import locales from './locales.json';
import { registerTranslations } from '@academy-lit/academy-intl-mixin';

export { AcademyLinkBasic } from './src/AcademyLinkBasic.js';

import { AcademyLinkBasic } from './src/AcademyLinkBasic.js';
registerTranslations(AcademyLinkBasic.is, locales);

// Auto-registro del componente
customElements.define(AcademyLinkBasic.is, AcademyLinkBasic);