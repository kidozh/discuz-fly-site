// Ensure react-i18next adapter and resources are available early during
// build/plugin init by requiring the SSR initializer.
try { require('./src/i18n/i18n-ssr') } catch (e) {}
import type { GatsbyConfig } from "gatsby";
import { siteUrl } from "./site-config.json";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "DisFly",
    siteUrl
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    { resolve: "gatsby-plugin-postcss" },
    { 
      resolve: "gatsby-plugin-image" 
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locales`,
        languages: [`en`, `zh`],
        defaultLanguage: `en`,
        siteUrl,
        i18nextOptions: {
          interpolation: { escapeValue: false },
          returnNull: false,
          react: { useSuspense: false },
        },
        pages: [
        {
          // Use a path-to-regexp compatible pattern that captures any
          // nested document id or path under the `doc` prefix. This avoids
          // using the literal `*` which the plugin parses with path-to-regexp
          // and can cause an unexpected modifier error.
          matchPath: '/:lang?/doc/:documentId(.*)',
          getLanguageFromPath: true,
          excludeLanguages: ['es']
        },
        {
          matchPath: '/preview',
          languages: ['en']
        }
      ]
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `{
          site { siteMetadata { siteUrl } }
          allSitePage { nodes { path component } }
        }`,
        resolvePages: ({ allSitePage }: { allSitePage: { nodes: { path: string; component: string }[] } }) =>
          allSitePage.nodes.filter(({ path, component }) => {
            if (/^\/(?:zh\/)?404(?:\.html)?\/?$/.test(path) || path.startsWith("/en/")) return false;
            if (component.endsWith("/TagsIndex.tsx")) return false;
            return !(component.endsWith("/BlogPost.tsx") && path.startsWith("/zh/blog/"));
          }),
      },
    },

    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
  { resolve: "gatsby-transformer-remark" },
    { resolve: "gatsby-plugin-sharp" },
    { resolve: "gatsby-transformer-sharp" },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'documents', path: './src/document/' },
      __key: 'documents',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'blog', path: './blog/' },
      __key: 'blog',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
          name: 'locales',
          path: './src/locales/' 
      },
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
