import locales from './locales.json';
import { registerTranslations } from '@academy-lit/academy-intl-mixin';

export { AcademyButtonBasic } from './src/AcademyButtonBasic.js';

import { AcademyButtonBasic } from './src/AcademyButtonBasic.js';
registerTranslations(AcademyButtonBasic.is, locales);

// Auto-registro del componente
customElements.define(AcademyButtonBasic.is, AcademyButtonBasic);