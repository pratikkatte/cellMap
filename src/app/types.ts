export type StructureId =
  | 'outerMembrane' | 'porin' | 'periplasm' | 'peptidoglycan'
  | 'innerMembrane' | 'atpSynthase' | 'nucleoid' | 'chromosome'
  | 'ribosome' | 'plasmid' | 'flagellarMotor' | 'flagellum' | 'pilus'

export type LayerId =
  | 'outerMembrane' | 'peptidoglycan' | 'innerMembrane' | 'cytoplasm'
  | 'nucleoid' | 'ribosomes' | 'proteins' | 'membraneComplexes' | 'pili' | 'flagellum'

export type CameraMode = 'exterior' | 'interior' | 'tour'
export type Quality = 'low' | 'medium' | 'high'

export interface CellStructureInfo {
  id: StructureId
  name: string
  category: string
  description: string
  role: string
  location: string
  whyItMatters: string
}

export interface TourStop {
  title: string
  description: string
  structure?: StructureId
  position: [number, number, number]
  target: [number, number, number]
}
