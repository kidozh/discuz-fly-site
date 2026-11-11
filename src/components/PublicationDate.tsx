import React from 'react'

type Props = {
  date?: string | null
  language: string
}

export default function PublicationDate({ date, language }: Props) {
  if (!date) return null
  const timestamp = new Date(date)
  if (Number.isNaN(timestamp.getTime())) return null

  const label = new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(timestamp)

  return <time dateTime={timestamp.toISOString()} lang={language}>{label}</time>
}
