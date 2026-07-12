import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './vision/vision.css'
import './landing/landing.css'

const LandingPage = lazy(() => import('./landing/LandingPage'))
const App = lazy(() => import('./app/App'))
const VisionPage = lazy(() => import('./vision/VisionPage'))

const route = window.location.pathname.replace(/\/$/, '') || '/'
const page = route === '/vision' ? <VisionPage /> : route === '/explore/ecoli' ? <App /> : <LandingPage />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="route-loader"><span /><p>Entering CellMap…</p></div>}>{page}</Suspense>
  </StrictMode>,
)
