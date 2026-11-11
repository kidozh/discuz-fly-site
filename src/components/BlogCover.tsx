import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

export const foundationModelsSlug = 'apple-intelligence-service-integration'

export default function BlogCover() {
  return (
    <div className="blog-cover" aria-hidden="true">
      <div className="blog-cover-phone">
        <div className="blog-cover-screen">
          <StaticImage src="../images/blog/foundation-models.webp" alt="" width={640} />
        </div>
      </div>
    </div>
  )
}
