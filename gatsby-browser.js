// i18n initialization is handled during build in `gatsby-node.js`.

// Run the same initializer if a page is loaded without the HTML head script.
exports.onClientEntry = require('./src/theme').initializeTheme;
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
