import { useAppStore } from '../app/store'
import { structures } from '../data/structures'
import { lacStages } from '../data/lacOperon'
import { knockoutDrugs, knockoutStages, knockoutStageText } from '../data/knockoutDrug'
import { currentSystemsStage } from '../data/systemsResponse'

export function NavigationHint() {
  const mode = useAppStore((s) => s.mode)
  const hovered = useAppStore((s) => s.hovered)
  const active = useAppStore((s) => s.processActive)
  const lacPanelOpen = useAppStore((s) => s.lacPanelOpen)
  const lacProgress = useAppStore((s) => s.lacProgress)
  const lacStage = [...lacStages].reverse().find((stage) => lacProgress >= stage.start) ?? lacStages[0]
  const knockoutPanelOpen = useAppStore((s) => s.knockoutPanelOpen)
  const knockoutProgress = useAppStore((s) => s.knockoutProgress)
  const knockoutDrug = useAppStore((s) => s.knockoutDrug)
  const knockoutGenotype = useAppStore((s) => s.knockoutGenotype)
  const knockoutStage = [...knockoutStages].reverse().find((stage) => knockoutProgress >= stage.start) ?? knockoutStages[0]
  const knockoutStageCopy = knockoutStageText(knockoutStage, knockoutGenotype)
  const systemsPanelOpen = useAppStore((s) => s.systemsPanelOpen)
  const systemsExample = useAppStore((s) => s.systemsExample)
  const systemsProgress = useAppStore((s) => s.systemsProgress)
  const systemsStage = currentSystemsStage(systemsExample, systemsProgress)
  return <>
    <div className="mode-chip glass"><span className={`mode-dot ${mode}`} />{mode === 'exterior' ? 'Exterior orbit' : mode === 'interior' ? 'Interior exploration' : 'Guided tour'}</div>
    {hovered && <div className="hover-label glass">{structures[hovered].name}<small>Click to inspect</small></div>}
    {mode === 'interior' && <div className="navigation-hint glass"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move</span><span><kbd>Q</kbd><kbd>E</kbd> descend / ascend</span><span>Double-click scene to look</span><span><kbd>Esc</kbd> release</span></div>}
    {active && <div className="process-caption glass"><span className="pulse" /><div><b>Coupled transcription & translation</b><p>In bacteria, transcription and translation occur in the same cellular compartment. Ribosomes can begin translating an mRNA while it is still being transcribed.</p></div></div>}
    {lacPanelOpen && !active && <div className="lac-scene-caption glass"><span>lacZYA</span><b>{lacStage.title}</b><small>{lacStage.description}</small></div>}
    {knockoutPanelOpen && !active && <div className="lac-scene-caption knockout-scene-caption glass"><span>{knockoutGenotype === 'deltaTolC' ? 'ΔtolC' : 'TolC+'}</span><b>{knockoutStageCopy.title}</b><small>{knockoutDrugs[knockoutDrug].shortName} · {knockoutStageCopy.description}</small></div>}
    {systemsPanelOpen && !active && <div className={`lac-scene-caption systems-scene-caption ${systemsExample === 'iml1515' ? 'model-caption' : ''} glass`}><span>{systemsExample === 'precise' ? 'RNA' : 'FBA'}</span><b>{systemsStage.title}</b><small>{systemsExample === 'precise' ? 'PRECISE-278' : 'iML1515'} · {systemsStage.description}</small></div>}
    <div className="disclaimer">Scale, abundance, and motion are visually compressed.</div>
  </>
}
