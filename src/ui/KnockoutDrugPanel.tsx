import { useAppStore } from '../app/store'
import { fitnessSeverity, knockoutDrugs, knockoutResearch, knockoutStages, knockoutStageText, type KnockoutDrugId } from '../data/knockoutDrug'

const drugIds = Object.keys(knockoutDrugs) as KnockoutDrugId[]

export function KnockoutDrugPanel() {
  const open = useAppStore((s) => s.knockoutPanelOpen)
  const running = useAppStore((s) => s.knockoutRunning)
  const progress = useAppStore((s) => s.knockoutProgress)
  const drugId = useAppStore((s) => s.knockoutDrug)
  const doseIndex = useAppStore((s) => s.knockoutDoseIndex)
  const genotype = useAppStore((s) => s.knockoutGenotype)
  const setOpen = useAppStore((s) => s.setKnockoutPanelOpen)
  const setDrug = useAppStore((s) => s.setKnockoutDrug)
  const setDoseIndex = useAppStore((s) => s.setKnockoutDoseIndex)
  const setGenotype = useAppStore((s) => s.setKnockoutGenotype)
  const start = useAppStore((s) => s.startKnockoutExperiment)
  const reset = useAppStore((s) => s.resetKnockoutExperiment)
  if (!open) return null

  const drug = knockoutDrugs[drugId]
  const point = drug.doses[Math.min(doseIndex, drug.doses.length - 1)]
  const activeStage = [...knockoutStages].reverse().find((stage) => progress >= stage.start) ?? knockoutStages[0]
  const phenotype = point.score > 1 ? 'relative advantage' : point.score > -2 ? 'mild fitness defect' : point.score > -8 ? 'strong fitness defect' : 'very strong fitness defect'

  return <aside className="lac-panel knockout-panel glass" aria-label="Keio knockout and drug experiment">
    <button className="close-details" onClick={() => setOpen(false)} aria-label="Close knockout and drug experiment">×</button>
    <div className="lac-scroll">
      <span className="eyebrow">Chemical-genetic perturbation</span>
      <h2><i>tolC</i> knockout + drug</h2>
      <p className="lac-lead">Compare an envelope reference with the Keio <b>ΔtolC</b> strain under antibiotic exposure.</p>

      <div className="evidence-badge knockout-evidence"><span>●</span><div><b>Measured fitness · Nichols screen</b><small>Spatial molecular behavior is explanatory</small></div></div>

      <section className="ko-section">
        <div className="ko-section-title"><span>01</span><h3>Genotype</h3></div>
        <div className="ko-genotype" role="group" aria-label="Genotype">
          <button className={genotype === 'wildType' ? 'active' : ''} disabled={running} onClick={() => setGenotype('wildType')}><b>TolC+</b><small>Reference view</small></button>
          <button className={genotype === 'deltaTolC' ? 'active deletion' : ''} disabled={running} onClick={() => setGenotype('deltaTolC')}><b>ΔtolC</b><small>Keio deletion</small></button>
        </div>
        <p className="ko-explainer">TolC forms an outer-membrane exit duct used by several multidrug efflux systems. The deletion view removes those ducts from the scene.</p>
      </section>

      <section className="ko-section">
        <div className="ko-section-title"><span>02</span><h3>Antibiotic</h3></div>
        <div className="drug-picker">
          {drugIds.map((id) => <button key={id} disabled={running} className={drugId === id ? 'active' : ''} onClick={() => setDrug(id)}>
            <i style={{ background: knockoutDrugs[id].color }} />{knockoutDrugs[id].shortName}
          </button>)}
        </div>
        <div className="drug-description"><b>{drug.name}</b><p>{drug.mechanism}</p><span>Primary visual target · {drug.target === 'ribosome' ? 'ribosomes' : 'bacterial chromosome'}</span></div>
      </section>

      <section className="ko-section">
        <div className="ko-section-title"><span>03</span><h3>Measured condition</h3></div>
        <div className="control-title ko-dose-title"><label htmlFor="ko-dose">Screen concentration</label><output>{point.concentration}</output></div>
        <input id="ko-dose" className="range ko-range" type="range" min="0" max={drug.doses.length - 1} step="1" value={Math.min(doseIndex, drug.doses.length - 1)} disabled={running} onChange={(event) => setDoseIndex(Number(event.target.value))} />
        <div className="dose-ticks">{drug.doses.map((dose) => <span key={dose.concentration}>{dose.concentration}</span>)}</div>
      </section>

      <div className={`fitness-card ${point.score < -8 ? 'severe' : ''}`}>
        <div><span>Normalized fitness score</span><strong>{genotype === 'deltaTolC' ? point.score.toFixed(2) : 'reference'}</strong></div>
        {genotype === 'deltaTolC' ? <>
          <div className="fitness-scale"><i style={{ width: `${Math.max(4, fitnessSeverity(point.score) * 100)}%` }} /></div>
          <p>At this screened condition, ΔtolC shows a <b>{phenotype}</b>. Lower scores indicate poorer relative growth in this screen.</p>
        </> : <p>The original table reports the deletion-strain score. This reference view is provided for visual comparison and does not invent a wild-type score.</p>}
      </div>

      <section className="fitness-series">
        <div className="control-title"><h3>Measured ΔtolC series</h3><output>raw scores</output></div>
        {drug.doses.map((dose, index) => <div className={index === Math.min(doseIndex, drug.doses.length - 1) ? 'active' : ''} key={dose.concentration}>
          <span>{dose.concentration}</span><i><b className={dose.score >= 0 ? 'positive' : ''} style={{ width: `${Math.max(2, Math.min(100, Math.abs(dose.score) / 22 * 100))}%` }} /></i><output>{dose.score.toFixed(2)}</output>
        </div>)}
      </section>

      <section className="lac-timeline ko-timeline">
        <h3>Exposure sequence</h3>
        {knockoutStages.map((stage, index) => {
          const text = knockoutStageText(stage, genotype)
          return <div className={`${stage.id === activeStage.id ? 'active' : ''} ${progress >= stage.start ? 'reached' : ''}`} key={stage.id}>
            <span>{String(index + 1).padStart(2, '0')}</span><p><b>{text.title}</b><small>{text.description}</small></p>
          </div>
        })}
      </section>

      <div className="lac-actions">
        <button className="primary ko-run" onClick={start} disabled={running}>{running ? 'Exposure running…' : progress > 0 ? 'Replay exposure' : 'Run exposure'} {!running && <span>▶</span>}</button>
        <button onClick={reset} disabled={running && progress < .02}>Reset</button>
      </div>

      <div className="source-card ko-sources">
        <span>Primary research</span>
        <a href={knockoutResearch.keio.url} target="_blank" rel="noreferrer">Keio single-gene deletion collection</a>
        <small>{knockoutResearch.keio.citation}</small>
        <a href={knockoutResearch.nichols.url} target="_blank" rel="noreferrer">{knockoutResearch.nichols.title}</a>
        <small>{knockoutResearch.nichols.citation}</small>
        <p>{knockoutResearch.note}</p>
      </div>
    </div>
  </aside>
}
