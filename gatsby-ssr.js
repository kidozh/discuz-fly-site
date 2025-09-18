try { require('./src/i18n/init') } catch (e) {}

const setThemeScript = `(function(){try{var ls=null;try{ls=window.localStorage.getItem('theme')}catch(e){}var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var useDark=ls==='dark'||(ls===null&&prefersDark);if(useDark)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme-ready','true')}catch(e){} })()`;

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    // eslint-disable-next-line react/jsx-key
    require('react').createElement('script', {
      key: 'gatsby-theme-prep',
      dangerouslySetInnerHTML: { __html: setThemeScript },
    }),
  ]);
};

// Wrap every page with the Layout component on SSR
exports.wrapPageElement = ({ element, props }) => {
  try {
    const React = require('react')
    const Layout = require('./src/components/Layout').default
    return React.createElement(Layout, props, element)
  } catch (e) {
    return element
  }
}
