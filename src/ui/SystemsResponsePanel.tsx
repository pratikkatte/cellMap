import { useAppStore } from '../app/store'
import { currentSystemsStage, metabolicFluxes, regulatoryModules, systemsResearch, systemsScenario, systemsStages } from '../data/systemsResponse'

const maxModuleDelta = Math.max(...regulatoryModules.map((module) => Math.abs(module.delta)))
const exchangeFluxes = metabolicFluxes.filter((flux) => ['formate', 'acetate', 'ethanol'].includes(flux.id))
const maxExchange = Math.max(...exchangeFluxes.map((flux) => flux.anaerobic))

function ConditionCard({ precise }: { precise: boolean }) {
  return <section className="systems-condition">
    <div><span>Strain</span><b>{systemsScenario.organism}</b></div>
    <div><span>Medium</span><b>{systemsScenario.medium}</b></div>
    <div><span>Change</span><b>{systemsScenario.reference} → no O₂ uptake</b></div>
    {precise && <div><span>RNA data</span><b>{systemsScenario.preciseSamples.reference.length} aerobic + {systemsScenario.preciseSamples.perturbation.length} oxygen-withdrawn samples</b></div>}
  </section>
}

function PreciseContent() {
  return <>
    <span className="eyebrow">Experimental transcriptomics</span>
    <h2>PRECISE response</h2>
    <p className="lac-lead">Explore how oxygen withdrawal reorganizes coordinated gene-expression programs across the E. coli transcriptome.</p>
    <div className="evidence-badge precise-evidence"><span>●</span><div><b>Data-derived regulatory activity</b><small>Measured RNA profiles decomposed with independent component analysis</small></div></div>
    <ConditionCard precise />
    <section className="systems-section">
      <div className="systems-heading"><div><span>PRECISE-278</span><h3>Regulatory programs</h3></div><output>top 8 of 92</output></div>
      <p className="systems-copy">Activity changes compare the mean of two oxygen-withdrawn samples with four aerobic reference samples. Values are ICA activity units—not expression fold changes.</p>
      <div className="module-chart" aria-label="Top PRECISE iModulon activity changes">
        {regulatoryModules.map((module) => {
          const width = Math.abs(module.delta) / maxModuleDelta * 50
          return <div className="module-row" key={module.name} title={module.role}>
            <b>{module.name}</b>
            <span className="module-axis"><i className={module.delta >= 0 ? 'up' : 'down'} style={module.delta >= 0 ? { left: '50%', width: `${width}%` } : { right: '50%', width: `${width}%` }} /></span>
            <output className={module.delta >= 0 ? 'up' : 'down'}>{module.delta >= 0 ? '+' : ''}{module.delta.toFixed(2)}</output>
          </div>
        })}
      </div>
      <div className="module-legend"><span>lower activity</span><i /><span>higher activity</span></div>
    </section>
  </>
}

function Iml1515Content() {
  const growth = metabolicFluxes.find((flux) => flux.id === 'growth')!
  const oxygen = metabolicFluxes.find((flux) => flux.id === 'oxygen')!
  const atp = metabolicFluxes.find((flux) => flux.id === 'atp')!
  const growthDecrease = Math.round((1 - growth.anaerobic / growth.aerobic) * 100)
  return <>
    <span className="eyebrow">Genome-scale metabolic model</span>
    <h2>iML1515 metabolism</h2>
    <p className="lac-lead">Explore one predicted metabolic solution after oxygen uptake is disabled while glucose remains available.</p>
    <div className="evidence-badge model-evidence"><span>◆</span><div><b>Model-predicted metabolic flux</b><small>Parsimonious flux-balance analysis—not an experimental measurement</small></div></div>
    <ConditionCard precise={false} />
    <section className="systems-section">
      <div className="systems-heading"><div><span>iML1515</span><h3>Metabolic consequences</h3></div><output>pFBA</output></div>
      <div className="systems-metrics">
        <div><span>Growth rate</span><b>{growth.aerobic.toFixed(3)} <i>→</i> {growth.anaerobic.toFixed(3)}</b><small>{growthDecrease}% lower predicted growth · h⁻¹</small></div>
        <div><span>O₂ uptake</span><b>{oxygen.aerobic.toFixed(2)} <i>→</i> 0</b><small>mmol gDW⁻¹ h⁻¹</small></div>
        <div><span>ATP synthase</span><b>{atp.aerobic.toFixed(2)} <i>→</i> {atp.anaerobic.toFixed(2)}</b><small>negative = reverse model direction</small></div>
      </div>
      <div className="flux-chart">
        <div className="control-title"><h3>Predicted fermentation secretion</h3><output>mmol gDW⁻¹ h⁻¹</output></div>
        {exchangeFluxes.map((flux) => <div className="flux-row" key={flux.id}>
          <span>{flux.name.replace(' secretion', '')}</span><i><b style={{ width: `${flux.anaerobic / maxExchange * 100}%` }} /></i><output>{flux.anaerobic.toFixed(2)}</output>
        </div>)}
      </div>
      <p className="model-caveat">One parsimonious optimal solution at 99.9% of maximum growth, with glucose uptake capped at 10 and oxygen exchange closed. Fluxes are constraint-dependent predictions.</p>
    </section>
  </>
}

