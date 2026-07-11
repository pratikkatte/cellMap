import { useAppStore } from '../app/store'
import { structures } from '../data/structures'

export function NavigationHint() {
  const mode = useAppStore((s) => s.mode)
  const hovered = useAppStore((s) => s.hovered)
  const active = useAppStore((s) => s.processActive)
  return <>
    <div className="mode-chip glass"><span className={`mode-dot ${mode}`} />{mode === 'exterior' ? 'Exterior orbit' : mode === 'interior' ? 'Interior exploration' : 'Guided tour'}</div>
    {hovered && <div className="hover-label glass">{structures[hovered].name}<small>Click to inspect</small></div>}
    {mode === 'interior' && <div className="navigation-hint glass"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move</span><span><kbd>Q</kbd><kbd>E</kbd> descend / ascend</span><span>Double-click scene to look</span><span><kbd>Esc</kbd> release</span></div>}
    {active && <div className="process-caption glass"><span className="pulse" /><div><b>Coupled transcription & translation</b><p>In bacteria, transcription and translation occur in the same cellular compartment. Ribosomes can begin translating an mRNA while it is still being transcribed.</p></div></div>}
    <div className="disclaimer">Scale, abundance, and motion are visually compressed.</div>
  </>
}
