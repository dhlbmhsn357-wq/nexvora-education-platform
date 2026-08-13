import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/tokens.css'
import './styles/typography.css'
import './styles.css'
import './final-polish.css'
import './styles/design-system.css'
import './styles/product-ui.css'

createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><HashRouter><App /></HashRouter></ErrorBoundary></StrictMode>)
