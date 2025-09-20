import React from 'react'
import { Link } from 'gatsby-plugin-react-i18next'

const LocalizedLink: React.FC<any> = (props) => {
  // Simple wrapper to centralize future link logic and keep usage ergonomic
  return <Link {...props} />
}

export default LocalizedLink
