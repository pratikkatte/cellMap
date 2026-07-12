import type { LayerId, StructureId } from '../app/types'
import { useAppStore } from '../app/store'
import { layerLabels, structures } from '../data/structures'

const presets: Record<string, Partial<Record<LayerId, boolean>>> = {
  'Whole cell': { outerMembrane: true, peptidoglycan: true, innerMembrane: true, cytoplasm: true, nucleoid: true, ribosomes: true, proteins: true, membraneComplexes: true, pili: true, flagellum: true },
  'Cell envelope': { outerMembrane: true, peptidoglycan: true, innerMembrane: true, cytoplasm: false, nucleoid: false, ribosomes: false, proteins: false, membraneComplexes: true, pili: false, flagellum: false },
  'Cytoplasm': { outerMembrane: false, peptidoglycan: false, innerMembrane: true, cytoplasm: true, nucleoid: true, ribosomes: true, proteins: true, membraneComplexes: false, pili: false, flagellum: false },
  'Genetic machinery': { outerMembrane: false, peptidoglycan: false, innerMembrane: false, cytoplasm: true, nucleoid: true, ribosomes: true, proteins: false, membraneComplexes: false, pili: false, flagellum: false },
  'Motility system': { outerMembrane: true, peptidoglycan: true, innerMembrane: true, cytoplasm: false, nucleoid: false, ribosomes: false, proteins: false, membraneComplexes: true, pili: true, flagellum: true },
}

const structureGroups: { label: string; items: StructureId[] }[] = [
  { label: 'Cell envelope', items: ['outerMembrane', 'porin', 'periplasm', 'peptidoglycan', 'innerMembrane', 'atpSynthase'] },
  { label: 'Interior', items: ['nucleoid', 'chromosome', 'ribosome', 'plasmid'] },
  { label: 'Motility', items: ['flagellarMotor', 'flagellum', 'pilus'] },
]

export function StructurePanel() {
  const open = useAppStore((s) => s.leftOpen)
  const selected = useAppStore((s) => s.selected)
  const layers = useAppStore((s) => s.layers)
  const density = useAppStore((s) => s.density)
  const quality = useAppStore((s) => s.quality)
  const togglePanel = useAppStore((s) => s.togglePanel)
  const setSelected = useAppStore((s) => s.setSelected)
  const toggleLayer = useAppStore((s) => s.toggleLayer)
  const setLayers = useAppStore((s) => s.setLayers)
  const setDensity = useAppStore((s) => s.setDensity)
  const setQuality = useAppStore((s) => s.setQuality)
  const setProcessActive = useAppStore((s) => s.setProcessActive)
  const setLacPanelOpen = useAppStore((s) => s.setLacPanelOpen)
  const setKnockoutPanelOpen = useAppStore((s) => s.setKnockoutPanelOpen)
  const openSystemsExample = useAppStore((s) => s.openSystemsExample)
  return <aside className={`left-panel glass panel ${open ? '' : 'collapsed'}`}>
    <button className="collapse-button" onClick={() => togglePanel('left')} aria-label={open ? 'Collapse structure panel' : 'Expand structure panel'}>{open ? '‹' : '›'}</button>
    {open && <div className="panel-scroll">
      <div className="panel-heading"><span className="eyebrow">Explore</span><h2>Cell structures</h2></div>
      <div className="structure-tree">
        {structureGroups.map((group) => <section key={group.label}>
          <h3>{group.label}</h3>
          {group.items.map((id) => <button key={id} className={`structure-row ${selected === id ? 'active' : ''}`} onClick={() => setSelected(id)}>
            <span className={`structure-dot dot-${id}`} />{structures[id].name}<span className="chevron">›</span>
          </button>)}
        </section>)}
      </div>
      <div className="control-section">
        <h3>Visibility</h3>
        {(Object.entries(layerLabels) as [LayerId, string][]).map(([id, label]) => <label className="toggle-row" key={id}>
          <span>{label}</span><input type="checkbox" checked={layers[id]} onChange={() => toggleLayer(id)} /><i />
        </label>)}
      </div>
      <div className="control-section">
        <h3>View presets</h3>
        <div className="preset-grid">{Object.entries(presets).map(([name, config]) => <button key={name} onClick={() => setLayers(config)}>{name}</button>)}</div>
      </div>
      <div className="control-section quality-controls">
        <div className="control-title"><h3>Visual density</h3><output>{Math.round(density * 100)}%</output></div>
        <input className="range" type="range" min=".25" max="1" step=".05" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
        <div className="control-title"><h3>Quality</h3></div>
        <div className="segmented">{(['low', 'medium', 'high'] as const).map((q) => <button className={quality === q ? 'active' : ''} key={q} onClick={() => setQuality(q)}>{q}</button>)}</div>
      </div>
      <button className="process-button knockout-launch" onClick={() => setKnockoutPanelOpen(true)}><span className="process-icon">Δ</span><span><b>Knockout + drug</b><small>Explore ΔtolC chemical-genetic fitness</small></span><span>→</span></button>
      <button className="process-button systems-launch precise-launch" onClick={() => openSystemsExample('precise')}><span className="process-icon">P</span><span><b>PRECISE response</b><small>Explore transcriptome-wide regulation</small></span><span>→</span></button>
      <button className="process-button systems-launch model-launch" onClick={() => openSystemsExample('iml1515')}><span className="process-icon">M</span><span><b>iML1515 metabolism</b><small>Explore predicted metabolic flux</small></span><span>→</span></button>
      <button className="process-button lac-launch" onClick={() => setLacPanelOpen(true)}><span className="process-icon">L</span><span><b>Lac operon experiment</b><small>Induce a native bacterial gene network</small></span><span>→</span></button>
      <button className="process-button secondary-process" onClick={() => setProcessActive(true)}><span className="process-icon">⌁</span><span><b>Gene expression</b><small>Run coupled transcription + translation</small></span><span>▶</span></button>
    </div>}
  </aside>
}
