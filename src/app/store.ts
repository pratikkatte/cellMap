import { create } from 'zustand'
import type { CameraMode, LayerId, Quality, StructureId } from './types'
import type { KnockoutDrugId } from '../data/knockoutDrug'
import type { SystemsExample } from '../data/systemsResponse'

const allLayers: Record<LayerId, boolean> = {
  outerMembrane: true,
  peptidoglycan: true,
  innerMembrane: true,
  cytoplasm: true,
  nucleoid: true,
  ribosomes: true,
  proteins: true,
  membraneComplexes: true,
  pili: true,
  flagellum: true,
}

interface AppState {
  introOpen: boolean
  leftOpen: boolean
  rightOpen: boolean
  selected: StructureId | null
  hovered: StructureId | null
  mode: CameraMode
  quality: Quality
  density: number
  paused: boolean
  layers: Record<LayerId, boolean>
  tourIndex: number
  processActive: boolean
  lacPanelOpen: boolean
  lacRunning: boolean
  lacProgress: number
  lacInducer: number
  lacGlucose: boolean
  lacPreinduced: boolean
  lacRunNonce: number
  knockoutPanelOpen: boolean
  knockoutRunning: boolean
  knockoutProgress: number
  knockoutDrug: KnockoutDrugId
  knockoutDoseIndex: number
  knockoutGenotype: 'wildType' | 'deltaTolC'
  knockoutRunNonce: number
  systemsPanelOpen: boolean
  systemsExample: SystemsExample
  systemsRunning: boolean
  systemsProgress: number
  systemsRunNonce: number
  resetNonce: number
  setIntroOpen: (value: boolean) => void
  setSelected: (value: StructureId | null) => void
  setHovered: (value: StructureId | null) => void
  setMode: (value: CameraMode) => void
  setQuality: (value: Quality) => void
  setDensity: (value: number) => void
  togglePaused: () => void
  toggleLayer: (id: LayerId) => void
  setLayers: (layers: Partial<Record<LayerId, boolean>>) => void
  setTourIndex: (value: number) => void
  setProcessActive: (value: boolean) => void
  setLacPanelOpen: (value: boolean) => void
  setLacProgress: (value: number) => void
  setLacInducer: (value: number) => void
  setLacGlucose: (value: boolean) => void
  setLacPreinduced: (value: boolean) => void
  startLacExperiment: () => void
  finishLacExperiment: () => void
  resetLacExperiment: () => void
  setKnockoutPanelOpen: (value: boolean) => void
  setKnockoutProgress: (value: number) => void
  setKnockoutDrug: (value: KnockoutDrugId) => void
  setKnockoutDoseIndex: (value: number) => void
  setKnockoutGenotype: (value: 'wildType' | 'deltaTolC') => void
  startKnockoutExperiment: () => void
  finishKnockoutExperiment: () => void
  resetKnockoutExperiment: () => void
  setSystemsPanelOpen: (value: boolean) => void
  openSystemsExample: (value: SystemsExample) => void
  setSystemsProgress: (value: number) => void
  startSystemsExperiment: () => void
  finishSystemsExperiment: () => void
  resetSystemsExperiment: () => void
  togglePanel: (side: 'left' | 'right') => void
  resetCamera: () => void
}

