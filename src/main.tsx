import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import './styles/global.css'
import './styles/print.css'

// Precached service worker: the whole app works offline after first load
// (FR-050). There is no runtime caching because there are no network requests
// to cache — see vite.config.ts.
registerSW({ immediate: true })

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing from index.html')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
