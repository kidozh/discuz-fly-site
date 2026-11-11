import React from 'react'
import { Link } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'

export type DocumentEntry = {
  slug: string
  title: string
  path: string
  excerpt?: string | null
}

const projectSlugs = ['privacy_policy', 'term_of_services', 'open_source']
const guideSlugs = ['apple-watch', 'android-background-reminders', 'android-translation', 'intelligence-service']

function orderDocuments(documents: DocumentEntry[], preferred: string[]) {
  return [...documents].sort((a, b) => {
    const position = (slug: string) => preferred.includes(slug) ? preferred.indexOf(slug) : preferred.length
    return position(a.slug) - position(b.slug) || a.title.localeCompare(b.title)
  })
}

export function groupDocuments(documents: DocumentEntry[]) {
  return [
    { id: 'guides', label: 'docs.group_guides', documents: orderDocuments(documents.filter(doc => !projectSlugs.includes(doc.slug)), guideSlugs) },
    { id: 'project', label: 'docs.group_project', documents: orderDocuments(documents.filter(doc => projectSlugs.includes(doc.slug)), projectSlugs) },
  ].filter(group => group.documents.length > 0)
}

type Props = {
  documents: DocumentEntry[]
  indexPath: string
  activePath: string
  mobile?: boolean
}

export default function DocSidebar({ documents, indexPath, activePath, mobile }: Props) {
  const { t } = useTranslation()
  const title = String(t('docs.documentation'))
  const normalizedActive = activePath.replace(/\/$/, '')
  const isActive = (path: string) => path.replace(/\/$/, '') === normalizedActive
  const groups = groupDocuments(documents)
  const navigation = (
    <nav aria-label={title} className="docs-nav">
      <Link to={indexPath} className="docs-nav-link docs-nav-overview" aria-current={isActive(indexPath) ? 'page' : undefined}>
        {t('docs.overview')}
      </Link>
      {groups.map(group => (
        <div className="docs-nav-group" key={group.id}>
          <p className="docs-nav-label">{t(group.label)}</p>
          <ul>
            {group.documents.map(doc => (
              <li key={doc.path}>
                <Link to={doc.path} className="docs-nav-link" aria-current={isActive(doc.path) ? 'page' : undefined}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <aside className="docs-sidebar">
      <div className="docs-sticky docs-desktop">{navigation}</div>
      {mobile && (
        <details className="docs-disclosure docs-mobile">
          <summary>{t('docs.browse')}</summary>
          {navigation}
        </details>
      )}
    </aside>
  )
}
