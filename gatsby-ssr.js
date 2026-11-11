// Load SSR-ready i18n instance/registration so react-i18next is registered
// before React renders during static HTML generation.
try { require('./src/i18n/i18n-ssr') } catch (e) {}
const React = require('react');
const { siteUrl, ga4MeasurementId } = require('./site-config.json');
const setThemeScript = `(function(){try{var ls=null;try{ls=window.localStorage.getItem('theme')}catch(e){}var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var useDark=ls==='dark'||(ls===null&&prefersDark);if(useDark)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme-ready','true')}catch(e){} })()`;

exports.onRenderBody = ({ setHeadComponents }) => {
  const scripts = [
    React.createElement('script', {
      key: 'gatsby-theme-prep',
      dangerouslySetInnerHTML: { __html: setThemeScript },
    }),
  ];

  if (process.env.NODE_ENV === 'production') {
    const measurementId = JSON.stringify(ga4MeasurementId);
    const siteHostname = JSON.stringify(new URL(siteUrl).hostname);
    scripts.push(React.createElement('script', {
      key: 'google-analytics-ga4',
      dangerouslySetInnerHTML: { __html: `
        (function () {
          if (window.location.hostname !== ${siteHostname}
            || navigator.doNotTrack === '1' || window.doNotTrack === '1'
            || navigator.globalPrivacyControl === true) return;

          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', ${measurementId}, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });

          var script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${measurementId};
          document.head.appendChild(script);
        })();
      ` },
    }));
  }

  setHeadComponents(scripts);
};

// Let page components render `Layout` themselves. Ensure i18n plugin
// wrapper is applied so translations are available during SSR.
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
