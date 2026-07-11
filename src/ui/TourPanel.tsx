import { useAppStore } from '../app/store'
import { tourStops } from '../data/tourStops'

export function TourPanel() {
  const mode = useAppStore((s) => s.mode)
  const index = useAppStore((s) => s.tourIndex)
  const setIndex = useAppStore((s) => s.setTourIndex)
  const setMode = useAppStore((s) => s.setMode)
  const setSelected = useAppStore((s) => s.setSelected)
  const setProcess = useAppStore((s) => s.setProcessActive)
  if (mode !== 'tour') return null
  const stop = tourStops[index]
  const move = (next: number) => {
    setIndex(next); setSelected(tourStops[next].structure ?? null)
    if (next === 7) setProcess(true)
  }
  return <section className="tour-panel glass">
    <div className="tour-progress"><span>Guided tour</span><b>{String(index + 1).padStart(2, '0')} / {tourStops.length}</b></div>
    <div className="progress-track"><i style={{ width: `${((index + 1) / tourStops.length) * 100}%` }} /></div>
    <h2>{stop.title}</h2><p>{stop.description}</p>
    <div className="tour-actions">
      <button onClick={() => move(Math.max(0, index - 1))} disabled={index === 0}>← Previous</button>
      {index < tourStops.length - 1 ? <button className="primary" onClick={() => move(index + 1)}>Next <span>→</span></button> : <button className="primary" onClick={() => setMode('exterior')}>Finish tour</button>}
      <button className="tour-exit" onClick={() => setMode('exterior')}>Exit</button>
    </div>
  </section>
}
