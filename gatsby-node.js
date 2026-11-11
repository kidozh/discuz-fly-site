// Ensure SSR shim registers initReactI18next as early as possible.
try { require('./src/i18n/i18n-ssr') } catch (e) {}

// Initialize i18n synchronously during bootstrap so translations are available
// during static rendering.
exports.onPreBootstrap = () => {
  try {
    const i18next = require('i18next');
    const { initReactI18next, setI18n } = require('react-i18next');

    if (!i18next.__initializedWithReact) {
      i18next.use(initReactI18next);
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
    // ignore if not available
  }
};

// Explicitly declare Markdown frontmatter fields so GraphQL recognizes optional fields
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      title: String
      slug: String
      language: String
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions;

  const DOC_PREFIX = process.env.DOC_PREFIX || 'doc';
  const languages = (process.env.SITE_LANGUAGES || 'en,zh').split(',');
  const defaultLang = process.env.DEFAULT_LANGUAGE || 'en';
  const languagesArr = languages.map((l) => l.trim()).filter(Boolean);
  const docRoot = `/${DOC_PREFIX}/`;
  const localizedDocPath = (lang, path = docRoot) => lang === defaultLang ? path : `/${lang}${path}`;
  // Always enable markdown page generation so docs are produced in all environments
  const ENABLE_MARKDOWN_PAGES = true;

  const generated = [];

  // The default language uses the site's unprefixed routes.
  createRedirect({ fromPath: `/${defaultLang}${docRoot}`, toPath: docRoot, isPermanent: true, redirectInBrowser: true });

  // create index pages per language
  try {
    const indexComponent = require.resolve('./src/templates/DocumentIndex.tsx');
    languagesArr.forEach((lang) => {
      if (!lang) return;
      createPage({
        path: localizedDocPath(lang),
        component: indexComponent,
        context: {
          language: lang,
          docPrefix: DOC_PREFIX,
          i18n: {
            language: lang,
            languages: languagesArr,
            defaultLanguage: defaultLang,
            generateDefaultLanguagePage: false,
            routed: true,
            originalPath: `/${DOC_PREFIX}/`,
          },
        },
      });
      generated.push({ id: `index-${lang}`, path: localizedDocPath(lang), type: 'index', language: lang });
    });
  } catch (e) {
    reporter.warn('Failed to create document index pages');
  }

    try {
      const introspect = await graphql(`{ __type(name: "File") { fields { name } } }`);
      const fileType = introspect && introspect.data && introspect.data.__type;
      const hasChildMarkdown = fileType && fileType.fields && fileType.fields.some((f) => f.name === 'childMarkdownRemark');

      if (!hasChildMarkdown) {
        reporter.info('Skipping markdown page generation because `childMarkdownRemark` is not present in schema');
      } else {
        const mdResult = await graphql(`
          {
            allFile(filter: { sourceInstanceName: { eq: "documents" }, extension: { in: ["md", "markdown"] } }) {
              nodes {
                id
                absolutePath
                relativePath
                childMarkdownRemark {
                  id
                  html
                  rawMarkdownBody
                  frontmatter {
                    slug
                    date
                    language
                    title
                  }
                }
              }
            }
          }
        `);

        if (!mdResult.errors) {
          const files = mdResult.data?.allFile?.nodes || [];

          const docsList = files.map((fileNode) => {
            const md = fileNode.childMarkdownRemark;
            if (!md) return null;
            const nodePath = fileNode.absolutePath;
            let lang = md.frontmatter && md.frontmatter.language;
            if (!lang && nodePath) {
              const m = nodePath.match(/\.([a-z]{2})\.md$/i);
              if (m) lang = m[1];
            }
            if (!lang) lang = defaultLang;

            let slug = md.frontmatter && md.frontmatter.slug;
            if (!slug && nodePath) {
              const parts = nodePath.split(/src\/document\//i);
              let rel = parts.length > 1 ? parts[1] : fileNode.relativePath || fileNode.absolutePath.split('/').pop();
              rel = rel.replace(/\.[a-z]{2}\.md$|\.md$/i, '');
              if (rel.match(/\/index$/i)) slug = rel.replace(/\/index$/i, '');
              else slug = rel;
              slug = slug.replace(/^\/+|\/+$/g, '');
            }
            if (!slug) slug = fileNode.id;
            slug = String(slug).replace(/^\/+|\/+$/g, '');
            const langPrefix = `${lang}/`;
            if (slug.startsWith(langPrefix)) slug = slug.slice(langPrefix.length);

            const originalPath = `${docRoot}${slug}/`.replace(/\/+/g, '/');
            const pagePath = localizedDocPath(lang, originalPath);

            let title = md.frontmatter && md.frontmatter.title;
            if (!title) {
              const raw = md.rawMarkdownBody || '';
              const match = raw.match(/^#\s+(.+)$/m);
              if (match && match[1]) title = match[1].trim();
            }
            if (!title) {
              try {
                const rel = fileNode.relativePath || fileNode.absolutePath.split(/\\/).pop();
                title = rel.replace(/\.[a-z]{2}\.md$|\.md$/i, '').replace(/(^index$)|(^index\.[a-z]{2}$)/i, '') || rel;
                title = String(title).replace(/[-_]/g, ' ').replace(/^\//, '').trim();
              } catch (e) {
                title = null;
              }
            }

            return { id: md.id, path: pagePath, originalPath, language: lang, title: title || null, slug, html: md.html || null, date: md.frontmatter?.date || null };
          }).filter(Boolean);

          const component = require.resolve('./src/templates/MarkdownDocument.tsx');

          const translations = new Map();
          docsList.forEach(({ originalPath, language, path }) => {
            if (!translations.has(originalPath)) translations.set(originalPath, {});
            translations.get(originalPath)[language] = path;
          });

          docsList.forEach((doc) => {
            const paths = translations.get(doc.originalPath);
            const alternates = Object.keys(paths).length > 1
              ? { ...paths, ...(paths[defaultLang] ? { 'x-default': paths[defaultLang] } : {}) }
              : undefined;
            createPage({
              path: doc.path,
              component,
              context: {
                id: doc.id,
                language: doc.language,
                html: doc.html || null,
                title: doc.title || null,
                alternates,
                docPrefix: DOC_PREFIX,
                docPages: docsList,
                i18n: {
                  language: doc.language,
                  languages: languagesArr,
                  defaultLanguage: defaultLang,
                  generateDefaultLanguagePage: false,
                  routed: true,
                  originalPath: doc.originalPath,
                },
              },
            });

            generated.push({ id: doc.id, path: doc.path, language: doc.language, title: doc.title || null });

            if (doc.slug) {
              createRedirect({ fromPath: `/${doc.language}/${doc.slug}/`, toPath: doc.path, isPermanent: true, redirectInBrowser: true });
              if (doc.language === defaultLang) {
                createRedirect({ fromPath: `/${defaultLang}${doc.originalPath}`, toPath: doc.path, isPermanent: true, redirectInBrowser: true });
              }
            }
          });

          // Create language-aware redirects for common legacy routes
          const legacySlugs = ['privacy_policy', 'term_of_services', 'terms_of_services', 'terms_of_service', 'terms'];
          // ensure unique mapping to our canonical slugs
          const canonical = {
            privacy_policy: 'privacy_policy',
            term_of_services: 'term_of_services',
            terms_of_services: 'term_of_services',
            terms_of_service: 'term_of_services',
            terms: 'term_of_services',
          };

          // root-level redirects to default language
          legacySlugs.forEach((s) => {
            const toSlug = canonical[s] || s;
            const toPath = `${docRoot}${toSlug}/`;
            createRedirect({ fromPath: `/${s}/`, toPath, isPermanent: true, redirectInBrowser: true });
            createRedirect({ fromPath: `/${s}`, toPath, isPermanent: true, redirectInBrowser: true });
          });

          // language-prefixed redirects: /zh/privacy_policy -> /zh/doc/privacy_policy/
          languagesArr.forEach((lang) => {
            legacySlugs.forEach((s) => {
              const toSlug = canonical[s] || s;
              const fromA = `/${lang}/${s}`.replace(/\/+/g, '/');
              const fromB = `/${lang}/${s}/`.replace(/\/+/g, '/');
              const toPath = localizedDocPath(lang, `${docRoot}${toSlug}/`);
              createRedirect({ fromPath: fromA, toPath, isPermanent: true, redirectInBrowser: true });
              createRedirect({ fromPath: fromB, toPath, isPermanent: true, redirectInBrowser: true });
            });
          });
        }
      }
    } catch (e) {
      try {
        reporter.warn('Failed to create pages from markdown files: ' + (e && (e.stack || e.message || String(e))));
      } catch (err) {
        console.error('Failed to create pages from markdown files', e);
      }
      console.error('createPages(markdown) error:', e);
    }

  // write generated pages metadata to public/doc-pages.json (so it can be used at runtime)
  try {
    const fs = require('fs');
    const outDir = 'public';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(`${outDir}/doc-pages.json`, JSON.stringify(generated, null, 2));
    reporter.info(`Wrote ${outDir}/doc-pages.json with ${generated.length} entries`);
  } catch (e) {
    reporter.warn('Failed to write public/doc-pages.json');
  }

  // --- Blog generation (single-language, no i18n) ---
  try {
    const blogResult = await graphql(`
      {
        allFile(filter: { sourceInstanceName: { eq: "blog" }, extension: { in: ["md", "markdown"] } }) {
          nodes {
            id
            relativePath
            childMarkdownRemark {
              id
              html
              rawMarkdownBody
              frontmatter {
                title
                slug
                date
                excerpt
              }
            }
          }
        }
      }
    `);

    if (!blogResult.errors) {
      const blogFiles = blogResult.data?.allFile?.nodes || [];
      const blogComponent = require.resolve('./src/templates/BlogPost.tsx');
      const blogIndexComponent = require.resolve('./src/templates/BlogIndex.tsx');

      // normalize posts list for context and feed
      const posts = blogFiles.map((f) => {
        const md = f.childMarkdownRemark || {};
        const fm = md.frontmatter || {};
        const slug = String(fm.slug || (f.relativePath || '').replace(/\.md$|\.markdown$/i, '')).replace(/^\/+|\/+$/g, '');
        const path = `/blog/${slug}/`;
        const date = fm.date || null;
        const excerpt = fm.excerpt || '';
        const title = fm.title || slug;
        const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
        return { id: md.id || slug, slug, path, date, excerpt, title, tags, html: md.html || null };
      }).sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const postsForContext = posts.map((p) => ({ id: p.id, frontmatter: { title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt, tags: p.tags }, relativePath: p.slug }))

      // Pagination settings
      const PAGE_SIZE = 5;

      // create language-prefixed blog index, pagination, tags and posts
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

      // For backwards compatibility keep the unprefixed `/blog/` as the default language index
  createPage({ path: '/blog/', component: blogIndexComponent, context: { language: defaultLang, posts: postsForContext, currentPage: 1, totalPages, pageSize: PAGE_SIZE, i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: '/blog/' } } });

  // create paginated pages for default language: /blog/page/2/ ...
  for (let i = 2; i <= totalPages; i++) {
  const pagePath = `/blog/page/${i}/`;
  createPage({ path: pagePath, component: blogIndexComponent, context: { language: defaultLang, posts: postsForContext, currentPage: i, totalPages, pageSize: PAGE_SIZE, i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: pagePath } } });
  }

  // Create language-prefixed versions for each supported language (e.g. /zh/blog/)
  languagesArr.forEach((lang) => {
    const base = `/${lang}/blog`;
    const baseIndex = `${base}/`;
    // index page
  createPage({ path: baseIndex, component: blogIndexComponent, context: { language: lang, posts: postsForContext, currentPage: 1, totalPages, pageSize: PAGE_SIZE, i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: baseIndex.slice(lang.length + 1) } } });
    // paginated pages
    for (let i = 2; i <= totalPages; i++) {
  const pagePath = `${base}/page/${i}/`;
  createPage({ path: pagePath, component: blogIndexComponent, context: { language: lang, posts: postsForContext, currentPage: i, totalPages, pageSize: PAGE_SIZE, i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: pagePath.slice(lang.length + 1) } } });
    }
  });

      // collect tags and create tag index pages (with pagination)
      const tagMap = new Map();
      posts.forEach((p) => {
        (p.tags || []).forEach((t) => {
          const arr = tagMap.get(t) || [];
          arr.push(p);
          tagMap.set(t, arr);
        });
      });

      Array.from(tagMap.entries()).forEach(([tag, tagPosts]) => {
        const tagSlug = String(tag).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const tagPostsForContext = tagPosts.map((p) => ({ id: p.id, frontmatter: { title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt, tags: p.tags }, relativePath: p.slug }))
        const tagTotalPages = Math.max(1, Math.ceil(tagPosts.length / PAGE_SIZE));
  // page 1 (unprefixed)
  createPage({ path: `/blog/tag/${tagSlug}/`, component: blogIndexComponent, context: { language: defaultLang, posts: tagPostsForContext, selectedTag: tag, currentPage: 1, totalPages: tagTotalPages, pageSize: PAGE_SIZE, i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: `/blog/tag/${tagSlug}/` } } })
  // create language-prefixed tag pages
  languagesArr.forEach((lang) => {
    const base = `/${lang}/blog/tag/${tagSlug}`;
    const baseIndex = `${base}/`;
  createPage({ path: baseIndex, component: blogIndexComponent, context: { language: lang, posts: tagPostsForContext, selectedTag: tag, currentPage: 1, totalPages: tagTotalPages, pageSize: PAGE_SIZE, i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: baseIndex.slice(lang.length + 1) } } });
    for (let i = 2; i <= tagTotalPages; i++) {
  const tagPagePath = `${base}/page/${i}/`;
  createPage({ path: tagPagePath, component: blogIndexComponent, context: { language: lang, posts: tagPostsForContext, selectedTag: tag, currentPage: i, totalPages: tagTotalPages, pageSize: PAGE_SIZE, i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: tagPagePath.slice(lang.length + 1) } } })
    }
  });
        // additional pages (unprefixed)
        for (let i = 2; i <= tagTotalPages; i++) {
          const tagPagePath = `/blog/tag/${tagSlug}/page/${i}/`;
          createPage({ path: tagPagePath, component: blogIndexComponent, context: { language: defaultLang, posts: tagPostsForContext, selectedTag: tag, currentPage: i, totalPages: tagTotalPages, pageSize: PAGE_SIZE, i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: tagPagePath } } })
        }
      });

      // Create a centralized tags index page (/tags/ and per-language)
      try {
        const tagsWithCounts = Array.from(tagMap.entries()).map(([t, arr]) => ({ tag: t, count: (arr || []).length })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
        const tagsComponent = require.resolve('./src/templates/TagsIndex.tsx');
        // unprefixed /tags/
        createPage({ path: `/tags/`, component: tagsComponent, context: { tags: tagsWithCounts, i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: `/tags/` } } });
        // per-language tags
        languagesArr.forEach((lang) => {
          const base = `/${lang}/tags/`;
          createPage({ path: base, component: tagsComponent, context: { tags: tagsWithCounts, i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: '/tags/' } } });
        });
      } catch (e) {
        // non-fatal
      }

      // Create individual post pages with previous/next in context
      // NOTE: do not pass rendered `html` into page context to avoid SSR build-time issues with certain modules.
      for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        const previous = i > 0 ? posts[i - 1] : null; // newer
        const next = i < posts.length - 1 ? posts[i + 1] : null; // older

        // default (unprefixed) path
        createPage({
          path: p.path,
          component: blogComponent,
          context: {
            language: defaultLang,
            id: p.id,
            title: p.title || null,
            date: p.date || null,
            excerpt: p.excerpt || null,
            previous: previous ? { id: previous.id, title: previous.title, slug: previous.slug, path: previous.path, date: previous.date || null, excerpt: previous.excerpt || null } : null,
            next: next ? { id: next.id, title: next.title, slug: next.slug, path: next.path, date: next.date || null, excerpt: next.excerpt || null } : null,
            i18n: { language: defaultLang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: p.path },
          },
        });

        // create language-prefixed paths for each supported language
        languagesArr.forEach((lang) => {
          const langPath = `/${lang}${p.path}`.replace(/\/+/g, '/');
          createPage({
            path: langPath,
            component: blogComponent,
            context: {
              language: lang,
              id: p.id,
              title: p.title || null,
              date: p.date || null,
              excerpt: p.excerpt || null,
              previous: previous ? { id: previous.id, title: previous.title, slug: previous.slug, path: `/${lang}${previous.path}`.replace(/\/+/g, '/'), date: previous.date || null, excerpt: previous.excerpt || null } : null,
              next: next ? { id: next.id, title: next.title, slug: next.slug, path: `/${lang}${next.path}`.replace(/\/+/g, '/'), date: next.date || null, excerpt: next.excerpt || null } : null,
              i18n: { language: lang, languages: languagesArr, defaultLanguage: defaultLang, generateDefaultLanguagePage: false, routed: true, originalPath: p.path },
            },
          });
        });
      }

      // Generate RSS feed (simple RSS 2.0)
      try {
        const siteQuery = await graphql(`{ site { siteMetadata { siteUrl title } } }`);
        const siteUrl = siteQuery.data?.site?.siteMetadata?.siteUrl || '';
        const siteTitle = siteQuery.data?.site?.siteMetadata?.title || 'Blog';
        const items = posts.map((p) => {
          const url = (siteUrl || '').replace(/\/$/, '') + p.path;
          const pubDate = p.date ? new Date(p.date).toUTCString() : new Date().toUTCString();
          const description = p.excerpt || (p.html ? p.html.replace(/<[^>]+>/g, '').slice(0, 200) : '');
          return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${p.html || ''}]]></content:encoded>
    </item>`
        }).join('\n');

        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>Blog feed</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

        const fs = require('fs');
        const outDir = 'public';
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(`${outDir}/blog.xml`, rss, 'utf8');
        reporter.info(`Wrote ${outDir}/blog.xml with ${posts.length} items`);
      } catch (e) {
        reporter.warn('Failed to write RSS feed: ' + String(e));
      }
    }
  } catch (e) {
    reporter.warn('Failed to generate blog pages: ' + String(e));
  }
};

// GitHub Pages serves files, so Gatsby's browser redirects alone can't handle direct visits.
exports.onPostBuild = ({ store }) => {
  const fs = require('fs');
  const path = require('path');
  const { siteUrl } = require('./site-config.json');
  const { pages, redirects } = store.getState();
  const docPrefix = process.env.DOC_PREFIX || 'doc';
  const staticPath = /^\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\/$/i;
  const written = new Set();

  fs.writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', siteUrl).href}\n`);

  for (const { fromPath, toPath } of redirects) {
    const from = fromPath.endsWith('/') ? fromPath : fromPath + '/';
    if (from === toPath || !staticPath.test(from) || !staticPath.test(toPath)) continue;
    if (!toPath.startsWith(`/${docPrefix}/`) && toPath.split('/')[2] !== docPrefix) continue;
    if (written.has(from) || pages.has(from) || !pages.has(toPath)) continue;

    const dir = path.join('public', from.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    const canonicalUrl = new URL(toPath, siteUrl).href;
    const lang = toPath.startsWith('/zh/') ? 'zh' : 'en';
    const title = lang === 'zh' ? '正在跳转' : 'Redirecting';
    fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="canonical" href="${canonicalUrl}">
    <meta http-equiv="refresh" content="0;url=${toPath}">
  </head>
  <body><a href="${toPath}">${title}</a></body>
</html>
`);
    written.add(from);
  }
};
