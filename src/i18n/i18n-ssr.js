// SSR-only i18n instance initializer.
// This module synchronously initializes i18next with local JSON resources
// and registers initReactI18next so that during Gatsby static HTML rendering
// react-i18next hooks don't trigger Suspense or informational warnings.
try {
  const i18next = require('i18next');
  const { initReactI18next, setI18n } = require('react-i18next');

  if (!global.__I18N_SSR_INITIALIZED) {
    i18next.use(initReactI18next);

    let en = {};
    let zh = {};
    try { en = require('../locales/en/translation.json'); } catch (e) {}
    try { zh = require('../locales/zh/translation.json'); } catch (e) {}

    try {
      i18next.init({
        resources: { en: { translation: en }, zh: { translation: zh } },
        lng: process.env.DEFAULT_LANGUAGE || 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });
    } catch (e) {
      // ignore initialization errors in restricted environments
    }

    try { if (typeof setI18n === 'function') setI18n(i18next); } catch (e) {}

    global.__I18N_SSR_INITIALIZED = true;
  }

  module.exports = i18next;
} catch (e) {
  // If i18next or react-i18next aren't available in this environment,
  // export a harmless null so requires don't crash.
  module.exports = null;
}
