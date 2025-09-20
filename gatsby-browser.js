// i18n initialization is handled during build in `gatsby-node.js`.

// Ensure theme is set before React hydrates to prevent flash of wrong theme
exports.onClientEntry = () => {
  try {
    const setTheme = () => {
      const ls = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const useDark = ls === 'dark' || (ls === null && prefersDark);
      if (useDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      // mark ready so CSS transitions can run safely
      document.documentElement.setAttribute('data-theme-ready', 'true');
    };
    setTheme();
  } catch (e) {
    // ignore
  }
};
require('./src/styles/global.css');

// Let page components render `Layout` themselves. Only ensure the
// i18n plugin's wrapper is applied so `react-i18next` provider is
// outside of page content during hydration.
exports.wrapPageElement = ({ element, props }) => {
  try {
    const i18nPlugin = require('gatsby-plugin-react-i18next')
    if (i18nPlugin && typeof i18nPlugin.wrapPageElement === 'function') {
      return i18nPlugin.wrapPageElement({ element, props })
    }
    return element
  } catch (e) {
    return element
  }
}
