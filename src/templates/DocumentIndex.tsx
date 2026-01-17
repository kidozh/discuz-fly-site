import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import LocalizedLink from '../components/LocalizedLink';
import SeoHead from '../components/SeoHead';
import DocSidebar from '../components/DocSidebar';
import { useTranslation } from 'gatsby-plugin-react-i18next';

const DocumentIndex = ({ data, pageContext, location }: any) => {
  const language = pageContext?.language || 'en';
  const { t } = useTranslation();
  const nodes = data?.allMarkdownRemark?.nodes || [];
  // filter nodes to only those under src/document and matching the current language
  const filtered = nodes.filter((node: any) => {
    const absolute = node.parent && node.parent.absolutePath
    if (!absolute) return false
    if (!/src\/document\//.test(absolute)) return false
    // determine language for node
    const fmLang = node.frontmatter?.language
    const m = absolute.match(/\.([a-z]{2})\.md$/i)
    const fileLang = m ? m[1] : null
    const nodeLang = fmLang || fileLang || 'en'
    return String(nodeLang) === String(language);
  });

  const docPrefix = pageContext?.docPrefix || process.env.DOC_PREFIX || 'doc';

  // build hierarchical tree from filtered nodes
  const docBase = () => `/${docPrefix}`;

  function computeSlug(node: any) {
    let slug = node.frontmatter?.slug || '';
    if (!slug && node.parent && node.parent.absolutePath) {
      const absolutePath = String(node.parent.absolutePath || '');
      const parts = absolutePath.split(/src\/document\//i);
      let rel = '';
      if (Array.isArray(parts) && parts.length > 1 && parts[1]) {
        rel = parts[1];
      } else {
        const last = absolutePath.split('/').pop();
        rel = last || '';
      }
      rel = String(rel).replace(/\.[a-z]{2}\.md$/i, '').replace(/\.md$/i, '');
      if (rel.match(/\/index$/i)) {
        slug = rel.replace(/\/index$/i, '');
      } else {
        slug = rel;
      }
      slug = slug.replace(/^\/+|\/+$/g, '');
    }
    return slug;
  }

  // tree node: { name, path, title?, children: Map }
  const root: any = { children: new Map() };

  filtered.forEach((node: any) => {
    const slug = computeSlug(node);
    const parts = slug === '' ? [] : slug.split('/').filter(Boolean);
    let cursor = root;
    parts.forEach((part: string, idx: number) => {
      if (!cursor.children.has(part)) {
        cursor.children.set(part, { name: part, children: new Map() });
      }
      cursor = cursor.children.get(part);
      // if it's the last part, attach metadata
      if (idx === parts.length - 1) {
        const title = node.frontmatter?.title || node.frontmatter?.slug || part;
        cursor.title = title;
        cursor.excerpt = node.excerpt || null;
        cursor.date = node.frontmatter?.date || null;
        const path = `${docBase()}${slug === '' ? '' : '/' + slug}`;
        cursor.path = path;
      }
    });
    // handle index files (slug === '')
    if (parts.length === 0) {
      root.title = node.frontmatter?.title || t('docs.index');
      root.path = `${docBase()}`;
    }
  });

  function renderTree(node: any, prefix = ''): any {
    const items: any[] = [];
    if (node.title && node.path) {
      items.push(
        <li key={node.path} className="py-1">
          <LocalizedLink to={node.path} className="text-brand hover:underline" prefetch="true">{node.title}</LocalizedLink>
        </li>
      );
    }
    const children = Array.from(node.children ? node.children.values() : []);
    children.sort((a: any, b: any) => a.name.localeCompare(b.name));
    children.forEach((child: any) => {
      const childKey = `${prefix}/${child.name}`;
      const hasChildren = child.children && child.children.size > 0;
      if (hasChildren) {
        items.push(
          <li key={childKey} className="py-1">
            <details>
              <summary className="cursor-pointer font-medium">{child.name}</summary>
              <ul className="pl-4 mt-2">
                {renderTree(child, childKey)}
              </ul>
            </details>
          </li>
        );
      } else {
        const title = child.title || child.name;
        const path = child.path || `${docBase()}/${[...childKey.split('/').filter(Boolean)].join('/')}`;
        items.push(
          <li key={childKey} className="py-1">
            <LocalizedLink to={path} className="hover:underline" prefetch="true">{title}</LocalizedLink>
          </li>
        );
      }
    });
    return items;
  }

  return (
    <Layout pageProps={{ language }}>
  <SeoHead title={String(t('docs.documents_title', { language }))} lang={language} />
      <main className="max-w-5xl mx-auto py-12 px-4 lg:flex lg:space-x-8">
        <aside className="w-full lg:w-1/3 mb-8 lg:mb-0">
          <h2 className="text-lg font-semibold mb-4">{String(t('docs.documentation', { language }))}</h2>
          <DocSidebar nodes={filtered} language={language} docPrefix={docPrefix} activePath={location?.pathname} />
        </aside>
        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{root.title || String(t('docs.documents_title', { language }))}</h1>
          <p className="text-sm text-gray-600">{String(t('docs.select_prompt'))}</p>
        </section>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query DocumentIndexQuery($language: String!) {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/src/document/" } }) {
      nodes {
        frontmatter {
          title
          slug
          language
          date
        }
        excerpt(pruneLength: 140)
        parent {
          ... on File {
            absolutePath
            relativePath
          }
        }
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default DocumentIndex;
