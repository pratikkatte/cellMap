import { useAppStore } from '../app/store'
import { lacExpressionLevel, lacResearch, lacStages } from '../data/lacOperon'

export function LacExperimentPanel() {
  const open = useAppStore((s) => s.lacPanelOpen)
  const running = useAppStore((s) => s.lacRunning)
  const progress = useAppStore((s) => s.lacProgress)
  const inducer = useAppStore((s) => s.lacInducer)
  const glucose = useAppStore((s) => s.lacGlucose)
  const preinduced = useAppStore((s) => s.lacPreinduced)
  const setOpen = useAppStore((s) => s.setLacPanelOpen)
  const setInducer = useAppStore((s) => s.setLacInducer)
  const setGlucose = useAppStore((s) => s.setLacGlucose)
  const setPreinduced = useAppStore((s) => s.setLacPreinduced)
  const start = useAppStore((s) => s.startLacExperiment)
  const reset = useAppStore((s) => s.resetLacExperiment)
  if (!open) return null

  const expression = lacExpressionLevel(inducer, glucose, preinduced)
  const expressed = expression * Math.min(1, progress / .9)
  const onCells = Math.round(expression * 12)
  const stageIndex = [...lacStages].reverse().findIndex((stage) => progress >= stage.start)
  const activeIndex = stageIndex < 0 ? 0 : lacStages.length - 1 - stageIndex
  const state = expression < .18 ? 'Mostly OFF' : expression < .68 ? 'Mixed response' : 'Mostly ON'

  return <aside className="lac-panel glass" aria-label="Lac operon perturbation experiment">
    <button className="close-details" onClick={() => setOpen(false)} aria-label="Close lac operon experiment">×</button>
    <div className="lac-scroll">
      <span className="eyebrow">Native gene perturbation</span>
      <h2>The lac operon switch</h2>
      <p className="lac-lead">Explore how environmental context and cellular history shape expression of the <i>lacZYA</i> operon.</p>

      <div className="evidence-badge"><span>◉</span><div><b>Paper-grounded regulatory behavior</b><small>Illustrative molecular animation</small></div></div>

      <div className="lac-state-card">
        <div><span>Expected endpoint</span><strong>{state}</strong></div>
        <div className="expression-meter" aria-label={`Current lac response ${Math.round(expressed * 100)} percent`}><i style={{ width: `${Math.round(expressed * 100)}%` }} /></div>
        <output>{Math.round(expressed * 100)}% current response</output>
      </div>

      <section className="lac-controls">
        <div className="control-title"><label htmlFor="lac-inducer">Inducer level</label><output>{Math.round(inducer * 100)}%</output></div>
        <input id="lac-inducer" className="range lac-range" type="range" min="0" max="1" step=".01" value={inducer} disabled={running} onChange={(event) => setInducer(Number(event.target.value))} />
        <label className="experiment-toggle"><input type="checkbox" checked={glucose} disabled={running} onChange={(event) => setGlucose(event.target.checked)} /><span><b>Glucose present</b><small>Reduces lac activation through carbon-source regulation</small></span><i /></label>
        <label className="experiment-toggle"><input type="checkbox" checked={preinduced} disabled={running} onChange={(event) => setPreinduced(event.target.checked)} /><span><b>Previously induced</b><small>Lowers the switching threshold through history dependence</small></span><i /></label>
      </section>

      <section className="population-readout">
        <div className="control-title"><h3>Illustrative cell population</h3><output>{onCells}/12 ON</output></div>
        <div className="cell-population" aria-label={`${onCells} of 12 cells predicted on`}>
          {Array.from({ length: 12 }, (_, i) => <i className={i < onCells ? 'on' : ''} key={i} />)}
        </div>
        <p>Cells can occupy different expression states under the same external condition.</p>
      </section>

      <section className="lac-timeline">
        <h3>Cellular response</h3>
        {lacStages.map((stage, index) => <div className={`${index === activeIndex ? 'active' : ''} ${progress >= stage.start ? 'reached' : ''}`} key={stage.id}>
          <span>{String(index + 1).padStart(2, '0')}</span><p><b>{stage.title}</b><small>{stage.description}</small></p>
        </div>)}
      </section>

      <div className="lac-actions">
        <button className="primary" onClick={start} disabled={running}>{running ? 'Induction running…' : progress > 0 ? 'Replay induction' : 'Run induction'} {!running && <span>▶</span>}</button>
        <button onClick={reset} disabled={running && progress < .02}>Reset</button>
      </div>

      <div className="source-card">
        <span>Primary research</span>
        <a href={lacResearch.url} target="_blank" rel="noreferrer">{lacResearch.title}</a>
        <small>{lacResearch.citation}</small>
        <p>{lacResearch.note}</p>
      </div>
    </div>
  </aside>
}
