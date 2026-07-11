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
      <button className="process-button" onClick={() => setProcessActive(true)}><span className="process-icon">⌁</span><span><b>Gene expression</b><small>Run coupled transcription + translation</small></span><span>▶</span></button>
    </div>}
  </aside>
}
