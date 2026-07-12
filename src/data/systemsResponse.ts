export interface RegulatoryModule {
  name: string
  reference: number
  oxygenWithdrawal: number
  delta: number
  role: string
}

export interface FluxComparison {
  id: string
  name: string
  aerobic: number
  anaerobic: number
  unit: string
  note: string
}

export type SystemsExample = 'precise' | 'iml1515'

export const systemsScenario = {
  title: 'Oxygen withdrawal',
  organism: 'E. coli K-12 MG1655',
  medium: 'M9 minimal medium + glucose',
  reference: 'Aerobic, 37 °C',
  perturbation: 'Oxygen uptake disabled',
  preciseSamples: {
    reference: ['minspan__wt_glc__1', 'minspan__wt_glc__2', 'minspan__wt_glc__3', 'minspan__wt_glc__4'],
    perturbation: ['minspan__wt_glc_anaero__1', 'minspan__wt_glc_anaero__2'],
  },
} as const

// PRECISE iModulon activities are ICA-derived values, not expression fold changes.
// Deltas are the anaerobic two-replicate mean minus the aerobic four-replicate mean.
export const regulatoryModules: RegulatoryModule[] = [
  { name: 'ArcA-2', reference: 1.375390, oxygenWithdrawal: 36.102460, delta: 34.727070, role: 'ArcA-associated oxygen-responsive regulation' },
  { name: 'ArcA-1', reference: -1.496241, oxygenWithdrawal: -28.241894, delta: -26.745652, role: 'A distinct ArcA-associated gene program' },
  { name: 'RpoS', reference: 2.750149, oxygenWithdrawal: -15.392515, delta: -18.142664, role: 'General stress and stationary-phase regulation' },
  { name: 'Fur-2', reference: -4.353008, oxygenWithdrawal: -18.794031, delta: -14.441023, role: 'Iron homeostasis-associated regulation' },
  { name: 'Fnr', reference: 9.942412, oxygenWithdrawal: 23.206316, delta: 13.263904, role: 'Major oxygen-sensitive transcriptional program' },
  { name: 'NarL', reference: 1.121892, oxygenWithdrawal: 14.055700, delta: 12.933808, role: 'Anaerobic respiratory response regulation' },
  { name: 'NikR', reference: 4.604145, oxygenWithdrawal: 15.343281, delta: 10.739136, role: 'Nickel uptake and homeostasis regulation' },
  { name: 'Translation', reference: 7.195921, oxygenWithdrawal: -3.063754, delta: -10.259675, role: 'Ribosome and protein-synthesis machinery' },
]

// One parsimonious optimal iML1515 solution at 99.9% of maximum growth.
// Glucose uptake is capped at 10 mmol gDW^-1 h^-1; EX_o2_e is closed anaerobically.
export const metabolicFluxes: FluxComparison[] = [
  { id: 'growth', name: 'Growth rate', aerobic: .876120, anaerobic: .157382, unit: 'h⁻¹', note: 'Predicted biomass objective' },
  { id: 'oxygen', name: 'Oxygen uptake', aerobic: 22.098099, anaerobic: 0, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Magnitude of exchange flux' },
  { id: 'atp', name: 'ATP synthase', aerobic: 70.335931, anaerobic: -5.945047, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Negative denotes reverse model direction' },
  { id: 'formate', name: 'Formate secretion', aerobic: 0, anaerobic: 18.156931, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Fermentation product' },
  { id: 'acetate', name: 'Acetate secretion', aerobic: .035766, anaerobic: 8.795755, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Fermentation product' },
  { id: 'ethanol', name: 'Ethanol secretion', aerobic: 0, anaerobic: 8.768521, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Fermentation product' },
  { id: 'pfl', name: 'Pyruvate formate-lyase', aerobic: 0, anaerobic: 18.173994, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Anaerobic carbon-routing reaction' },
  { id: 'cytochrome', name: 'Cytochrome bo₃ oxidase', aerobic: 44.188966, anaerobic: 0, unit: 'mmol gDW⁻¹ h⁻¹', note: 'Aerobic respiratory reaction' },
]

export const systemsStages = {
  precise: [
    { id: 'reference', start: 0, title: 'Aerobic RNA reference', description: 'Four PRECISE samples establish the aerobic regulatory state.' },
    { id: 'withdraw', start: .16, title: 'Oxygen withdrawn', description: 'Two matched samples capture the response without oxygen.' },
    { id: 'regulation', start: .36, title: 'iModulons shift', description: 'ICA resolves coordinated changes across 92 regulatory programs.' },
    { id: 'oxygen-sensors', start: .62, title: 'ArcA and Fnr respond', description: 'Oxygen-responsive programs show some of the largest activity changes.' },
    { id: 'endpoint', start: .88, title: 'Transcriptome reprogrammed', description: 'The result is a data-derived regulatory fingerprint of oxygen withdrawal.' },
  ],
  iml1515: [
    { id: 'reference', start: 0, title: 'Aerobic model reference', description: 'The model routes glucose through respiration while oxygen is available.' },
    { id: 'withdraw', start: .16, title: 'Oxygen exchange closed', description: 'The oxygen-uptake bound is set to zero.' },
    { id: 'respiration', start: .4, title: 'Respiratory flux falls', description: 'Terminal aerobic respiration drops out of the predicted solution.' },
    { id: 'fermentation', start: .66, title: 'Fermentation rises', description: 'Formate, acetate, and ethanol secretion carry more carbon.' },
    { id: 'endpoint', start: .9, title: 'Lower predicted growth', description: 'The parsimonious solution predicts substantially slower biomass production.' },
  ],
} as const

export const systemsResearch = {
  precise: {
    title: 'PRECISE: transcriptomic data and iModulon decomposition',
    citation: 'Sastry et al., Nature Communications (2019)',
    url: 'https://www.nature.com/articles/s41467-019-13483-w',
    dataUrl: 'https://github.com/SBRG/precise-db',
  },
  imodulondb: { title: 'PRECISE-278 on iModulonDB', url: 'https://imodulondb.org/e_coli/precise278' },
  iml1515: {
    title: 'iML1515 genome-scale metabolic model',
    citation: 'Monk et al., Nature Biotechnology (2017)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6521705/',
    modelUrl: 'https://bigg.ucsd.edu/models/iML1515',
  },
} as const

export function currentSystemsStage(example: SystemsExample, progress: number) {
  const stages = systemsStages[example]
  return [...stages].reverse().find((stage) => progress >= stage.start) ?? stages[0]
}
