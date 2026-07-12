import { useAppStore } from '../app/store'

export function TopBar() {
  const mode = useAppStore((s) => s.mode)
  const paused = useAppStore((s) => s.paused)
  const setMode = useAppStore((s) => s.setMode)
  const setSelected = useAppStore((s) => s.setSelected)
  const setTourIndex = useAppStore((s) => s.setTourIndex)
  const togglePaused = useAppStore((s) => s.togglePaused)
  const resetCamera = useAppStore((s) => s.resetCamera)
  const startTour = () => { setTourIndex(0); setSelected('outerMembrane'); setMode('tour') }
  const fullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
  return <header className="topbar glass">
    <a className="brand" href="/" aria-label="Back to CellMap worlds">
      <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
      <div><h1>Inside a Bacterial Cell</h1><p>Interactive <i>E. coli</i>-inspired cellular environment</p></div>
    </a>
    <nav className="top-actions" aria-label="Experience controls">
      <a className="worlds-link" href="/">All worlds</a>
      <a className="vision-link" href="/vision">Our vision</a>
      <button className="primary compact" onClick={startTour}>Guided tour</button>
      <button onClick={() => { setSelected(null); setMode(mode === 'interior' ? 'exterior' : 'interior') }}>{mode === 'interior' ? 'Exit cell' : 'Enter cell'}</button>
      <button className="icon-button" onClick={resetCamera} aria-label="Reset camera" title="Reset camera (R)">↻</button>
      <button className="icon-button" onClick={togglePaused} aria-label={paused ? 'Resume animation' : 'Pause animation'} title={paused ? 'Resume motion' : 'Pause motion'}>{paused ? '▶' : 'Ⅱ'}</button>
      <button className="icon-button" onClick={fullscreen} aria-label="Toggle fullscreen" title="Fullscreen">⛶</button>
    </nav>
  </header>
}
