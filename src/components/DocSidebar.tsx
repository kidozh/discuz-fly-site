import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

type DocSidebarProps = {
  nodes: any[]
  language: string
  docPrefix: string
  activePath?: string
  showBack?: boolean
}

const DocSidebar: React.FC<DocSidebarProps> = ({ nodes, language, docPrefix, activePath, showBack }) => {
  const docBase = (lang: string) => `/${lang}/${docPrefix}`;
  const { t } = useTranslation();
  const indexLabel = t('docs.index', 'Index');
  const backLabel = t('docs.back', 'Back to docs');
  const undatedLabel = t('docs.undated', 'No date');

  function computeSlug(node: any) {
    // If caller provided a normalized `path` (from gatsby-node pageContext), derive slug from it
    if (node && node.path && typeof node.path === 'string') {
      let p = node.path;
      // normalize: remove leading slashes
      p = p.replace(/^\/+/, '');
      // remove leading language/docPrefix like "en/doc/" or "zh/doc/"
      p = p.replace(new RegExp(`^[a-z]{2}\/${docPrefix}\/?`), '');
      // if still prefixed by language, strip it (e.g. "en/..." remaining)
      p = p.replace(/^[a-z]{2}\//, '');
      p = String(p).replace(/^\/+|\/+$/g, '');
      return p;
    }

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

  const root: any = { children: new Map() };

  nodes.forEach((node: any) => {
    const slug = computeSlug(node);
    const parts = slug === '' ? [] : slug.split('/').filter(Boolean);
    let cursor = root;
      parts.forEach((part: string, idx: number) => {
      if (!cursor.children.has(part)) {
        cursor.children.set(part, { name: part, children: new Map() });
      }
      cursor = cursor.children.get(part);
      if (idx === parts.length - 1) {
        const title = node.title || node.frontmatter?.title || node.frontmatter?.slug || part;
        cursor.title = title;
        cursor.excerpt = node.excerpt || null;
        cursor.date = node.date || node.frontmatter?.date || null;
        const path = `${docBase(language)}${slug === '' ? '' : '/' + slug}`;
        cursor.path = path;
      }
    });
    if (parts.length === 0) {
      root.title = node.title || node.frontmatter?.title || 'Index';
      root.path = `${docBase(language)}`;
    }
  });

  function nodeContainsActive(node: any): boolean {
    if (!activePath) return false;
    const normalize = (p: any) => String(p || '').replace(/\/+$|^\s+|\s+$/g, '').replace(/\/$/, '');
    if (node.path && normalize(node.path) === normalize(activePath)) return true;
    const children = Array.from(node.children ? node.children.values() : []);
    return children.some((c: any) => nodeContainsActive(c));
  }

  function renderTree(node: any, prefix = ''): any {
    const items: any[] = [];
    if (node.title && node.path) {
      const normalize = (p: any) => String(p || '').replace(/\/+$|^\s+|\s+$/g, '').replace(/\/$/, '');
      const isActive = activePath && normalize(node.path) === normalize(activePath);
      const activeBg = isActive ? 'bg-brand/10 dark:bg-brand-700 dark:text-white ring-2 ring-brand' : '';
      items.push(
        <li key={node.path} className="py-2">
          <a
            href={node.path}
            className={`block p-3 border border-gray-200 rounded-md shadow-sm transform transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md ${activeBg}`}
          >
            <div className={`font-medium ${isActive ? 'text-brand' : 'text-theme'}`}>{node.title}</div>
            <div className="text-xs text-gray-400 mt-1">{node.date ? new Date(node.date).toLocaleDateString() : undatedLabel}</div>
          </a>
        </li>
      );
    }
    const children = Array.from(node.children ? node.children.values() : []);
    children.sort((a: any, b: any) => {
      const da = a.date ? new Date(a.date).getTime() : null;
      const db = b.date ? new Date(b.date).getTime() : null;
      if (da && db) return db - da; // newest first
      if (da && !db) return -1;
      if (!da && db) return 1;
      return a.name.localeCompare(b.name);
    });
    children.forEach((child: any) => {
      const childKey = `${prefix}/${child.name}`;
      const hasChildren = child.children && child.children.size > 0;
      if (hasChildren) {
        const open = nodeContainsActive(child);
        items.push(
          <li key={childKey} className="py-1">
            <details open={open}>
              <summary className="cursor-pointer font-medium">{child.name}</summary>
              <ul className="pl-4 mt-2">
                {renderTree(child, childKey)}
              </ul>
            </details>
          </li>
        );
      } else {
        const title = child.title || child.name;
        const path = child.path || `${docBase(language)}/${[...childKey.split('/').filter(Boolean)].join('/')}`;
        const normalize = (p: any) => String(p || '').replace(/\/+$|^\s+|\s+$/g, '').replace(/\/$/, '');
        const isActive = activePath && normalize(path) === normalize(activePath);
        const activeBg = isActive ? 'bg-brand/10 dark:bg-brand-700 dark:text-white ring-2 ring-brand' : '';
        items.push(
          <li key={childKey} className="py-2">
            <a
              href={path}
              className={`block p-3 border border-gray-200 rounded-md shadow-sm transform transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md ${activeBg}`}
            >
              <div className={`${isActive ? 'text-brand font-medium' : 'font-medium'}`}>{title}</div>
              <div className="text-xs text-gray-400 mt-1">{child.date ? new Date(child.date).toLocaleDateString() : undatedLabel}</div>
            </a>
          </li>
        );
      }
    });
    return items;
  }

  return (
    <nav>
      <div className="mb-3">
        {showBack ? (
          <a href={`/${language}/${docPrefix}/`} className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-brand">
            <span className="mr-2">←</span>
            <span>{backLabel}</span>
          </a>
        ) : (
          root.path ? (
            <a href={root.path} className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-brand">
              ← <span className="ml-2">{root.title || indexLabel}</span>
            </a>
          ) : null
        )}
      </div>
      <ul className="space-y-2">
        {renderTree(root)}
      </ul>
    </nav>
  );
}

export default DocSidebar;
