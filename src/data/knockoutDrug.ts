export type KnockoutDrugId = 'chloramphenicol' | 'erythromycin' | 'ciprofloxacin'

export interface DrugDosePoint {
  concentration: string
  score: number
}

export interface KnockoutDrugRecord {
  id: KnockoutDrugId
  name: string
  shortName: string
  target: 'ribosome' | 'nucleoid'
  color: string
  mechanism: string
  doses: DrugDosePoint[]
}

// Exact normalized fitness scores for the Keio ECK3026-TOLC deletion strain
// from Nichols et al. Supplementary Table S2. Values are screen scores, not
// survival percentages and not a kinetic dose-response model.
export const knockoutDrugs: Record<KnockoutDrugId, KnockoutDrugRecord> = {
  chloramphenicol: {
    id: 'chloramphenicol', name: 'Chloramphenicol', shortName: 'CHL', target: 'ribosome', color: '#df9b5f',
    mechanism: 'Targets the bacterial ribosome and inhibits protein synthesis.',
    doses: [
      { concentration: '0.5', score: -5.736369 },
      { concentration: '1.0', score: -7.151329 },
      { concentration: '1.5', score: -10.307943 },
      { concentration: '2.0', score: -9.588618 },
    ],
  },
  erythromycin: {
    id: 'erythromycin', name: 'Erythromycin', shortName: 'ERY', target: 'ribosome', color: '#d2746f',
    mechanism: 'Binds the bacterial ribosome and interferes with translation.',
    doses: [
      { concentration: '0.1', score: 1.118662 },
      { concentration: '1.0', score: -6.211012 },
      { concentration: '5.0', score: -21.847221 },
      { concentration: '10.0', score: -20.59765 },
    ],
  },
  ciprofloxacin: {
    id: 'ciprofloxacin', name: 'Ciprofloxacin', shortName: 'CIP', target: 'nucleoid', color: '#9e8ec2',
    mechanism: 'Perturbs DNA topology by targeting bacterial type II topoisomerases.',
    doses: [
      { concentration: '0.004', score: -1.135996 },
      { concentration: '0.006', score: -1.068115 },
      { concentration: '0.008', score: -0.578262 },
    ],
  },
}

export const knockoutStages = [
  { id: 'baseline', title: 'Reference cell', description: 'TolC channels support export across the outer membrane.', start: 0 },
  { id: 'deletion', title: 'tolC deleted', description: 'The Keio deletion removes functional TolC from the envelope.', start: .12 },
  { id: 'exposure', title: 'Drug exposure', description: 'Antibiotic molecules encounter the Gram-negative envelope.', start: .28 },
  { id: 'partitioning', title: 'Altered accumulation', description: 'Loss of an outer-membrane efflux conduit changes intracellular exposure.', start: .46 },
  { id: 'targeting', title: 'Cellular target engaged', description: 'The selected drug is shown near its primary cellular target.', start: .66 },
  { id: 'phenotype', title: 'Fitness phenotype', description: 'The measured Nichols screen score is revealed without conversion to survival.', start: .88 },
] as const

export function knockoutStageText(stage: (typeof knockoutStages)[number], genotype: 'wildType' | 'deltaTolC') {
  if (genotype === 'deltaTolC') return { title: stage.title, description: stage.description }
  if (stage.id === 'deletion') return { title: 'TolC retained', description: 'Functional TolC ducts remain visible in the reference envelope.' }
  if (stage.id === 'partitioning') return { title: 'Efflux-assisted export', description: 'The reference view retains TolC and shows lower representative intracellular retention.' }
  if (stage.id === 'phenotype') return { title: 'Reference comparison', description: 'No wild-type score is fabricated; measured values remain specific to ΔtolC.' }
  return { title: stage.title, description: stage.description }
}

export const knockoutResearch = {
  keio: {
    title: 'Construction of E. coli K-12 in-frame, single-gene knockout mutants',
    citation: 'Baba et al., Molecular Systems Biology 2, 2006.0008 (2006)',
    url: 'https://doi.org/10.1038/msb4100050',
  },
  nichols: {
    title: 'Phenotypic Landscape of a Bacterial Cell',
    citation: 'Nichols et al., Cell 144, 143–156 (2011)',
    url: 'https://doi.org/10.1016/j.cell.2010.11.052',
    dataUrl: 'https://ecoliwiki.org/tools/chemgen/files/coli_FinalData2.txt',
  },
  note: 'Genotype, concentrations, and normalized fitness scores are source-derived. Molecular paths, accumulation, timing, and target highlights are explanatory visual encodings—not measured molecular trajectories.',
}

export function fitnessSeverity(score: number) {
  return Math.max(0, Math.min(1, -score / 22))
}
