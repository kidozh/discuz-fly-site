// Initialize react-i18next integration to avoid runtime informational warning
try {
  const i18next = require('i18next');
  const { initReactI18next, setI18n } = require('react-i18next');

  if (!i18next.__initializedWithReact) {
    i18next.use(initReactI18next);

    // Only perform synchronous initialization during server-side builds
    const isServer = typeof window === 'undefined';
    const isBuildStage = process.env.BUILD_STAGE === 'build-html' || process.env.NODE_ENV === 'production';
    if (isServer && isBuildStage) {
      let en = {};
      let zh = {};
      try { en = require('../locales/en/translation.json'); } catch (e) {}
      try { zh = require('../locales/zh/translation.json'); } catch (e) {}

      try {
        i18next.init({
          resources: { en: { translation: en }, zh: { translation: zh } },
          lng: 'en',
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
        });
      } catch (e) {
        // ignore init errors in some environments
      }

      try { if (typeof setI18n === 'function') setI18n(i18next); } catch (e) {}
    }

    i18next.__initializedWithReact = true;
  }
} catch (e) {
  // If packages are not available in some environments, fail silently
}

module.exports = {};
