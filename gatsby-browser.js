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

// Wrap every page with Layout so Navbar/Footer are provided globally
exports.wrapPageElement = ({ element, props }) => {
  try {
    const React = require('react')
    const Layout = require('./src/components/Layout').default
    return React.createElement(Layout, props, element)
  } catch (e) {
    return element
  }
}
