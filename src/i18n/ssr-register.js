// Minimal SSR shim: only register initReactI18next so react-i18next
// won't complain during server-side rendering. Resource loading and
// initialization are handled by `gatsby-node.js`.
try {
  const i18next = require('i18next');
  const { initReactI18next } = require('react-i18next');

  if (!i18next.__registeredWithReact) {
    i18next.use(initReactI18next);
    i18next.__registeredWithReact = true;
  }
} catch (e) {
  // fail silently if dependencies are missing in some environments
}

module.exports = {};
