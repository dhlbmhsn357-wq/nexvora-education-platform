'use client'

import { useEffect, useState } from 'react'
import { HashRouter } from 'react-router-dom'
import App from '../src/App'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}
