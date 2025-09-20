import React from 'react'
import MarkdownIt from 'markdown-it'

type Props = {
  code: string
}

const md = new MarkdownIt({ html: true })

const RuntimeMdxRenderer: React.FC<Props> = ({ code }) => {
  // As we removed runtime MDX dependency, fall back to rendering Markdown as HTML
  // Strip YAML frontmatter if present
  const cleaned = String(code).replace(/^---\s*[\s\S]*?---\s*/, '')
  try {
    const html = md.render(cleaned)
    return <div className="prose lg:prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
  } catch (err: any) {
    return (
      <div className="prose">
        <p>Markdown render failed:</p>
        <pre className="whitespace-pre-wrap bg-gray-50 border p-3 rounded">{String(err && err.stack ? err.stack : err)}</pre>
        <h4 className="mt-3">Source preview</h4>
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    )
  }
}

export default RuntimeMdxRenderer
