import { useAppStore } from '../app/store'
import { structures } from '../data/structures'

export function DetailsPanel() {
  const selected = useAppStore((s) => s.selected)
  const open = useAppStore((s) => s.rightOpen)
  const togglePanel = useAppStore((s) => s.togglePanel)
  const setSelected = useAppStore((s) => s.setSelected)
  if (!selected) return <aside className={`right-panel glass panel empty-details ${open ? '' : 'collapsed'}`}>
    <button className="collapse-button right" onClick={() => togglePanel('right')}>{open ? '›' : '‹'}</button>
    {open && <div><span className="eyebrow">Structure details</span><p>Select a structure in the cell or from the list to learn what it does.</p></div>}
  </aside>
  const item = structures[selected]
  return <aside className={`right-panel glass panel details ${open ? '' : 'collapsed'}`}>
    <button className="collapse-button right" onClick={() => togglePanel('right')}>{open ? '›' : '‹'}</button>
    {open && <div className="panel-scroll">
      <div className="details-visual"><span className={`structure-orb dot-${selected}`} /><div className="orbit-ring" /></div>
      <button className="close-details" onClick={() => setSelected(null)} aria-label="Close details">×</button>
      <span className="eyebrow">{item.category}</span>
      <h2>{item.name}</h2>
      <p className="description">{item.description}</p>
      <dl>
        <div><dt>Biological role</dt><dd>{item.role}</dd></div>
        <div><dt>Approximate location</dt><dd>{item.location}</dd></div>
      </dl>
      <div className="why"><span>Why it matters</span><p>{item.whyItMatters}</p></div>
      <p className="scale-note">Representation is simplified and visually enlarged for exploration.</p>
    </div>}
  </aside>
}
