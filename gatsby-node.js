// Ensure SSR shim registers initReactI18next as early as possible.
try { require('./src/i18n/i18n-ssr') } catch (e) {}

// Synchronous i18n initialization during Gatsby build (SSR/static HTML)
// This ensures react-i18next has resources available during static rendering
// and avoids React Suspense during build.
exports.onPreBootstrap = () => {
  try {
    const i18next = require('i18next');
    const { initReactI18next, setI18n } = require('react-i18next');

    if (!i18next.__initializedWithReact) {
      i18next.use(initReactI18next);

      // Load local resources synchronously from src/locales
      let en = {};
      let zh = {};
      try { en = require('./src/locales/en/translation.json'); } catch (e) {}
      try { zh = require('./src/locales/zh/translation.json'); } catch (e) {}

      try {
        i18next.init({
          resources: { en: { translation: en }, zh: { translation: zh } },
          lng: process.env.DEFAULT_LANGUAGE || 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
        });
      } catch (e) {
        // ignore init errors in some CI environments
      }

      try { if (typeof setI18n === 'function') setI18n(i18next); } catch (e) {}
      i18next.__initializedWithReact = true;
    }
  } catch (e) {
    // If modules aren't present in some contexts, fail silently.
  }
};
