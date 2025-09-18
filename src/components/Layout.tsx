import * as React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-theme text-theme transition-colors">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
