// Ensure react-i18next adapter and resources are available early during
// build/plugin init by requiring the SSR initializer.
try { require('./src/i18n/i18n-ssr') } catch (e) {}
import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `DiscuzFlySite`,
    siteUrl: `https://discuzhub.kidozh.com/`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    { resolve: "gatsby-plugin-postcss" },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-163130656-1", // Google Analytics / GA
          "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          optimize_id: "OPT_CONTAINER_ID",
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          // Defaults to https://www.googletagmanager.com
          origin: "YOUR_SELF_HOSTED_ORIGIN",
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
    { resolve: "gatsby-plugin-image" },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locales`,
        languages: [`en`, `zh`],
        defaultLanguage: `en`,
        siteUrl: `https://discuzhub.kidozh.com/`,
        i18nextOptions: {
          interpolation: { escapeValue: false },
          returnNull: false,
          react: { useSuspense: false },
        },
      },
    },
    { resolve: "gatsby-plugin-sitemap" },

    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    { resolve: "gatsby-plugin-mdx" },
    { resolve: "gatsby-plugin-sharp" },
    { resolve: "gatsby-transformer-sharp" },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'locales', path: './src/locales/' },
      __key: 'locales',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'images', path: './src/images/' },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'pages', path: './src/pages/' },
      __key: 'pages',
    },
  ],
};

export default config;
