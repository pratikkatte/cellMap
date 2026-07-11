import { useAppStore } from '../app/store'

export function IntroModal() {
  const open = useAppStore((s) => s.introOpen)
  const setOpen = useAppStore((s) => s.setIntroOpen)
  const setMode = useAppStore((s) => s.setMode)
  const setSelected = useAppStore((s) => s.setSelected)
  if (!open) return null
  return <div className="modal-backdrop">
    <section className="intro-card glass" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="eyebrow">A microscopic journey</div>
      <div className="intro-cell" aria-hidden="true"><span /><span /><span /></div>
      <h2 id="intro-title">Inside a Bacterial Cell</h2>
      <p className="intro-lead">Explore a living, <i>E. coli</i>-inspired Gram-negative bacterium.</p>
      <p>Orbit around the cell, enter through the envelope, inspect the nucleoid, observe ribosomes, and trigger coupled transcription and translation.</p>
      <div className="science-note"><span>i</span><p>This is an educational visualization. Molecular abundance, movement, and scale are simplified for clarity and browser performance.</p></div>
      <div className="modal-actions">
        <button className="primary" onClick={() => setOpen(false)}>Begin exploration <span>→</span></button>
        <button onClick={() => { setOpen(false); setSelected('outerMembrane'); setMode('tour') }}>Start guided tour</button>
      </div>
    </section>
  </div>
}