export function SystemsResponsePanel() {
  const open = useAppStore((state) => state.systemsPanelOpen)
  const example = useAppStore((state) => state.systemsExample)
  const running = useAppStore((state) => state.systemsRunning)
  const progress = useAppStore((state) => state.systemsProgress)
  const setOpen = useAppStore((state) => state.setSystemsPanelOpen)
  const start = useAppStore((state) => state.startSystemsExperiment)
  const reset = useAppStore((state) => state.resetSystemsExperiment)
  if (!open) return null

  const stages = systemsStages[example]
  const activeStage = currentSystemsStage(example, progress)
  const isPrecise = example === 'precise'
  const label = isPrecise ? 'PRECISE regulatory response' : 'iML1515 metabolic prediction'

  return <aside className={`lac-panel systems-panel ${isPrecise ? 'precise-panel' : 'model-panel'} glass`} aria-label={`${label} experiment`}>
    <button className="close-details" onClick={() => setOpen(false)} aria-label={`Close ${label}`}>×</button>
    <div className="lac-scroll">
      {isPrecise ? <PreciseContent /> : <Iml1515Content />}

      <section className="lac-timeline systems-timeline">
        <h3>{isPrecise ? 'Regulatory response sequence' : 'Model perturbation sequence'}</h3>
        {stages.map((stage, index) => <div className={`${stage.id === activeStage.id ? 'active' : ''} ${progress >= stage.start ? 'reached' : ''}`} key={stage.id}>
          <span>{String(index + 1).padStart(2, '0')}</span><p><b>{stage.title}</b><small>{stage.description}</small></p>
        </div>)}
      </section>

      <div className="lac-actions">
        <button className="primary systems-run" onClick={start} disabled={running}>{running ? 'Response running…' : progress > 0 ? 'Replay example' : `Run ${isPrecise ? 'PRECISE' : 'iML1515'} example`} {!running && <span>▶</span>}</button>
        <button onClick={reset} disabled={running && progress < .02}>Reset</button>
      </div>

      <div className="source-card systems-sources">
        <span>{isPrecise ? 'Experimental data provenance' : 'Model provenance'}</span>
        {isPrecise ? <>
          <a href={systemsResearch.precise.url} target="_blank" rel="noreferrer">{systemsResearch.precise.title}</a>
          <small>{systemsResearch.precise.citation}</small>
          <a href={systemsResearch.precise.dataUrl} target="_blank" rel="noreferrer">PRECISE source data repository</a>
          <a href={systemsResearch.imodulondb.url} target="_blank" rel="noreferrer">{systemsResearch.imodulondb.title}</a>
          <p>These activities are derived from experimental RNA profiles. The 3D positions, particle counts, and animation timing are explanatory encodings.</p>
        </> : <>
          <a href={systemsResearch.iml1515.url} target="_blank" rel="noreferrer">{systemsResearch.iml1515.title}</a>
          <small>{systemsResearch.iml1515.citation}</small>
          <a href={systemsResearch.iml1515.modelUrl} target="_blank" rel="noreferrer">iML1515 model on BiGG</a>
          <p>The displayed fluxes are one constraint-dependent prediction. They do not claim that every cell follows this unique flux state.</p>
        </>}
      </div>
    </div>
  </aside>
}
