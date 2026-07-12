export interface LacStage {
  id: string
  title: string
  description: string
  start: number
}

export const lacStages: LacStage[] = [
  { id: 'baseline', title: 'Repressed baseline', description: 'LacI occupies the operator and lacZYA transcription remains low.', start: 0 },
  { id: 'induction', title: 'Inducer sensed', description: 'Inducer binding reduces LacI repression at the operon.', start: .12 },
  { id: 'transcription', title: 'lacZYA transcribed', description: 'RNA polymerase produces a single polycistronic messenger RNA.', start: .27 },
  { id: 'translation', title: 'Coupled translation', description: 'Ribosomes translate the emerging bacterial mRNA before transcription is complete.', start: .48 },
  { id: 'localization', title: 'Proteins localize', description: 'LacZ remains cytoplasmic while LacY inserts into the inner membrane.', start: .7 },
  { id: 'response', title: 'Induced state', description: 'LacY-mediated uptake reinforces induction; individual cells may occupy different states.', start: .9 },
]

export function lacExpressionLevel(inducer: number, glucose: boolean, preinduced: boolean) {
  // A qualitative phase-response approximation based on the lac network's known
  // positive feedback and history dependence. It is not a fitted kinetic model.
  const effectiveInducer = inducer * (glucose ? .48 : 1)
  const threshold = preinduced ? .3 : .55
  return Math.max(0, Math.min(1, (effectiveInducer - threshold + .12) / .3))
}

export const lacResearch = {
  title: 'Multistability in the lactose utilization network of Escherichia coli',
  citation: 'Ozbudak et al., Nature 427, 737–740 (2004)',
  url: 'https://doi.org/10.1038/nature02298',
  note: 'The regulatory logic and history dependence are paper-grounded. Molecular counts, spatial placement, and animation time are illustrative.',
}