export const useAppStore = create<AppState>((set) => ({
  introOpen: true,
  leftOpen: true,
  rightOpen: true,
  selected: null,
  hovered: null,
  mode: 'exterior',
  quality: 'medium',
  density: 0.75,
  paused: false,
  layers: allLayers,
  tourIndex: 0,
  processActive: false,
  lacPanelOpen: false,
  lacRunning: false,
  lacProgress: 0,
  lacInducer: 0.64,
  lacGlucose: false,
  lacPreinduced: false,
  lacRunNonce: 0,
  knockoutPanelOpen: false,
  knockoutRunning: false,
  knockoutProgress: 0,
  knockoutDrug: 'chloramphenicol',
  knockoutDoseIndex: 2,
  knockoutGenotype: 'deltaTolC',
  knockoutRunNonce: 0,
  systemsPanelOpen: false,
  systemsExample: 'precise',
  systemsRunning: false,
  systemsProgress: 0,
  systemsRunNonce: 0,
  resetNonce: 0,
  setIntroOpen: (introOpen) => set({ introOpen }),
  setSelected: (selected) => set((state) => ({ selected, rightOpen: selected ? true : state.rightOpen })),
  setHovered: (hovered) => set({ hovered }),
  setMode: (mode) => set({ mode }),
  setQuality: (quality) => set({ quality }),
  setDensity: (density) => set({ density }),
  togglePaused: () => set((state) => ({ paused: !state.paused })),
  toggleLayer: (id) => set((state) => ({ layers: { ...state.layers, [id]: !state.layers[id] } })),
  setLayers: (layers) => set((state) => ({ layers: { ...state.layers, ...layers } })),
  setTourIndex: (tourIndex) => set({ tourIndex }),
  setProcessActive: (processActive) => set((state) => ({ processActive, lacPanelOpen: processActive ? false : state.lacPanelOpen, knockoutPanelOpen: processActive ? false : state.knockoutPanelOpen, systemsPanelOpen: processActive ? false : state.systemsPanelOpen, systemsRunning: processActive ? false : state.systemsRunning })),
  setLacPanelOpen: (lacPanelOpen) => set((state) => ({ lacPanelOpen, knockoutPanelOpen: lacPanelOpen ? false : state.knockoutPanelOpen, knockoutRunning: lacPanelOpen ? false : state.knockoutRunning, systemsPanelOpen: lacPanelOpen ? false : state.systemsPanelOpen, systemsRunning: lacPanelOpen ? false : state.systemsRunning, processActive: lacPanelOpen ? false : state.processActive })),
  setLacProgress: (lacProgress) => set({ lacProgress }),
  setLacInducer: (lacInducer) => set({ lacInducer }),
  setLacGlucose: (lacGlucose) => set({ lacGlucose }),
  setLacPreinduced: (lacPreinduced) => set({ lacPreinduced }),
  startLacExperiment: () => set((state) => ({
    lacPanelOpen: true, lacRunning: true, lacProgress: 0,
    lacRunNonce: state.lacRunNonce + 1, processActive: false,
    knockoutPanelOpen: false, knockoutRunning: false,
    systemsPanelOpen: false, systemsRunning: false,
    selected: null, rightOpen: false, mode: 'exterior',
  })),
  finishLacExperiment: () => set({ lacRunning: false, lacProgress: 1 }),
  resetLacExperiment: () => set((state) => ({ lacRunning: false, lacProgress: 0, lacRunNonce: state.lacRunNonce + 1 })),
  setKnockoutPanelOpen: (knockoutPanelOpen) => set((state) => ({ knockoutPanelOpen, lacPanelOpen: knockoutPanelOpen ? false : state.lacPanelOpen, lacRunning: knockoutPanelOpen ? false : state.lacRunning, systemsPanelOpen: knockoutPanelOpen ? false : state.systemsPanelOpen, systemsRunning: knockoutPanelOpen ? false : state.systemsRunning, processActive: knockoutPanelOpen ? false : state.processActive })),
  setKnockoutProgress: (knockoutProgress) => set({ knockoutProgress }),
  setKnockoutDrug: (knockoutDrug) => set({ knockoutDrug, knockoutDoseIndex: knockoutDrug === 'ciprofloxacin' ? 1 : 2, knockoutProgress: 0, knockoutRunning: false }),
  setKnockoutDoseIndex: (knockoutDoseIndex) => set({ knockoutDoseIndex, knockoutProgress: 0, knockoutRunning: false }),
  setKnockoutGenotype: (knockoutGenotype) => set({ knockoutGenotype, knockoutProgress: 0, knockoutRunning: false }),
  startKnockoutExperiment: () => set((state) => ({
    knockoutPanelOpen: true, lacPanelOpen: false, knockoutRunning: true, knockoutProgress: 0,
    knockoutRunNonce: state.knockoutRunNonce + 1, processActive: false,
    systemsPanelOpen: false, systemsRunning: false,
    selected: null, rightOpen: false, mode: 'exterior',
  })),
  finishKnockoutExperiment: () => set({ knockoutRunning: false, knockoutProgress: 1 }),
  resetKnockoutExperiment: () => set((state) => ({ knockoutRunning: false, knockoutProgress: 0, knockoutRunNonce: state.knockoutRunNonce + 1 })),
  setSystemsPanelOpen: (systemsPanelOpen) => set((state) => ({
    systemsPanelOpen,
    lacPanelOpen: systemsPanelOpen ? false : state.lacPanelOpen,
    lacRunning: systemsPanelOpen ? false : state.lacRunning,
    knockoutPanelOpen: systemsPanelOpen ? false : state.knockoutPanelOpen,
    knockoutRunning: systemsPanelOpen ? false : state.knockoutRunning,
    processActive: systemsPanelOpen ? false : state.processActive,
  })),
  openSystemsExample: (systemsExample) => set({
    systemsExample, systemsPanelOpen: true, systemsRunning: false, systemsProgress: 0,
    lacPanelOpen: false, lacRunning: false,
    knockoutPanelOpen: false, knockoutRunning: false,
    processActive: false,
  }),
  setSystemsProgress: (systemsProgress) => set({ systemsProgress }),
  startSystemsExperiment: () => set((state) => ({
    systemsPanelOpen: true, systemsRunning: true, systemsProgress: 0,
    systemsRunNonce: state.systemsRunNonce + 1,
    lacPanelOpen: false, lacRunning: false,
    knockoutPanelOpen: false, knockoutRunning: false,
    processActive: false, selected: null, rightOpen: false, mode: 'exterior',
  })),
  finishSystemsExperiment: () => set({ systemsRunning: false, systemsProgress: 1 }),
  resetSystemsExperiment: () => set((state) => ({ systemsRunning: false, systemsProgress: 0, systemsRunNonce: state.systemsRunNonce + 1 })),
  togglePanel: (side) => set((state) => side === 'left' ? { leftOpen: !state.leftOpen } : { rightOpen: !state.rightOpen }),
  resetCamera: () => set((state) => ({ mode: 'exterior', resetNonce: state.resetNonce + 1, selected: null })),
}))
