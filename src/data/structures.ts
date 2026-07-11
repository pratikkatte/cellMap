import type { CellStructureInfo } from '../app/types'

export const structures: Record<string, CellStructureInfo> = {
  outerMembrane: {
    id: 'outerMembrane', name: 'Outer membrane', category: 'Cell envelope',
    description: 'The outer membrane is a defining feature of Gram-negative bacteria. It acts as a selective permeability barrier and contains lipopolysaccharides and porin proteins.',
    role: 'Selective barrier and first line of environmental protection.', location: 'Outermost layer of the cell envelope.',
    whyItMatters: 'It helps the cell tolerate detergents, antibiotics, and sudden environmental changes.',
  },
  porin: {
    id: 'porin', name: 'Porin', category: 'Outer membrane protein',
    description: 'Porins form water-filled channels that allow small hydrophilic molecules to cross the outer membrane.',
    role: 'Passive uptake and exchange of small solutes.', location: 'Embedded in the outer membrane.',
    whyItMatters: 'Porin abundance and selectivity strongly influence nutrient uptake and antibiotic entry.',
  },
  periplasm: {
    id: 'periplasm', name: 'Periplasm', category: 'Cell envelope compartment',
    description: 'The periplasm is the space between the outer and inner membranes. It contains the thin peptidoglycan layer and proteins involved in nutrient processing, transport, and envelope maintenance.',
    role: 'Processing nutrients and maintaining the envelope.', location: 'Narrow compartment between the two membranes.',
    whyItMatters: 'It lets the bacterium sense and process its surroundings before molecules reach the cytoplasm.',
  },
  peptidoglycan: {
    id: 'peptidoglycan', name: 'Peptidoglycan', category: 'Cell wall',
    description: 'Peptidoglycan is a mesh-like polymer that helps the cell maintain its shape and resist osmotic pressure. In Gram-negative bacteria, it forms a relatively thin layer within the periplasm.',
    role: 'Mechanical strength and shape maintenance.', location: 'A thin mesh in the periplasm.',
    whyItMatters: 'Without this mesh, internal osmotic pressure could rupture the cell.',
  },
  innerMembrane: {
    id: 'innerMembrane', name: 'Inner membrane', category: 'Cell envelope',
    description: 'The inner membrane controls transport between the cytoplasm and the environment. It also contains respiratory complexes and ATP synthase used for energy generation.',
    role: 'Transport, respiration, and energy conversion.', location: 'Boundary of the cytoplasm.',
    whyItMatters: 'In bacteria, core energy metabolism occurs here rather than in mitochondria.',
  },
  atpSynthase: {
    id: 'atpSynthase', name: 'ATP synthase', category: 'Membrane complex',
    description: 'ATP synthase uses the proton gradient across the inner membrane to produce ATP, the cell’s main energy-carrying molecule.',
    role: 'Converts ion flow into chemical energy.', location: 'Embedded in the inner membrane.',
    whyItMatters: 'It supplies ATP to power biosynthesis, transport, and many other cellular processes.',
  },
  nucleoid: {
    id: 'nucleoid', name: 'Nucleoid', category: 'Genetic region',
    description: 'The nucleoid is the region containing the bacterial chromosome. It is not surrounded by a membrane and has an irregular shape determined by DNA folding, transcription, and DNA-binding proteins.',
    role: 'Organizes the chromosome while keeping it accessible.', location: 'Irregular central region of the cytoplasm.',
    whyItMatters: 'Its open, membrane-free organization permits transcription and translation to be directly coupled.',
  },
  chromosome: {
    id: 'chromosome', name: 'Chromosome', category: 'Genetic material',
    description: 'The main bacterial chromosome is usually a circular DNA molecule. It is compacted into the nucleoid but remains accessible for replication and transcription.',
    role: 'Stores most of the cell’s genetic information.', location: 'Folded throughout the nucleoid.',
    whyItMatters: 'It contains the instructions needed for growth, maintenance, and reproduction.',
  },
  ribosome: {
    id: 'ribosome', name: 'Ribosome', category: 'Molecular machine',
    description: 'Bacterial ribosomes translate messenger RNA into proteins. They are present in large numbers throughout the cytoplasm and can begin translation while an mRNA is still being transcribed.',
    role: 'Protein synthesis.', location: 'Throughout the cytoplasm, with partial exclusion from the dense nucleoid core.',
    whyItMatters: 'Every new enzyme, transporter, and structural protein passes through a ribosome.',
  },
  plasmid: {
    id: 'plasmid', name: 'Plasmid', category: 'Genetic material',
    description: 'Plasmids are small, independently replicating DNA molecules. They may carry genes that provide traits such as antibiotic resistance or specialized metabolic functions.',
    role: 'Carries accessory genes.', location: 'Floating in the cytoplasm near the nucleoid.',
    whyItMatters: 'Plasmids can spread useful traits rapidly between bacterial populations.',
  },
  flagellarMotor: {
    id: 'flagellarMotor', name: 'Flagellar motor', category: 'Motility complex',
    description: 'The flagellar motor is a rotary molecular machine embedded in the cell envelope. It uses ion flow across the inner membrane to rotate the external flagellar filament.',
    role: 'Converts an ion gradient into rotation.', location: 'Spans the cell envelope at one pole-side surface.',
    whyItMatters: 'This nanoscale rotary machine gives the cell control over swimming behavior.',
  },
  flagellum: {
    id: 'flagellum', name: 'Flagellum', category: 'Surface appendage',
    description: 'The flagellum is a long helical filament used for swimming. Rotation generated by the flagellar motor propels the bacterium through liquid environments.',
    role: 'Swimming and directional movement.', location: 'Extends far outside the cell envelope.',
    whyItMatters: 'Motility helps bacteria seek nutrients and leave harmful conditions.',
  },
  pilus: {
    id: 'pilus', name: 'Pilus', category: 'Surface appendage',
    description: 'Pili are thin surface appendages involved in attachment, surface interaction, and, for some specialized pili, DNA transfer between cells.',
    role: 'Attachment, interaction, and specialized DNA transfer.', location: 'Projects from the outer surface.',
    whyItMatters: 'Pili help bacteria colonize surfaces and form communities.',
  },
}

export const layerLabels = {
  outerMembrane: 'Outer membrane', peptidoglycan: 'Peptidoglycan', innerMembrane: 'Inner membrane',
  cytoplasm: 'Cytoplasm particles', nucleoid: 'Nucleoid & DNA', ribosomes: 'Ribosomes',
  proteins: 'Soluble proteins', membraneComplexes: 'Membrane complexes', pili: 'Pili', flagellum: 'Flagellum',
} as const
