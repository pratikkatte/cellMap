import { CellEnvelope } from './CellEnvelope'
import { Cytoplasm } from './Cytoplasm'
import { InnerMembraneComplexes, OuterSurface } from './MembraneProteins'
import { Nucleoid, Plasmids } from './Nucleoid'
import { Ribosomes } from './Ribosomes'
import { FlagellarMotor, Flagellum, Pili } from './Motility'
import { PeriplasmicParticles } from '../particles/PeriplasmicParticles'
import { TranscriptionTranslation } from '../processes/TranscriptionTranslation'
import { useAppStore } from '../app/store'

export function Bacterium() {
  const layers = useAppStore((s) => s.layers)
  return <group>
    <Cytoplasm />
    <Nucleoid />
    <Plasmids />
    <Ribosomes />
    <PeriplasmicParticles />
    <CellEnvelope />
    {layers.outerMembrane && <OuterSurface />}
    {layers.membraneComplexes && <InnerMembraneComplexes />}
    {layers.membraneComplexes && <FlagellarMotor />}
    {layers.pili && <Pili />}
    {layers.flagellum && <Flagellum />}
    <TranscriptionTranslation />
  </group>
}
